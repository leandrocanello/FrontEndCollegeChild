// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { Quasar } from 'quasar'
import quasarUserOptions from './quasar-user-options'

createApp(App)
  .use(Quasar, quasarUserOptions)
  .use(router) // Certifique-se de que o roteador está sendo usado
  .mount('#app')
