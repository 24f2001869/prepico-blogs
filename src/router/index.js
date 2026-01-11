import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

// Lazy load views
const HomeView = () => import('../views/HomeView.vue')
const AdminView = () => import('../views/AdminView.vue')
const BlogDetailView = () => import('../views/BlogDetailView.vue')
const LoginView = () => import('../views/LoginView.vue')

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: 'Prepico Blog' }
  },
  {
    path: '/blog/:id',
    name: 'blog-detail',
    component: BlogDetailView,
    props: true,
    meta: { title: 'Blog Detail' }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { title: 'Admin Login', guestOnly: true }
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminView,
    meta: { title: 'Admin Dashboard', requiresAuth: true }
  },
  // Redirect to home for unknown routes
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

// Auth guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  authStore.checkAuth()

  // Set page title
  if (to.meta.title) {
    document.title = `${to.meta.title} | Prepico`
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
    return
  }

  // Check if route is guest only (like login page)
  if (to.meta.guestOnly && authStore.isAuthenticated) {
    next('/admin')
    return
  }

  next()
})

export default router
