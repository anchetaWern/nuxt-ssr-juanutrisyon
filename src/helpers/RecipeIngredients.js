export const addIngredientToRecipe = (ingredient, ingredient_serving_size, selected_custom_serving, new_serving_size, selected_serving_qty) => {

    // selected_custom_serving = selected_custom_serving.value
    // selected_serving_qty = selected_serving_qty.value

    if (process.client) {

        const recipe = sessionStorage.getItem('recipe');
        let recipe_data = [];
        if (recipe) {
            recipe_data = JSON.parse(recipe);
        }

        const index = recipe_data.findIndex(itm => itm.description_slug === ingredient.description_slug);

        if (index === -1) {
            recipe_data.push(ingredient);
            sessionStorage.setItem('recipe', JSON.stringify(recipe_data));

            let serving_size_data = {};
            const serving_size = sessionStorage.getItem('recipe_serving_sizes');
            if (serving_size) {
                serving_size_data = JSON.parse(serving_size);
            }

            serving_size_data[ingredient.description_slug] = new_serving_size ? new_serving_size : ingredient_serving_size; 
            sessionStorage.setItem('recipe_serving_sizes', JSON.stringify(serving_size_data));

            let stored_custom_servings = {};
            const stored_cs = sessionStorage.getItem('recipe_custom_servings');
            if (stored_cs) {
                stored_custom_servings = JSON.parse(stored_cs);
            }

            stored_custom_servings[ingredient.description_slug] = {
                'weight': new_serving_size ? new_serving_size : ingredient_serving_size, 
                'qty': selected_serving_qty ? selected_serving_qty : 1, 
            }

            sessionStorage.setItem('recipe_custom_servings', JSON.stringify(stored_custom_servings));

            return true;
        }
        //
        return false;
    }
}