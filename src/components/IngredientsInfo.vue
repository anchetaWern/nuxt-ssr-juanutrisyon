<template>
    <div id="ingredients-section" class="mt-5 text-center" v-if="props.ingredients">
        <div class="text-body-2 mb-1 text-center font-weight-medium">Ingredients</div>

        <p class="text-subtitle2 text-grey-darken-3">
            {{ props.ingredients }}
        </p>

        <v-btn variant="plain" size="x-small" v-if="hasAnalysis" @click="openIngredientsInfoModal">
        View More Info
        </v-btn>
    </div>


    <v-dialog
        v-model="ingredientsInfoDialog"
        fullscreen
        transition="dialog-bottom-transition"
    >
        <v-card title="Ingredients Analysis">
            <template v-slot:text>

                <div v-for="(ingredient, index) in ingredientsAnalysis">
                    <div class="mb-5">
                        <div class="text-subtitle-1 font-weight-bold">{{ ingredient.name }}</div>
                        <div class="mb-2 text-grey-darken-4">Score: {{ ingredient.score }} out of 5</div>
                        <p class="text-body-2">{{ ingredient.effects }}</p>
                        <div class="mt-3">
                            <div class="font-weight-medium">Health Risks</div>
                            <p class="text-body-2">{{ ingredient.health_risks }}</p>
                        </div>
                    </div>

                    <v-divider class="mb-5"></v-divider>
                </div>
                
            </template>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    text="close"
                    variant="flat"
                    @click="closeModal"
                ></v-btn>
            </v-card-actions>
        </v-card>

    </v-dialog>

</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const API_BASE_URI = import.meta.env.VITE_API_URI;

const emit = defineEmits(['update:open']);

const props = defineProps({
    ingredients: {
        type: Array,
        default: null
    },
    foodSlug: String,
    hasAnalysis: {
        type: Boolean,
        default: false
    },
});

const ingredientsInfoDialog = ref(false);
const ingredientsAnalysis = ref(null);

const openIngredientsInfoModal = async () => {
  
    const res = await useFetch(`${API_BASE_URI}/food-ingredients/${props.foodSlug}`)
    ingredientsAnalysis.value = res.data.value;

    ingredientsInfoDialog.value = true;
}

const closeModal = () => {
    ingredientsInfoDialog.value = false;
}
</script>