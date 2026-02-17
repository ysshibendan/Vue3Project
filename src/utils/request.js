import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/store/auth'
import router from '@/router'

// 创建axios实例
const service = axios.create({
  timeout: 10000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 首先尝试从localStorage获取token
    const token = localStorage.getItem('vue3project_token')
    
    // 如果localStorage中有token，作为query参数传递
    if (token) {
      // 如果是GET请求，将token作为query参数
      if (config.method === 'get' || config.method === 'GET') {
        if (!config.params) {
          config.params = {}
        }
        config.params.token = token

      } else {
        // 如果是POST/PUT/DELETE等请求，将token作为query参数
        if (!config.params) {
          config.params = {}
        }
        config.params.token = token

      }
    } else {
      // 如果localStorage中没有token，尝试从store获取
      const authStore = useAuthStore()
      if (authStore.token) {
        if (!config.params) {
          config.params = {}
        }
        config.params.token = authStore.token

      } else {

      }
    }
      

    return config
  },
  error => {
    console.error('请求错误', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {

     // 直接返回响应数据，不做额外处理
     return response.data
  },
  error => {
    console.error('响应错误', error)
    
    if (error.code === 'NETWORK_ERROR') {
      ElMessage.error('网络连接失败，请检查网络或服务器状态')
    } else if (error.response) {
      ElMessage.error(`服务器错误: ${error.response.status}`)
    } else {
      ElMessage.error(error.message || '网络错误')
    }
    return Promise.reject(error)
  }
)

export default service