<template>
    <v-dialog
        v-model="props.open"
        fullscreen
        transition="dialog-bottom-transition"
    >
        <v-card title="Ingredients Analysis">
            <template v-slot:text>

                <div v-for="(ingredient, index) in food_ingredients">
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
                    @click="emit('update:open', false)"
                ></v-btn>
            </v-card-actions>
        </v-card>

    </v-dialog>

</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
    open: {
        type: Boolean,
        default: false
    },
    food_ingredients: {
        type: Array,
        default: null
    }
});

const API_BASE_URI = import.meta.env.VITE_API_URI;

const emit = defineEmits(['update:open']);
</script>