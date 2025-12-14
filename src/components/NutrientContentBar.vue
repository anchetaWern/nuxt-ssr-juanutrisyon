<template>
    <v-progress-linear 
        id="calories-bar"
        class="mt-1"
        :model-value="
            calculatePercentage(
                convertKjToKcal(
                    amountPerContainer(
                        value, 
                        servingsPerContainer, 
                        displayValuesPerContainer, 
                        originalServingSize, 
                        newServingSize, 
                        newServingCount
                    ), 
                    originalServingUnit
                ),
                2000
            )" 
        :bg-color="
            getRailColor(
                convertKjToKcal(
                    amountPerContainer(
                        value, 
                        servingsPerContainer, 
                        displayValuesPerContainer, 
                        originalServingSize, 
                        newServingSize, 
                        newServingCount
                    ),
                    originalServingUnit
                )
            )" 
        :color="
            getProgressColor(
                convertKjToKcal(
                    amountPerContainer(
                        value, 
                        servingsPerContainer, 
                        displayValuesPerContainer, 
                        originalServingSize, 
                        newServingSize, 
                        newServingCount
                    ),
                    originalServingUnit
                )
            )">
    </v-progress-linear>
</template>

<script setup>
import { calculatePercentage, formatNumber } from '@/helpers/Numbers';
import { convertKjToKcal, extractNutrients, amountPerContainer } from '@/helpers/Nutrients';

const getRailColor = (calories) => {
    return 'grey-darken-3';
}

const getProgressColor = (calories) => {
    return 'deep-purple-lighten-2';
}

const props = defineProps({
    value: [String, Number],
    servingSize: [String, Number],
    requirement: [String, Number],
    originalServingSize: [String, Number],
    originalServingUnit: String, 
    originalServingsPerContainer: String,
    newServingSize: [String, Number],
    newServingCount: [String, Number],
    displayValuesPerContainer: Boolean, 
});
</script>