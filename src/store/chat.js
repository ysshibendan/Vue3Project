import { defineStore } from 'pinia'
import { ref } from 'vue'
import { sendMessage, getMessageHistory, createSession, getSessionList } from '@/api/chat'

export const useChatStore = defineStore('chat', () => {
  // 状态
  const sessions = ref([])
  const currentSession = ref(null)
  const messages = ref([])
  const loading = ref(false)
  const currentRiskAssessment = ref(null)
  
  // 获取会话列表
  const fetchSessions = async (params = {}) => {
    try {
      loading.value = true
      const response = await getSessionList(params)
      if (response.code === 200) {
        sessions.value = response.data.list || []
        return response
      } else {
        throw new Error(response.message || '获取会话列表失败')
      }
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }
  
  // 创建新会话
  const createNewSession = async (data = {}) => {
    try {
      const response = await createSession(data)
      if (response.code === 200) {
        currentSession.value = response.data
        return response
      } else {
        throw new Error(response.message || '创建会话失败')
      }
    } catch (error) {
      throw error
    }
  }
  
  // 获取消息历史
  const fetchMessageHistory = async (sessionId, params = {}) => {
    try {
      loading.value = true
      const response = await getMessageHistory(sessionId, params)
      if (response.code === 200) {
        messages.value = response.data.list || []
        return response
      } else {
        throw new Error(response.message || '获取消息历史失败')
      }
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }
  
  // 发送消息
  const sendMessageToAI = async (data) => {
    try {
      loading.value = true
      const response = await sendMessage(data)
      if (response.code === 200) {
        // 添加用户消息
        const userMessage = {
          id: Date.now().toString(),
          content: data.content,
          messageType: 0, // 0表示用户消息
          createdAt: new Date()
        }
        messages.value.push(userMessage)
        
        // 添加AI回复
        const aiMessage = {
          id: response.aiReply.id,
          content: response.aiReply.content,
          messageType: 1, // 1表示AI消息
          createdAt: new Date(response.aiReply.createdAt)
        }
        messages.value.push(aiMessage)
        
        // 更新风险评估
        if (response.riskAssessment) {
          currentRiskAssessment.value = response.riskAssessment
        }
        
        return response
      } else {
        throw new Error(response.message || '发送消息失败')
      }
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }
  
  // 设置当前会话
  const setCurrentSession = (session) => {
    currentSession.value = session
  }
  
  // 清空消息
  const clearMessages = () => {
    messages.value = []
  }
  
  // 清空当前风险评估
  const clearRiskAssessment = () => {
    currentRiskAssessment.value = null
  }
  
  return {
    // 状态
    sessions,
    currentSession,
    messages,
    loading,
    currentRiskAssessment,
    
    // 方法
    fetchSessions,
    createNewSession,
    fetchMessageHistory,
    sendMessageToAI,
    setCurrentSession,
    clearMessages,
    clearRiskAssessment
  }
})