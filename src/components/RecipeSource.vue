<template>
    <div id="recipe-source-section" class="mt-5 text-center">
        <div class="text-body-2 mb-1 text-center font-weight-medium">Recipe Source</div>
        <div>
            <a :href="url" target="_blank">{{ name }}</a>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    name: String,
    url: String,
});
</script>