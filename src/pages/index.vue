<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}

#main-container {
  max-width: 450px;
}
</style>


<template>
 
    <div class="mt-5" id="main-container">

      <v-row dense justify="center">
        <v-col>


          <v-card
            title=""
          >
            <div class="px-5 pb-3 text-body-1">
                <h1 class="text-h6">Juan Nutrisyon – Nutrition Facts for Filipino Foods and Recipes.</h1>
                <div>
                Helping you make informed food choices—without guilt or fear.
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

            
          </v-card>

        </v-col>
      </v-row>


      <v-row dense justify="center">
        <v-col>

          <v-card>
            <div class="px-5 pt-3 pb-3 text-body-1">
              <h2 class="text-subtitle-1 font-weight-bold">View Food Database</h2>
              <p class="text-body-2">With over 15,000 foods in our database you'll be sure to find what you're looking for. Our food data is sourced from PhilFCT and USDA food database, but we also add new foods from food labels.</p>
            </div>

            <div class="px-2 pb-2">
              <v-btn block href="/categories" color="primary">
              View
              </v-btn>
            </div>

          </v-card>

        </v-col>
      </v-row>

      <v-row>
        <v-col>

          <v-card>
            <div class="px-5 pt-3 pb-3 text-body-1">
              <h2 class="text-subtitle-1 font-weight-bold">Create & Analyze Recipes</h2>
              <p class="text-body-2">Can't find a food in our database? You can sign up for an account and create your own recipes. Simply search for the ingredients and add them to a recipe. Adjust the serving sizes accordingly and the nutrients for each serving will now be estimated.</p>
            </div>

            <div class="px-2 pb-2">
              <v-btn block href="/recipe" color="primary">
              Create
              </v-btn>
            </div>

          </v-card>

        </v-col>

      </v-row>

      <v-row dense justify="center">
        <v-col>

          <v-card>
            <div class="px-5 pt-3 pb-3 text-body-1">
              <h2 class="text-subtitle-1 font-weight-bold">Analyze Your Diet</h2>
              <p class="text-body-2">Ever wonder if you're consuming too much of a certain nutrient? Or if you're missing out on essential nutrients because of your diet? Fret not because this tool will allow you to analyze your diet. It will show you the most important nutrients you should be keeping an eye on, your over-consumed nutrients, your deficient nutrients, and your good to go nutrients.</p>
            </div>

            <div class="px-2 pb-2">
              <v-btn block href="/analyze" color="primary">
              Analyze
              </v-btn>
            </div>

          </v-card>

        </v-col>
      </v-row>

      <v-row>
        <v-col>

          <v-card>
            <div class="px-5 pt-3 pb-3 text-body-1">
              <h2 class="text-subtitle-1 font-weight-bold">Contribute Food Data</h2>
              <p class="text-body-2">This project is funded out of pocket by a one-man team so we rely on community contribution for the food data.</p>
            </div>

            <div class="px-2 pb-2">
              <v-btn block href="/recipe" color="primary">
              Contribute
              </v-btn>
            </div>

          </v-card>

        </v-col>

      </v-row>

    </div>


  
  
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
      href: `https://app.juanutrisyon.info`
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

  ],

  script: [
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebSite",
            "@id": "https://app.juanutrisyon.info/#website",
            "name": "Juan Nutrisyon",
            "url": "https://app.juanutrisyon.info",
            "description": "Juan Nutrisyon helps Filipinos make healthier food choices by providing nutrition facts, diet analysis tools, food tracking, and recipe insights.",
            "publisher": {
              "@id": "https://app.juanutrisyon.info/#organization"
            },
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://app.juanutrisyon.info/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            },
            "hasPart": [
              {
                "@type": "WebPage",
                "name": "Recipe Creation",
                "url": "https://app.juanutrisyon.info/recipe"
              },
              {
                "@type": "WebPage",
                "name": "Diet Analysis",
                "url": "https://app.juanutrisyon.info/analyze"
              },
              {
                "@type": "WebPage",
                "name": "Food Contribution",
                "url": "https://contribute.juanutrisyon.info"
              }
            ]
          },
          {
            "@type": "WebApplication",
            "@id": "https://app.juanutrisyon.info/#webapp",
            "name": "Juan Nutrisyon",
            "url": "https://app.juanutrisyon.info",
            "operatingSystem": "Web",
            "applicationCategory": "HealthApplication",
            "description": "Analyze and track your diet, create and view recipe nutrients with Filipino food nutrition data.",
            "publisher": {
              "@id": "https://app.juanutrisyon.info/#organization"
            }
          },
          {
            "@type": "Organization",
            "@id": "https://app.juanutrisyon.info/#organization",
            "name": "Juan Nutrisyon",
            "url": "https://app.juanutrisyon.info",
            "logo": {
              "@type": "ImageObject",
              "url": "https://app.juanutrisyon.info/juan-nutrisyon-logo.jpg"
            },
            "sameAs": [
              "https://www.facebook.com/juanutrisyon"
            ]
          }
        ]
      })
    }
  ]

});


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
