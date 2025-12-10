<template>

    <v-dialog
        v-model="props.open"
        fullscreen
        transition="dialog-bottom-transition"
    >
        <template v-slot:default>

            <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                    text="close"
                    variant="flat"
                    @click="emit('update:open', false)"
                ></v-btn>
            </v-card-actions>

            <v-card title="Daily Values">
    
                <template v-slot:text>
                    <div class="text-body-2">
                        <p>
                        The daily recommended nutrient intake is adapted from multiple sources. It's primarily based from PDRI's (Philippine Dietary Reference Intakes) Estimated Average Requirements (EAR).
                        </p>
                        <p class="mt-2">
                        Nutrients that aren't covered by the EAR are adapted from the Recommended Nutrient Intakes for macronutrients, vitamins and minerals. It's based on a 2,530kcal per day requirement for 19 to 29 year old males.
                        </p>
                        
                        <p class="mt-2">
                        Total fat and total carbohydrates are computed from PDRI's Acceptable Macronutrient Distribution Ranges based on a 2,530kcal per day requirement.
                        </p>

                        <p class="mt-2">
                        Anything else that hasn't been covered by PDRI's recommendations are adapted from the <a href="https://www.fda.gov/food/nutrition-facts-label/daily-value-nutrition-and-supplement-facts-labels" target="_blank">United States' Food and Drug Administration Daily Values</a>. 
                        </p>
                       
                        <p class="mt-2">
                        Do note that these values are only meant to serve as a general guideline for the nutritional needs of the average person. 
                        Individual needs may vary depending on various factors such as age, gender, activity level, health status, body size and composition, metabolic rate, genetic factors, lifestyle and dietary habits, and environmental factors.
                        </p>

                        <p class="mt-2">
                        As a general guideline, you want to avoid eating foods that are high in sugars, saturated fat, and cholesterol. 
                        On the other hand, you want to be eating foods that are high in protein, fiber, vitamins and minerals (except sodium). 
                        To help with this, we've adapted the <a href="https://www.fao.org/ag/humannutrition/32444-09f5545b8abe9a0c3baf01a4502ac36e4.pdf" target="_blank">FAO guidelines for nutrition and health claims</a>.
                        You'll see a label of high, low, very low, and free beside the daily value for specific nutrients if they meet FAO's criteria.
                        </p>

                        <p class="mt-2">These are the reference values for each nutrient:</p>
                        
                    </div>   

                    <div class="pt-3 text-body-2" v-if="daily_values_table">
                 
                        <v-table density="compact">
                            <thead>
                                <tr>
                                <th class="text-left">
                                    Nutrient
                                </th>
                                <th class="text-left">
                                    Value
                                </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="item in daily_values_table.filter(item => item.nutrient !== 'calories')"
                                    :key="item.nutrient"
                                >
                                <td>{{ item.nutrient }}</td>
                                <td>{{ item.value }}</td>
                                </tr>
                            </tbody>
                        </v-table>

                    </div>
                </template>

                
            </v-card>
        </template>
    </v-dialog>


</template>


<script setup>

import { ref, defineProps, defineEmits } from 'vue';

const daily_values_table = ref(null); // todo: fill data

const emit = defineEmits(['update:open']);

const props = defineProps({
    open: {
        type: Boolean,
        default: false
    }
});
</script>