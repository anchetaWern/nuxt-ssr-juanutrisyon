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
                <v-btn id="add-to-analyze" size="x-small" color="primary" variant="outlined" @click="addForAnalysis">Log as Meal</v-btn>
            </div>
        </div>

    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

import Toast, { createToast } from 'mosha-vue-toastify'
import 'mosha-vue-toastify/dist/style.css'

import { addIngredientToRecipe, addItemToSessionBucket } from '@/helpers/RecipeIngredients';

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
    },
    updateRecipeIngredientCount: {
        type: Function,
    },
    updateAnalyzeIngredientCount: {
        type: Function,
    }
});

const addToRecipe = () => {
    
    if (process.client) {
        const ok = addIngredientToRecipe(props.food, props.food.serving_size, props.selectedCustomServing, props.newServingSize, props.selectedServingQty);
        
        if (ok) {
            createToast(
                {
                    title: 'Added!',
                    description: props.food.recipe_ingredients.length ? 'Recipe ingredients was added' : 'Ingredient was added to recipe'
                }, 
                { type: 'success', position: 'bottom-right' }
            );
        } else {
            createToast(
                {
                    title: 'Error!',
                    description: 'Ingredient was already added to the recipe.'
                }, 
                { type: 'danger', position: 'bottom-right' }
            );
        }
        
        props.updateRecipeIngredientCount();
    }
}


const addForAnalysis = () => {
    if (!process.client) return;

    const ok = addItemToSessionBucket({
        item: props.food,
        bucketKey: 'analyze',
        servingSizeKey: 'analyze_serving_sizes',
        customServingKey: 'analyze_custom_servings',
        defaultServingSize: props.food.serving_size,
        selectedServingSize: props.newServingSize,
        selectedServingQty: props.selectedServingQty,
    });

    if (ok) {
        createToast(
            {
                title: 'Added!',
                description: 'Food was added for analysis',
            },
            { type: 'success', position: 'bottom-right' }
        );

        props.updateAnalyzeIngredientCount();
    } else {
        createToast(
            {
                title: 'Error!',
                description: 'Food was already added for analysis.',
            },
            { type: 'danger', position: 'bottom-right' }
        );
    }
};
</script>

<style>
.sticky-title {
    position: sticky;
    top: 0;
    background: #FFF;
    z-index: 10;
}
</style>