<template>

    <v-container class="mt-5" id="food-container">

<v-row justify="center">
      <v-col cols="12" md="8" lg="6" xl="6">

    
<div class="text-center mt-10" v-if="isLoading">
    <v-progress-circular indeterminate color="primary"></v-progress-circular>
</div>

  <div class="mt-5" v-if="food">
    
    <FoodHeader :food="food" :selectedCustomServing="selected_custom_serving" :selectedServingQty="selected_serving_qty" :newServingSize="newServingSize" />

    <div class="mt-5" v-if="food.nutrients.length === 0 || food.calories === null || food.serving_size === null">
        <v-alert 
            density="compact"
            type="warning"
            variant="outlined"
        >
            This food has incomplete data.
        </v-alert>
    </div>  

    <div class="mt-3" v-if="hasMacros" id="macros-section">
        <div class="text-body-2 mb-1 text-center font-weight-medium">Macronutrients</div>
        <div class="mt-1" style="height: 130px;">
            <Pie :data="chartData" :options="chartOptions" />
        </div>
    </div>

    <div class="mt-5 pt-5" v-if="food.nutrients.length > 0">
        <h2 class="text-body-2 text-center font-weight-medium">Nutrition Facts <v-btn id="nutrition-help" variant="text" size="x-small" icon="mdi-help" @click="dvHelp = true"></v-btn></h2>
        
        <v-switch 
            id="display-values-per-container"
            v-if="hasValuesPerContainerToggle"
            label="Display values per container" 
            v-model="displayValuesPerContainer" 
            color="success"
            hide-details
            inset
            
        >
        </v-switch>

        <v-table>
            <tbody>
                <tr id="servings-per-container" v-if="food.servings_per_container">
                    <td class="text-grey-darken-3">
                        {{ newServingCount ? newServingCount : food.servings_per_container }} Servings Per Container
                        <v-btn id="modify-serving-size" size="x-small" @click="openModifyServingCountModal">Modify</v-btn>
                    </td>
                </tr>
                <tr id="serving-size" v-if="food.serving_size">
                    <td class="text-grey-darken-3">
                        Serving Size: {{ servingSize(food.serving_size, newServingSize) }}{{ food.serving_size_unit }} <span v-if="food.custom_serving_size">/ {{ food.custom_serving_size }}</span>
                        <v-btn size="x-small" @click="openModifyServingSizeModal">Modify</v-btn>
                    </td>
                </tr>
                <tr id="edible-portion" v-if="food.edible_portion && food.edible_portion < 100">
                    <td class="text-grey-darken-3">
                       Edible Portion: {{ food.edible_portion }}%
                    </td>
                </tr>
                <tr id="calories-available" v-if="food.calories">
                    <td class="text-grey-darken-3">
                        Calories: 

                        <span id="calories-provided">
                        {{ 
                            formatNumber(
                                convertKjToKcal(
                                    amountPerContainer(
                                        food.calories, 
                                        servingsPerContainer, 
                                        displayValuesPerContainer, 
                                        food.serving_size, 
                                        newServingSize, 
                                        newServingCount
                                    ),
                                    food.calories_unit
                                )
                            ) 
                        }}
                        kcal
                        </span> / <span id="calories-required">{{ calorie_req_in_kcal }}kcal</span>

                        <span id="calories-provided-percentage">
                        ({{ 
                            formatNumber(
                                calculatePercentage(
                                    convertKjToKcal(
                                        amountPerContainer(
                                            food.calories, 
                                            servingsPerContainer, 
                                            displayValuesPerContainer, 
                                            food.serving_size, 
                                            newServingSize, 
                                            newServingCount
                                        ),
                                        food.calories_unit
                                    ), 
                                    calorie_req_in_kcal
                                )
                            ) 
                        }}%) 
                        </span>

                        
                        <FAOContentClaim 
                            :value="food.calories"
                            :unit="food.calories_unit"
                            :requirement="calorie_req_in_kcal"
                            :food="food" 
                            :servingsPerContainer="servingsPerContainer" 
                            :displayValuesPerContainer="displayValuesPerContainer" 
                            :newServingSize="newServingSize" 
                            :newServingCount="newServingCount"
                            :faoNutrientContentClaims="fao_nutrient_claims" />

                        <v-progress-linear 
                            id="calories-bar"
                            class="mt-1"
                            :model-value="
                                calculatePercentage(
                                    convertKjToKcal(
                                        amountPerContainer(
                                            food.calories, 
                                            servingsPerContainer, 
                                            displayValuesPerContainer, 
                                            food.serving_size, 
                                            newServingSize, 
                                            newServingCount
                                        ), 
                                        food.calories_unit
                                    ),
                                    calorie_req_in_kcal
                                )" 
                            :bg-color="
                                getCalorieBgColor(
                                    convertKjToKcal(
                                        amountPerContainer(
                                            food.calories, 
                                            servingsPerContainer, 
                                            displayValuesPerContainer, 
                                            food.serving_size, 
                                            newServingSize, 
                                            newServingCount
                                        ),
                                        food.calories_unit
                                    )
                                )" 
                            :color="
                                getCalorieColor(
                                    convertKjToKcal(
                                        amountPerContainer(
                                            food.calories, 
                                            servingsPerContainer, 
                                            displayValuesPerContainer, 
                                            food.serving_size, 
                                            newServingSize, 
                                            newServingCount
                                        ),
                                        food.calories_unit
                                    )
                                )">
                        </v-progress-linear>
                    </td>
                </tr>
            </tbody>
        </v-table>

        <v-switch 
            v-model="displayMoreNutrients" 
            label="Show more nutrient data"
            color="success"
            hide-details
            inset
        ></v-switch>

        <div class="mt-3" v-if="elements && elements.length && recommended_daily_values && displayMoreNutrients">
            <span class="text-subtitle-2">Elements</span>
            <NutrientsTable 
                :nutrients="elements" 
                :servingsPerContainer="servingsPerContainer" 
                :displayValuesPerContainer="displayValuesPerContainer"
                :displayMoreNutrients="displayMoreNutrients"
                :recommended_daily_values="recommended_daily_values"
                :originalServingSize="food.serving_size"
                :newServingSize="newServingSize"
                :newServingCount="newServingCount"
                :getValueColor="getValueColor"
                :foodState="food.state.name"
                :foodCalories="food.calories"
                :faoNutrientContentClaims="fao_nutrient_claims"  />
        </div>

        <div id="macros-details-section" class="mt-3" v-if="macros && macros.length && recommended_daily_values">
            <h2 class="text-subtitle-2">Macronutrients</h2>
            <NutrientsTable 
                :nutrients="macros" 
                :servingsPerContainer="servingsPerContainer" 
                :displayValuesPerContainer="displayValuesPerContainer"
                :displayMoreNutrients="displayMoreNutrients"
                :recommended_daily_values="recommended_daily_values"
                :originalServingSize="food.serving_size"
                :newServingSize="newServingSize"
                :newServingCount="newServingCount"
                :getValueColor="getValueColor"
                :foodState="food.state.name" 
                :foodCalories="food.calories"
                :faoNutrientContentClaims="fao_nutrient_claims"
            />
        </div>

        <div id="vitamins-section" class="mt-3" v-if="vitamins && vitamins.length && recommended_daily_values">
            <h2 class="text-subtitle-2">Vitamins</h2>
            <NutrientsTable 
                :nutrients="vitamins" 
                :servingsPerContainer="servingsPerContainer" 
                :displayValuesPerContainer="displayValuesPerContainer"
                :displayMoreNutrients="displayMoreNutrients"
                :recommended_daily_values="recommended_daily_values"
                :originalServingSize="food.serving_size"
                :newServingSize="newServingSize"
                :newServingCount="newServingCount"
                :getValueColor="getValueColor"
                :foodState="food.state.name"
                :foodCalories="food.calories"
                :faoNutrientContentClaims="fao_nutrient_claims"  />
        </div>

        <div id="minerals-section" class="mt-3" v-if="minerals && minerals.length && recommended_daily_values">
            <h2 class="text-subtitle-2">Minerals</h2>
            <NutrientsTable 
                :nutrients="minerals" 
                :servingsPerContainer="servingsPerContainer" 
                :displayValuesPerContainer="displayValuesPerContainer"
                :displayMoreNutrients="displayMoreNutrients"
                :recommended_daily_values="recommended_daily_values"
                :originalServingSize="food.serving_size"
                :newServingSize="newServingSize"
                :newServingCount="newServingCount"
                :getValueColor="getValueColor"
                :foodState="food.state.name"
                :foodCalories="food.calories"
                :faoNutrientContentClaims="fao_nutrient_claims"  />
        </div>

        <div id="others-section" class="mt-3" v-if="others && others.length && recommended_daily_values">
            <h2 class="text-subtitle-2">Others</h2>
            <NutrientsTable 
                :nutrients="others" 
                :servingsPerContainer="servingsPerContainer" 
                :displayValuesPerContainer="displayValuesPerContainer"
                :displayMoreNutrients="displayMoreNutrients"
                :recommended_daily_values="recommended_daily_values"
                :originalServingSize="food.serving_size"
                :newServingSize="newServingSize"
                :newServingCount="newServingCount"
                :getValueColor="getValueColor"
                :foodState="food.state.name"
                :foodCalories="food.calories"
                :faoNutrientContentClaims="fao_nutrient_claims"  />
        </div>   
        
        <DownloadNutritionLabel :food="food" :recommended_daily_values="recommended_daily_values" />
    </div>

    <IngredientsInfo :foodSlug="route.params.food" :ingredients="food.ingredients" :hasAnalysis="food.hasIngredientsInfo" />

    <AllergenInfo :allergens="food.allergen_information" />

    <RecipeIngredients 
        :food="food"
        :selectedCustomServing="selected_custom_serving"   
        :selectedServingQty="selected_serving_qty" 
    />

    <RecipeSource v-if="food.recipe && food.recipe_source" :name="food.recipe_source.name" :url="food.recipe.source_url" />


    <div class="mt-5 pt-5 text-center">

        <ImageGallery :images="images" />

        <ModifyServingSizeModal 
            :food="food"
            v-model:open="modifyServingSizeDialog" 
            :customServingSizes="custom_serving_sizes"
            v-model:qty="selected_serving_qty"
            v-model:servingSize="newServingSize" />

        <ModifyServingCountModal v-model:open="modifyServingCountDialog" v-model:newServingCount="newServingCount" />


        <ReportIssue :slug="route.params.food" />

    </div>

    <CountryOfOrigin :country="food.origin_country" />


  </div>


    <DailyValuesModal v-model:open="dvHelp" />

    <Tour 
      :targets="targets" 
      :isLoading="isLoading"
      v-if="tourModeEnabled"
    />

    <DataSourceInfo />
    
    <HowToContribute />


    </v-col>
    </v-row>

</v-container>

</template>

<script setup>
import { ref, onMounted, watchEffect, watch, defineEmits, inject, computed } from 'vue';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'vue-chartjs'
import axios from 'axios'
import NutrientsTable from '@/components/NutrientsTable.vue'
import NutritionLabel from '@/components/NutritionLabel.vue'
import { calculatePercentage, formatNumber } from '@/helpers/Numbers';

import { addIngredientToRecipe } from '@/helpers/RecipeIngredients';

import { convertWeight, FAONutrientContentClaim, normalizeFoodState, convertKjToKcal, extractNutrients } from '@/helpers/Nutrients';
import Tour from '@/components/Tour.vue';

import FoodHeader from '@/components/FoodHeader.vue';

import RecipeSource from '@/components/RecipeSource.vue';

import { getSortedByName, findAgeData } from '@/helpers/Arr';
import { 
    amountPerContainer, 
    nutrientUnit, 
    servingSize,
    
    getElements,
    getMacros,
    getVitamins,
    getMinerals,
    getOthers
} from '@/helpers/Nutrients';

import { useRoute } from 'vue-router'; 

import Toast, { createToast, clearToasts } from 'mosha-vue-toastify'
import 'mosha-vue-toastify/dist/style.css'

import { useHead } from '@vueuse/head'

import DailyValuesModal from '@/components/Modals/DailyValuesModal.vue';

import ImageGallery from '@/components/ImageGallery.vue';

import ReportIssue from '@/components/ReportIssue.vue';

import ModifyServingCountModal from '@/components/Modals/ModifyServingCountModal.vue';

import ModifyServingSizeModal from '@/components/Modals/ModifyServingSizeModal.vue';

import RecipeIngredients from '@/components/RecipeIngredients.vue';

import DownloadNutritionLabel from '@/components/DownloadNutritionLabel.vue';

import DataSourceInfo from '@/components/DataSourceInfo.vue';

import HowToContribute from '@/components/HowToContribute.vue';

import AllergenInfo from '@/components/AllergenInfo.vue';

import IngredientsInfo from '@/components/IngredientsInfo.vue';

import CountryOfOrigin from '@/components/CountryOfOrigin.vue';

import FAOContentClaim from '@/components/FAOContentClaim.vue'

const API_BASE_URI = import.meta.env.VITE_API_URI;

const displayMoreNutrients = ref(false);

const emit = defineEmits(['update-ingredient-count-child', 'update-analyze-count-child']);


const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
        onClick: null,    
    },

    tooltip: {
        enabled: true,
        callbacks: {
            label: function(tooltipItem) {
                return tooltipItem.formattedValue + "%";
            },
            title: function(tooltipItem) {
                return null;
            },
            footer: function(tooltipItem) {
                return null;
            },
            beforeLabel: function(tooltipItem) {
                return null;
            },
        },
    }
  }
}


ChartJS.register(ArcElement, Tooltip, Legend)

const nutrients = ref(null);

const elements = ref(null);
const macros = ref(null);
const vitamins = ref(null);
const minerals = ref(null);
const others = ref(null);

const dvHelp = ref(false);

const displayValuesPerContainer = ref(false);

const route = useRoute();

const isLoading = ref(false);

const food = ref(null);

const images = computed(() => {
    const images_arr = [];

    if (food.value?.title_image) {
        images_arr.push({
            title: 'Food',
            src: food.value.title_image,
        });
    }

    if (food.value?.nutrition_label_image) {
        images_arr.push({
            title: 'Nutrition label',
            src: food.value.nutrition_label_image,
        });
    }

    if (food.value?.barcode_image) {
        images_arr.push({
            title: 'Barcode',
            src: food.value.barcode_image,
        });
    }   

    if (food.value?.ingredients_image) {
        images_arr.push({
            title: 'Ingredients',
            src: food.value.ingredients_image,
        });
    }

    return images_arr;
});


const custom_serving_sizes = ref(null);
const selected_custom_serving = ref(null); 
const selected_serving_qty = ref(1);

const fao_nutrient_claims = ref(null);

const hasMacros = ref(false);
const chartData = ref(null);

const calorie_req_in_kcal = ref(2000);

const recommended_daily_values = ref(null);

const daily_values_table = ref(null);

const servingsPerContainer = ref(1);
const hasValuesPerContainerToggle = ref(false);

const modifyServingSizeDialog = ref(false);

const modifyServingCountDialog = ref(false);

const newServingSize = ref(null);

const newServingCount = ref(null);

const food_ingredients = ref(null);

const issueDescription = ref('');

//


const tourModeEnabled = inject("tourModeEnabled");

const targets = ref([
    {
        target: '#food-description',
        description: "This is the descriptive name of the food. This will often indicate the state of processing (eg. raw, cooked, unripe).",
    },
]);
    

watch(selected_custom_serving, (new_custom_serving, old_custom_serving) => {
    
    selected_serving_qty.value = 1;
    newServingSize.value = parseFloat(new_custom_serving);
    
});

watch(selected_serving_qty, (new_serving_qty, old_serving_qty) => {
    
    if (selected_custom_serving.value) {
        newServingSize.value = parseFloat(selected_custom_serving.value) * parseInt(new_serving_qty);
    }
});



// ===
const pageTitle = computed(() => food.value?.description ?? 'Juan Nutrisyon')
const pageDescription = computed(() =>
  food.value
    ? `${food.value.description} Nutrition Facts: Calories, total fat, total carbohydrates, dietary fiber, sugar, protein, vitamins and minerals.`
    : 'Your personal nutrition companion to help you make informed food choices—without guilt or fear.'
)
const canonical = computed(() =>
  food.value
    ? `https://app.juanutrisyon.info/food/${food.value.description_slug}` // <- note the / and .value
    : 'https://app.juanutrisyon.info'
)

const pageImage = computed(() => {
  if (Array.isArray(images.value) && images.value.length > 0) {
    return images.value[0].src || '';
  }
  return '';
});



const needed_nutrients = [
  "total carbohydrates",
  "dietary fiber",
  "sugar",
  "protein",
  "total fat",
  "saturated fat",
  "trans fat",
  "cholesterol",
  "sodium"
];

const structuredData = computed(() => {
  if (!food.value) return null;

  const nutrients = extractNutrients(food.value.nutrients || [], needed_nutrients);

  console.log(JSON.stringify(nutrients));

  return {
    "@context": "https://schema.org",
    "@type": "Food",
    "name": pageTitle.value,
    "image": pageImage.value,
    "nutrition": {
      "@type": "NutritionInformation",
      "calories": {
        "@type": "Energy",
        "value": food.value?.calories,
        "unitText": food.value?.calories_unit,
      },
      "servingSize": `${food.value?.serving_size} ${food.value?.serving_size_unit}`,
      "carbohydrateContent": nutrients["total carbohydrates"] || "0 g",
      "fiberContent": nutrients["dietary fiber"] || "0 g",
      "sugarContent": nutrients["sugar"] || "0 g",
      "proteinContent": nutrients["protein"] || "0 g",
      "fatContent": nutrients["total fat"] || "0 g",
      "saturatedFatContent": nutrients["saturated fat"] || "0 g",
      "transFatContent": nutrients["trans fat"] || "0 g",
      "cholesterolContent": nutrients["cholesterol"] || "0 mg",
      "sodiumContent": nutrients["sodium"] || "0 mg"
    },
    "publisher": {
      "@id": "https://app.juanutrisyon.info/#organization"
    }
  };
});

useHead(() => ({
  title: pageTitle.value,
  link: [{ rel: 'canonical', href: canonical.value }],
  meta: [
    { name: 'description', content: pageDescription.value },
    { property: 'og:title', content: `${pageTitle.value} Nutrition Facts | Juan Nutrisyon` },
    { property: 'og:description', content: pageDescription.value },
    { property: 'og:image', content: pageImage.value },
    { property: 'og:url', content: canonical.value },
    { property: 'og:type', content: 'article' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: `${pageTitle.value} Nutrition Facts | Juan Nutrisyon` },
    { name: 'twitter:description', content: pageDescription.value },
    { name: 'twitter:image', content: pageImage.value },
  ],
  script: structuredData.value
    ? [
        {
          type: "application/ld+json",
          children: JSON.stringify(structuredData.value),
        },
      ]
    : [],
}));

// ===

const getFAOColor = (value) => {
    const fao_colors = {
        'free': 'blue-grey-lighten-1',
        'very low': 'blue-grey-darken-1',
        'low': 'blue',
        'source': 'yellow',
        'high': 'red'
    };
    return fao_colors[value];
}

const getCalorieBgColor = (calories) => {
    return 'grey-darken-3';
}

const getCalorieColor = (calories) => {
    return 'deep-purple-lighten-2';
}

const openModifyServingCountModal = () => {
    
    modifyServingCountDialog.value = true;
}

const openModifyServingSizeModal = () => {
    console.log('lulu')
    modifyServingSizeDialog.value = true;
}

const getValueColor = (value, daily_limit) => {

    return 'deep-purple-lighten-2';
};

const modifyServingSize = () => {
    modifyServingSizeDialog.value = false;
}



const updateTargets = (food) => {
    if (food.alternate_names) {
        targets.value.push({
            target: '#food-alternate-names',
            description: "These are the alternative names of the food, if local names for the food is available, you’ll also see it here.",
        });
    }

    targets.value = targets.value.concat([
        {
            target: '#food-category',
            description: "This is the food category starting from the main category down to the sub-categories, each separated by “/”."
        },
        {
            target: '#add-to-recipe',
            description: 'Click this button to analyze the nutrient content of a recipe.',
        },
        {
            target: '#recipeAnalysisButton',
            description: 'This is the link to the recipe analysis page. Click here once you have added all the foods you want to add.'
        },
        {
            target: '#add-to-analyze',
            description: 'Click this button to analyze the nutrient content of the foods you ate throughout the day.',
        },
        {
            target: '#dietAnalysisButton',
            description: 'This is the link to the diet analysis page. lick here once you have added all the foods you want to add.',
        },
        {
            target: '#macros-section',
            description: 'This shows the percentage amount for each macronutrient (protein, fats, carbohydrates) present in the food.'
        },
    ]);

    if (food.servings_per_container > 1) {
        console.log('nono')
        targets.value.push({
            target: '#display-values-per-container',
            description: "Enable this to display the total nutrient available for the whole container. This is useful for when you're consuming a whole bag of chips."
        });
    }
    

    if (food.servings_per_container) {
        targets.value = targets.value.concat([
            {
                target: '#servings-per-container',
                description: "This is the total number of servings available per container. By default, the nutrient data only shows the values per serving.",
            },
            {
                target: '#modify-serving-size',
                description: 'Click this button to modify the number of servings. Note that this is only useful if the food has other sizes available, you can modify this to match the one you have on hand.'  
            }
        ]);
    }

    if (food.serving_size) {
        targets.value.push({
            target: '#serving-size',
            description: "The weight of the food. you can adjust this by clicking on the ‘modify’ button and entering the weight in grams or select any of the custom servings (if available)."
        });
    }

    if (food.edible_portion) {
        targets.value.push({
            target: '#edible-portion',
            description: "This is the percentage amount of the edible portion of the food. Note that the nutrient values are already adjusted to account for this."
        });
    }

    if (food.calories) {
        targets.value = targets.value.concat([
            {
                target: '#calories-provided',
                description: "The amount of energy you get per serving."
            },
            {
                target: '#calories-required',
                description: 'The daily required amount of calories as per PDRI.'
            },
            {
                target: '#calories-provided-percentage',
                description: "The percentage of the daily required amount. If the calorie amount meets the FAO guidelines for use of nutrition and health claims, you will also see here a label saying high, low, very low, or free. This is the FAO health claim rating for the nutrient. As a general guideline, focus on eating foods that are high in protein, fiber, vitamins and minerals (except sodium). Avoid foods that are high in sugars, saturated fat, and cholesterol."
            },
            {
                target: '#calories-bar',
                description: 'The visual representation of the calories provided.'
            }
        ]);
    }


    targets.value.push({
        target: '#macros-details-section',
        description: 'This section shows the macronutrients available in more detail. '
    });


    targets.value = targets.value.concat([
        {
            target: '#vitamins-section',
            description: 'This section shows the amount of vitamins you get from the food.'
        },

        {
            target: '#minerals-section',
            description: 'This section shows the amount of minerals you get from the food.'
        },

        {
            target: '#export-image',
            description: "Click on this button if you want to generate and download a nutrition facts label for the food. Bakeries, restaurant owners, and independent food manufacturers can use this to easily generate a nutrition label for the foods they're selling."
        },

        {
            target: '#images-section',
            description: "This is where you can see the images representing the food. For processed foods, you'll also see here the actual nutrition label, ingredients, and barcode.",
            position: 'top'
        },
    ]);

    if (food.ingredients) {
        targets.value.push({
            target: '#ingredients-section',
            description: 'This shows the ingredients used in making the food. This often applies only to processed foods like junk food.'
        });
    }

    targets.value.push({
        target: '#report-issue',
        description: "Click on this button to report any issue you notice.",
        position: 'top'
    });
}



const fetchFoodData = async () => {
   
    const { data: foodData } = await useAsyncData(
        () => `food-${route.params.food}`,
        () => $fetch(`/api/foods/${route.params.food}`),
        {
            server: true,
            lazy: false,
            transform: (data) => data,
            getCachedData: (key) => nuxtApp.payload.data[key]
        }
    );

    if (error.value) {
        console.error('Error fetching food:', error.value)
        return;
    } 


    food.value = foodData.value;
    updateTargets(foodData.value);

    newServingSize.value = foodData.value.serving_size;

    if (foodData.value && foodData.value.custom_serving_by_subtype) {
        console.log('meron: ', foodData.value.custom_serving_by_subtype.serving_units);
        const serving_units = foodData.value.custom_serving_by_subtype.serving_units
            .map(itm => ({
                name: itm.name,
                weight: itm.weight,
                unit: itm.weight_unit,
                volume_in_ml: itm.volume_in_ml,
            }))
            .filter(itm => {
                return (itm.volume_in_ml && foodData.value.density) || itm.weight
            });



            if (serving_units.length > 0) {
                custom_serving_sizes.value = serving_units
            }
    } else {
        console.log('waley');
    }
 
    
    const { data: consolidatedDailyNutrientDv, error: daily_nutrient_dv_err } = await useAsyncData('dailyNutrient', () => 
        $fetch(`${API_BASE_URI}/consolidated-recommended-daily-nutrient-intake?gender=male&age=19`)
    );
    
    
    if (consolidatedDailyNutrientDv.value) {
   
        const fda_daily_nutrient_values_arr = consolidatedDailyNutrientDv.value.map((itm) => {
            return {
                [itm.nutrient]: itm.daily_value,
            }
        });
        const fda_daily_nutrient_values = Object.assign({}, ...fda_daily_nutrient_values_arr);

        recommended_daily_values.value = fda_daily_nutrient_values;
        
        const dv_table = Object.keys(fda_daily_nutrient_values).map((key) => {
            const val = fda_daily_nutrient_values[key];
            const unit = nutrientUnit(key);
            return {
                nutrient: key, 
                value: `${val}${unit}`
            }
        });

        daily_values_table.value = dv_table;
       
    }
}

// 
console.log('slug: ', route.params.food);

const { data: foodData, error } = await useAsyncData('food', () =>
    $fetch(`${API_BASE_URI}/foods/${route.params.food}`)
)

if (error) {
    console.error('Error fetching food:', error.value);
}

if (foodData.value) {
    

    food.value = foodData.value;
    updateTargets(foodData.value);

    newServingSize.value = foodData.value.serving_size;

    let serving_units = null;

    if (foodData.value.custom_servings) {
        serving_units = foodData.value.custom_servings.serving_units;
    } else if (foodData.value.custom_serving_by_subtype) {
        serving_units = foodData.value.custom_serving_by_subtype.serving_units;
    }

    if (serving_units) {
        serving_units.map(itm => ({
            name: itm.name,
            weight: itm.weight,
            unit: itm.weight_unit,
            volume_in_ml: itm.volume_in_ml,
        }))
        .filter(itm => {
            return (itm.volume_in_ml && foodData.value.density) || itm.weight
        })

        if (serving_units.length > 0) {
            custom_serving_sizes.value = serving_units
        }
    }

    //
    const macros_keys = ['total carbohydrates', 'protein', 'total fat'];
    const macros_data = {};

    food.value.nutrients.forEach((itm) => {
        if (macros_keys.includes(itm.name)) {
            macros_data[itm.name] = itm.amount;
        }
    });

    const macros_numbers = Object.values(macros_data);
    const total = macros_numbers.reduce((sum, num) => sum + num, 0);

    const macros_percentages = {};
    for (const [key, value] of Object.entries(macros_data)) {
        const percent = calculatePercentage(value, total);
        macros_percentages[key] = percent.toFixed(2);
    }

    if (Object.values(macros_data).some(itm => itm)) {
        hasMacros.value = true;
    }

    chartData.value = {
        labels: [
            `Protein: ${macros_percentages.protein}%`,
            `Fat: ${macros_percentages['total fat']}%`,
            `Carbs: ${macros_percentages['total carbohydrates']}%`
        ],
        datasets: [
            {
                backgroundColor: ['#2ecc71', '#d35400', '#f39c12'],
                data: [
                    macros_percentages['protein'],
                    macros_percentages['total fat'],
                    macros_percentages['total carbohydrates']
                ]
            }
        ],
    };

    elements.value = getElements(food.value.nutrients);
    macros.value = getMacros(food.value.nutrients);
    vitamins.value = getVitamins(food.value.nutrients); 
    minerals.value = getMinerals(food.value.nutrients);
    others.value = getOthers(food.value.nutrients);
    //

    if (foodData.value.servings_per_container) {
        servingsPerContainer.value = foodData.value.servings_per_container;

        if (foodData.value.servings_per_container > 1) {
            hasValuesPerContainerToggle.value = true;
        }
    }


    const { data: faoNutrientContentClaimData, error: faoNutrientContentError } = await useAsyncData('faoNutrientContent', () => 
        $fetch(`${API_BASE_URI}/fao-nutrient-content-claims`)
    );

    if (faoNutrientContentClaimData.value) {
        const normalized_food_state = normalizeFoodState(foodData.value.state.name);
        const filtered_fao_nutrient_content_claims = faoNutrientContentClaimData.value.filter((itm) => {
            return itm.food_state === normalized_food_state;
        });
    
        fao_nutrient_claims.value = filtered_fao_nutrient_content_claims;
    }

}


const { data: consolidatedDailyNutrientDv, error: daily_nutrient_dv_err } = await useAsyncData('dailyNutrient', () => 
    $fetch(`${API_BASE_URI}/consolidated-recommended-daily-nutrient-intake?gender=male&age=19`)
);

if (consolidatedDailyNutrientDv.value) {

    const fda_daily_nutrient_values_arr = consolidatedDailyNutrientDv.value.map((itm) => {
        return {
            [itm.nutrient]: itm.daily_value,
        }
    });
    const fda_daily_nutrient_values = Object.assign({}, ...fda_daily_nutrient_values_arr);

    recommended_daily_values.value = fda_daily_nutrient_values;

    const dv_table = Object.keys(fda_daily_nutrient_values).map((key) => {
        const val = fda_daily_nutrient_values[key];
        const unit = nutrientUnit(key);
        return {
            nutrient: key, 
            value: `${val}${unit}`
        }
    });

    daily_values_table.value = dv_table;
}

//


const fetchData = async () => {
    
    isLoading.value = true;

    try {

        const food_slug = route.params.food;

        const res = await useFetch(`${API_BASE_URI}/foods/${food_slug}`);
        console.log('BADAM: ', res.data.value);
        isLoading.value = false;

        const current_food = res.data.value;

        food.value = current_food;
        
        updateTargets(current_food);

        
        newServingSize.value = res.data.serving_size;

        if (food.value.custom_servings) {
            const serving_units = food.value.custom_servings.serving_units.map(itm => {
                return {
                    'name': itm.name,
                    'weight': itm.weight,
                    'unit': itm.weight_unit,
                    'volume_in_ml': itm.volume_in_ml,
                }
            })
            .filter((itm) => {
                return itm.volume_in_ml && current_food.density || itm.weight;
            });

            if (serving_units && serving_units.length > 0) {
                custom_serving_sizes.value = serving_units;
            }
        }

    
        let consolidated_daily_nutrient_dv = null;

        const fda_daily_nutrient_values_res = await useFetch(`${API_BASE_URI}/consolidated-recommended-daily-nutrient-intake?gender=male&age=19`);
        consolidated_daily_nutrient_dv = fda_daily_nutrient_values_res.data.value;
        if (process.client) {
            sessionStorage.setItem('consolidated_daily_nutrient_dv', JSON.stringify(consolidated_daily_nutrient_dv));
        }

        const fda_daily_nutrient_values_arr = consolidated_daily_nutrient_dv.map((itm) => {
            return {
                [itm.nutrient]: itm.daily_value,
            }
        });
        const fda_daily_nutrient_values = Object.assign({}, ...fda_daily_nutrient_values_arr);

        recommended_daily_values.value = fda_daily_nutrient_values;
        
        const dv_table = Object.keys(fda_daily_nutrient_values).map((key) => {
            const val = fda_daily_nutrient_values[key];
            const unit = nutrientUnit(key);
            return {
                nutrient: key, 
                value: `${val}${unit}`
            }
        });

        daily_values_table.value = dv_table;
    
        

        if (res.data.value.servings_per_container) {
            servingsPerContainer.value = res.data.value.servings_per_container;

            if (res.data.value.servings_per_container > 1) {
                hasValuesPerContainerToggle.value = true;
            }
        }

        const images_arr = [];

        if (res.data.value.title_image) {
            images_arr.push({
                title: 'Food',
                src: res.data.value.title_image,
            });
        }

        if (res.data.value.nutrition_label_image) {
            images_arr.push({
                title: 'Nutrition label',
                src: res.data.value.nutrition_label_image,
            })
        }

        if (res.data.value.barcode_image) {
            images_arr.push({
                title: 'Barcode',
                src: res.data.value.barcode_image,
            });
        }   

        if (res.data.value.ingredients_image) {
            images_arr.push({
                title: 'Ingredients',
                src: res.data.value.ingredients_image,
            });
        }

        images.value = images_arr;

    
        const macros_keys = ['total carbohydrates', 'protein', 'total fat'];
        
        const macros_data = {};

        res.data.value.nutrients.forEach((itm) => {
            if (macros_keys.indexOf(itm.name) !== -1) {
                macros_data[itm.name] = itm.amount;
            }
        });

        const macros_numbers = Object.values(macros_data);
        const total = macros_numbers.reduce((sum, num) => sum + num, 0);

        const macros_percentages = {};
        for (const [key, value] of Object.entries(macros_data)) {
            const percent = calculatePercentage(value, total);
            macros_percentages[key] = percent.toFixed(2);
        }

        if (Object.values(macros_data).filter(itm => itm).length > 0) {
            hasMacros.value = true;
        }

        chartData.value = {
            labels: [`Protein: ${macros_percentages.protein}%`, `Fat: ${macros_percentages['total fat']}%`, `Carbs: ${macros_percentages['total carbohydrates']}%`],
            datasets: [
                {
                    backgroundColor: ['#2ecc71', '#d35400', '#f39c12'],
                    data: [
                        macros_percentages['protein'],
                        macros_percentages['total fat'],
                        macros_percentages['total carbohydrates']
                    ] 
                }
            ],
        }
        
        elements.value = getElements(res.data.value.nutrients);
        macros.value = getMacros(res.data.value.nutrients);
        vitamins.value = getVitamins(res.data.value.nutrients); 
        minerals.value = getMinerals(res.data.value.nutrients);
        others.value = getOthers(res.data.value.nutrients);

        // get fao claims
        let fao_nutrient_content_claims = null;
       

        const fao_nutrient_content_claims_res = await useFetch(`${API_BASE_URI}/fao-nutrient-content-claims`);
        fao_nutrient_content_claims = fao_nutrient_content_claims_res.data.value;
        if (process.client) {
            sessionStorage.setItem('fao_nutrient_content_claims', JSON.stringify(fao_nutrient_content_claims));
        }
        
        // filter using the current food state
        const normalized_food_state = normalizeFoodState(food.value.state.name);
        const filtered_fao_nutrient_content_claims = fao_nutrient_content_claims.filter((itm) => {
            return itm.food_state === normalized_food_state;
        });
    
        fao_nutrient_claims.value = filtered_fao_nutrient_content_claims;

    } catch (err) {
        console.log('error loading food data: ', err);
        isLoading.value = false;
    }

}


const viewCategory = (slug) => {
    router.push(`/search?category=${slug}`);
}




</script>

<style>
#food-container {
    padding: 0.5rem 0 !important;
}

.add-padding {
    width: 120%;
    padding: 20px;
}

.sticky-title {
    position: sticky;
    top: 0;
    background: #FFF;
    z-index: 10;
}
</style>