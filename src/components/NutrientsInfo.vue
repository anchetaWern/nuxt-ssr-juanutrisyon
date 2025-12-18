<template>
    <div class="mt-3" v-if="elements && elements.length && recommendedDailyValues && displayMoreNutrients">
        <span class="text-subtitle-2">Elements</span>
        <NutrientsTable 
            :nutrients="elements" 
            :servingsPerContainer="servingsPerContainer" 
            :displayValuesPerContainer="displayValuesPerContainer"
            :displayMoreNutrients="displayMoreNutrients"
            :recommended_daily_values="recommendedDailyValues"
            :originalServingSize="originalServingSize"
            :newServingSize="newServingSize"
            :newServingCount="newServingCount"
            :getValueColor="getValueColor"
            :foodState="foodState"
            :foodCalories="calories"
            :faoNutrientContentClaims="faoNutrientContentClaims"  />
    </div>

    <div id="macros-details-section" class="mt-3" v-if="macros && macros.length && recommendedDailyValues">
        <h2 class="text-subtitle-2">Macronutrients</h2>
        <NutrientsTable 
            :nutrients="macros" 
            :servingsPerContainer="servingsPerContainer" 
            :displayValuesPerContainer="displayValuesPerContainer"
            :displayMoreNutrients="displayMoreNutrients"
            :recommended_daily_values="recommendedDailyValues"
            :originalServingSize="originalServingSize"
            :newServingSize="newServingSize"
            :newServingCount="newServingCount"
            :getValueColor="getValueColor"
            :foodState="foodState" 
            :foodCalories="calories"
            :faoNutrientContentClaims="faoNutrientContentClaims"
        />
    </div>

    <div id="vitamins-section" class="mt-3" v-if="vitamins && vitamins.length && recommendedDailyValues">
        <h2 class="text-subtitle-2">Vitamins</h2>
        <NutrientsTable 
            :nutrients="vitamins" 
            :servingsPerContainer="servingsPerContainer" 
            :displayValuesPerContainer="displayValuesPerContainer"
            :displayMoreNutrients="displayMoreNutrients"
            :recommended_daily_values="recommendedDailyValues"
            :originalServingSize="originalServingSize"
            :newServingSize="newServingSize"
            :newServingCount="newServingCount"
            :getValueColor="getValueColor"
            :foodState="foodState"
            :foodCalories="calories"
            :faoNutrientContentClaims="faoNutrientContentClaims"  />
    </div>

    <div id="minerals-section" class="mt-3" v-if="minerals && minerals.length && recommendedDailyValues">
        <h2 class="text-subtitle-2">Minerals</h2>
        <NutrientsTable 
            :nutrients="minerals" 
            :servingsPerContainer="servingsPerContainer" 
            :displayValuesPerContainer="displayValuesPerContainer"
            :displayMoreNutrients="displayMoreNutrients"
            :recommended_daily_values="recommendedDailyValues"
            :originalServingSize="originalServingSize"
            :newServingSize="newServingSize"
            :newServingCount="newServingCount"
            :getValueColor="getValueColor"
            :foodState="foodState"
            :foodCalories="calories"
            :faoNutrientContentClaims="faoNutrientContentClaims"  />
    </div>

    <div id="others-section" class="mt-3" v-if="others && others.length && recommendedDailyValues">
        <h2 class="text-subtitle-2">Others</h2>
        <NutrientsTable 
            :nutrients="others" 
            :servingsPerContainer="servingsPerContainer" 
            :displayValuesPerContainer="displayValuesPerContainer"
            :displayMoreNutrients="displayMoreNutrients"
            :recommended_daily_values="recommendedDailyValues"
            :originalServingSize="originalServingSize"
            :newServingSize="newServingSize"
            :newServingCount="newServingCount"
            :getValueColor="getValueColor"
            :foodState="foodState"
            :foodCalories="calories"
            :faoNutrientContentClaims="faoNutrientContentClaims"  />
    </div>   
</template>

<script setup>
const props = defineProps({
    elements: Array,
    macros: Array,
    vitamins: Array,
    minerals: Array,
    others: Array,

    calories: Number,
    foodState: String,

    faoNutrientContentClaims: Object,

    recommendedDailyValues: Object,

    servingsPerContainer: [String, Number],
    displayValuesPerContainer: Boolean, 
    newServingCount: [String, Number],
    newServingSize: [String, Number],

    displayMoreNutrients: Boolean,

    originalServingSize: [String, Number],
});



const getValueColor = (value, daily_limit) => {
    return 'deep-purple-lighten-2';
};
</script>