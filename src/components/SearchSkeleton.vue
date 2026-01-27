<template>
  <div class="search-skeleton">
   
    <!-- Results List Skeleton -->
    <div class="results-skeleton">
      <v-skeleton-loader
        v-for="n in 5"
        :key="n"
        type="list-item-avatar-two-line"
        class="mb-4"
        :loading="true"
        :boilerplate="false"
      >
        
      </v-skeleton-loader>
    </div>

    <!-- Pagination Skeleton -->
    <div>
      <v-skeleton-loader
        type="button"
        :loading="true"
        :boilerplate="false"
        class="d-flex gap-2 justify-center"
      >
       
      </v-skeleton-loader>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// You can toggle the skeleton visibility by changing the 'loading' prop
const isLoading = ref(true)

// Example: Auto-hide skeleton after 3 seconds (simulate data load)
// setTimeout(() => {
//   isLoading.value = false
// }, 3000)
</script>

<style scoped>


.results-skeleton {
  max-height: 600px;
  overflow-y: auto;
}

.d-flex {
  display: flex;
}

.gap-2 {
  gap: 8px;
}

.justify-center {
  justify-content: center;
}

.mb-4 {
  margin-bottom: 16px;
}

.mb-6 {
  margin-bottom: 24px;
}

.mt-6 {
  margin-top: 24px;
}
</style>
