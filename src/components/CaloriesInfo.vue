<template>
    <tr id="calories-available" v-if="food.calories">
        <td class="text-grey-darken-3">

            <NutrientContentLabel  
                labelId="calories-provided"
                requirementLabelId="calories-required"
                percentageId="calories-provided-percentage"
                :value="food.calories"
                :servingSize="food.serving_size"
                :requirement="requirement"
                requirementUnit="kcal"
                :originalServingUnit="food.calories_unit" 
                :originalServingsPerContainer="servingsPerContainer"
                :newServingSize="newServingSize"
                :newServingCount="newServingCount"
                :displayValuesPerContainer="displayValuesPerContainer" />
            
            <FAOContentClaim 
                :value="food.calories"
                :unit="food.calories_unit"
                :requirement="requirement"
                :food="food" 
                :servingsPerContainer="servingsPerContainer" 
                :displayValuesPerContainer="displayValuesPerContainer" 
                :newServingSize="newServingSize" 
                :newServingCount="newServingCount"
                :faoNutrientContentClaims="fao_nutrient_claims" />

            <NutrientContentBar 
                elementId="calories-bar"
                :value="food.calories"
                :servingSize="food.serving_size"
                :requirement="requirement"
                :originalServingSize="food.serving_size"
                :originalServingUnit="food.calories_unit" 
                :originalServingsPerContainer="servingsPerContainer"
                :newServingSize="newServingSize"
                :newServingCount="newServingCount"
                :displayValuesPerContainer="displayValuesPerContainer"
            />
        </td>
    </tr>
</template>

<script setup>
import NutrientContentBar from '@/components/NutrientContentBar.vue';
import FAOContentClaim from '@/components/FAOContentClaim.vue';
import NutrientContentLabel from '@/components/NutrientContentLabel.vue';

const props = defineProps({
    food: Object,
    requirement: Number,
    servingsPerContainer: [String, Number],
    displayValuesPerContainer: Boolean, 
    newServingCount: [String, Number],
    newServingSize: [String, Number],
    faoNutrientContentClaims: Object,
});
</script>