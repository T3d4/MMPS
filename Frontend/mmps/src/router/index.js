import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '@/views/HomeView.vue'
import QuizView from '@/views/QuizView.vue'
import LoginView from '@/views/LoginView.vue'
import SignupView from '@/views/SignupView.vue'
import QuizesView from '@/views/QuizzesView.vue'
import AdminDashboard from '@/views/AdminDashboardView.vue'
import UserManagement from '@/views/UserManagementView.vue'
import QuizManagement from '@/views/QuizManagementView.vue'
import Statistics from '@/views/StatisticsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/quizes',
      name: 'quizes',
      component: QuizesView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
      // component: () => import('@/views/QuizesView.vue')
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
    },

    {
      path: '/signup',
      name: 'signup',
      component: SignupView
    },

    {
      path: '/quiz/:id',
      name: 'quiz',
      component: QuizView

    },
    {
      path: '/admin',
      name: 'AdminDashboard',
      component: AdminDashboard
    },
    {
      path: '/admin/user-management',
      name: 'UserManagement',
      component: UserManagement
    },
    {
      path: '/admin/quiz-management',
      name: 'QuizManagement',
      component: QuizManagement
    },
    {
      path: '/admin/statistics',
      name: 'Statistics',
      component: Statistics
    }
    //   path: '/about',
    //   name: 'about',

    //   component: () => import('../views/AboutView.vue')
    // }
  ]
})

export default router
