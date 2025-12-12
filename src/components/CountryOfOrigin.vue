<template>
    <div class="mt-5" v-if="country && country !== 'PH'">
        <div class="text-body-2 mb-1">Origin Country: {{ country }}</div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    country: String
});
</script>