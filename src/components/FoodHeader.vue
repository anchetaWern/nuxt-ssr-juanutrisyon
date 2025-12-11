<template>
    <div v-if="food" :class="`pt-3 sticky-title ${food.type ? 'pt-5' : 'pt-12'}`">
        <div class="d-flex justify-end cursor-pointer">
            <div>
                <v-chip id="food-category" size="small" variant="outlined" v-if="food.type">
                <span @click="viewCategory(food.type.slug)">{{ food.type.name }}</span> <span @click="viewCategory(food.subtype.slug)" v-if="food.subtype">&nbsp;/ {{ food.subtype.name }}</span>
                </v-chip>
            </div>
        </div>

        <div class="d-flex justify-space-between align-center mt-3">
            <div class="mt-1">
                <h1 class="text-body-1" id="food-description">{{ food.description }}</h1>
                <span id="food-alternate-names" v-if="food.alternate_names != 'N/A'" class="text-medium-emphasis text-subtitle-2">{{ food.alternate_names }}</span>
            </div>
            <div class="w-33">
                <v-btn id="add-to-recipe" size="x-small" color="success" variant="outlined" @click="addToRecipe">Add to Recipe</v-btn>
                <v-btn id="add-to-analyze" size="x-small" color="primary" variant="outlined" @click="addForAnalysis">Analyze</v-btn>
            </div>
        </div>

    </div>
</template>

<script setup>
import { defineProps } from 'vue';

import Toast, { createToast } from 'mosha-vue-toastify'
import 'mosha-vue-toastify/dist/style.css'

import { addIngredientToRecipe } from '@/helpers/RecipeIngredients';

const props = defineProps({
    food: {
        type: Object,
        default: null
    },
    selectedCustomServing: {
        type: String,
        default: ''
    },
    selectedServingQty: {
        type: String,
        default: ''
    },
    newServingSize: {
        type: Number,
    }
});

const addToRecipe = () => {
    
    if (process.client) {

        addIngredientToRecipe(props.food, props.food.serving_size, props.selectedCustomServing, props.selectedServingQty);
        
        createToast(
            {
                title: 'Added!',
                description: props.food.recipe_ingredients.length ? 'Recipe ingredients was added' : 'Ingredient was added to recipe'
            }, 
            { type: 'success', position: 'bottom-right' }
        );

        emit('update-ingredient-count-child'); // TODO
        
    }
}


const addForAnalysis = () => {

    if (process.client) {

        const analyze = sessionStorage.getItem('analyze');
        let analyze_data = [];
        if (analyze) {
            analyze_data = JSON.parse(analyze);
        }

        const index = analyze_data.findIndex(itm => itm.description_slug === props.food.description_slug);
        if (index === -1) {
            analyze_data.push(props.food);
            sessionStorage.setItem('analyze', JSON.stringify(analyze_data));

            let serving_size_data = {};
            const serving_size = sessionStorage.getItem('analyze_serving_sizes');
            if (serving_size) {
                serving_size_data = JSON.parse(serving_size);
            }

            serving_size_data[props.food.description_slug] = props.newServingSize ? props.newServingSize : props.food.serving_size; 
            sessionStorage.setItem('analyze_serving_sizes', JSON.stringify(serving_size_data));

            
            let stored_custom_servings = {};
            const stored_cs = sessionStorage.getItem('analyze_custom_servings');
            if (stored_cs) {
                stored_custom_servings = JSON.parse(stored_cs);
            }

            stored_custom_servings[props.food.description_slug] = {
                'weight': props.selectedCustomServing ? props.selectedCustomServing : props.food.serving_size, 
                'qty': props.selectedServingQty ? props.selectedServingQty : 1, 
            }

            sessionStorage.setItem('analyze_custom_servings', JSON.stringify(stored_custom_servings));
            

            createToast(
                {
                    title: 'Added!',
                    description: 'Food was added for analysis'
                }, 
                { type: 'success', position: 'bottom-right' }
            );

            emit('update-analyze-count-child'); // TODO
        }

    }
}
</script>

