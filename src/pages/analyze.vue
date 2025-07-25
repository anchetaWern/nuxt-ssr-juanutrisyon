<template>
 
    <v-container class="mt-5" id="analyze-container">
    
      <div class="text-subtitle-1 mb-2">
        Analyze your diet
        <v-btn size="x-small" variant="text" icon="mdi-help" @click="helpDialog = true" id="helpButton"></v-btn>
      </div>

      <v-alert 
        v-if="!analyze || analyze.length === 0"
        density="compact"
        type="warning"
        variant="outlined"
      >
        You haven't added any foods yet. You can click on the 'Analyze' button on a food page to add it. 
      </v-alert>

      <div id="analyzed-foods" v-if="analyze && analyze.length > 0 && servingSizes">
       
        <div v-for="food in analyze" :key="food.description_slug" class="mb-3">
          <FoodCard 
            :food="food" 
            :removeFood="removeFood"
            :initialServingSize="servingSizes[food.description_slug]"
            @update-serving-size="updateServingSize"
            :openModifyServingSizeModal="openModifyServingSizeModal"
            :key="food_card_key" />
        </div>
      </div>

      <div v-if="analyze && analyze.length > 0 && servingSizes">
        <div class="text-subtitle-1 mt-5 mb-2">Summary</div>

        <v-row id="analysis-summary" v-if="summary_nutrients && summary_nutrients.length > 0" justify="space-between" dense no-gutters>
          <v-col
            v-for="summary_nut in summary_nutrients"
            :key="summary_nut.name"
            sm="4" 
            md="4"
            class="mb-1"
          >
            <NutritionCard :nutrient="summary_nut" :limits="recommended_daily_values" />
          </v-col>
        </v-row>

        <div v-if="deficient_nutrients && deficient_nutrients.length > 0">
          <div class="text-subtitle-1 mt-5 mb-2">Deficient Nutrients</div>

          <div id="deficient-nutrients">
            <NutrientsTable 
              :nutrients="deficient_nutrients" 
              servingsPerContainer="1" 
              displayValuesPerContainer="false"
              :recommended_daily_values="recommended_daily_values"
              :newServingSize="newServingSize"
              :newServingCount="newServingCount"
              :getValueColor="getValueColor"  />
          </div>
        </div>

        <div v-if="overconsumed_nutrients && overconsumed_nutrients.length > 0">
          <div class="text-subtitle-1 mt-5 mb-2">Over-consumed nutrients</div>

          <div id="overconsumed-nutrients">
            <NutrientsTable 
              :nutrients="overconsumed_nutrients" 
              servingsPerContainer="1" 
              displayValuesPerContainer="false"
              :recommended_daily_values="recommended_daily_values"
              :newServingSize="newServingSize"
              :newServingCount="newServingCount"
              :getValueColor="getValueColor" />
          </div>
        </div>

        <div v-if="good_coverage_nutrients && good_coverage_nutrients.length > 0">
          <div class="text-subtitle-1 mt-5 mb-2">Nutrients with good coverage</div>

          <div id="good-coverage-nutrients">
            <NutrientsTable 
              :nutrients="good_coverage_nutrients" 
              servingsPerContainer="1" 
              displayValuesPerContainer="false"
              :recommended_daily_values="recommended_daily_values"
              :newServingSize="newServingSize"
              :newServingCount="newServingCount"
              :getValueColor="getValueColor"  />
          </div>
        </div>


        <div class="mt-5 text-center">
          <v-btn id="report-issue" size="x-small" variant="text" @click="openReportIssueModal">
          Report Issue
          </v-btn>
        </div>

      </div>


      <v-dialog
          v-model="modifyServingSizeDialog"
          width="300"
      >
          <v-card title="Modify Serving Size">
              <div class="px-5 py-2">
                  <div v-if="custom_serving_sizes">
                  
                      <v-radio-group v-model="selected_custom_serving">
                        <v-radio 
                          :label="cs.name" 
                          :value="cs.volume_in_ml ? convertWeight(current_food.density.density, cs.volume_in_ml): cs.weight" 
                          v-for="cs in custom_serving_sizes">
                        </v-radio>
                      </v-radio-group>

                      <div class="text-medium-emphasis">Quantity</div>
                      <v-number-input
                          control-variant="split"
                          inset
                          v-model="selected_serving_qty"
                      ></v-number-input>
                  </div>

                  <div v-if="current_food.custom_serving_size" class="text-body-2 text-medium-emphasis py-1">
                    {{ current_food.custom_serving_size }} = {{ current_food.serving_size }}{{ current_food.serving_size_unit }}
                  </div>

                  <div v-else-if="current_food.serving_size" class="text-body-2 text-medium-emphasis py-1">
                    Original serving size: {{ current_food.serving_size }}{{ current_food.serving_size_unit }}
                  </div>

                  <div v-if="current_food.servings_per_container" class="text-body-2 text-medium-emphasis py-1">
                    Servings per container: {{ current_food.servings_per_container }} 
                  </div>

                  <v-text-field
                      label="Serving size in grams"
                      placeholder="50"
                      v-model="current_food_serving_size"
                  ></v-text-field>

                  <v-btn color="primary" block @click="modifyServingSize" rounded="0">Modify serving size</v-btn>
              </div>
          </v-card>

      </v-dialog>

      <v-dialog
          v-model="reportIssueModalVisible"
          width="300"
          max-width="400"
      >
          <v-card title="Report Issue">
              <template v-slot:text>
                  
                  <v-textarea
                      label="Describe your issue"
                      v-model="issueDescription"
                      rows="2"
                  ></v-textarea>

                  <v-btn color="primary" block @click="submitIssue" rounded="0">Submit</v-btn>
              </template>
          </v-card>
      </v-dialog>

    </v-container>


    <v-dialog
      v-model="helpDialog"
      width="auto"
      max-width="350px"
    >
      <template v-slot:default="{ isActive }">
        <v-card title="Help">
          <template v-slot:text>
            Click the button below to start a tour of the page. <v-btn class="mt-2" color="primary" @click="enableTourMode" block>Start Tour</v-btn>

            <br>
            To analyze your diet, search for the foods you ate for a day and click on the "Analyze" button. Repeat this step for every food you ate. 
            <br>
            Once done, go to the <a href="/analyze">diet analysis page</a> then adjust the serving sizes for each food by clicking on the weighing scale icon and entering the weight of the food in grams. Click on the "modify serving size" button to commit your change.<br>
            The summary section is where all the most important nutrients to watch out for is displayed. <br>
            The deficient nutrients section is where all the nutrients you're deficient in is listed. <br>
            The over-consumed nutrients section is where all the nutrients you've overconsumed is listed. <br>
            The nutrients with good coverage section lists all the nutrients where you are meeting the daily recommended values. <br>
            Note that not all foods have data on every single nutrient. For example, foods from the PhilFCT database don't have data on Vitamin B6, Vitamin B9, Vitamin B12, Vitamin D and Vitamin K. But foods from the Food Data Central has it. <br>
            This means the analysis can never be 100% accurate for those nutrients.
          </template>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              text="ok"
              variant="flat"
              @click="isActive.value = false"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>


    <Tour 
      :targets="targets" 
      :isLoading="isLoading"
      v-if="tourModeEnabled"
    />
    

</template>

<style scoped>
#analyze-container {
  padding: 0.5rem 0 !important;
}
</style>

<script setup>
import FoodCard from '@/components/FoodCard.vue';
import NutritionCard from '@/components/NutritionCard.vue';
import NutrientsTable from '@/components/NutrientsTable.vue';

import { ref, watch, onMounted, nextTick, defineEmits, inject } from 'vue';

import axios from 'axios';

import Toast, { createToast, clearToasts } from 'mosha-vue-toastify'
import 'mosha-vue-toastify/dist/style.css'

import { 
    aggregateNutrients,
    filterNutrients,
    filterDeficientNutrients,
    filterOverconsumedNutrients,
    filterGoodCoverageNutrients,
    convertWeight,
} from '@/helpers/Nutrients';

import { calculatePercentage } from '@/helpers/Numbers';

import Tour from '@/components/Tour.vue';


const API_BASE_URI = import.meta.env.VITE_API_URI;


const summary_nutrients_values = ['water', 'protein', 'dietary fiber', 'sodium', 'saturated fat', 'cholesterol', 'sugar', 'total carbohydrates', 'total fat']; 

const summary_nutrients = ref(null);

const deficient_nutrients = ref(null);
const good_coverage_nutrients = ref(null);
const overconsumed_nutrients = ref(null);

const newServingSize = ref(null);
const newServingCount = ref(1);

const reportIssueModalVisible = ref(false);
const issueDescription = ref('');


//
const analyze = ref(null);
const servingSizes = ref({});

onMounted(() => {
  if (process.client) {
    const stored_analyze_items = JSON.parse(sessionStorage.getItem('analyze') || '[]');
    console.log('now setting analyze: ', stored_analyze_items);
    analyze.value = stored_analyze_items;

    const stored_analyze_serving_sizes = JSON.parse(sessionStorage.getItem('analyze_serving_sizes') || '{}');
    servingSizes.value = stored_analyze_serving_sizes;
  }
});

const recommended_daily_values = ref(null);


const current_food_slug = ref(null);
const current_food = ref(null);
const modifyServingSizeDialog = ref(false);

const custom_serving_sizes = ref(null);
const selected_custom_serving = ref(null);
const selected_serving_qty = ref(1);

const custom_servings_ref = ref(null);

const food_card_key = ref(1);

const current_food_serving_size = ref(null); // the serving size set for the food being currently updated
const hasValuesPerContainerToggle = ref(false);

const isLoading = ref(true);

const tourModeEnabled = inject("tourModeEnabled");
const updateTourMode = inject("updateTourMode");

const enableTourMode = () => {
  helpDialog.value = false;
  updateTourMode(true);
}

const helpDialog = ref(false);

const initial_targets = [
  {
    target: '#analyzed-foods .food-card:nth-child(1) .food-description',
    description: "This is the name of the food. You can click on this to view the food page."
  },

  {
    target: '#analyzed-foods .food-card:nth-child(1) .modify-serving-size',
    description: "Modify the serving size for each food via the text field or by clicking the weighing scale icon."
  },

  {
    target: '#analyzed-foods .food-card:nth-child(1) .remove-food',
    description: "Click on this to remove the food from your analysis."
  },

  {
    target: '#analysis-summary',
    description: "These are the most important nutrients you have to watch out for. A black text means neutral, green text means you’ve met the recommended daily value for the specific nutrient for that day, and red text can either mean you’re over-consuming or under-consuming the nutrient. You know which one by looking at the arrow: up is over, down is under.",
  },
  {
    target: '#deficient-nutrients',
    description: "These are the nutrients you’re deficient in. Look into foods that are high on these nutrients and add them to your diet over time."
  },
];

const targets = ref(initial_targets);

const getUpdatedTargets = (overconsumed_nutrients, good_coverage_nutrients) => {

  const new_targets = initial_targets;
  if (overconsumed_nutrients) {
    new_targets.push({
      target: '#overconsumed-nutrients',
      description: "These are the nutrients you’re over-consuming. Try going through the food pages of all the foods you’ve added for analysis and check which ones are high on these nutrients. From there, limit how much of those foods you are eating on a daily basis.",
      position: 'top',
    });
  }

  if (good_coverage_nutrients) {
    new_targets.push({
      target: '#good-coverage-nutrients',
      description: "These are the nutrients where you’re hitting the daily recommended values. Continue consuming the foods rich in these nutrients so you can continue hitting the targets on a daily basis.",
      position: 'top',
    });
  }


  new_targets.push({
    target: '#report-issue',
    description: "Click on this button to report any issue you notice.",
    position: 'top'
  });

  return new_targets;
}


let isProgrammaticUpdate = false;

const emit = defineEmits(['update-analyze-count-child', 'update-analyze-serving-size-child']);

if (analyze.value && Object.keys(servingSizes).length === 0) {
  analyze.value.forEach(food => {
    servingSizes.value[food.description_slug] = food.serving_size;
  });
}

watch(selected_custom_serving, (new_custom_serving, old_custom_serving) => {
  if (isProgrammaticUpdate) return;
  selected_serving_qty.value = 1;
  current_food_serving_size.value = parseFloat(new_custom_serving);  
});

watch(selected_serving_qty, (new_serving_qty, old_serving_qty) => {
  if (isProgrammaticUpdate) return;

  if (selected_custom_serving.value) {
      current_food_serving_size.value = parseFloat(selected_custom_serving.value) * parseInt(new_serving_qty);
  }
});


const loadCustomServingsData = () => {
  // load custom servings data
  if (process.client) {
    const stored_cs = sessionStorage.getItem('analyze_custom_servings');
    if (stored_cs) {
      
      custom_servings_ref.value = JSON.parse(stored_cs); 
    }
  }
}

const fetchDailyValues = async () => {
  console.log('===fetching daily values...');

  try {
    const data = await $fetch(`${API_BASE_URI}/consolidated-recommended-daily-nutrient-intake?gender=male&age=19`);

    if (data) {
      console.log('consolidated: ', data);

      const fda_daily_nutrient_values_arr = data.map((itm) => ({
        [itm.nutrient]: itm.daily_value,
      }));

      const fda_daily_nutrient_values = Object.assign({}, ...fda_daily_nutrient_values_arr);
      recommended_daily_values.value = fda_daily_nutrient_values;
    }
  } catch (error) {
    console.error('Failed to fetch daily values:', error);
  }
};


const openModifyServingSizeModal = (food_slug, custom_servings_category) => {
  
  current_food_slug.value = food_slug;
  const found_food = analyze.value.find(itm => itm.description_slug === food_slug);
  current_food.value = found_food;

  if (custom_servings_category) {
    hasValuesPerContainerToggle.value = false;
    
    const serving_units = custom_servings_category.serving_units.map(itm => {
      return {
        'name': itm.name,
        'weight': itm.weight,
        'unit': itm.weight_unit,
        'volume_in_ml': itm.volume_in_ml,
      }
    })
    .filter((itm) => {
      return itm.volume_in_ml && found_food.density || itm.weight;
    });

    if (serving_units && serving_units.length > 0) {
        custom_serving_sizes.value = serving_units;
    }

    // load corresponding custom serving and fill the field if available
    
    const current_custom_serving = custom_servings_ref.value[food_slug];

    if (current_custom_serving) {
      isProgrammaticUpdate = true;

      const current_serving_size = current_custom_serving.weight * current_custom_serving.qty;
      
      selected_custom_serving.value = current_custom_serving.weight;
      selected_serving_qty.value = current_custom_serving.qty;
      current_food_serving_size.value = current_serving_size; // custom_servings_ref.value[food_slug].weight;

      nextTick(() => {
        isProgrammaticUpdate = false;
      });
      
    }

  } else {
    
    const current_food = analyze.value.find(itm => itm.description_slug === food_slug);

    if (current_food.servings_per_container > 1) {
      
      hasValuesPerContainerToggle.value = true;
    }

    const current_serving_size = parseFloat(servingSizes.value[food_slug]);

    custom_serving_sizes.value = null;
    selected_custom_serving.value = current_serving_size;
    selected_serving_qty.value = 1;

    current_food_serving_size.value = current_serving_size;

  }
  
  modifyServingSizeDialog.value = true;
}

const modifyServingSize = () => {

  if (process.client) {
    modifyServingSizeDialog.value = false;

    updateServingSize(current_food_slug.value, current_food_serving_size.value);

    food_card_key.value += 1; 

    let stored_custom_servings = {};
    
    const stored_cs = sessionStorage.getItem('analyze_custom_servings');
    if (stored_cs) {
      stored_custom_servings = JSON.parse(stored_cs);
    }

    stored_custom_servings[current_food_slug.value] = {
      'weight': selected_custom_serving.value,
      'qty': selected_serving_qty.value, 
    }

    custom_servings_ref.value = stored_custom_servings;

    sessionStorage.setItem('analyze_custom_servings', JSON.stringify(stored_custom_servings));
  }
}


const removeFood = (slug) => {
  
  if (process.client) {

    const updated_analyze = analyze.value.filter((food) => {
      return food.description_slug !== slug;
    }); 

    sessionStorage.setItem('analyze', JSON.stringify(updated_analyze));

    analyze.value = updated_analyze;   
    delete servingSizes.value[slug];  

    emit('update-analyze-count-child');

    const stored_cs = sessionStorage.getItem('analyze_custom_servings');
    if (stored_cs) {
      const stored_custom_servings = JSON.parse(stored_cs);
      delete stored_custom_servings[slug];

      if (Object.keys(stored_custom_servings).length > 0) {
        
        sessionStorage.setItem('analyze_custom_servings', JSON.stringify(stored_custom_servings));

        const updated_analyze_serving_sizes = Object.fromEntries(
          Object.entries(servingSizes.value).map(([key, value]) => [key, value])
        );

        sessionStorage.setItem('analyze_serving_sizes', JSON.stringify(updated_analyze_serving_sizes));
      } else {
        sessionStorage.removeItem('analyze_custom_servings');
        sessionStorage.removeItem('analyze_serving_sizes');
      }

    }

    refreshNutrients();
  }
}


const updateServingSize = (slug, newServingSize) => {

  if (process.client) {
    console.log('HANTO')
    servingSizes.value[slug] = newServingSize;
    sessionStorage.setItem('analyze_serving_sizes', JSON.stringify(servingSizes.value));

    emit('update-analyze-serving-size-child');

    refreshNutrients();
  }
}

const getRailColor = (value, daily_limit) => {
  return 'grey-darken-3';
};

const getValueColor = (value, daily_limit) => {
  const dv_percent = calculatePercentage(value, daily_limit); 
  
  if (dv_percent > 125) {
    return 'deep-purple-darken-4';

  } else if (dv_percent >= 75 && dv_percent <= 125) {
    return 'deep-purple-lighten-2';
  } 

  return 'deep-purple-lighten-4';
};


const refreshNutrients = () => {
  console.log('ref called');
  if (process.client) {  
    console.log('kliyente');

    const analyze_data = JSON.parse(sessionStorage.getItem('analyze'));
    const analyze_serving_sizes_data = JSON.parse(sessionStorage.getItem('analyze_serving_sizes'));
    console.log('analyze data: ', analyze_data);
    console.log('serving sizes: ', analyze_serving_sizes_data);
    console.log('reco daily: ', recommended_daily_values.value); // this is empty

    if (analyze_data && analyze_data.length > 0 && analyze_serving_sizes_data && recommended_daily_values.value) {
      console.log('analyze data: ', analyze_data);
      console.log('analyze serving sizes data: ', analyze_serving_sizes_data);

      const aggregated_nutrients = aggregateNutrients(analyze_data, analyze_serving_sizes_data, 1);
      console.log('aggregated nutrients: ', aggregated_nutrients);
      
      const filtered_nutrients = filterNutrients(aggregated_nutrients, summary_nutrients_values);
      console.log('filtered nutrients: ', filtered_nutrients);

      console.log('reco values: ', recommended_daily_values.value);
      
      const filtered_deficient_nutrients = filterDeficientNutrients(aggregated_nutrients, recommended_daily_values.value);
      console.log('deficient nutrients: ', filtered_deficient_nutrients);

      const filtered_overconsumed_nutrients = filterOverconsumedNutrients(aggregated_nutrients, recommended_daily_values.value);
      console.log('filtered overconsumed nutrients: ', filtered_overconsumed_nutrients);

      const overconsumed_nutrient_names = filtered_overconsumed_nutrients.map(itm => itm.name);
      
      // exclude overconsumed nutrients
      const filtered_good_coverage_nutrients = filterGoodCoverageNutrients(aggregated_nutrients, recommended_daily_values.value, overconsumed_nutrient_names);
      console.log('good nutrients: ', filtered_good_coverage_nutrients);
      summary_nutrients.value = filtered_nutrients;

      deficient_nutrients.value = filtered_deficient_nutrients;
      good_coverage_nutrients.value = filtered_good_coverage_nutrients;
      overconsumed_nutrients.value = filtered_overconsumed_nutrients;

      isLoading.value = false;
    
      targets.value = getUpdatedTargets(filtered_good_coverage_nutrients, filtered_overconsumed_nutrients);
    }
  }
}


const openReportIssueModal = () => {
    reportIssueModalVisible.value = true;
}


const submitIssue = async () => {

  const food_urls = analyze.value.map(itm => itm.description_slug);

  if (issueDescription.value.trim()) {
    
      try {
          await axios.post(`${API_BASE_URI}/report-issue`, 
              { 
                  'page': `analyze`,
                  'params': JSON.stringify(food_urls),
                  'description': issueDescription.value
              }, 
          );

          createToast(
              {
                  title: 'Submitted!',
                  description: "Your issue was submitted. Thank you for your contribution. We really appreciate it!"
              }, 
              { type: 'success', position: 'bottom-right' }
          );

          issueDescription.value = '';
          reportIssueModalVisible.value = false;
          
      } catch (err) {
          console.log('submit issue error: ', err);
      }
  }
  
}



//

onMounted(async () => {
  console.log('on mounted..');
  loadCustomServingsData();
  await fetchDailyValues();
  refreshNutrients();
});
</script>