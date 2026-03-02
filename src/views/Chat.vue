<template>
  <div class="page-container">
    <app-header />
    
    <div class="main-content">
      <app-sidebar />
      
      <div class="chat-area">
        <div class="chat-container">
          <!-- 左侧会话列表 -->
          <div class="chat-sidebar">
            <div class="sidebar-header">
              <h3>会话列表</h3>
              <el-button type="primary" :icon="Plus" @click="createNewSession" size="small">
                新建对话
              </el-button>
            </div>
            
            <div class="session-list" v-loading="sessionsLoading">
              <div v-if="sessions.length === 0" class="empty-state">
                <el-empty description="暂无会话" />
              </div>
              
              <div v-else>
                <div
                  v-for="session in sessions"
                  :key="session.id"
                  :class="['session-item', { active: currentSessionId === session.id }]"
                  @click="selectSession(session.id)"
                >
                  <div class="session-info">
                    <h4 class="session-title">{{ session.title }}</h4>
                    <p class="session-preview">{{ session.lastMessage || '暂无消息' }}</p>
                    <span class="session-time">{{ formatDate(session.updatedAt) }}</span>
                  </div>
                  
                  <div class="session-actions">
                    <el-dropdown @command="handleSessionCommand" trigger="click">
                      <el-button link :icon="MoreFilled" size="small" />
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item :command="{ action: 'rename', id: session.id }">
                            重命名
                          </el-dropdown-item>
                          <el-dropdown-item :command="{ action: 'delete', id: session.id }">
                            删除
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 右侧聊天区域 -->
          <div class="chat-main">
            <div class="chat-header">
              <h2>{{ currentSession?.title || '新对话' }}</h2>
              <div class="header-actions">
                <el-button v-if="currentSession" type="primary" @click="clearMessages" size="small">
                  清空对话
                </el-button>
              </div>
            </div>
            
            <div class="chat-messages" ref="messagesContainer">
              <div v-if="messages.length === 0 && !currentSession" class="welcome-message">
                <div class="welcome-content">
                  <el-icon size="48" color="#409EFF"><ChatDotRound /></el-icon>
                  <h3>欢迎使用智能心理咨询</h3>
                  <p>我是您的AI心理咨询助手，有什么可以帮助您的吗？</p>
                </div>
              </div>
              
              <div
                v-for="message in messages"
                :key="message.id"
                :class="['message-item', message.messageType === 0 ? 'user' : 'ai']"
              >
                <!-- 调试信息 -->
                <!-- {{ JSON.stringify(message) }} -->
                <div class="message-bubble">
                  <div class="avatar">
                    <el-avatar v-if="message.messageType === 0" :size="40">
                      {{ userInfo?.username?.charAt(0) || 'U' }}
                    </el-avatar>
                    <div v-else class="ai-avatar">
                      AI
                    </div>
                  </div>
                  <div v-if="message.messageType === 0" class="message-content">
                    <div class="message-text">{{ message.content }}</div>
                    <!-- 用户消息不显示时间 -->
                  </div>
                  <div v-else class="message-content">
                    <div class="message-text">{{ message.content }}</div>
                    <!-- AI消息时间显示在内容中 -->
                    <div class="message-time">{{ formatTime(message.createdAt) }}</div>
                  </div>
                </div>
                <!-- AI消息时间显示在头像下面 -->
                <div v-if="message.messageType === 1" class="ai-time">
                  {{ formatTime(message.createdAt) }}
                </div>
              </div>
              
              <div v-if="loading" class="message-item ai">
                <div class="message-bubble">
                  <div class="avatar">
                    <el-avatar :size="40" style="background-color: var(--primary-color)">
                      AI
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
            </div>
            
            <div class="chat-input">
              <chat-input
                v-model="inputMessage"
                :loading="loading"
                @send="sendMessage"
                @clear="clearInput"
              />
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { ChatDotRound, Plus, MoreFilled } from '@element-plus/icons-vue'
import { useAuthStore } from '@/store/auth'
import { sendMessage as sendMessageApi, getMessageHistory, createSession, getSessionList, deleteSession } from '@/api/chat'
import { useAuth } from '@/composables/useAuth'
import AppHeader from '@/components/common/Header.vue'
import AppSidebar from '@/components/common/Sidebar.vue'
import ChatInput from '@/components/chat/ChatInput.vue'

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
const currentSessionId = ref(null)
const sessions = ref([])
const sessionsLoading = ref(false)
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
  
  // 格式化时间
  const formatTime = (time) => {
    if (!time) return ''
    const date = new Date(time)
    const now = new Date()
    
    // 如果是同一天，只显示时间
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }
    
    // 否则显示日期和时间
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  // 格式化日期
  const formatDate = (time) => {
    if (!time) return ''
    const date = new Date(time)
    const now = new Date()
    
    // 如果是今天
    if (date.toDateString() === now.toDateString()) {
      return '今天 ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }
    
    // 如果是昨天
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    if (date.toDateString() === yesterday.toDateString()) {
      return '昨天 ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }
    
    // 否则显示完整日期
    return date.toLocaleDateString('zh-CN', {
      month: '2-digit',
      day: '2-digit'
    })
  }
  
  // 获取会话列表
  const fetchSessions = async () => {
    sessionsLoading.value = true
    try {
      const response = await getSessionList({
        token: authStore.token
      })
      
      if (response && response.sessions) {
        sessions.value = response.sessions || []
      } else {
        ElMessage.error('获取会话列表失败')
      }
    } catch (error) {
      console.error('获取会话列表失败:', error)
      ElMessage.error('获取会话列表失败')
    } finally {
      sessionsLoading.value = false
    }
  }
  
  // 创建新会话
  const createNewSession = async () => {
    try {
      // 清空当前消息
      messages.value = []
      currentSession.value = null
      currentSessionId.value = null
      
      // 创建新会话
      const response = await createSession({
        token: authStore.token
      })
      
      if (response && response.id) {
        // 后端返回的session数据直接在response中
        const newSession = {
          id: response.id,
          title: response.title || `对话-${new Date().toLocaleDateString()}`,
          createdAt: response.createdAt,
          updatedAt: response.updatedAt,
          messageCount: response.messageCount || 0
        }
        
        currentSession.value = newSession
        currentSessionId.value = newSession.id
        sessions.value.unshift(newSession)
        
        console.log('创建会话成功:', newSession)
        ElMessage.success('新对话创建成功')
      } else {
        console.error('创建会话失败:', response)
        ElMessage.error('创建新对话失败')
      }
    } catch (error) {
      console.error('创建新对话失败:', error)
      ElMessage.error('创建新对话失败')
    }
  }
  
  // 选择会话
  const selectSession = async (sessionId) => {
    if (sessionId === currentSessionId.value) return
    
    // 更新当前会话
    const session = sessions.value.find(s => s.id === sessionId)
    if (session) {
      currentSession.value = session
      currentSessionId.value = sessionId
    }
    
    // 获取消息历史
    await fetchMessageHistory(sessionId)
  }
  
  
  
  // 处理会话命令
  const handleSessionCommand = async (command) => {
    const { action, id } = command
    
    if (action === 'rename') {
      const session = sessions.value.find(s => s.id === id)
      if (!session) return
      
      try {
        const { value: newTitle } = await ElMessageBox.prompt(
          '请输入新的会话名称',
          '重命名会话',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputValue: session.title
          }
        )
        
        if (newTitle) {
          session.title = newTitle
          // 这里应该调用重命名接口，暂时只更新本地
          ElMessage.success('重命名成功')
        }
      } catch {
        // 用户取消
      }
    } else if (action === 'delete') {
      try {
        await ElMessageBox.confirm(
          '确定要删除这个会话吗？删除后无法恢复。',
          '删除确认',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        
        // 调用删除API
        const response = await deleteSession({
          session_id: id,
          token: authStore.token
        })
        
        if (response && response.code === 200) {
          // 从列表中移除
          const index = sessions.value.findIndex(s => s.id === id)
          if (index !== -1) {
            sessions.value.splice(index, 1)
            
            // 如果删除的是当前会话，清空消息
            if (id === currentSessionId.value) {
              messages.value = []
              currentSession.value = null
              currentSessionId.value = null
            }
          }
          
          ElMessage.success('删除成功')
        } else {
          ElMessage.error(response.message || '删除失败')
        }
      } catch (error) {
        // 用户取消或删除失败
        if (error !== 'cancel') {
          ElMessage.error('删除失败')
        }
      }
    }
  }
  
  // 删除会话
  const handleDeleteSession = async (sessionId) => {
    try {
      await ElMessageBox.confirm(
        '确定要删除这个会话吗？',
        '删除会话',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
      
      const response = await deleteSession({
        session_id: sessionId,
        token: authStore.token
      })
      
      if (response && response.code === 200) {
        ElMessage.success('删除成功')
        // 从会话列表中移除
        const index = sessions.value.findIndex(s => s.id === sessionId)
        if (index !== -1) {
          sessions.value.splice(index, 1)
        }
        
        // 如果删除的是当前会话，清空消息
        if (currentSessionId.value === sessionId) {
          messages.value = []
          currentSession.value = null
          currentSessionId.value = null
        }
      } else {
        ElMessage.error(response.message || '删除失败')
      }
    } catch (error) {
      ElMessage.error('删除失败')
    }
  }
  
  // 清空消息
  const clearMessages = async () => {
    try {
      await ElMessageBox.confirm(
        '确定要清空当前对话吗？',
        '清空确认',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
      
      messages.value = []
      ElMessage.success('对话已清空')
    } catch {
      // 用户取消
    }
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
  const sendMessage = async (messageContent) => {
    if (!messageContent || typeof messageContent !== 'string' || !messageContent.trim()) return
    
    console.log('准备发送消息:', messageContent)
    
    // 如果没有当前会话，先创建一个
    if (!currentSessionId.value) {
      console.log('没有当前会话，创建新会话')
      await createNewSession()
      // 等待一下确保会话创建完成
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
    // 添加用户消息
    const userMessage = {
      id: Date.now().toString(),
      content: messageContent,
      messageType: 0, // 0表示用户消息
      createdAt: new Date()
    }
    
    console.log('添加用户消息:', userMessage)
    messages.value.push(userMessage)
    console.log('当前消息列表:', messages.value)
    scrollToBottom()
    
    loading.value = true
    
    try {
      const requestData = {
        session_id: currentSessionId.value,
        content: messageContent,
        message_type: 0,
        token: authStore.token
      }
      
      console.log('发送消息参数:', requestData)
      
      let response
      try {
        response = await sendMessageApi(requestData)
      } catch (error) {
        console.error('发送消息请求失败:', error)
        ElMessage.error('发送消息失败，请稍后重试')
        return
      }
      
      console.log('发送消息响应:', response)
      
      // 检查响应是否有效
      if (!response) {
        console.error('响应为空或未定义')
        ElMessage.error('服务器未响应，请稍后重试')
        return
      }
      
      // 检查响应结构
      if (response && response.code === 200 && response.aiReply) {
        // 添加AI回复
        const aiMessage = {
          id: response.aiReply.id,
          content: response.aiReply.content,
          messageType: 1, // 1表示AI消息
          createdAt: response.aiReply.createdAt || new Date()
        }
        
        messages.value.push(aiMessage)
        
        // 更新当前会话的最后消息
        if (currentSession.value) {
          currentSession.value.lastMessage = aiMessage.content
          currentSession.value.updatedAt = new Date()
        }
        
        // 更新风险评估
        if (response.riskAssessment) {
          currentRiskAssessment.value = response.riskAssessment
        }
        
        scrollToBottom()
      } else {
        console.error('发送消息失败:', response)
        const errorMsg = response && response.message ? response.message : '发送消息失败'
        ElMessage.error(errorMsg)
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
  
  // 获取历史消息
  const fetchMessageHistory = async (sessionId) => {
    loading.value = true
    try {
      const response = await getMessageHistory({
        token: authStore.token,
        session_id: sessionId
      })
      
      if (response && response.messages) {
        // 处理历史消息的类型
        messages.value = response.messages.map(msg => ({
          ...msg,
          messageType: msg.messageType === 'AI' ? 1 : 0 // 确保AI消息的messageType为1
        })) || []
        scrollToBottom()
      }
    } catch (error) {
      ElMessage.error(error.message || '获取历史消息失败')
    } finally {
      loading.value = false
    }
  }
  
  // 初始化
  onMounted(async () => {
    // 检查token状态
    const tokenFromStorage = localStorage.getItem('vue3project_token')
    const tokenFromStore = authStore.token
    console.log('页面加载时token状态:', {
      localStorage: tokenFromStorage,
      store: tokenFromStore
    })
    
    if (!tokenFromStorage && !tokenFromStore) {
      ElMessage.error('未找到登录凭证，请重新登录')
      router.push('/login')
      return
    }
    
    // 首先获取会话列表
    await fetchSessions()
    
    // 检查是否有会话ID
    const sessionId = route.query.sessionId
    if (sessionId) {
      // 如果有会话ID，获取历史消息
      await fetchMessageHistory(sessionId)
      const session = sessions.value.find(s => s.id === sessionId)
      if (session) {
        currentSession.value = session
        currentSessionId.value = sessionId
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
.page-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-container {
  display: flex;
  height: 100%;
  background-color: var(--background-color);
}

// 左侧会话列表
.chat-sidebar {
  width: 280px;
  border-right: 1px solid var(--border-light);
  display: flex;
  flex-direction: column;
  
  .sidebar-header {
    padding: 16px;
    border-bottom: 1px solid var(--border-light);
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
      color: var(--text-color);
    }
  }
  
  .session-list {
    flex: 1;
    overflow-y: auto;
    
    .empty-state {
      padding: 20px;
      text-align: center;
    }
    
    .session-item {
      padding: 12px 16px;
      cursor: pointer;
      transition: background-color 0.3s;
      border-bottom: 1px solid var(--border-light);
      display: flex;
      align-items: center;
      
      &:hover {
        background-color: var(--secondary-color);
      }
      
      &.active {
        background-color: rgba(var(--primary-color), 0.1);
        border-right: 3px solid var(--primary-color);
      }
      
      .session-info {
        flex: 1;
        min-width: 0;
        
        .session-title {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-color);
          margin: 0 0 5px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .session-preview {
          font-size: 12px;
          color: var(--text-secondary);
          margin: 0 0 5px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .session-time {
          font-size: 11px;
          color: var(--text-placeholder);
        }
      }
      
      .session-actions {
        margin-left: 10px;
      }
    }
  }
}

// 右侧聊天区域
.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  
  .chat-header {
    padding: 16px 20px;
    border-bottom: 1px solid var(--border-light);
    background-color: var(--background-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    h2 {
      font-size: 18px;
      font-weight: 500;
      color: var(--text-color);
      margin: 0;
    }
  }
  
  .chat-messages {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    
    .welcome-message {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      
      .welcome-content {
        text-align: center;
        
        h3 {
          margin: 16px 0 8px;
          color: var(--text-color);
        }
        
        p {
          margin: 0;
          color: var(--text-secondary);
        }
      }
    }
    
    .message-item {
      margin-bottom: 20px;
      
      &.user {
        display: flex;
        justify-content: flex-end;
        
        .message-bubble {
          max-width: 70%;
          display: flex;
          align-items: center;
          
          .avatar {
            margin-left: 12px;
            margin-right: 0;
            order: 2; // 头像在右边
          }
          
          .message-content {
            background-color: #70ba96;
            color: white;
            border-radius: 8px;
            padding: 10px 15px;
            order: 1; // 内容在左边
            margin-right: 12px;
            
            .message-text {
              margin-bottom: 0; // 去掉时间
            }
            
            .message-time {
              display: none; // 隐藏时间
            }
          }
        }
      }
      
      &.ai {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        
        .message-bubble {
          max-width: 70%;
          display: flex;
          align-items: flex-start;
          margin-bottom: 5px;
          
          .avatar {
            margin-right: 12px;
            margin-left: 0;
            flex-shrink: 0;
          }
          
          .message-content {
            background-color: #70ba96;
            color: white;
            border-radius: 8px;
            padding: 10px 15px;
            flex: 1;
            
            .message-text {
              margin-bottom: 5px;
            }
            
            .message-time {
              display: none; // 隐藏内容中的时间
            }
          }
        }
        
        // AI消息时间显示在头像正下方
        .ai-time {
          font-size: 12px;
          color: black;
          opacity: 0;
          transition: opacity 0.3s ease;
          margin-top: 5px;
          margin-left: 0; // 与头像左对齐
          width: 40px; // 头像宽度
          text-align: center;
          padding: 0;
          line-height: 1.2;
        }
        
        // 悬浮时显示时间
        &:hover .ai-time {
          opacity: 0.7;
        }
      }
      
      .message-bubble {
        display: flex;
        align-items: flex-start;
        
        .avatar {
          flex-shrink: 0;
        }
        
        .ai-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #70ba96;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: bold;
        }
        
        .message-content {
          padding: 12px 16px;
          line-height: 1.5;
          word-wrap: break-word;
          
          .message-text {
            margin-bottom: 5px;
            white-space: pre-wrap;
            word-break: break-word;
            overflow-wrap: break-word;
          }
          
          .message-time {
            font-size: 12px;
            text-align: right;
            opacity: 0.7;
          }
        }
      }
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
}

.typing-indicator {
  display: flex;
  align-items: center;
  
  span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: var(--text-secondary);
    margin: 0 2px;
    animation: typing 1.4s infinite;
    
    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
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
  
  .risk-card {
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
    
    &.low {
      background-color: rgba(103, 194, 58, 0.1);
      border-left: 4px solid #67C23A;
    }
    
    &.medium {
      background-color: rgba(230, 162, 60, 0.1);
      border-left: 4px solid #E6A23C;
    }
    
    &.high {
      background-color: rgba(245, 108, 108, 0.1);
      border-left: 4px solid #F56C6C;
    }
    
    &.critical {
      background-color: rgba(220, 53, 69, 0.1);
      border-left: 4px solid #DC3545;
    }
  }
  
  .risk-level {
    font-weight: 600;
    margin-bottom: 8px;
  }
  
  .risk-score {
    margin-bottom: 8px;
  }
  
  .risk-description {
    margin-bottom: 12px;
    line-height: 1.5;
  }
  
  .risk-recommendation {
    padding-top: 12px;
    border-top: 1px solid var(--border-light);
    
    strong {
      color: var(--primary-color);
    }
  }
}
</style>