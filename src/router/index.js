import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import VerbeteView from '../views/VerbeteView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/verbete/:id',
      name: 'verbete',
      component: VerbeteView
    }
  ],
  // Essa função garante que toda transição de página resete o scroll para o topo
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' } // 'smooth' dá um efeito sutil de rolagem suave
    }
  }
})

export default router