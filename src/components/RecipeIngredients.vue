<template>
    <div id="recipe-ingredients-section" class="mt-5" v-if="food.recipe_ingredients && food.recipe_ingredients.length > 0">
        <div class="text-body-2 mb-1 text-center font-weight-medium">Recipe Ingredients</div>
        <v-table density="compact">
            <tbody>
                <tr
                    v-for="item in food.recipe_ingredients"
                    :key="item.id"
                >
                    <td>
                        <a :href="`/food/${item.ingredient.description_slug}`" target="_blank">{{ item.ingredient.description }} ({{ item.serving_size }}{{ item.serving_size_unit }})</a>
                    </td>
                </tr>
            </tbody>
        </v-table>
        <div>
            <v-btn id="add-to-recipe" size="x-small" color="warning" variant="outlined" @click="modifyRecipe">Modify Recipe</v-btn>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps } from 'vue';
import { addIngredientToRecipe } from '@/helpers/RecipeIngredients';
import Toast, { createToast } from 'mosha-vue-toastify'

const emit = defineEmits(['update-ingredient-count-child']);

const props = defineProps({
    food: {
        type: Object,
        default: null,
    },
    selectedCustomServing: {
        type: String,
        default: ''
    },
    selectedServingQty: {
        type: String,
        default: ''
    }

});

const modifyRecipe = () => {
    if (process.client) {
        
        let added = false;

        console.log('foodp: ', props.food);
        console.log('selected custom serving: ', props.selectedCustomServing);
        console.log('selected serving qty: ', props.selectedServingQty);

        if (props.food.recipe_ingredients.length) {
            
            const added_results = [];

            props.food.recipe_ingredients.forEach((itm) => {
                added_results.push(addIngredientToRecipe(itm.ingredient, itm.serving_size, props.selectedCustomServing, props.selectedServingQty));
                // ingredient, ingredient_serving_size, selected_custom_serving, selected_serving_qty
            });

            if (added_results.length && added_results[0]) {
                added = true;
                sessionStorage.setItem('food_id', props.food.id);
                sessionStorage.setItem('recipe_id', props.food.recipe.id);
                sessionStorage.setItem('serving_count', props.food.servings_per_container);
                sessionStorage.setItem('recipe_name', props.food.description);
                sessionStorage.setItem('recipe_image', props.food.title_image);
            }
        }


        if (added) {

            createToast(
                {
                    title: 'Added!',
                    description: props.food.recipe_ingredients.length ? 'Recipe ingredients was added' : 'Ingredient was added to recipe'
                }, 
                { type: 'success', position: 'bottom-right' }
            );

            emit('update-ingredient-count-child'); // todo: emit no longer works
        }

    }
}

</script>