import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { guest: true },
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('@/views/auth/ForgotPasswordView.vue'),
      meta: { guest: true },
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('@/views/auth/ResetPasswordView.vue'),
      meta: { guest: true },
    },
    {
      path: '/admin',
      component: () => import('@/components/layout/AppLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/admin/dashboard',
        },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/dashboard/DashboardView.vue'),
        },
        {
          path: 'schools',
          name: 'schools',
          component: () => import('@/views/schools/SchoolsListView.vue'),
        },
        {
          path: 'schools/:id',
          name: 'school-detail',
          component: () => import('@/views/schools/SchoolDetailView.vue'),
        },
        {
          path: 'staff',
          name: 'staff',
          component: () => import('@/views/staff/StaffView.vue'),
        },
        {
          path: 'parents',
          name: 'parents',
          component: () => import('@/views/parents/ParentsView.vue'),
        },
        {
          path: 'students',
          name: 'students',
          component: () => import('@/views/students/StudentsView.vue'),
        },
        {
          path: 'classrooms',
          name: 'classrooms',
          component: () => import('@/views/classrooms/ClassroomsView.vue'),
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/views/settings/SettingsView.vue'),
        },
        {
          path: 'school-requests',
          name: 'school-requests',
          component: () => import('@/views/school-requests/SchoolRequestsView.vue'),
        },
      ],
    },
    { path: '/:pathMatch(.*)*', redirect: '/login' },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login' }
  }
  if (to.meta.guest && auth.isAuthenticated) {
    return { name: 'dashboard' }
  }
})

export default router
