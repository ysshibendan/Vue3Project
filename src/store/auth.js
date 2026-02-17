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
      let tokenValue = null
      
      // 尝试多种可能的token位置
      if (response.token) {
        tokenValue = response.token
      } else if (response.data && response.data.token) {
        tokenValue = response.data.token
      } else if (response.data && response.data.data && response.data.data.token) {
        tokenValue = response.data.data.token
      } else if (response.data && response.data.access_token) {
        tokenValue = response.data.access_token
      } else if (response.access_token) {
        tokenValue = response.access_token
      }
      
      console.log('提取的token:', tokenValue)
      
      if (!tokenValue) {
        console.error('登录响应结构:', JSON.stringify(response, null, 2))
        throw new Error('登录响应中未找到token')
      }
      
      token.value = tokenValue
      setToken(tokenValue)
      
      console.log('保存的token:', tokenValue)
      console.log('localStorage中的token:', localStorage.getItem('vue3project_token'))
      
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
      // 直接从localStorage获取token
      const token = localStorage.getItem('vue3project_token')
      
      if (!token) {
        throw new Error('未找到token，请先登录')
      }
      
      const response = await fetch(`/api/userinfo?token=${token}`, {
        method: 'GET'
      })
      
      const data = await response.json()
      
      // 根据实际响应结构获取用户信息
      if (data.data && data.data.userInfo) {
        userInfo.value = data.data.userInfo

      } else {
        userInfo.value = data.data || data

      }
      return data
    } catch (error) {
      throw error
    }
  }
  
  // 设置用户信息
  const setUserInfo = (info) => {
    userInfo.value = info
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
    setUserInfo,
    logout
  }
})