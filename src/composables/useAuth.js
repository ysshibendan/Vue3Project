import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { ElMessage } from 'element-plus'

export function useAuth() {
  const router = useRouter()
  const authStore = useAuthStore()
  
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  
  const requireAuth = () => {
    if (!isAuthenticated.value) {
      ElMessage.warning('请先登录')
      router.push('/login')
      return false
    }
    return true
  }
  
  return {
    isAuthenticated,
    requireAuth
  }
}