import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // 1. Puxa as configurações da pasta router

const app = createApp(App)

app.use(router) // 2. Avisa ao Vue para usar essas configurações
app.mount('#app')