<template>
    <div class="mt-5" v-if="show">
        <v-alert 
            density="compact"
            type="warning"
            variant="outlined"
        >
            This food has incomplete data.
        </v-alert>
    </div> 
</template>

<script setup>
const props = defineProps({
    show: Boolean
});
</script>