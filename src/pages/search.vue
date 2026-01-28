<template>
    
    <div class="mt-5 pt-5">
        <SearchSkeleton v-if="isLoading" />
      
        <div v-if="!isLoading">
          <v-alert
              border="top"
              type="warning"
              variant="outlined"
              prominent
              v-if="items.length === 0"
            >
            No matches found for query '{{searchSummary}}'. Please try a different query.
          </v-alert>

          <v-alert :text="`Showing results for '${searchSummary}'`" class="mb-2" v-if="searchSummary && items.length > 0" type="info"></v-alert>
        </div>
    </div>

  
    <v-card class="mx-auto" v-if="!isLoading">
      <v-list
        id="search-list"
        :items="items"
        lines="three"
        item-props
      >
          
      </v-list>
    </v-card>  
    

    <div class="text-center" v-if="!isLoading">
        <v-container>
          <v-row justify="center">
            <v-col cols="12">
              <v-container class="max-width">
                <v-pagination
                  v-model="currentPage"
                  :length="totalPages"
                  class="my-4"
                ></v-pagination>
              </v-container>
            </v-col>
          </v-row>
        </v-container>
    </div>

    <Tour 
      :targets="targets" 
      :isLoading="isLoading"
      v-if="tourModeEnabled"
    />

</template>


<script setup>
import { defineComponent, watch, ref, getCurrentInstance, inject, onMounted } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import { unslugify } from '@/helpers/Str';
import { convertKjToKcal } from '@/helpers/Nutrients';
import Tour from '@/components/Tour.vue';
import SearchSkeleton from '@/components/SearchSkeleton.vue';

import { retryAxios } from '@/api/retryAxios';

const API_BASE_URI = import.meta.env.VITE_API_URI;

useHead({
  title: 'Food Search Results - Juan Nutrisyon',

  link: [
    {
      rel: 'canonical',
      href: `https://app.juanutrisyon.info/search`
    }
  ],

  meta: [
    { hid: 'description', name: 'description', content: 'View the results of your search query.' },
    { name: 'robots', content: 'index, follow' },

    // Open Graph (Facebook, LinkedIn, etc.)
    { property: 'og:title', content: 'Food Search Results - Juan Nutrisyon' },
    { property: 'og:description', content: 'View the results of your search query.' },
    { property: 'og:type', content: 'website' },

    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Food Search Results - Juan Nutrisyon' },
    { name: 'twitter:description', content: 'View the results of your search query.' },

  ]

});


// Inject global state
const tourModeEnabled = inject("tourModeEnabled");

// Define reactive state
const dialog = ref(false);
const items = ref([]);
const isLoading = ref(true);
const searchSummary = ref(""); // No need for reactive

const route = useRoute();
const router = useRouter();

const currentCategory = ref(route.query.category || null);
const currentPage = ref(parseInt(route.query.page) || 1);
const totalPages = ref(1);

const params = new URLSearchParams(route.query);
const categories = ref(null); 

if (process.client) {
  categories.value = JSON.parse(sessionStorage.getItem("food_types"));
}


const totalItems = ref(0);

const targets = ref([
  {
    target: '#search-list .v-list-item--link:nth-child(1)',
    description: 'Scroll down and click through the pages until you find what you’re looking for. The calories, carbohydrates (C), total fat (F), and protein (P) content is indicated below the food description. Once done, click the food.'
  }
]);

const updateTargets = (total_items) => {
  
  if (total_items > 10) {
    targets.value = targets.value.concat([
      {
        target: '.mdi-chevron-right',
        description: "Click on this button to move to the next page of results. If you can't find what you're looking for after 3 pages, you might want to refine your search term.",
        position: 'top'
      },
      {
        target: '.mdi-chevron-left',
        description: "Click on this button to move to the previous page of results.",
        position: 'top'
      },
      {
        target: '.v-pagination__item--is-active',
        description: 'This is the current page',
        position: 'top'
      }
    ]);
  }
}


// Helper function to get category name
function getCategory(slug) {
  if (categories.value) {
    return categories.value.find((cat) => cat.slug === slug);
  }
  return { name: unslugify(slug) };
}

// Generate initial search summary
let summary = "";
if (currentCategory.value) {
  summary += `Category: ${getCategory(currentCategory.value).name}`;
}
if (params.get("q")) {
  if (currentCategory.value) {
    summary += ", ";
  }
  summary += `${params.get("q")}`;
}
searchSummary.value = summary;

function updateSearchSummary(newSummary) {
  searchSummary.value = newSummary;
}

watch(currentPage, (newPage) => {
  const query = { ...route.query }

  if (newPage <= 1) {
    delete query.page
    router.replace({ query }) 
  } else {
    query.page = newPage.toString()
    router.push({ query })
  }

  updateSearchResults()
})

watch(
  () => route.query.page,
  (newPage) => {
    const page = parseInt(newPage)

    currentPage.value = Number.isNaN(page) || page < 1 ? 1 : page
  },
  { immediate: true }
)


watch(
  () => route.query.category,
  (newCategory) => {
    currentCategory.value = newCategory || null;
  }
);

watch(
  () => route.query,
  (newParams, oldParams) => {
    if (JSON.stringify(newParams) !== JSON.stringify(oldParams)) {
      let search_summary = "";

      if (newParams.category) {
        search_summary = `Category: ${newParams.category}`;
      }

      if (newParams.q) {
        if (newParams.category) {
          search_summary += ", ";
        }
        search_summary += `${newParams.q}`;
      }

      updateSearchSummary(search_summary);
      console.log('hazam: ', newParams);
      updateSearchResults();
    }
  },
  { deep: true }
);


const constructComplexQuery = (str) => {
  
  if (str === 'low calorie') {
    return 'calories=lte40kcal';
  } else if (str === 'moderate calorie') {
    return 'calories=lte100kcal';
  } else if (str === 'high calorie') {
    return 'calories=gte100kcal';
  } else if (str === 'low fat') {
    return 'fat=lte3g';
  } else if (str === 'moderate fat') {
    return 'fat=lte7g';
  } else if (str === 'high fat') {
    return 'fat=gt7g';
  } else if (str === 'low protein') {
    return 'protein=lt5g';
  } else if (str === 'high protein') {
    return 'protein=gt10g';
  } else if (str === 'moderate protein') {
    return 'protein=lte10g';
  } else if (str === 'low carb') {
    return 'carbohydrates=lt15g';
  } else if (str === 'high carb') {
    return 'carbohydrates=gt30g';
  } else if (str === 'moderate carb') {
    return 'carbohydrates=lte30g';
  } else if (str === 'low sodium') {
    return 'sodium=lte140mg';
  } else if (str === 'high sodium') {
    return 'sodium=gt400mg';
  } else if (str === 'moderate sodium') {
    return 'sodium=lte400mg';
  } else if (str === 'low fiber') {
    return 'fiber=lt2g';
  } else if (str === 'high fiber') {
    return 'fiber=gt5g';
  } else if (str === 'moderate fiber') {
    return 'fiber=lte5g';
  } else if (str === 'low sugar') {
    return 'sugar=lt5g';
  } else if (str === 'high sugar') {
    return 'sugar=gt15g';
  } else if (str === 'moderate sugar') {
    return 'sugar=lte15g';
  } else if (str === 'zero cholesterol') {
    return 'cholesterol=eq0mg';
  } else if (str === 'low calcium') {
    return 'calcium=lt100mg';
  } else if (str === 'high calcium') {
    return 'calcium=gt200mg';
  } else if (str === 'moderate calcium') {
    return 'calcium=lte200mg';
  } else if (str === 'low vitamin c') {
    return 'vitamin_c=lt10mg';
  } else if (str === 'high vitamin c') {
    return 'vitamin_c=gt30mg';
  } else if (str === 'moderate vitamin c') {
    return 'vitamin_c=lte30mg';
  } else if (str === 'low vitamin a') {
    return 'vitamin_a=lt500IU';
  } else if (str === 'high vitamin a') {
    return 'vitamin_a=gt1000IU';
  } else if (str === 'moderate vitamin a') {
    return 'vitamin_a=lte1000IU';
  } else if (str === 'low iron') {
    return 'iron=lt1mg';
  } else if (str === 'high iron') {
    return 'iron=gt5mg';
  } else if (str === 'moderate iron') {
    return 'iron=lte5mg';
  } else if (str === 'low potassium') {
    return 'potassium=lt100mg';
  } else if (str === 'high potassium') {
    return 'potassium=gt300mg';
  } else if (str === 'moderate potassium') {
    return 'potassium=lte300mg';
  } else if (str === 'low magnesium') {
    return 'magnesium=lt25mg';
  } else if (str === 'high magnesium') {
    return 'magnesium=gt50mg';
  } else if (str === 'moderate magnesium') {
    return 'magnesium=lt50mg';
  } else if (str === 'low vitamin b1') {
    return 'vitamin_b1=lt0.1mg';
  } else if (str === 'high vitamin b1') {
    return 'vitamin_b1=gt0.5mg';
  } else if (str === 'moderate vitamin b1') {
    return 'vitamin_b1=lte0.5mg';
  } else if (str === 'low vitamin b2') {
    return 'vitamin_b2=lt0.1mg';
  } else if (str === 'high vitamin b2') {
    return 'vitamin_b2=gt0.5mg';
  } else if (str === 'moderate vitamin b2') {
    return 'vitamin_b2=lte0.5mg';
  } else if (str === 'low vitamin b3') {
    return 'vitamin_b3=lt1mg';
  } else if (str === 'high vitamin b3') {
    return 'vitamin_b3=gt3mg';
  } else if (str === 'moderate vitamin b3') {
    return 'vitamin_b3=lte3mg';
  } 

  const regex = /(carbohydrates|protein|fat|calories)(>=|<=|>|<|=)(\d+(\.\d+)?)(g|kcal|ml)(?:,|$)/g;
  let match;

  let formattedQuery = '';

  const conditions = {
    '>': 'gt',
    '<': 'lt',
    '>=': 'gte',
    '<=': 'lte',
    '=': 'eq'
  };

  while ((match = regex.exec(str)) !== null) {
  
    const keyword = match[1];
    const cond = match[2];
    const value = match[3];
  
    const unit = match[5];

    if (keyword) {
      formattedQuery += `${keyword}=${conditions[cond]}${value}${unit}&`;
    }
  }

  if (formattedQuery.charAt(formattedQuery.length - 1) === '&') {
    formattedQuery = formattedQuery.substr(0, formattedQuery.length - 1);
  }

  return formattedQuery;
}


const constructQuery = () => {
  let formattedQuery = '';
  const query = route.query.q;
  const normalizedQuery = query ? query.toLowerCase() : query;

  const keywords = [
    'carbohydrates', 'fat', 'protein',
    'calories', 'low calorie', 'moderate calorie', 'high calorie',
    'low fat', 'high fat', 'moderate fat',
    'low protein', 'high protein', 'moderate protein',
    'low carb', 'high carb', 'moderate carb',
    'low sodium', 'high sodium', 'moderate sodium',
    'low fiber', 'high fiber', 'moderate fiber',
    'low sugar', 'high sugar', 'moderate sugar',
    'zero cholesterol',
    'low calcium', 'high calcium', 'moderate calcium',
    'low vitamin c', 'high vitamin c', 'moderate vitamin c',
    'low vitamin a', 'high vitamin a', 'moderate vitamin a',
    'low iron', 'high iron', 'moderate iron',
    'low potassium', 'high potassium', 'moderate potassium',
    'low magnesium', 'high magnesium', 'moderate magnesium',
    'low vitamin b1', 'high vitamin b1', 'moderate vitamin b1',
    'low vitamin b2', 'high vitamin b2', 'moderate vitamin b2',
    'low vitamin b3', 'high vitamin b3', 'moderate vitamin b3',
  ];
  
  if (normalizedQuery && keywords.some(v => normalizedQuery.includes(v))) {
    
    formattedQuery = constructComplexQuery(normalizedQuery);
  } else {
    formattedQuery = normalizedQuery ? `description=${normalizedQuery}` : '';
  }

  return formattedQuery;
}


const updateSearchResults = async () => {

  const query = constructQuery();
  
  if (query || currentCategory.value) {
    const macros_keys = ['total carbohydrates', 'protein', 'total fat'];
    
    const url = currentCategory.value ? `${API_BASE_URI}/foods?${query}&category=${currentCategory.value}&page=${currentPage.value}` : `${API_BASE_URI}/foods?${query}&page=${currentPage.value}`;

    isLoading.value = true;


    try {
      const dynamicKey = `food-${query}-${currentCategory.value}-${currentPage.value}`;

      const { data: foodsData, error } = await useAsyncData(dynamicKey, () =>
          $fetch(url)
      )

      if (error.value) {
        console.error('Error fetching foods:', error.value)
        return;
      } 

      if (foodsData.value) {

        isLoading.value = false;

        totalPages.value = foodsData.value.last_page;

        updateTargets(foodsData.value.total);

        items.value = foodsData.value.data.flatMap((itm, index, array) => {
        
        const item = {
          prependAvatar: itm.title_image,
          title: itm.description,
          subtitle: `${convertKjToKcal(itm.calories, itm.calories_unit)}kcal`,
          to: `/food/${itm.description_slug}`
        };

        if (index < array.length - 1) {
          return [item, { type: 'divider' }];
        } else {
          return [item];
        }
      });

      } else {
        console.log('nada: ', foodsData.value);
      }
    } catch (err) {
      console.log('search err: ', err);
      isLoading.value = false;
    }

  }
}


await updateSearchResults();
</script>