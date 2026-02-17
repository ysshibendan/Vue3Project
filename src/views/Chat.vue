<template>
    <div class="page-container">
      <app-header />
      
      <div class="main-content">
        <app-sidebar />
        
        <div class="chat-area">
          <div class="chat-container">
            <div class="chat-header">
              <h2>{{ currentSession?.title || '新对话' }}</h2>
              <div class="header-actions">
                <el-button type="primary" @click="saveSession">保存会话</el-button>
              </div>
            </div>
            
            <div class="chat-messages" ref="messagesContainer">
              <div
                v-for="message in messages"
                :key="message.id"
                :class="['message-item', message.messageType === 0 ? 'user' : 'ai']"
              >
                <div class="avatar">
                  <el-avatar v-if="message.messageType === 0" :size="40">
                    {{ userInfo?.username?.charAt(0) || 'U' }}
                  </el-avatar>
                  <el-avatar v-else :size="40" style="background-color: var(--primary-color)">
                    <el-icon><Robot /></el-icon>
                  </el-avatar>
                </div>
                <div class="message-content">{{ message.content }}</div>
              </div>
              
              <div v-if="loading" class="message-item ai">
                <div class="avatar">
                  <el-avatar :size="40" style="background-color: var(--primary-color)">
                    <el-icon><Robot /></el-icon>
                  </el-avatar>
                </div>
                <div class="message-content">
                  <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="chat-input">
              <el-input
                v-model="inputMessage"
                type="textarea"
                :rows="3"
                placeholder="请输入您想说的话..."
                @keydown.ctrl.enter="sendMessage"
              />
              <div class="input-actions">
                <el-button @click="clearInput">清空</el-button>
                <el-button type="primary" @click="sendMessage" :disabled="!inputMessage.trim() || loading">
                  发送 (Ctrl+Enter)
                </el-button>
              </div>
            </div>
          </div>
          
          <!-- 风险评估面板 -->
          <div v-if="currentRiskAssessment" class="risk-panel">
            <h3>风险评估</h3>
            <div :class="['risk-card', currentRiskAssessment.level?.toLowerCase()]">
              <div class="risk-level">风险等级: {{ getRiskLevelText(currentRiskAssessment.level) }}</div>
              <div class="risk-score">风险分数: {{ currentRiskAssessment.score?.toFixed(2) }}</div>
              <div class="risk-description">{{ currentRiskAssessment.description }}</div>
              <div v-if="currentRiskAssessment.recommendation" class="risk-recommendation">
                <strong>建议:</strong> {{ currentRiskAssessment.recommendation }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed, onMounted, nextTick, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import { useAuthStore } from '@/store/auth'
  import { sendMessage as sendMessageApi, getMessageHistory, createSession } from '@/api/chat'
  import { useAuth } from '@/composables/useAuth'
  import AppHeader from '@/components/common/Header.vue'
  import AppSidebar from '@/components/common/Sidebar.vue'
  
  const route = useRoute()
  const router = useRouter()
  const authStore = useAuthStore()
  const { requireAuth } = useAuth()
  
  // 检查认证状态
  if (!requireAuth()) {
    // 如果未认证，将会重定向到登录页面
  }
  const userInfo = computed(() => authStore.userInfo)
  const messages = ref([])
  const inputMessage = ref('')
  const loading = ref(false)
  const messagesContainer = ref(null)
  const currentSession = ref(null)
  const currentRiskAssessment = ref(null)
  
  // 获取风险等级文本
  const getRiskLevelText = (level) => {
    const levelMap = {
      'LOW': '低风险',
      'MEDIUM': '中风险',
      'HIGH': '高风险',
      'CRITICAL': '极高风险'
    }
    return levelMap[level] || '未知'
  }
  
  // 滚动到底部
  const scrollToBottom = () => {
    nextTick(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    })
  }
  
  // 发送消息
  const sendMessage = async () => {
    if (!inputMessage.value.trim()) return
    
    const userMessage = {
      id: Date.now().toString(),
      content: inputMessage.value,
      messageType: 0, // 0表示用户消息
      createdAt: new Date()
    }
    
    messages.value.push(userMessage)
    const messageContent = inputMessage.value
    inputMessage.value = ''
    scrollToBottom()
    
    loading.value = true
    
    try {
      const response = await sendMessageApi({
        sessionId: currentSession.value?.id || '',
        content: messageContent,
        messageType: 0,
        token: authStore.token
      })
      
      if (response.code === 200) {
        // 添加AI回复
        const aiMessage = {
          id: response.aiReply.id,
          content: response.aiReply.content,
          messageType: 1, // 1表示AI消息
          createdAt: new Date(response.aiReply.createdAt)
        }
        
        messages.value.push(aiMessage)
        
        // 更新当前会话
        if (!currentSession.value && response.aiReply.sessionId) {
          currentSession.value = {
            id: response.aiReply.sessionId,
            title: `对话-${new Date().toLocaleDateString()}`
          }
        }
        
        // 更新风险评估
        if (response.riskAssessment) {
          currentRiskAssessment.value = response.riskAssessment
        }
        
        scrollToBottom()
      } else {
        ElMessage.error(response.message || '发送消息失败')
      }
    } catch (error) {
      ElMessage.error(error.message || '发送消息失败')
    } finally {
      loading.value = false
    }
  }
  
  // 清空输入
  const clearInput = () => {
    inputMessage.value = ''
  }
  
  // 保存会话
  const saveSession = async () => {
    if (!currentSession.value) {
      try {
        const response = await createSession({
          token: authStore.token
        })
        
        if (response.code === 200) {
          currentSession.value = response.data
          ElMessage.success('会话保存成功')
        } else {
          ElMessage.error(response.message || '保存会话失败')
        }
      } catch (error) {
        ElMessage.error(error.message || '保存会话失败')
      }
    } else {
      ElMessage.success('会话已保存')
    }
  }
  
  // 获取历史消息
  const fetchMessageHistory = async (sessionId) => {
    try {
      const response = await getMessageHistory(sessionId, {
        page: 1,
        pageSize: 100
      })
      
      if (response.code === 200) {
        messages.value = response.data.list || []
        scrollToBottom()
      }
    } catch (error) {
      ElMessage.error(error.message || '获取历史消息失败')
    }
  }
  
  // 初始化
  onMounted(async () => {
    // 检查是否有会话ID
    const sessionId = route.query.sessionId
    if (sessionId) {
      // 如果有会话ID，获取历史消息
      await fetchMessageHistory(sessionId)
      currentSession.value = {
        id: sessionId,
        title: `对话-${new Date().toLocaleDateString()}`
      }
    }
    
    // 添加欢迎消息
    if (messages.value.length === 0) {
      messages.value.push({
        id: 'welcome',
        content: '您好！我是您的心理健康助手，很高兴能为您服务。有什么可以帮助您的吗？',
        messageType: 1,
        createdAt: new Date()
      })
    }
    
    scrollToBottom()
  })
  </script>
  
  <style scoped lang="scss">
  .chat-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 20px;
    overflow: hidden;
  }
  
  .chat-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: var(--background-color);
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    overflow: hidden;
    margin-bottom: 20px;
  }
  
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid var(--border-light);
    background-color: var(--background-color);
    
    h2 {
      font-size: 18px;
      font-weight: 500;
      color: var(--text-color);
    }
  }
  
  .chat-messages {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    
    .message-item {
      display: flex;
      margin-bottom: 20px;
      
      &.user {
        justify-content: flex-end;
        
        .message-content {
          background-color: var(--primary-color);
          color: white;
          border-radius: 18px 18px 4px 18px;
        }
        
        .avatar {
          margin-left: 12px;
          margin-right: 0;
        }
      }
      
      &.ai {
        justify-content: flex-start;
        
        .message-content {
          background-color: var(--secondary-color);
          color: var(--text-color);
          border-radius: 18px 18px 18px 4px;
        }
      }
      
      .avatar {
        margin-right: 12px;
        flex-shrink: 0;
      }
      
      .message-content {
        max-width: 70%;
        padding: 12px 16px;
        line-height: 1.5;
        word-wrap: break-word;
      }
    }
  }
  
  .typing-indicator {
    display: flex;
    align-items: center;
    
    span {
      height: 8px;
      width: 8px;
      background-color: #999;
      border-radius: 50%;
      display: inline-block;
      margin: 0 2px;
      animation: typing 1.4s infinite ease-in-out both;
      
      &:nth-child(1) {
        animation-delay: -0.32s;
      }
      
      &:nth-child(2) {
        animation-delay: -0.16s;
      }
    }
  }
  
  @keyframes typing {
    0%, 80%, 100% {
      transform: scale(0);
      opacity: 0.5;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }
  
  .chat-input {
    padding: 16px 20px;
    border-top: 1px solid var(--border-light);
    background-color: var(--background-color);
    
    .input-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 10px;
    }
  }
  
  .risk-panel {
    width: 300px;
    background-color: var(--background-color);
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    padding: 20px;
    
    h3 {
      font-size: 18px;
      color: var(--text-color);
      margin-bottom: 15px;
    }
  }
  </style>