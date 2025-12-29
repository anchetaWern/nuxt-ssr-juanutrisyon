<template>

    <v-dialog
        v-model="props.open"
        width="300"
    >
        <v-card title="Modify Serving Size">
            <div class="px-5 py-2">
                <div v-if="customServingSizes">
                    <v-radio-group 
                        :model-value="selectedCustomServing"
                        @update:model-value="val => $emit('update:selectedCustomServing', val)">
                        <v-radio 
                            :label="cs.name" 
                            :value="cs.volume_in_ml ? convertWeight(food.density.density, cs.volume_in_ml) : cs.weight" 
                            v-for="cs in customServingSizes">
                        </v-radio>
                    </v-radio-group>

                    <div class="text-medium-emphasis">Quantity</div>
                    <v-number-input
                        control-variant="split"
                        inset
                        :model-value="props.qty"
                        @update:model-value="updateQty"
                    ></v-number-input>
                </div>
                
                <div v-if="food.custom_serving_size" class="text-body-2 text-medium-emphasis py-1">
                {{ food.custom_serving_size }} = {{ food.serving_size }}{{ food.serving_size_unit }}
                </div>

                <div v-else-if="food.serving_size" class="text-body-2 text-medium-emphasis py-1">
                Original serving size: {{ food.serving_size }}{{ food.serving_size_unit }}
                </div>

                <div v-if="food.servings_per_container" class="text-body-2 text-medium-emphasis py-1">
                Servings per container: {{ food.servings_per_container }} 
                </div>

                <v-text-field
                    label="Serving size in grams"
                    placeholder="50"
                    :model-value="props.servingSize"
                    @update:model-value="updateServingSize"
                ></v-text-field>

                <v-btn color="primary" block @click="emit('update:open', false)" rounded="0">Modify serving size</v-btn>
            </div>
        </v-card>

    </v-dialog>


</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import { convertWeight } from '@/helpers/Nutrients';

const props = defineProps({
    open: {
        type: Boolean,
        default: false
    },
    food: {
        type: Object,
        default: null,
    },
    customServingSizes: Array,
    qty: [String, Number],
    servingSize: [String, Number],
    selectedCustomServing: [String, Number],
});

const emit = defineEmits(['update:open', 'update:qty', 'update:servingSize', 'update:selectedCustomServing']);

const updateQty = (updatedQty) => {
    emit('update:qty', updatedQty);
}

const updateServingSize = (updatedServingSize) => {
    emit('update:servingSize', updatedServingSize);
}
</script>