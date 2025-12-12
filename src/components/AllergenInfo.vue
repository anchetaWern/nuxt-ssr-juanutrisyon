<template>
    <div id="allergen-section" class="mt-5" v-if="allergens">
        <div class="text-body-2 mb-1 text-center font-weight-medium">Allergen Info</div>

        <p class="text-subtitle2 text-grey-darken-3">
            {{ allergens }}
        </p>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    allergens: {
        type: String,
        default: ''
    }
});
</script>