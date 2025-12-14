<template>
    <v-chip 
        class="fao-content-claim"
        size="small" 
        density="compact" 
        :color="getFAOColor(
            FAONutrientContentClaim(
                'energy', 
                value, 
                calculatePercentage(
                    convertKjToKcal(
                        amountPerContainer(
                            value, 
                            servingsPerContainer, 
                            displayValuesPerContainer, 
                            food.serving_size, 
                            100, 
                            newServingCount
                        ),
                        unit
                    ),
                    requirement
                ), 
                food.serving_size, 
                food.state.name, 
                faoNutrientContentClaims
            )
        )"
        v-if="FAONutrientContentClaim(
            'energy', 
            value, 
            calculatePercentage(
                convertKjToKcal(
                    amountPerContainer(
                        value, 
                        servingsPerContainer, 
                        displayValuesPerContainer, 
                        food.serving_size, 
                        100, 
                        newServingCount
                    ), 
                    unit 
                ),
                requirement
            ), 
            food.serving_size, 
            food.state.name, 
            faoNutrientContentClaims
        )">
        {{ 
            FAONutrientContentClaim(
                'energy', 
                value, 
                calculatePercentage(
                    convertKjToKcal(
                        amountPerContainer(
                            value, 
                            servingsPerContainer, 
                            displayValuesPerContainer, 
                            food.serving_size, 
                            newServingSize, 
                            newServingCount
                        ),
                        unit
                    ), 
                    requirement
                ), 
                food.serving_size, 
                food.state.name, 
                faoNutrientContentClaims
            ) 
        }}
    </v-chip>
</template>

<script setup>
import { calculatePercentage, formatNumber } from '@/helpers/Numbers';
import { amountPerContainer, convertWeight, FAONutrientContentClaim, normalizeFoodState, convertKjToKcal, extractNutrients, getFAOColor } from '@/helpers/Nutrients';

/*

*/

const props = defineProps({
    value: [String, Number],
    unit: String,
    requirement: Number,
    food: Object,
    servingsPerContainer: [String, Number],
    displayValuesPerContainer: Boolean,
    newServingSize: [String, Number],
    newServingCount: [String, Number],
    faoNutrientContentClaims: Object,
});

</script>