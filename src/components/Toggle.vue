<template>
    <v-switch 
        :model-value="show"
        @update:model-value="emit('update:show', $event)"
        :label="label"
        color="success"
        hide-details
        inset
    ></v-switch>
</template>

<script setup>
const props = defineProps({
    label: String,
    show: {
        type: Boolean,
        default: false
    },
});

const emit = defineEmits(['update:show']);
</script>