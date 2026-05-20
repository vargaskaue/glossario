import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import VerbeteView from '../views/VerbeteView.vue' // 1. Importa a página nova

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/verbete/:id', // 2. O ':id' avisa que essa URL muda de acordo com o verbete
      name: 'verbete',
      component: VerbeteView
    }
  ]
})

export default router