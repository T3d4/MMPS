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
import NotFound from '@/views/NotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'quizes',
      component: QuizesView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
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
    },
    {
      path: '/:pathMatch(.*)*', // This is the wildcard route
      name: 'NotFound',
      component: NotFound
    }
  ]
})

export default router
