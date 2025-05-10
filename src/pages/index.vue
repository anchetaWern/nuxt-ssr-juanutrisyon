<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}

#category-container {
  max-width: 450px;
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
                <span class="text-white text-body-2">{{ card.title }}</span>
              </div>
            </div>

          </v-card>
        </v-col>
      </v-row>

    </v-container>


    <v-dialog
      max-width="400"
      v-model="welcomeModalVisible"   
      persistent
    >
        <v-card
          title="Welcome to Juan Nutrisyon!🌱"
        >

            <div class="px-5 text-body-1">
              <div>
              Your personal nutrition companion to help you make informed food choices—without guilt or fear.
              </div>

              <div class="mt-5">
              ✅ Search for foods and instantly view their nutrient content.
              </div>

              <div>
              ✅ Build recipes and get a full breakdown of combined nutrients.
              </div>

              <div>
              ✅ Track your daily intake and find out if you're meeting your nutritional goals.
              </div>

              <div class="mt-4">
              ✨ Remember: Your body is resilient, and all foods can have a place in a balanced diet. Focus on eating more <strong>whole foods</strong>, <strong>fiber</strong>, and <strong>essential nutrients</strong>, but also enjoy treats in moderation. You deserve to eat, and no single food defines your health. Moderation, not restriction, is key. 💛
              </div>
            </div>

            <template v-slot:actions>
                <v-btn
                    class="ms-auto"
                    text="Dismiss"
                    @click="closeWelcomeModal"
                ></v-btn>
            </template>
        </v-card>
    </v-dialog>
  
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


const router = useRouter();

const welcomeModalVisible = ref(false);

onMounted(() => {
  if (process.client) {
    welcomeModalVisible.value = !localStorage.getItem('welcome_done');
  }
});

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

const closeWelcomeModal = () => {
  welcomeModalVisible.value = false;
  if (process.client) {
    localStorage.setItem('welcome_done', 'yes');
  }
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
