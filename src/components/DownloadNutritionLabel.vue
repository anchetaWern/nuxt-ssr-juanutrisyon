<template>

    <div id="export-image" class="text-center mt-2">
        <v-btn variant="plain" size="x-small" @click="exportAsImage">
        Download Nutrition Label
        </v-btn>
    </div>

</template>

<script setup>
import { ref, defineProps } from 'vue';
import { toPng } from 'html-to-image';

const props = defineProps({
    food: {
        type: Object,
        default: null,
    },
    exportable: {
        type: [HTMLElement, Object], 
        required: true
    }
});

const exportAsImage = () => {
    
    const node = props.exportable;

    node.classList.remove('hidden');

    toPng(node)
        .then((dataUrl) => {
            
            const link = document.createElement('a');
            link.download = `${props.food.description_slug}-nutrient-info.png`;
            link.href = dataUrl;
            link.click();

            node.classList.add('hidden');
            
        })
        .catch((error) => {
            console.log('error: ', error);
            node.classList.add('hidden');
            console.error('Error exporting image:', error);
        });
}
</script>