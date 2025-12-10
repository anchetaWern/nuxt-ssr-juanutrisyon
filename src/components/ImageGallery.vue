<template v-if="props.images.length > 0">
    <div class="text-body-2 mb-1 font-weight-medium">Images</div>

    <v-row id="images-section">
        <v-col
            v-for="img in props.images"
            :key="img"
            class="d-flex child-flex"
            cols="6"
        >
            <v-img
                :lazy-src="img"
                :src="img.src"
                aspect-ratio="1"
                class="bg-grey-lighten-2"
                cover
                @click="openImageModal(img)"
            >
                <template v-slot:placeholder>
                    <v-row
                        align="center"
                        class="fill-height ma-0"
                        justify="center"
                    >
                        <v-progress-circular
                            color="grey-lighten-5"
                            indeterminate
                        ></v-progress-circular>
                    </v-row>
                </template>
            </v-img>
        </v-col>
    </v-row>


    <v-dialog
        max-width="400"
        v-model="imageModalVisible"   
    >
        <v-card
            :title="currentImage.title"
            v-if="currentImage"
        >
            <v-img
                :src="currentImage.src"
                cover
            ></v-img>

            <template v-slot:actions>
                <v-btn
                    class="ms-auto"
                    text="Close"
                    @click="closeImageModal"
                ></v-btn>
            </template>
        </v-card>
    </v-dialog>

</template>

<script setup>
import { ref, defineProps } from 'vue';

const props = defineProps({
    images: null,
});

const imageModalVisible = ref(false);

const currentImage = ref(null);

const closeImageModal = () => {
    imageModalVisible.value = false;
}

const openImageModal = (img) => {
    imageModalVisible.value = true;
    currentImage.value = img;
}
</script>