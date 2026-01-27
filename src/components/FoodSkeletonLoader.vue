<template>
  <div class="food-skeleton-container">
   
    <div class="d-flex justify-end">
      <v-skeleton-loader
        type="chip"
        width="180"
        class="justify-end"
      />
    </div>
  
    <v-skeleton-loader
        v-for="n in 1"
        :key="n"
        type="list-item-two-line"
        :loading="true"
        :boilerplate="false"
    />
       
    <v-skeleton-loader
        type="heading"
        width="40%"
        class="mx-auto"
    />

    <div class="d-flex justify-center">
        <v-skeleton-loader
            type="avatar"
            class="text-center"
        />
    </div>

    <v-skeleton-loader
        type="heading"
        width="40%"
        class="mx-auto mt-3"
    />

    <v-skeleton-loader
        type="list-item"
        width="50%"
        :loading="true"
        :boilerplate="false"
    />
    <v-skeleton-loader
        type="list-item"
        width="50%"
        :loading="true"
        :boilerplate="false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isLoading = ref(true)

// Optional: Auto-hide skeleton after 3 seconds (for testing)
// onMounted(() => {
//   setTimeout(() => {
//     isLoading.value = false
//   }, 3000)
// })
</script>

<style scoped>
.food-skeleton-container {
  max-width: 800px;
  margin: 0 auto;
}

.gap-3 {
  gap: 12px;
}

.gap-4 {
  gap: 16px;
}

.gap-6 {
  gap: 24px;
}
</style>
