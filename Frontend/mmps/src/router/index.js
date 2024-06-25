import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import SignupView from '@/views/SignupView.vue'
import QuizesView from '@/views/QuizzesView.vue'
import AdminDashboard from '@/views/AdminDashboardView.vue'
import UserManagement from '@/views/UserManagementView.vue'
import QuizManagement from '@/views/QuizManagementView.vue'
import Statistics from '@/views/StatisticsView.vue'
import NotFound from '@/views/NotFound.vue'
import ProfileView from '@/views/ProfileView.vue'
import UserDetailView from '@/views/UserDetailView.vue'
import QuizDetailView from '@/views/QuizDetailView.vue'
import { axiosInstance } from '@/axiosConfig'
import { quiz_id, verified } from '@/global_state/state'
import QuizView from '@/views/QuizView.vue'
import store from '@/store/store'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
      path: '/',
      name: 'quizes',
      component: QuizesView,
      meta: { requiresAuth: true }
    },
    {
      path: '/quiz/:id',
      name: 'quiz',
      component: QuizView,
      beforeEnter: async (to, from, next) => {
        try {
          console.log(verified.value)
          const userId = store.getters.user._id
          console.log(userId)
          const response = await axiosInstance.get(`/quiz/${quiz_id.value}`, {
            params: { userId }, // Send userId as a query parameter
          });
          console.log(response)
          console.log(verified.value)

          if (response.data.hasTaken || !verified.value) {
            console.log("got to not verifed")
            next('/'); // Redirect to the home page or another appropriate page
          } else {
            console.log("got to verified")
            next();
          }
        } catch (error) {
          next('/'); // Redirect to home page on error
        }
      },
      meta: { requiresAuth: true }
    },
    {
      path: '/admin',
      name: 'AdminDashboard',
      component: AdminDashboard,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/user-management',
      name: 'UserManagement',
      component: UserManagement,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/quiz-management',
      name: 'QuizManagement',
      component: QuizManagement,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/statistics',
      name: 'Statistics',
      component: Statistics,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/:pathMatch(.*)*', // This is the wildcard route
      name: 'NotFound',
      component: NotFound,
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true }
    },
    {
      path: '/admin/user-management/user/:id',
      name: 'UserDetail',
      component: UserDetailView,
      props: true,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/quiz-management/quiz/:id',
      name: 'QuizDetail',
      component: QuizDetailView,
      props: true,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
  ]
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)
  const isLoggedIn = store.getters.isLoggedIn
  const isAdmin = store.getters.isAdmin

  if (requiresAuth & !isLoggedIn) {
    next('/login')
  } else if (requiresAdmin && !isAdmin) {
    next('/')
  } else {
    next()
  }
})

export default router
