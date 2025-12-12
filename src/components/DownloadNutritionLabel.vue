<template>

    <div ref="exportable" class="capture-area hidden" v-if="recommended_daily_values">

        <NutritionLabel 
            :name="food.description"
            :servingsPerContainer="food.servings_per_container"
            :servingSize="food.serving_size"
            :calories="food.calories"
            :caloriesUnit="food.calories_unit"
            :nutritionData="food.nutrients"
            :ingredients="food.ingredients"
            :recommended_daily_values="recommended_daily_values"
        />
    </div>

    <div id="export-image" class="text-center mt-2">
        <v-btn variant="plain" size="x-small" @click="exportAsImage">
        Download Nutrition Label
        </v-btn>
    </div>

</template>

<script setup>
import { ref, defineProps } from 'vue';
import { toPng } from 'html-to-image';
import NutritionLabel from '@/components/NutritionLabel.vue';

const props = defineProps({
    food: {
        type: Object,
        default: null,
    },
    recommended_daily_values: {
        type: Object,
        default: null,
    }
});

const exportable = ref(null);

const exportAsImage = () => {
    
    const node = exportable.value;

    node.classList.remove('hidden');

    toPng(node)
        .then((dataUrl) => {
            
            const link = document.createElement('a');
            link.download = `${props.food.description_slug}-nutrient-info.png`;
            link.href = dataUrl;
            link.click();

            node.classList.add('hidden');
            
        })
        .catch((error) => {
            console.log('error: ', error);
            node.classList.add('hidden');
            console.error('Error exporting image:', error);
        });
}
</script>

<style>
.capture-area {
    width: 300px;
    position: relative;
    background-color: #FFFFFF;
}

.hidden {
    display: none;
}
</style>