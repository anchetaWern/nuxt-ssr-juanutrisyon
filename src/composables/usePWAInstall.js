// composables/usePWAInstall.ts
import { ref, onMounted } from 'vue'

export function usePWAInstall() {
  const deferredPrompt = ref(null)
  const canInstall = ref(false)
  const isIOS = ref(false)
  const isInstalled = ref(false)
  const showBanner = ref(false) // can control visibility of your custom banner

  onMounted(() => {
    if (process.server) return

    // Detect iOS devices
    isIOS.value = /iphone|ipad|ipod/i.test(navigator.userAgent)

    // Detect if app is already installed
    isInstalled.value =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator).standalone === true

    // Listen for beforeinstallprompt (Android/desktop Chrome)
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault() // stop Chrome's default banner
      deferredPrompt.value = e
      canInstall.value = true
      showBanner.value = true
      console.log('beforeinstallprompt fired')
    })

    // For testing locally: force banner for iOS / dev
    if (isIOS.value && !isInstalled.value) {
      showBanner.value = true
    }
  })

  const install = async () => {
    if (!deferredPrompt.value) return

    // Show the native install prompt
    deferredPrompt.value.prompt()
    const choice = await deferredPrompt.value.userChoice
    console.log('Install choice outcome:', choice.outcome)

    // Reset
    deferredPrompt.value = null
    canInstall.value = false
    showBanner.value = false
  }

  const dismiss = () => {
    showBanner.value = false
  }

  return {
    canInstall,
    isIOS,
    isInstalled,
    showBanner,
    install,
    dismiss
  }
}
