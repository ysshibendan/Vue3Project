import { createRouter, createWebHistory } from 'vue-router'


const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/chat',
    name: 'Chat',
    component: () => import('@/views/Chat.vue')
  },
  {
    path: '/history',
    name: 'History',
    component: () => import('@/views/History.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/Profile.vue')
  },
  {
    path: '/usercenter',
    name: 'UserCenter',
    component: () => import('@/views/usercenter/Dashboard.vue')
  },
  {
    path: '/usercenter/users',
    name: 'UserManagement',
    component: () => import('@/views/usercenter/UserManagement.vue')
  },
  {
    path: '/usercenter/students',
    name: 'StudentManagement',
    component: () => import('@/views/usercenter/StudentManagement.vue')
  },
  {
    path: '/usercenter/counselors',
    name: 'CounselorManagement',
    component: () => import('@/views/usercenter/CounselorManagement.vue')
  },
  {
    path: '/usercenter/appointments',
    name: 'AppointmentManagement',
    component: () => import('@/views/usercenter/AppointmentManagement.vue')
  },
  {
    path: '/counselors',
    name: 'Counselors',
    component: () => import('@/views/Counselors.vue')
  },
  {
    path: '/counselor/:id',
    name: 'CounselorDetail',
    component: () => import('@/views/CounselorDetail.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
// router.beforeEach((to, from, next) => {
//   const authStore = useAuthStore()
//   const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  
//   if (requiresAuth && !authStore.isAuthenticated) {
//     next('/login')
//   } else if (to.path === '/login' && authStore.isAuthenticated) {
//     next('/home')
//   } else {
//     next()
//   }
// })

export default router