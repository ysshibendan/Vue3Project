import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/store/auth'
import router from '@/router'

// 创建axios实例
const service = axios.create({
  timeout: 0 // 取消超时限制
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 首先尝试从localStorage获取token
    let token = localStorage.getItem('vue3project_token')
    
    // 如果localStorage中没有token，尝试从store获取
    if (!token) {
      try {
        const authStore = useAuthStore()
        token = authStore.token
        console.log('从store获取token:', token)
      } catch (error) {
        console.error('获取token失败:', error)
      }
    } else {
      console.log('从localStorage获取token:', token)
    }
    
    // 如果有token，根据请求类型添加到请求中
    if (token) {
      // 如果是GET请求，将token作为query参数
      if (config.method === 'get' || config.method === 'GET') {
        if (!config.params) {
          config.params = {}
        }
        config.params.token = token
      } else {
        // 如果是POST请求，将token放入请求体中
        if (!config.data) {
          config.data = {}
        }
        config.data.token = token
      }
    } else {
      console.warn('未找到token，请求可能失败')
    }
    
    console.log('请求配置:', config)
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
    console.log('原始响应:', response)
    console.log('响应状态:', response.status)
    console.log('响应数据:', response.data)
    
    // 检查响应结构
    if (!response) {
      console.error('响应为空')
      return Promise.reject(new Error('服务器未响应'))
    }
    
    // 检查HTTP状态码
    if (response.status !== 200) {
      console.error('HTTP状态码不是200:', response.status)
      return Promise.reject(new Error(`请求失败，状态码: ${response.status}`))
    }
    
    // 处理流式响应
    if (response.data && response.data.output && response.data.output.choices) {
      // 流式响应，提取完整内容
      const choice = response.data.output.choices[0]
      if (choice && choice.message && choice.message.content) {
        return {
          code: 200,
          message: '发送成功',
          aiReply: {
            id: Date.now().toString(),
            userId: 'ai',
            content: choice.message.content,
            messageType: 'AI',
            createdAt: new Date().toISOString()
          }
        }
      }
    }
    
    // 返回响应数据
    return response.data
  },
  error => {
    console.error('响应错误:', error)
    
    if (error.code === 'NETWORK_ERROR') {
      ElMessage.error('网络连接失败，请检查网络或服务器状态')
    } else if (error.response) {
      console.error('错误响应:', error.response)
      ElMessage.error(`服务器错误: ${error.response.status}`)
    } else {
      ElMessage.error(error.message || '网络错误')
    }
    return Promise.reject(error)
  }
)

export default service