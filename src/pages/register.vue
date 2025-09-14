<template>
 
    <v-container class="mt-5">
        <v-text-field
            label="Email"
            v-model="email"
        ></v-text-field>

        <v-text-field
            label="Username"
            v-model="username"
        ></v-text-field>

        <v-text-field
            v-model="password"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            name="password"
            @click:append="showPassword = !showPassword"
        ></v-text-field>

        <v-btn color="primary" block @click="register" rounded="0" :disabled="createUserNotOk" :loading="creatingAccount">Create Account</v-btn>

        <div class="mt-2 text-center">
            <a href="/login">Login</a>
        </div>
    </v-container>
 
</template>


<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '@/firebase.js'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { createToast } from 'mosha-vue-toastify'
import 'mosha-vue-toastify/dist/style.css'
import axios from 'axios'

import { validateEmail } from '@/helpers/Validate'

useHead({
  title: 'Register - Juan Nutrisyon',

  link: [
    {
      rel: 'canonical',
      href: `https://app.juanutrisyon.info/register`
    }
  ],

  meta: [
    { hid: 'description', name: 'description', content: 'Create a Juan Nutrisyon account.' },
    { name: 'robots', content: 'index, follow' },

    // Open Graph (Facebook, LinkedIn, etc.)
    { property: 'og:title', content: 'Register - Juan Nutrisyon' },
    { property: 'og:description', content: 'Create a Juan Nutrisyon account.' },
    { property: 'og:type', content: 'website' },

    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Register - Juan Nutrisyon' },
    { name: 'twitter:description', content: 'Create a Juan Nutrisyon account.' },

  ]

});

const API_BASE_URI = import.meta.env.VITE_API_URI

const email = ref('')
const username = ref('')
const password = ref('')
const creatingAccount = ref(false)

const router = useRouter()

const createUserNotOk = computed(() => {
  return !(
    email.value &&
    username.value &&
    password.value &&
    validateEmail(email.value)
  )
})

const register = async () => {
  creatingAccount.value = true

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    )
    const user = userCredential.user

    const token = await user.getIdToken()

    await updateProfile(user, { displayName: username.value })

    await axios.post(`${API_BASE_URI}/firebase-auth/sync`, { token })

    createToast(
      {
        title: 'Created user!',
        description: "You'll now be redirected to the login page.",
      },
      { type: 'success', position: 'bottom-right' }
    )

    router.push('/login')
  } catch (error) {
    createToast(
      {
        title: 'Cannot create user',
        description: 'Please check your details.',
      },
      { type: 'danger', position: 'bottom-right' }
    )
  } finally {
    creatingAccount.value = false
  }
}
</script>
