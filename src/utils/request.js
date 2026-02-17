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
   
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers['Authorization'] = `Bearer ${authStore.token}`
    }
      
    console.log('请求URL:', config.url)
    console.log('请求方法:', config.method)
    console.log('请求数据:', config.data)
    console.log('请求头:', config.headers)
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
    console.log('响应状态:', response.status)
    console.log('响应数据:', response.data)
     // 直接返回响应数据，不做额外处理
     return response.data
  },
  error => {
    console.error('响应错误', error)
    console.error('错误详情:', error.response)
    
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