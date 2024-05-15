import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '@/views/HomeView.vue'
import QuizView from '@/views/QuizView.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: HomeView
    // },
    {
      path: '/',
      name: 'login',
      component: LoginView
      // component: () => import('@/views/QuizesView.vue')
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
    },
    {
      path: '/quiz/:id',
      name: 'quiz',
      component: QuizView

    }
    //   path: '/about',
    //   name: 'about',

    //   component: () => import('../views/AboutView.vue')
    // }
  ]
})

export default router
