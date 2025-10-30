import { createPinia } from 'pinia'
import { createApp } from 'vue'

import 'nprogress/nprogress.css'
import VueViewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
import Toast, { POSITION, type PluginOptions } from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import App from './App.vue'
import './assets/styles.css'
import router from './router'
const app = createApp(App)

const options: PluginOptions = {
  position: POSITION.TOP_CENTER,
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: 'button',
  icon: true,
  rtl: false,
}
app.use(createPinia())
app.use(router)
app.use(Toast, options)
app.use(VueViewer)
app.mount('#app')
