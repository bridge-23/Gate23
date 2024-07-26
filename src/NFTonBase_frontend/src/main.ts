import './assets/main.css'
import './assets/base.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar, Notify } from 'quasar'
import quasarUserOptions from '@/quasar-user-options'
import 'quasar/src/css/index.sass'
import '@quasar/extras/material-icons/material-icons.css'
import { initSatellite } from '@junobuild/core'

import piniaPluginPersist from 'pinia-plugin-persist'
import App from './App.vue'
import router from './router'

async function initApp() {
  try {
    await initSatellite({
      satelliteId: 'kuyff-qaaaa-aaaal-ac5uq-cai'
    })

    const app = createApp(App)
    const pinia = createPinia()
    pinia.use(piniaPluginPersist)
    app.use(pinia)
    app.use(router)
    app.use(Quasar, quasarUserOptions)
    app.use(Quasar, {
      plugins: {
        Notify
      }
      // config: {
      //   notify: /* look at QuasarConfOptions from the API card */
      // }
    })

    app.mount('#app')
  } catch (error) {
    console.error('Failed to initialize app:', error)
  }
}

initApp()
