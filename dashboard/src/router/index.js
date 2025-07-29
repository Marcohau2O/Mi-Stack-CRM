import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import LeadsView from '@/views/LeadsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/leads',
      name: 'leads',
      component: LeadsView,
      meta: { requiresAuth: true } // 🔒 Ruta protegida
    }
  ]
})

// ✅ Guard global para proteger rutas
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  // Si la ruta requiere autenticación y no hay token, redirige al login
  if (to.meta.requiresAuth && !token) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
