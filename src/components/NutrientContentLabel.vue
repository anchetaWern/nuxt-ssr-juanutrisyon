<template>
   {{ label }}

    <span :id="labelId">
    {{ 
        formatNumber(
            convertKjToKcal(
                amountPerContainer(
                    value, 
                    servingsPerContainer, 
                    displayValuesPerContainer, 
                    servingSize, 
                    newServingSize, 
                    newServingCount
                ),
                originalServingUnit
            )
        ) 
    }}{{ requirementUnit }}
    </span> / <span :id="requirementLabelId">{{ requirement }}{{ requirementUnit }}</span>

    <span :id="percentageId">
    ({{ 
        formatNumber(
            calculatePercentage(
                convertKjToKcal(
                    amountPerContainer(
                        value, 
                        servingsPerContainer, 
                        displayValuesPerContainer, 
                        servingSize, 
                        newServingSize, 
                        newServingCount
                    ),
                    originalServingUnit
                ), 
                requirement
            )
        ) 
    }}%) 
    </span>
</template>

<script setup>
import { calculatePercentage, formatNumber } from '@/helpers/Numbers';
import { convertKjToKcal, extractNutrients, amountPerContainer } from '@/helpers/Nutrients';

const props = defineProps({
    labelId: String,
    label: String,
    value: [String, Number],
    servingSize: [String, Number],
    requirement: [String, Number],
    requirementLabelId: String,
    requirementUnit: String,
    originalServingUnit: String, 
    newServingSize: [String, Number],
    newServingCount: [String, Number],
    displayValuesPerContainer: Boolean, 
    percentageId: String,
});
</script>