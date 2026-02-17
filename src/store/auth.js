import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as loginApi, getUserInfo } from '@/api/auth'
import { setToken, getToken, removeToken } from '@/utils/storage'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(getToken())
  const userInfo = ref(null)
  
  const isAuthenticated = computed(() => !!token.value)
  
   // 登录
   const login = async (loginForm) => {
    try {
      const response = await loginApi(loginForm)
      console.log('登录响应:', response)
      
      // 根据实际响应结构获取token
      const tokenValue = response.token || response.data?.token
      if (!tokenValue) {
        throw new Error('登录响应中未找到token')
      }
      
      token.value = tokenValue
      setToken(tokenValue)
      
      // 尝试获取用户信息，但不影响登录流程
      try {
        await fetchUserInfo()
      } catch (error) {
        console.warn('获取用户信息失败，但登录成功:', error)
      }
      
      return response
    } catch (error) {
      throw error
    }
  }
  
  // 获取用户信息
  const fetchUserInfo = async () => {
    try {
      const response = await getUserInfo()
      console.log('用户信息响应:', response)
      
      // 根据实际响应结构获取用户信息
      userInfo.value = response.data || response
      return response
    } catch (error) {
      throw error
    }
  }
  
  // 登出
  const logout = () => {
    token.value = null
    userInfo.value = null
    removeToken()
  }
  
  return {
    token,
    userInfo,
    isAuthenticated,
    login,
    fetchUserInfo,
    logout
  }
})