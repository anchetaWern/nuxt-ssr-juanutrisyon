<template>
  
  <v-app>
    <NuxtPwaManifest />
    
    <Analytics mode="production" />
    <default-bar 
      :updateItems="updateItems" 
      :ingredientCount="ingredientCount"
      :analyzeCount="analyzeCount"
      :loggedInUser="loggedInUser"
    />

    

    <default-view 
      
      @update-ingredient-count="updateIngredientCount" 
      @update-serving-size="updateServingSize"
      @update-serving-count="updateServingCount"
      @update-analyze-count="updateAnalyzeCount" />

      <FloatingActionButton />
      

    <!-- Install Banner -->
    <v-slide-y-reverse-transition>
      <v-card
        v-if="showBanner"
        class="install-banner"
        elevation="8"
      >
        <div class="install-content">
          <div>
            <strong>Install Juan Nutrisyon</strong><br />

            <small v-if="!isIOS">
              Access faster.
            </small>

            <small v-else>
              Tap
              <v-icon size="16">mdi-export-variant</v-icon>
              then <b>Add to Home Screen</b>
            </small>
          </div>

          <div class="actions">
            <v-btn
              v-if="canInstall && !isIOS"
              color="yellow-darken-2"
              @click="install"
              class="px-3 py-1"
            >
              Install
            </v-btn>

            <v-btn icon @click="dismiss">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
        </div>
      </v-card>
    </v-slide-y-reverse-transition>


  </v-app>
</template>

<script setup>
import { computed, ref, onMounted, provide } from 'vue';
import { usePWAInstall } from '@/composables/usePWAInstall'

import { useRouter } from 'vue-router'
import { auth } from '@/firebase.js';
import { onAuthStateChanged } from "firebase/auth";

import DefaultBar from './default-bar.vue'
import DefaultView from './default-view.vue'

import FloatingActionButton from '@/components/FloatingActionButton.vue';

import Loader from '@/components/Loader.vue';

const router = useRouter();

const ingredientCount = ref(0);
const analyzeCount = ref(0);

const loggedInUser = ref(null);

onAuthStateChanged(auth, (user) => {
  if (user) {
    loggedInUser.value = user;
  } else {
    loggedInUser.value = null;
  }
});

onMounted(() => {

  if (process.client) {

    const recipe_data = JSON.parse(sessionStorage.getItem('recipe'));
    const recipe_serving_sizes = JSON.parse(sessionStorage.getItem('recipe_serving_sizes'));
    if (recipe_data && recipe_serving_sizes) {
      ingredientCount.value = recipe_data.length;
    }

    const analyze_data = JSON.parse(sessionStorage.getItem('analyze'));
    if (analyze_data) {
      analyzeCount.value = analyze_data.length;
    }
  }

});

const updateIngredientCount = () => {

  if (process.client) {
    const recipe_data = JSON.parse(sessionStorage.getItem('recipe'));
    const recipe_serving_sizes = JSON.parse(sessionStorage.getItem('recipe_serving_sizes'));

    if (recipe_data && recipe_serving_sizes) {
      ingredientCount.value = recipe_data.length;
    } else {
      ingredientCount.value = 0;
    }
  }
}

const updateServingSize = () => {
  const recipe_serving_sizes = JSON.parse(sessionStorage.getItem('recipe_serving_sizes'));
}

const updateServingCount = (servingCount) => {

  if (process.client) {
    sessionStorage.setItem('serving_count', servingCount);
  }
}

const updateAnalyzeCount = () => {
  const analyze_data = JSON.parse(sessionStorage.getItem('analyze'));
  if (analyze_data) {
    analyzeCount.value = analyze_data.length;
  } else {
    analyzeCount.value = 0;
  }
}

const currentRoute = computed(() => router.currentRoute.value);

const updateItems = (q) => {
  
  if (q) {
    router.push({ 
      name: 'search', 
      query: { 
        q, 
      }
    });
  }

}


//

const tourModeEnabled = ref(false)

if (process.client) {
  tourModeEnabled.value = localStorage.getItem("tourModeEnabled") === 'yes'

  watch(tourModeEnabled, (newValue) => {
    console.log("setting new value for tour mode: ", newValue)
    localStorage.setItem("tourModeEnabled", newValue)
  })
}

provide("tourModeEnabled", tourModeEnabled)

const updateTourMode = (value) => {
  tourModeEnabled.value = value
}
provide('updateTourMode', updateTourMode)


const dismissed = ref(false)

const { canInstall, isIOS, showBanner, install, dismiss } = usePWAInstall()
console.log('can install: ', canInstall.value);
console.log('is ios: ', isIOS.value);
console.log('show banner: ', showBanner.value);

</script>

<style>
.install-banner {
  position: fixed;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 32px);
  max-width: 520px;
  border-radius: 16px;
  z-index: 9999;
}

.install-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
}

.actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>