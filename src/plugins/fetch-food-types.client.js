import axios from 'axios'

export default defineNuxtPlugin(() => {
  const API_BASE_URI = useRuntimeConfig().public.apiBaseUri

  if (!sessionStorage.getItem('food_types')) {
    axios.get(`${API_BASE_URI}/food-types`)
      .then(res => {
        sessionStorage.setItem('food_types', JSON.stringify(res.data))
      })
      .catch(err => {
        console.error('Error fetching food_types:', err)
      })
  }
})
