import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './plugins/router'
import { loadFonts } from './plugins/webfontloader'

import VueGtag from "vue-gtag"

import { createPinia } from 'pinia'

import VueApexCharts from "vue3-apexcharts"

loadFonts()

const pinia = createPinia()
function router_plugin() {
  return { router }
}
pinia.use(router_plugin)

createApp(App)
  .use(vuetify)
  .use(router)
  .use(pinia)
  .use(VueGtag, {
    config: { 
      id: "G-2L9NBCN6ZV",
    },
  }, router)
  .use(VueApexCharts)
  .mount('#app')
