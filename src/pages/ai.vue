<template>
 
    <v-container class="mt-5" id="ai-container">
    
        <div class="text-subtitle-1 mb-2">
        AI Diet Analyzer
        </div>

        <v-alert 
          v-if="!currentUser"
          density="compact"
          type="warning"
          variant="outlined"
          class="mb-3"
        >
            This feature is still in development. Shoot me an <a href="mailto:ancheta.wern@gmail.com">email</a> if you want early access. 
        </v-alert>

        <v-textarea clearable label="Describe your meal" v-model="meal" rows="2" placeholder="eg. 1 cup kare-kare with bagnet"></v-textarea>

        <v-btn size="small" color="primary" @click="analyze" :loading="analyzing" :disabled="analyzeNotOk" block>Analyze</v-btn>

        <div class="text-grey-darken-3 text-xs mt-1" v-if="totalSeconds">Request took {{ totalSeconds }} seconds</div>

        <v-table v-if="food">
            <tbody>
                <tr>
                    <td class="text-grey-darken-3">
                        <a :href="recipe_link" target="_blank">{{ food }}</a>
                    </td>
                </tr>
                <tr>
                    <td class="text-grey-darken-3" v-if="servingCount">
                        Total servings of the recipe: {{ servingCount }}
                    </td>
                </tr>
                <tr>
                    <td class="text-grey-darken-3" v-if="serving_size">
                        Serving Size: {{ serving_size }} ({{ wholeNumber(serving_size_in_grams) }}g)
                    </td>
                </tr>
                <tr>
                    <td class="text-grey-darken-3" v-if="recipe_calories_per_serving">
                        Calories per serving: {{ wholeNumber(recipe_calories_per_serving) }}kcal
                    </td>
                </tr>
                
            </tbody>
        </v-table>

        <v-table density="compact" v-if="ingredients">
            <thead>
                <tr>
                    <th class="text-left">
                        Ingredients (weight per serving)
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="item in ingredients"
                    :key="item.nutrient"
                >
                    <td>
                        <a :href="`/food/${item.matched_id}`" target="_blank">{{ item.ingredient }} ({{ formatNumber(item.grams / servingCount) }}g)</a>
                        <v-badge
                          v-if="!item.matched_id"
                          color="error"
                          content="no match"
                          inline>
                        </v-badge>
                    </td>
                </tr>
            </tbody>
        </v-table>


<div class="text-subtitle-1 mb-2 mt-5" v-if="macros && macros.length">Estimated nutrients per serving</div>

      <div id="macros-section" class="mt-3" v-if="macros && macros.length && recommended_daily_values">
        <span class="text-subtitle-2">Macros</span>
        <NutrientsTable 
          v-if="macros"
          :nutrients="macros" 
          servingsPerContainer="1" 
          displayValuesPerContainer="false"
          :recommended_daily_values="recommended_daily_values"
          :newServingSize="newServingSize"
          :newServingCount="newServingCount"
          :getValueColor="getValueColor" />
      </div>


      <div id="vitamins-section" class="mt-3" v-if="vitamins && vitamins.length && recommended_daily_values">
        <span class="text-subtitle-2">Vitamins</span>
        <NutrientsTable 
          :nutrients="vitamins" 
          servingsPerContainer="1" 
          displayValuesPerContainer="false"
          :recommended_daily_values="recommended_daily_values"
          :newServingSize="newServingSize"
          :newServingCount="newServingCount"
          :getValueColor="getValueColor" />
      </div>

      <div id="minerals-section" class="mt-3" v-if="minerals && minerals.length && recommended_daily_values">
        <span class="text-subtitle-2">Minerals</span>
        <NutrientsTable 
          :nutrients="minerals" 
          servingsPerContainer="1" 
          displayValuesPerContainer="false"
          :recommended_daily_values="recommended_daily_values"
          :newServingSize="newServingSize"
          :newServingCount="newServingCount"
          :getValueColor="getValueColor" />
      </div>

      <div id="other-nutrients-section" class="mt-3" v-if="others && others.length && recommended_daily_values">
        <span class="text-subtitle-2">Others</span>
        <NutrientsTable 
          :nutrients="others" 
          servingsPerContainer="1" 
          displayValuesPerContainer="false"
          :recommended_daily_values="recommended_daily_values"
          :newServingSize="newServingSize"
          :newServingCount="newServingCount"
          :getValueColor="getValueColor" />
      </div>


    </v-container>

</template>

<style scoped>
#ai-container {
  padding: 0.5rem 0 !important;
}
</style>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { auth } from '@/firebase.js';
import { onAuthStateChanged } from 'firebase/auth';

import { 
    aggregateNutrients,
    getMacros,
    getVitamins,
    getMinerals,
    getOthers,
    modifyServingSize,
    amountPerContainer,
    convertKjToKcal,
} from '@/helpers/Nutrients';

import { calculatePercentage, wholeNumber, formatNumber } from '@/helpers/Numbers';

const API_BASE_URI = import.meta.env.VITE_API_URI;

const currentUser = ref(null);
const analyzeNotOk = ref(true);

const recommended_daily_values = ref(null);

const meal = ref('');
const food = ref('');
const nutrients = ref(null);
const servingCount = ref(null);

const totalSeconds = ref(0);

const ingredients = ref(null);

const serving_size = ref(null);
const serving_size_in_grams = ref(null);
const recipe_total_calories = ref(null);
const recipe_calories_per_serving = ref(null);

const ingredients_count = ref(null);

const macros = ref([]);
const vitamins = ref(null);
const minerals = ref(null);
const others = ref(null);

const recipe_nutrients = ref(null);

const analyzing = ref(false);

const recipe_link = ref(null);

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser.value = {
      email: user.email,
      username: user.displayName,
      uid: user.uid
    }

    if (user.email === 'nutrikid@gmail.com') {
      analyzeNotOk.value = false;
    }
  } else {
    currentUser.value = null
  }
})

const getValueColor = (value, daily_limit) => {
  const dv_percent = calculatePercentage(value, daily_limit); 
  
  if (dv_percent > 125) {
    return 'deep-purple-darken-4';

  } else if (dv_percent >= 75 && dv_percent <= 125) {
    return 'deep-purple-lighten-2';
  } 

  return 'deep-purple-lighten-4';
};

const analyze = async () => {
    
    if (currentUser.value && currentUser.value.email === 'nutrikid@gmail.com') {

      totalSeconds.value = 0;

      console.log('bamster: ', meal.value);

      analyzing.value = true;

      try {
          const res = await axios.post(`${API_BASE_URI}/ai-analyzer`, 
            { 
              'meal': meal.value,
            }, 
          );
          console.log('res: ', res.data);

          totalSeconds.value = res.data.total_seconds.toFixed(2);
          
          food.value = res.data.food;

          nutrients.value = res.data.nutrients;
          servingCount.value = parseInt(res.data.recipe_total_servings);
        
          ingredients.value = res.data.ingredients;
          serving_size.value = res.data.serving_size; 
          serving_size_in_grams.value = res.data.serving_size_in_grams;
          recipe_link.value = res.data.recipe_link;
          refreshNutrients();

          analyzing.value = false;

      } catch (err) {
          console.log('err: ', err);
          analyzing.value = false;
      }
    
    } 
}

const fetchDailyValues = async () => {
  let consolidated_daily_nutrient_dv = null;

  if (process.client) {
    if (sessionStorage.getItem('consolidated_daily_nutrient_dv')) {
        consolidated_daily_nutrient_dv = JSON.parse(sessionStorage.getItem('consolidated_daily_nutrient_dv'));
    } else {
        const fda_daily_nutrient_values_res = await axios.get(`${API_BASE_URI}/consolidated-recommended-daily-nutrient-intake?gender=male&age=19`);
        consolidated_daily_nutrient_dv = fda_daily_nutrient_values_res.data;
        sessionStorage.setItem('consolidated_daily_nutrient_dv', JSON.stringify(consolidated_daily_nutrient_dv));
    }
  }

  // isLoading.value = false;
  console.log('rapas')

  const fda_daily_nutrient_values_arr = consolidated_daily_nutrient_dv.map((itm) => {
      return {
          [itm.nutrient]: itm.daily_value,
      }
  });
  const fda_daily_nutrient_values = Object.assign({}, ...fda_daily_nutrient_values_arr);
  recommended_daily_values.value = fda_daily_nutrient_values;
}

fetchDailyValues();


const refreshNutrients = () => {

  if (process.client) {
    const recipe_data = nutrients.value;

    console.log("recipe data: ");
    console.table(recipe_data);

    // todo: load this from the results: {"corn-on-cob-white":100}
   
    // temporary
   
    let recipe_serving_sizes_data = {};

    console.log('ingredients: ');
    console.table(ingredients.value);

    ingredients.value.forEach(item => {
        if (item.matched_id) {
            recipe_serving_sizes_data[item.matched_id] = item.grams;
        }
    });
  
   console.log('recipe serving sizes data: ');
   console.table(recipe_serving_sizes_data);
   

    /*
    const recipe_serving_sizes_data = {
      "pork-fresh-shoulder-whole-separable-lean-and-fat-raw":907.18,
      "soup-bouillon-cubes-and-granules-low-sodium-dry":10.5, // bouillon-cube-beef is used by AI
      "sausage-hotdog-smoked":150,
      "tomato-sauce":227,
      "tomato":120,
      "carrots-mature-raw":122,
      "potato":368,
      "green-peas-raw":115,
      "onion-bombay-bulb":110,
      "garlic-bulb":18, // garlic raw is used by the AI
      "water-bottled-generic":710,
      "canola-oil":42,
      "spices-pepper-black":0.5,
      "salt-table":0.5, 
      "spices-bay-leaf":1, // none
    };
    */
    
    
    if (recipe_data && recipe_data.length) {
      const aggregated_nutrients = aggregateNutrients(recipe_data, recipe_serving_sizes_data, servingCount.value);
      recipe_nutrients.value = aggregated_nutrients;

      macros.value = getMacros(aggregated_nutrients);
      vitamins.value = getVitamins(aggregated_nutrients);
      minerals.value = getMinerals(aggregated_nutrients);
      others.value = getOthers(aggregated_nutrients);
    
      const recipe_ingredients = recipe_data.map((itm) => {
        const original_serving_size = itm.serving_size;
        const serving_size = parseInt(recipe_serving_sizes_data[itm.description_slug]);
        const serving_size_unit = itm.serving_size_unit;
        const food_state = itm.food_state;
        const food_substate = itm.food_substate;
        const original_calories = convertKjToKcal(itm.calories, itm.calories_unit);
        const new_calories = modifyServingSize(original_serving_size, serving_size, original_calories);
      
        return {
          slug: itm.description_slug,
          original_serving_size,
          serving_size,
          serving_size_unit,
          food_state,
          food_substate,
          original_calories,
          new_calories,
        }
      });

      // ingredients.value = recipe_ingredients;

      const total_calories = recipe_ingredients.reduce(
        (accumulator, itm) => accumulator + itm.new_calories,
        0,
      );

      console.log('total calories: ', total_calories);
      
      recipe_total_calories.value = total_calories;

      const calories_per_serving = total_calories / servingCount.value;       
      recipe_calories_per_serving.value = calories_per_serving;

      console.log('calories per serving: ', calories_per_serving);

      const total_ingredients = recipe_ingredients.length;
      ingredients_count.value = total_ingredients;

      const food_states = {};
      recipe_ingredients.forEach((itm) => {
        food_states[itm.food_state] = food_states.hasOwnProperty(itm.food_state) ? food_states[itm.food_state] + 1 : 1; 
      });

      /*
      const sorted_by_food_state = Object.keys(food_states).sort(function(a, b){
        return food_states[b] - food_states[a];
      }); // first item is the food state

      recipe_food_state.value = sorted_by_food_state[0];
      */

      // issue: recipe_ingredients dont all have calories and serving_size
      console.log('recipe ingredients: ');
      console.table(recipe_ingredients);
      
      const total_weight = recipe_ingredients.reduce(
        (accumulator, itm) => accumulator + itm.serving_size,
        0,
      );

      console.log('total weight: ', total_weight);

      const weight_per_serving = total_weight / servingCount.value;
      console.log('serving count: ', servingCount.value);
      console.log('weight per serving: ', weight_per_serving);
     
      // serving_size_in_grams.value = weight_per_serving;

    }
  }
          
}

</script>