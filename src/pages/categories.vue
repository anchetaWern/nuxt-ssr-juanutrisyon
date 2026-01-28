<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}

</style>


<template>
 
    <v-container class="mt-5 overflow-y-auto" id="category-container">

      <v-row dense justify="center">
        <v-col
          v-for="card in cards"
          :key="card.title"
          :cols="card.flex"
        >
          <v-card @click="goToCategory(card.slug)" :id="card.slug === 'vegetables' ? 'categoryCard' : ''">

            <div class="relative" style="height: 200px; overflow: hidden;">
              <img
                :src="card.src"
                :alt="card.title"
                class="w-full h-full object-cover"
                style="object-fit: cover; object-position: center; height: 200px; width: 100%;"
              />
             
              <div
                class="px-4 py-2"
                style="position: absolute; bottom: 0; width: 100%; background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.7));"
              >
                <h2 class="text-white text-body-2">{{ card.title }}</h2>
              </div>
            </div>

          </v-card>
        </v-col>
      </v-row>

    </v-container>

  
    <Tour 
      :targets="targets" 
      v-if="tourModeEnabled" 
      :isLoading="isLoading" />
</template>


<script setup>
import { ref, computed, inject } from 'vue';
import { useRouter } from 'vue-router';
import Tour from '@/components/Tour.vue';

import { auth } from '@/firebase.js';
import { onAuthStateChanged } from "firebase/auth";

useHead({
  title: 'Nutrition Facts for Filipino Foods – Juan Nutrisyon',

  link: [
    {
      rel: 'canonical',
      href: `https://app.juanutrisyon.info/categories`
    }
  ],

  meta: [
    { hid: 'description', name: 'description', content: 'Explore nutrition facts for Filipino foods with our database. Track calories, analyze your diet, calculate recipe nutrition, and discover healthier choices for everyday meals.' },
    { name: 'robots', content: 'index, follow' },


    // Open Graph (Facebook, LinkedIn, etc.)
    { property: 'og:title', content: 'Nutrition Facts for Filipino Foods – Juan Nutrisyon' },
    { property: 'og:description', content: 'Explore nutrition facts for Filipino foods with our database. Track calories, analyze your diet, calculate recipe nutrition, and discover healthier choices for everyday meals.' },
    { property: 'og:type', content: 'website' },

    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Nutrition Facts for Filipino Foods – Juan Nutrisyon' },
    { name: 'twitter:description', content: 'Explore nutrition facts for Filipino foods with our database. Track calories, analyze your diet, calculate recipe nutrition, and discover healthier choices for everyday meals.' },

  ]

});


const router = useRouter();


const tourModalVisible = ref(true);

const tourModeEnabled = inject("tourModeEnabled");

const isLoading = ref(false);

const cards = ref([
  { id: 2, slug: 'vegetables', title: 'Vegetables', src: '/images/vegetables.jpg', flex: 12 },
  { id: 4, slug: 'aquatic-foods', title: 'Aquatic Foods', src: '/images/aquatic-foods.jpg', flex: 6 },
  { id: 4, slug: 'meat-and-poultry', title: 'Meat and Poultry', src: '/images/meat-and-poultry.jpg', flex: 6 },
  { id: 7, slug: 'legumes-nuts-and-seeds', title: 'Legumes, nuts, and seeds', src: '/images/legumes-nuts-seeds.jpg', flex: 6 },
  { id: 8, slug: 'fats-and-oils', title: 'Fats and Oils', src: '/images/fats-and-oils.jpg', flex: 6 },
  { id: 3, slug: 'fruits', title: 'Fruits', src: '/images/fruits.jpg', flex: 6 },
  { id: 1, slug: 'cereals-and-grains', title: 'Cereals and Grains', src: '/images/cereals-and-grains.jpg', flex: 6 },
  { id: 6, slug: 'dairy-products', title: 'Dairy Products', src: '/images/dairy-products.jpg', flex: 6 },
  { id: 11, slug: 'herbs-and-spices', title: 'Herbs and Spices', src: '/images/herbs-and-spices.jpg', flex: 6 },
  { id: 10, slug: 'beverages', title: 'Beverages', src: '/images/beverages.jpg', flex: 6 },
  { id: 12, slug: 'prepared-and-processed', title: 'Prepared and Processed', src: '/images/prepared-and-processed.jpg', flex: 6 },
  { id: 9, slug: 'sugars-and-sweets', title: 'Sugars and Sweets', src: '/images/sugars-and-sweets.jpg', flex: 6 },
  { id: 9, slug: 'foraged-foods', title: 'Foraged Foods', src: '/images/foraged-foods.jpg', flex: 6 },
]);

const targets = ref([
  {
    target: "#searchButton",
    description: "Click on this to start searching for a food.",
  },

  
  {
    target: "#helpButton",
    description: "Click on this if you're lost or if you want to know more info about this app.",
  },

  
  {
    target: "#dietAnalysisButton",
    description: "Click on this to quickly go to the diet analysis page. You can click on the 'Analyze' button on a food's page to add foods to this page.",
  },

  {
    target: "#recipeAnalysisButton",
    description: "Click on this to quickly go to the recipe analysis page. You can click on the 'Add to recipe' button on a food's page to add foods to this page.",
  }
  
]);

const updateTargets = (new_targets) => {
  targets.value = targets.value.concat(new_targets);
}

onAuthStateChanged(auth, (user) => {
  if (user) {
 
    updateTargets([
      {
        target: "#logoutButton",
        description: "Click on this to logout.",
      },
    ]);
  } else {
    updateTargets([
      {
        target: "#loginButton",
        description: "Click on this to login or create a Juan Nutrisyon account. With an account, you can contribute food labels and save recipes for future reference and for other people to view as well.",
      },
    ]);
  }

  updateTargets([
    {
      target: "#appIcon",
      description: "Click on this if you want to go back to the home page"
    },

    {
      target: "#categoryCard",
      description: "Click this to list foods of a specific food category"
    }
  ]);

});


const goToCategory = (slug) => {
  router.push(`/search?category=${slug}`);
};



//
const steps = ref([
  { id: 1, target: "#btn-1", tooltipText: "Click this button to start" },
  { id: 2, target: "#btn-2", tooltipText: "This button does something important" },
  { id: 3, target: "#input-1", tooltipText: "Enter your details here" },
]);

const stepIndex = ref(0);
const isOnboarding = ref(true);

// Computed Property for Current Step
const currentStep = computed(() => steps.value[stepIndex.value]);

// Get Activator for Tooltip (Ensures it attaches to the correct element)
const getActivator = computed(() => {
  return document.querySelector(currentStep.value.target);
});

// Step Navigation
const nextStep = () => {
  if (stepIndex.value < steps.value.length - 1) {
    stepIndex.value++;
  } else {
    isOnboarding.value = false;
  }
};

const prevStep = () => {
  if (stepIndex.value > 0) {
    stepIndex.value--;
  }
};
</script>
