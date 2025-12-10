<template>

    <v-dialog
        v-model="props.open"
        width="300"
    >
        <v-card>
            <v-text-field
                hide-details="auto"
                label="Serving Count"
                placeholder="5"
                v-model="servingCount"
                autofocus
            ></v-text-field>
        
            <v-btn color="primary" block @click="emit('update:open', false)" rounded="0">Modify number of servings</v-btn>
        </v-card>

    </v-dialog>

</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';

const props = defineProps({
    open: {
        type: Boolean,
        default: false
    },
    newServingCount: {
        type: String,
        default: '',
    },
    
});

const emit = defineEmits(['update:open', 'update:newServingCount']);

const servingCount = computed({
    get() {
        return props.newServingCount;
    },
    set(value) {
        emit('update:newServingCount', value);
    }
});
</script>