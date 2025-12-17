<template>
    <tr id="edible-portion" v-if="value && value < 100">
        <td class="text-grey-darken-3">
            Edible Portion: {{ value }}%
        </td>
    </tr>
</template>

<script setup>
const props = defineProps({
    value: [String, Number],
});
</script>
