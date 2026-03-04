<template>
  <div class="home-page">
    <!-- 导航栏 -->
    <header class="navbar">
      <div class="nav-container">
        <div class="logo" @click="goToHome">
          <h1>心理健康咨询平台</h1>
        </div>
        <nav class="nav-menu">
        </nav>
        <div class="nav-actions">
          <template v-if="isAuthenticated">
            <el-button @click="goToProfile">个人中心</el-button>
            <el-button type="primary" @click="goToChat">开始咨询</el-button>
          </template>
          <template v-else>
            <el-button @click="goToLogin">登录</el-button>
            <el-button type="primary" @click="goToLogin">注册</el-button>
          </template>
        </div>
      </div>
      <!-- 新导航栏 -->
      <div class="nav-bg" id="navbr">
        <div class="nav">
          <ul>
            <li class="hover"><router-link to="/" class="first-level" title="网站首页">网站首页</router-link></li>
            <li class="">
              <router-link to="/counselors" class="first-level">
                心理咨询
              </router-link>
            </li>
            <li class="">
              <router-link to="/counselors" class="first-level">
                心理咨询师
              </router-link>
            </li>
            <li class="">
              <router-link to="/chat" class="first-level">
                智能聊天
              </router-link>
            </li>
            <li class="">
              <router-link to="/test" class="first-level">
                心理测评
              </router-link>
            </li>
            <li class="">
              <router-link to="/consultation" class="first-level">
                在线咨询
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </header>
    <!-- 主要内容 -->
    <main>
      <div class="consultation-container">
        <!-- 左侧预约列表 -->
    <div class="appointment-list">
      <div class="list-header">
        <h3>我的预约</h3>
      </div>
      <div class="appointment-items">
        <!-- 调试信息 -->
        <div v-if="appointments.length === 0" class="no-appointments">
          <el-empty description="暂无预约信息" />
        </div>
        <div v-else class="appointment-table">
          <table class="appointment-table-content">
            <thead>
              <tr>
                <th style="width: 20%; text-align: center; padding: 18px 8px; font-size: 22px; border: 1px solid #000;">咨询师姓名</th>
                <th style="width: 20%; text-align: center; padding: 18px 8px; font-size: 22px; border: 1px solid #000;">预约日期</th>
                <th style="width: 25%; text-align: center; padding: 18px 8px; font-size: 22px; border: 1px solid #000;">预约时间</th>
                <th style="width: 15%; text-align: center; padding: 18px 8px; font-size: 22px; border: 1px solid #000;">状态</th>
                <th style="width: 20%; text-align: center; padding: 18px 8px; font-size: 22px; border: 1px solid #000;">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="appointment in appointments" 
                :key="appointment.id"
                :class="['appointment-row', { active: selectedAppointment?.id === appointment.id }]"
              >
                <td style="text-align: center; padding: 18px 8px; font-size: 20px; border: 1px solid #000;">{{ appointment.counselorName }}</td>
                <td style="text-align: center; padding: 18px 8px; font-size: 20px; border: 1px solid #000;">{{ appointment.appointmentDate }}</td>
                <td style="text-align: center; padding: 18px 8px; font-size: 20px; border: 1px solid #000;">{{ appointment.startTime }} - {{ appointment.endTime }}</td>
                <td style="text-align: center; padding: 18px 8px; font-size: 20px; border: 1px solid #000;">
                  <el-tag :type="getAppointmentStatusType(appointment.status).type" size="large" style="font-size: 18px;">
                    {{ appointment.statusText }}
                  </el-tag>
                </td>
                <td style="text-align: center; padding: 18px 8px; font-size: 20px; border: 1px solid #000;">
                  <el-button 
                    v-if="appointment.status === 1"
                    type="primary" 
                    size="large" 
                    @click.stop="startConsultation(appointment)"
                  >
                    前往
                  </el-button>
                  <el-button 
                    v-if="appointment.status === 1"
                    type="danger" 
                    size="large" 
                    @click.stop="handleCancelAppointment(appointment)"
                  >
                    取消
                  </el-button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 右侧聊天区域 -->
    <div class="chat-main">
      <!-- 聊天头部 -->
      <div class="chat-header">
        <div class="appointment-info" v-if="selectedAppointment">
          <el-avatar :size="60">
            {{ selectedAppointment.counselorName.charAt(0) }}
          </el-avatar>
          <div class="appointment-details">
            <div class="appointment-name" style="font-size: 20px;">{{ selectedAppointment.counselorName }}</div>
            <div class="appointment-time" style="font-size: 18px;">{{ selectedAppointment.appointmentDate }} {{ selectedAppointment.startTime }}-{{ selectedAppointment.endTime }}</div>
          </div>
        </div>
        <div class="chat-actions" v-if="currentSessionId">
          <el-button size="small" @click="endConsultation">结束咨询</el-button>
        </div>
      </div>

      <!-- 聊天消息区域 -->
      <div class="chat-messages" ref="messagesContainer">
        <div
          v-for="message in messages"
          :key="message.id"
          :class="['message-item', message.sender_id === userInfo?.id ? 'user' : 'counselor']"
        >
          <div class="message-bubble">
            <div class="avatar">
              <el-avatar v-if="message.sender_id === userInfo?.id" :size="40">
                {{ userInfo?.username?.charAt(0) || 'U' }}
              </el-avatar>
              <el-avatar v-else :size="40">
                {{ selectedAppointment?.counselorName?.charAt(0) || 'C' }}
              </el-avatar>
            </div>
            <div class="message-content">
              <div class="message-text">{{ message.content }}</div>
              <div class="message-time">{{ formatTime(message.sent_at) }}</div>
            </div>
          </div>
        </div>

        <!-- 视频通话区域 -->
        <div v-if="videoCall.active" class="video-call-container">
          <div class="video-local">
            <video ref="localVideo" autoplay muted></video>
            <div class="video-info">我</div>
          </div>
          <div class="video-remote">
            <video ref="remoteVideo" autoplay></video>
            <div class="video-info">{{ selectedAppointment?.counselorName }}</div>
          </div>
          <div class="video-controls">
            <el-button @click="toggleVideo" :type="videoCall.active ? 'danger' : 'primary'">
              {{ videoCall.active ? '挂断' : '视频' }}
            </el-button>
          </div>
        </div>


      </div>

      <!-- 聊天输入框 -->
      <div class="chat-input" v-if="currentSessionId">
        <el-input
          v-model="inputMessage"
          type="textarea"
          :rows="3"
          placeholder="请输入消息..."
          @keydown.enter.prevent="sendMessage"
        />
        <div class="input-actions">
          <el-button type="primary" @click="sendMessage">发送</el-button>
          <el-button @click="sendImage">图片</el-button>
          <el-button @click="startVideoCall">视频</el-button>
        </div>
      </div>
    </div>
      </div>
    </main>
    
    <!-- 弹窗式聊天/视频通话容器 -->
    <el-dialog 
      v-model="consultationDialog.visible" 
      :title="consultationDialog.title" 
      width="1200px" 
      :before-close="handleCloseConsultationDialog"
      :close-on-click-modal="false"
      class="consultation-dialog"
    >
      <!-- 切换按钮 -->
      <div class="consultation-tabs">
        <el-button 
          :type="consultationDialog.activeTab === 'chat' ? 'primary' : 'default'"
          @click="consultationDialog.activeTab = 'chat'"
          class="tab-button"
        >
          文字聊天
        </el-button>
        <el-button 
          :type="consultationDialog.activeTab === 'video' ? 'primary' : 'default'"
          @click="consultationDialog.activeTab = 'video'"
          class="tab-button"
        >
          视频聊天
        </el-button>
      </div>
      
      <!-- 文字聊天内容 -->
      <div v-if="consultationDialog.activeTab === 'chat'" class="chat-content">
        <!-- 聊天头部 -->
        <div class="chat-header">
          <div class="appointment-info" v-if="consultationDialog.appointment">
            <!-- 使用img标签替代el-avatar，确保图片正确显示 -->
            <div class="avatar-container">
              <img 
                :src="getCounselorAvatar()" 
                :alt="consultationDialog.appointment.counselorName"
                class="counselor-avatar-img"
                @error="handleAvatarError"
                ref="counselorAvatarImg"
              />
            </div>
            <div class="appointment-details">
              <div class="appointment-name">{{ consultationDialog.appointment.counselorName }}</div>
            </div>
          </div>
        </div>
        
        <!-- 聊天消息区域 -->
        <div class="chat-messages" ref="dialogMessagesContainer">
          <div
            v-for="message in consultationDialog.messages"
            :key="message.id"
            :class="['message-item', message.sender_id === userInfo?.id ? 'user' : 'counselor']"
          >
            <!-- 咨询师消息：左边头像，右边消息 -->
            <div v-if="message.sender_id !== userInfo?.id" class="message-row counselor-message">
              <div class="message-avatar">
                <!-- 使用img标签替代el-avatar，确保图片正确显示 -->
                <img 
                  :src="getCounselorAvatar()" 
                  :alt="consultationDialog.appointment?.counselorName || '咨询师'"
                  class="message-avatar-img"
                  @error="handleMessageAvatarError"
                  ref="messageAvatarImg"
                />
              </div>
              <div class="message-bubble">
                <div class="message-content">
                  {{ message.content }}
                </div>
                <div class="message-time">
                  {{ formatTime(message.sent_at) }}
                </div>
              </div>
            </div>
            
            <!-- 用户消息：左边消息，右边头像 -->
            <div v-else class="message-row user-message">
              <div class="message-bubble">
                <div class="message-content">
                  {{ message.content }}
                </div>
                <div class="message-time">
                  {{ formatTime(message.sent_at) }}
                </div>
              </div>
              <div class="message-avatar">
                <el-avatar :size="40" :src="userInfo?.avatar">
                  {{ userInfo?.username?.charAt(0) || 'U' }}
                </el-avatar>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 聊天输入框 -->
        <div class="chat-input" v-if="consultationDialog.sessionId">
          <div class="input-container">
            <el-input
              v-model="consultationDialog.inputMessage"
              type="textarea"
              :rows="3"
              placeholder="请输入消息..."
              @keydown.enter.prevent="sendDialogMessage"
              resize="none"
            />
            <el-button 
              type="primary" 
              @click="sendDialogMessage"
              :disabled="!consultationDialog.inputMessage.trim()"
              class="send-button"
            >
              发送
            </el-button>
          </div>
        </div>
      </div>
      
      <!-- 视频聊天内容 -->
      <div v-if="consultationDialog.activeTab === 'video'" class="video-content">
        <div class="video-container">
          <div class="video-local">
            <video ref="dialogLocalVideo" autoplay muted></video>
            <div class="video-info">我</div>
          </div>
          <div class="video-remote">
            <video ref="dialogRemoteVideo" autoplay></video>
            <div class="video-info">{{ consultationDialog.appointment?.counselorName }}</div>
          </div>
          <div class="video-controls">
            <el-button 
              :type="consultationDialog.videoCall.active ? 'danger' : 'primary'"
              @click="toggleDialogVideoCall"
            >
              {{ consultationDialog.videoCall.active ? '挂断' : '发起视频' }}
            </el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/store/auth'
import { 
  startConsultation as startConsultationApi, 
  sendMessage as sendConsultationMessage, 
  getMessageHistory, 
  endConsultation as endConsultationApi,
  getActiveConsultation
} from '@/api/consultation'
import request from '@/utils/request'
import { getUserAppointments, cancelAppointment } from '@/api/appointment'
import { useAuth } from '@/composables/useAuth'
import { getUserInfo } from '@/api/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { isAuthenticated: isAuth } = useAuth()

// 获取用户信息
const userInfo = ref(null)
const fetchUserInfo = async () => {
  try {
    console.log('开始获取用户信息...')
    const response = await getUserInfo()
    
    console.log('getUserInfo响应:', response)
    
    if (response.code === 200) {
      // 检查响应数据结构
      console.log('检查response.data:', response.data)
      console.log('response.data类型:', typeof response.data)
      
      // 从response.data.userInfo获取用户信息
      if (response.data && response.data.userInfo) {
        console.log('准备赋值userInfo.value = response.data.userInfo')
        console.log('赋值前userInfo.value:', userInfo.value)
        
        userInfo.value = response.data.userInfo
        
        console.log('赋值后userInfo.value:', userInfo.value)
        console.log('用户信息获取成功:', userInfo.value)
        console.log('用户ID:', userInfo.value?.id)
        console.log('用户ID类型:', typeof userInfo.value?.id)
      } else {
        console.error('response.data.userInfo不存在，检查响应数据结构')
        console.error('完整响应:', response)
      }
    } else {
      console.error('获取用户信息失败，响应码:', response.code)
    }
  } catch (error) {
    console.error('获取用户信息异常:', error)
  }
}

// 初始化时获取用户信息
fetchUserInfo()

// 响应式数据
const appointments = ref([])
const selectedAppointment = ref(null)
const counselors = ref([])
const selectedCounselor = ref(null)
const messages = ref([])
const currentSessionId = ref(null)
const inputMessage = ref('')
const messagesContainer = ref(null)
const videoCall = reactive({
  active: false,
  localStream: null,
  remoteStream: null
})

// 弹窗式聊天/视频通话数据
const consultationDialog = reactive({
  visible: false,
  title: '咨询对话',
  activeTab: 'chat', // 'chat' 或 'video'
  appointment: null,
  counselorInfo: null, // 咨询师详细信息
  sessionId: null,
  messages: [],
  inputMessage: '',
  websocket: null,
  videoCall: {
    active: false,
    localStream: null,
    remoteStream: null,
    peerConnection: null
  }
})

// 弹窗元素引用
const dialogMessagesContainer = ref(null)
const dialogLocalVideo = ref(null)
const dialogRemoteVideo = ref(null)

// 计算属性
const isConsulting = computed(() => !!currentSessionId.value)
const isAuthenticated = computed(() => authStore.isAuthenticated)

// 格式化时间
const formatTime = (time) => {
  if (!time) return ''
  
  let date
  try {
    date = new Date(time)
  } catch (error) {
    console.error('无效日期:', time, error)
    return ''
  }
  
  // 检查日期是否有效
  if (isNaN(date.getTime())) {
    console.error('无效日期:', time)
    return ''
  }
  
  const now = new Date()
  
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  } else {
    return date.toLocaleString('zh-CN', { 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }
}

// 选择预约
const selectAppointment = (appointment) => {
  selectedAppointment.value = appointment
}

// 获取状态样式
const getStatusClass = (status) => {
  switch (status) {
    case 0: return 'pending' // 待确认
    case 1: return 'confirmed' // 已确认
    case 2: return 'completed' // 已完成
    case 3: return 'cancelled' // 已取消
    default: return 'unknown'
  }
}

// 获取预约状态标签类型
const getAppointmentStatusType = (status) => {
  switch (status) {
    case 0: return { type: 'warning', text: '待确认' } // 待确认
    case 1: return { type: 'success', text: '已确认' } // 已确认
    case 2: return { type: 'info', text: '已完成' } // 已完成
    case 3: return { type: 'danger', text: '已取消' } // 已取消
    default: return { type: 'info', text: '未知' } // 未知
  }
}

// 获取咨询师信息
const fetchCounselorInfo = async (counselorId) => {
  try {
    // 检查token是否存在
    if (!authStore.token) {
      return
    }
    
    // 通过usercenter模块的/api/counselor/list接口获取咨询师列表
    // 按照Counselors.vue的逻辑
    const response = await request({
      url: '/api/counselor/list',
      method: 'GET',
      params: {
        token: authStore.token,
        status: -1,
        is_available: 1,
        page: 1,
        page_size: 50
      }
    })
    

    
    if (response.data && response.data.data) {
      // 从列表中查找对应的咨询师
      // 数据结构是数组，每个元素包含userInfo和counselorInfo
      // 使用预约信息中的counselor_id来匹配
      // 注意：counselorInfo.id是字符串，appointment.counselorId可能是数字，需要类型转换
      const counselorData = response.data.data.find(item => {

        return String(item.counselorInfo.id) === String(appointment.counselorId)
      })
      if (counselorData) {


        
        // 使用JSON.parse(JSON.stringify())确保数据正确设置
        
        consultationDialog.counselorInfo.avatar = counselorData.userInfo.avatar || ''; 
        consultationDialog.counselorInfo.specialties = counselorData.counselorInfo.specialty ? [counselorData.counselorInfo.specialty] : [];
        consultationDialog.counselorInfo.introduction = counselorData.counselorInfo.introduction || '';
        consultationDialog.counselorInfo.workExperience = counselorData.counselorInfo.workExperience || 0;
        consultationDialog.counselorInfo.realName = counselorData.userInfo.realName || ''; // 补充名字，防止模板报错
        
        
        

        
        // 强制更新头像
        nextTick(() => {
          forceUpdateAvatar()
        })
      } else {

        // 如果找不到对应的咨询师，使用默认信息
        const defaultCounselorInfo = {
          id: appointment.counselorId,
          name: consultationDialog.appointment.counselorName,
          title: '心理咨询师',
          avatar: '',
          specialties: []
        }
        
        // 直接替换整个对象
        consultationDialog.counselorInfo = defaultCounselorInfo

        // 强制更新头像
        forceUpdateAvatar()
      }
    } else {
      // 如果响应格式不正确，使用默认信息
      consultationDialog.counselorInfo = {
        id: counselorId,
        name: consultationDialog.appointment.counselorName,
        title: '心理咨询师',
        avatar: '',
        specialties: []
      }
    }
  } catch (error) {

    
    // 检查是否是token相关错误
    if (error.response?.status === 401 || error.response?.data?.message?.includes('token')) {
      ElMessage.error('Token验证失败，请重新登录')
      // 可以在这里添加跳转到登录页的逻辑
      return
    }
    
    // 使用默认信息
    consultationDialog.counselorInfo = {
      id: counselorId,
      name: consultationDialog.appointment.counselorName,
      title: '心理咨询师',
      avatar: '',
      specialties: []
    }
  }
}

// 获取咨询师头像URL - 完全按照Home.vue的逻辑
const getCounselorAvatar = () => {
  // 尝试从counselorInfo获取avatar
  let avatar = consultationDialog.counselorInfo?.avatar
  
  // 如果counselorInfo不存在，尝试从userInfo获取
  if (!avatar && consultationDialog.userInfo?.avatar) {
    avatar = consultationDialog.userInfo.avatar
  }
  

  
  // 如果是空字符串，使用默认头像
  if (!avatar || avatar.trim() === '') {

    return '/src/assets/images/head.webp'
  }
  
  // 如果是相对路径（如1.jpg），则从assets/images获取
  if (avatar.startsWith('/') || !avatar.startsWith('http')) {
    // 去掉开头的/，然后从assets/images获取
    const fileName = avatar.replace(/^\//, '')
    const result = `/src/assets/images/${fileName}`

    return result
  }
  
  // 如果是完整URL，直接返回

  return avatar
}

// 强制刷新头像
const forceUpdateAvatar = () => {

  nextTick(() => {
    if (consultationDialog.counselorInfo?.avatar) {
      const avatar = consultationDialog.counselorInfo.avatar
      if (avatar && avatar.trim() !== '') {
        // 强制更新img元素的src属性
        const counselorImg = document.querySelector('.counselor-avatar-img')
        const messageImg = document.querySelector('.message-avatar-img')
        

        
        if (counselorImg) {
          counselorImg.src = getCounselorAvatar()

        }
        
        if (messageImg) {
          messageImg.src = getCounselorAvatar()

        }
      } else {

      }
    } else {

    }
  })
}

// 处理头像加载错误
const handleAvatarError = (e) => {

  // 设置默认头像
  e.target.src = '/src/assets/images/head.webp'
}

// 处理消息中头像加载错误
const handleMessageAvatarError = (e) => {

  // 设置默认头像
  e.target.src = '/src/assets/images/head.webp'
}

// 开始咨询
const startConsultation = async (appointment) => {
  try {
    const response = await startConsultationApi({
      token: authStore.token,
      appointment_id: appointment.id
    })
    
    if (response.code === 200) {
      // 初始化弹窗数据
      consultationDialog.appointment = appointment
      // 使用appointment.id作为sessionId
      consultationDialog.sessionId = appointment.id
      consultationDialog.title = `与 ${appointment.counselorName} 的咨询`
      consultationDialog.activeTab = 'chat' // 默认显示聊天
      consultationDialog.messages = []
      consultationDialog.inputMessage = ''
      consultationDialog.visible = true
      
      // 获取咨询师信息
      await fetchCounselorInfo(appointment.counselorId)
      
      ElMessage.success('咨询已开始')
      
      // 获取历史消息
      await fetchDialogMessageHistory()
      
      // 建立WebSocket连接
      await connectWebSocket()
    } else {
      // 尝试获取活跃咨询会话
      try {
        const activeResponse = await getActiveConsultation({
          token: authStore.token,
          appointment_id: appointment.id
        })
        
        if (activeResponse.code === 200 && activeResponse.session) {
          // 初始化弹窗数据
          consultationDialog.appointment = appointment
          // 使用appointment.id作为sessionId
          consultationDialog.sessionId = appointment.id
          consultationDialog.title = `与 ${appointment.counselorName} 的咨询`
          consultationDialog.activeTab = 'chat' // 默认显示聊天
          consultationDialog.messages = []
          consultationDialog.inputMessage = ''
          consultationDialog.visible = true
          
          // 获取咨询师信息
          await fetchCounselorInfo(appointment.counselorId)
          
          ElMessage.success('已连接到现有咨询会话')
          
          // 获取历史消息
          await fetchDialogMessageHistory()
          
          // 建立WebSocket连接
          await connectWebSocket()
        } else {
          ElMessage.error(activeResponse.message || '获取活跃会话失败')
        }
      } catch (activeError) {

        ElMessage.error(response.message || '开始咨询失败')
      }
    }
  } catch (error) {
    ElMessage.error('开始咨询失败')
  }
}

// 发送消息
const sendMessage = async () => {
  if (!inputMessage.value.trim() || !currentSessionId.value) return
  
  try {
    const response = await sendConsultationMessage({
      token: authStore.token,
      appointment_id: currentSessionId.value,
      message_type: 0, // 文本消息
      content: inputMessage.value
    })
    

    
    // 检查响应结构
    if (response && typeof response === 'object') {
      // 直接检查response.code，因为request.js已经返回了response.data
      if (res.code === 200 || res.code === '200') {
        
        const messageId = res.data.messageId || response.messageId || response.message_id || Date.now().toString()

        
        messages.value.push({
          id: messageId,
          sender_id: userInfo.value.id,
          message_type: 0,
          content: inputMessage.value,
          sent_at: new Date()
        })
        
        inputMessage.value = ''
        scrollToBottom()
        
        
        ElMessage.success(response.message || '消息发送成功')
      } else {

        ElMessage.error(response.message || '发送消息失败')
      }
    } else {

      ElMessage.error('发送消息失败')
    }
  } catch (error) {

    ElMessage.error('发送消息失败')
  }
}

// 发送图片
const sendImage = () => {
  ElMessage.info('图片功能开发中')
}

// 开始视频通话
const startVideoCall = () => {
  if (videoCall.active) {
    ElMessage.warning('视频通话已进行中')
    return
  }
  
  videoCall.active = true
  ElMessage.success('发起视频通话')
  // TODO: 实现WebRTC视频通话
}

// 结束视频通话
const toggleVideo = () => {
  videoCall.active = !videoCall.active
  if (!videoCall.active) {
    // 挂断视频，清理资源
    if (videoCall.localStream) {
      videoCall.localStream.getTracks().forEach(track => track.stop())
    }
    if (videoCall.remoteStream) {
      videoCall.remoteStream.getTracks().forEach(track => track.stop())
    }
    ElMessage.info('视频通话已结束')
  }
}

// 结束咨询
const endConsultation = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要结束咨询吗？',
      '结束咨询',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const response = await endConsultationApi({
      token: authStore.token,
      appointment_id: currentSessionId.value
    })
    
    if (response.code === 200) {
      currentSessionId.value = null
      messages.value = []
      ElMessage.success('咨询已结束')
    } else {
      ElMessage.error(response.message || '结束咨询失败')
    }
  } catch (error) {
    ElMessage.error('结束咨询失败')
  }
}

// 获取消息历史
const fetchMessageHistory = async () => {
  try {
    const response = await getMessageHistory(currentSessionId.value, {
      token: authStore.token,
      page: 1,
      page_size: 50
    })
    
    if (response.code === 200) {
      messages.value = response.messages || []
      scrollToBottom()
    }
  } catch (error) {
    ElMessage.error('获取消息历史失败')
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

// 导航相关函数
const goToHome = () => {
  router.push('/')
}

const goToLogin = () => {
  router.push('/login')
}

const goToProfile = () => {
  router.push('/profile')
}

const goToChat = () => {
  router.push('/chat')
}

// 获取预约列表
const fetchAppointments = async () => {
  try {
    const response = await getUserAppointments(1, 50, 1) // 获取状态为1（已确认）的预约

    if (response.code === 200) {
      // 根据Profile.vue中的实现，数据结构应该是response.data
      appointments.value = response.data || []

    } else {
      ElMessage.error(response.message || '获取预约列表失败')
    }
  } catch (error) {

    ElMessage.error('获取预约列表失败')
  }
}

// 取消预约
const handleCancelAppointment = async (appointment) => {
  try {
    await ElMessageBox.confirm(
      `确定要取消与${appointment.counselorName}的预约吗？`,
      '取消预约',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const response = await cancelAppointment(appointment.id)
    if (response.code === 200) {
      ElMessage.success('预约已取消')
      // 从列表中移除
      const index = appointments.value.findIndex(a => a.id === appointment.id)
      if (index !== -1) {
        appointments.value.splice(index, 1)
      }
      // 如果取消的是当前选中的预约，清空聊天区域
      if (selectedAppointment.value?.id === appointment.id) {
        selectedAppointment.value = null
        messages.value = []
        currentSessionId.value = null
      }
    } else {
      ElMessage.error(response.message || '取消预约失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('取消预约失败')
    }
  }
}

// 关闭弹窗
const handleCloseConsultationDialog = () => {
  // 关闭WebSocket连接
  if (consultationDialog.websocket) {
    consultationDialog.websocket.close()
    consultationDialog.websocket = null
  }
  
  // 结束视频通话
  if (consultationDialog.videoCall.active) {
    stopDialogVideoCall()
  }
  
  // 结束咨询会话
  if (consultationDialog.sessionId) {
    endConsultationApi({
      token: authStore.token,
      appointment_id: consultationDialog.sessionId
    }).catch(error => {

    })
  }
  
  // 重置弹窗数据
  consultationDialog.visible = false
  consultationDialog.appointment = null
  consultationDialog.sessionId = null
  consultationDialog.messages = []
  consultationDialog.inputMessage = ''
}

// 获取弹窗消息历史
const fetchDialogMessageHistory = async () => {
  try {
    // 检查sessionId是否存在
    if (!consultationDialog.sessionId) {
      return
    }
    
    console.log('获取消息历史，会话ID:', consultationDialog.sessionId)
    const response = await getMessageHistory(consultationDialog.sessionId, {
      token: authStore.token,
      page: 1,
      page_size: 50
    })
    
    console.log('消息历史响应:', response)
    
    if (response.code === 200) {
      // 处理历史消息，根据senderId判断消息归属
      const messages = (response.messages || []).map(msg => {
        console.log('处理历史消息:', msg)
        console.log('消息发送者ID:', msg.senderId, '当前用户ID:', userInfo.value?.id)
        return {
          ...msg,
          sender_id: msg.senderId, // 确保字段名一致
          message_type: msg.messageType === 'TEXT' ? 0 : 1, // 转换消息类型
          content: msg.content,
          sent_at: new Date(msg.sentAt)
        }
      })
      
      console.log('处理后的学生端消息列表:', messages)
      consultationDialog.messages = messages
      scrollToDialogBottom()
    }
  } catch (error) {
    ElMessage.error('获取消息历史失败')
  }
}

// 发送弹窗消息
const sendDialogMessage = async () => {
  if (!consultationDialog.inputMessage.trim() || !consultationDialog.sessionId) return
  
  try {
    const response = await sendConsultationMessage({
      token: authStore.token,
      appointment_id: consultationDialog.sessionId,
      message_type: 0, // 文本消息
      content: consultationDialog.inputMessage
    })
    
    if (response.code === 200) {
      // 不在这里添加消息，等待WebSocket接收
      // 这样可以避免重复显示消息
      consultationDialog.inputMessage = ''
    } else {
      ElMessage.error(response.message || '发送消息失败')
    }
  } catch (error) {
    ElMessage.error('发送消息失败')
  }
}

// 弹窗消息滚动到底部
const scrollToDialogBottom = () => {
  nextTick(() => {
    if (dialogMessagesContainer.value) {
      dialogMessagesContainer.value.scrollTop = dialogMessagesContainer.value.scrollHeight
    }
  })
}

// 建立WebSocket连接
const connectWebSocket = async () => {
  try {
    // 获取WebSocket连接参数
    const response = await fetch('/v1/consultation/ws/connect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify({
        token: authStore.token,
        appointment_id: consultationDialog.sessionId
      })
    })
    
    if (!response.ok) {
      throw new Error('WebSocket连接失败')
    }
    
    const data = await response.json()
    
    // 建立WebSocket连接
    // 直接连接到WebSocket端点，使用token和appointment_id作为参数
    const wsUrl = `ws://localhost:8003/v1/consultation/ws?token=${authStore.token}&appointment_id=${consultationDialog.sessionId}`
    consultationDialog.websocket = new WebSocket(wsUrl)
    
    consultationDialog.websocket.onopen = () => {

    }
    
    consultationDialog.websocket.onmessage = (event) => {
        const message = JSON.parse(event.data)
        console.log('WebSocket收到消息:', message)
        
        if (message.type === 1) { // WS_MESSAGE
          // 如果userInfo.value不存在，使用本地存储的用户ID
          if (!userInfo.value) {
            console.log('userInfo.value不存在，使用本地存储的用户ID')
            // 从localStorage获取用户ID
            const token = localStorage.getItem('vue3project_token')
            if (token) {
              try {
                // 解析token获取用户ID
                const tokenParts = token.split('.')
                if (tokenParts.length === 3) {
                  const payload = JSON.parse(atob(tokenParts[1]))
                  const currentUserId = String(payload.user_id || payload.sub || payload.userId)
                  console.log('从token解析的用户ID:', currentUserId)
                  
                  // 添加消息
                  const senderId = message.sender_id || message.senderId
                  const msgSenderId = String(senderId)
                  
                  consultationDialog.messages.push({
                    id: message.id || Date.now(),
                    sender_id: msgSenderId,
                    message_type: 0,
                    content: message.content,
                    sent_at: new Date(message.timestamp)
                  })
                  
                  scrollToDialogBottom()
                  return // 提前返回，避免执行下面的代码
                }
              } catch (error) {
                console.error('解析token失败:', error)
              }
            }
          }
          
          // 添加所有接收到的消息，包括自己发送的消息
          // 这样可以确保消息只显示一次
          // 确保sender_id正确设置
          const senderId = message.sender_id || message.senderId
          console.log('当前userInfo对象:', userInfo.value)
          console.log('当前用户ID:', userInfo.value?.id)
          console.log('当前用户ID类型:', typeof userInfo.value?.id)
          console.log('消息发送者ID:', senderId)
          console.log('消息发送者ID类型:', typeof senderId)
          
          // 确保类型一致，都转换为字符串
          const currentUserId = String(userInfo.value?.id)
          const messageSenderId = String(senderId)
          
          console.log('转换后的当前用户ID:', currentUserId)
          console.log('转换后的消息发送者ID:', messageSenderId)
          console.log('是否为当前用户发送的消息:', currentUserId === messageSenderId)
        // 添加所有接收到的消息，包括自己发送的消息
          // 这样可以确保消息只显示一次
          // 确保sender_id正确设置
          const msgSenderId = message.sender_id || message.senderId
          console.log('当前userInfo对象:', userInfo.value)
          console.log('当前用户ID:', userInfo.value?.id)
          console.log('当前用户ID类型:', typeof userInfo.value?.id)
          console.log('消息发送者ID:', msgSenderId)
          console.log('消息发送者ID类型:', typeof msgSenderId)
          
          // 确保类型一致，都转换为字符串
          const msgCurrentUserId = String(userInfo.value?.id)
          const normalizedSenderId = String(msgSenderId)
          
          console.log('转换后的当前用户ID:', msgCurrentUserId)
          console.log('转换后的消息发送者ID:', normalizedSenderId)
          console.log('是否为当前用户发送的消息:', msgCurrentUserId === normalizedSenderId)
          
          consultationDialog.messages.push({
            id: message.id || Date.now(),
            sender_id: normalizedSenderId, // 使用转换后的ID
            message_type: 0,
            content: message.content,
            sent_at: new Date(message.timestamp)
          })
          
          scrollToDialogBottom()
      } else if (message.type === 4) { // WS_VIDEO_OFFER
        // 处理视频通话请求
        handleVideoOffer(message)
      }
    }
    
    consultationDialog.websocket.onclose = () => {

    }
    
    consultationDialog.websocket.onerror = (error) => {

    }
  } catch (error) {

  }
}

// 切换弹窗视频通话
const toggleDialogVideoCall = async () => {
  if (consultationDialog.videoCall.active) {
    // 结束视频通话
    stopDialogVideoCall()
  } else {
    // 开始视频通话
    await startDialogVideoCall()
  }
}

// 开始弹窗视频通话
const startDialogVideoCall = async () => {
  try {
    // 获取本地媒体流
    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    })
    
    // 显示本地视频
    if (dialogLocalVideo.value) {
      dialogLocalVideo.value.srcObject = localStream
    }
    
    // 创建WebRTC连接
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
      ]
    })
    
    // 添加本地流
    localStream.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStream)
    })
    
    // 处理远程流
    peerConnection.ontrack = (event) => {
      if (dialogRemoteVideo.value) {
        dialogRemoteVideo.value.srcObject = event.streams[0]
      }
      consultationDialog.videoCall.remoteStream = event.streams[0]
    }
    
    // 处理ICE候选
    peerConnection.onicecandidate = (event) => {
      if (event.candidate && consultationDialog.websocket) {
        consultationDialog.websocket.send(JSON.stringify({
          type: 5, // WS_ICE_CANDIDATE
          session_id: consultationDialog.sessionId,
          sender_id: userInfo.value.id,
          content: JSON.stringify(event.candidate),
          timestamp: new Date().toISOString()
        }))
      }
    }
    
    // 创建offer
    const offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)
    
    // 发送offer
    if (consultationDialog.websocket) {
      consultationDialog.websocket.send(JSON.stringify({
        type: 4, // WS_VIDEO_OFFER
        session_id: consultationDialog.sessionId,
        sender_id: userInfo.value.id,
        content: JSON.stringify(offer),
        timestamp: new Date().toISOString()
      }))
    }
    
    // 更新状态
    consultationDialog.videoCall.active = true
    consultationDialog.videoCall.localStream = localStream
    consultationDialog.videoCall.peerConnection = peerConnection
    
    ElMessage.success('视频通话已发起')
  } catch (error) {

    ElMessage.error('发起视频通话失败')
  }
}

// 停止弹窗视频通话
const stopDialogVideoCall = () => {
  if (consultationDialog.videoCall.localStream) {
    consultationDialog.videoCall.localStream.getTracks().forEach(track => track.stop())
    consultationDialog.videoCall.localStream = null
  }
  
  if (consultationDialog.videoCall.peerConnection) {
    consultationDialog.videoCall.peerConnection.close()
    consultationDialog.videoCall.peerConnection = null
  }
  
  if (dialogLocalVideo.value) {
    dialogLocalVideo.value.srcObject = null
  }
  
  if (dialogRemoteVideo.value) {
    dialogRemoteVideo.value.srcObject = null
  }
  
  consultationDialog.videoCall.active = false
  consultationDialog.videoCall.remoteStream = null
  
  // 通知对方结束通话
  if (consultationDialog.websocket) {
    consultationDialog.websocket.send(JSON.stringify({
      type: 6, // WS_LEAVE
      session_id: consultationDialog.sessionId,
      sender_id: userInfo.value.id,
      content: '视频通话已结束',
      timestamp: new Date().toISOString()
    }))
  }
  
  ElMessage.info('视频通话已结束')
}

// 处理视频通话请求
const handleVideoOffer = async (message) => {
  try {
    // 切换到视频标签
    consultationDialog.activeTab = 'video'
    
    // 获取本地媒体流
    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    })
    
    // 显示本地视频
    if (dialogLocalVideo.value) {
      dialogLocalVideo.value.srcObject = localStream
    }
    
    // 创建WebRTC连接
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
      ]
    })
    
    // 添加本地流
    localStream.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStream)
    })
    
    // 处理远程流
    peerConnection.ontrack = (event) => {
      if (dialogRemoteVideo.value) {
        dialogRemoteVideo.value.srcObject = event.streams[0]
      }
      consultationDialog.videoCall.remoteStream = event.streams[0]
    }
    
    // 处理ICE候选
    peerConnection.onicecandidate = (event) => {
      if (event.candidate && consultationDialog.websocket) {
        consultationDialog.websocket.send(JSON.stringify({
          type: 5, // WS_ICE_CANDIDATE
          session_id: consultationDialog.sessionId,
          sender_id: userInfo.value.id,
          content: JSON.stringify(event.candidate),
          timestamp: new Date().toISOString()
        }))
      }
    }
    
    // 设置远程描述
    const offer = JSON.parse(message.content)
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
    
    // 创建answer
    const answer = await peerConnection.createAnswer()
    await peerConnection.setLocalDescription(answer)
    
    // 发送answer
    if (consultationDialog.websocket) {
      consultationDialog.websocket.send(JSON.stringify({
        type: 5, // WS_VIDEO_ANSWER
        session_id: consultationDialog.sessionId,
        sender_id: userInfo.value.id,
        content: JSON.stringify(answer),
        timestamp: new Date().toISOString()
      }))
    }
    
    // 更新状态
    consultationDialog.videoCall.active = true
    consultationDialog.videoCall.localStream = localStream
    consultationDialog.videoCall.peerConnection = peerConnection
    
    ElMessage.info('视频通话已接通')
  } catch (error) {

    ElMessage.error('接听视频通话失败')
  }
}

// 初始化
onMounted(async () => {
  await fetchAppointments()
})
</script>

<style scoped lang="scss">

/* 导航栏样式 */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow-x: hidden;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
}

.logo {
  cursor: pointer;
}

.logo h1 {
  margin: 0;
  font-size: 24px;
  color: var(--primary-color);
  transition: color 0.3s;
}

.logo:hover h1 {
  color: var(--primary-color);
  opacity: 0.8;
}

.nav-menu {
  display: flex;
  gap: 30px;
}

.nav-link {
  text-decoration: none;
  color: var(--text-color);
  font-weight: 500;
  transition: color 0.3s;
  cursor: pointer;
}

.nav-link:hover {
  color: var(--primary-color);
}

.nav-actions {
  display: flex;
  gap: 15px;
}

/* 新导航栏样式 */
.nav-bg {
  font-family: Arial, 'Microsoft Yahei', 'Helvetica Neue', Helvetica, 'Lucida Grande', 'Hiragino Sans GB', 'WenQuanYi Micro Hei', STHeiti, SimSun, sans-serif;
  font-size: 14px;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
  list-style: none;
  margin: 0;
  padding: 0;
  text-align: justify;
  background: #70ba96;
  height: 50px;
}

.nav ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  flex-wrap: nowrap;
  justify-content: center;
  gap: 45px;
}

.nav li {
  height: 100%;
  display: flex;
  align-items: center;
  min-width: 100px;
  white-space: nowrap;
}

/* 新导航栏里面的功能样式 */
.nav-bg a {
  font-family: Arial, 'Microsoft Yahei', 'Helvetica Neue', Helvetica, 'Lucida Grande', 'Hiragino Sans GB', 'WenQuanYi Micro Hei', STHeiti, SimSun, sans-serif;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
  list-style: none;
  text-align: center;
  font-size: 17px;
  line-height: 50px;
  background-color: transparent;
  text-decoration: none;
  color: #fff;
  display: block;
  position: relative;
}

.nav-bg a:hover {
  color: #f0f0f0;
  text-decoration: underline;
}

.nav-bg a.router-link-active {
  color: #f0f0f0;
  font-weight: bold;
}

/* 主要内容样式 */
main {
  padding-top: 120px;
  height: auto;
  min-height: calc(100vh - 120px);
  overflow-x: hidden;
  box-sizing: border-box;
  margin: 0;
  padding-bottom: 0;
  max-width: 100%;
  width: 100%;
}

.consultation-container {
  display: flex;
  height: calc(100vh - 120px);
  background-color: var(--background-color);
  
  .chat-main {
    flex: 1;
    min-width: 0; /* 防止flex子元素溢出 */
  }
}

/* 左侧预约列表 */
.appointment-list {
  width: 1040px; /* 520px * 2 = 1040px，增加按钮所在表格的长度为原来2倍 */
  background-color: var(--secondary-color);
  border-right: 1px solid var(--border-light);
  display: flex;
  flex-direction: column;
  
  .list-header {
    padding: 24px; /* 16px * 1.5 = 24px */
    border-bottom: 1px solid var(--border-light);
    
    h3 {
      margin: 0;
      font-size: 24px; /* 16px * 1.5 = 24px */
      font-weight: 500;
      color: var(--text-color);
    }
  }
  
  .appointment-items {
    flex: 1;
    overflow-y: auto;
    padding: 24px; /* 16px * 1.5 = 24px */
  }
  
  .appointment-table {
    width: 100%;
    border-collapse: collapse;
    
    .appointment-table-content {
      width: 100%;
      border-collapse: collapse;
      
      th {
        background-color: #f5f7fa;
        padding: 18px 8px; /* 12px * 1.5 = 18px */
        text-align: center;
        font-weight: 500;
        font-size: 18px; /* 增大字体 */
        color: var(--text-color);
        border: 1px solid #000; /* 黑色边框 */
        white-space: nowrap;
      }
      
      td {
        padding: 18px 8px; /* 12px * 1.5 = 18px */
        text-align: center;
        font-size: 16px; /* 增大字体 */
        border: 1px solid #000; /* 黑色边框 */
        white-space: nowrap;
      }
    }
    
    .appointment-row {
      cursor: pointer;
      transition: background-color 0.3s;
      
      &:hover {
        background-color: var(--hover-color);
      }
      
      &.active {
        background-color: var(--primary-color);
        color: white;
        
        td {
          border-color: var(--primary-color);
        }
      }
    }
  }
  
  .no-appointments {
    padding: 30px; /* 20px * 1.5 = 30px */
    text-align: center;
    color: #999;
    font-size: 18px; /* 增大字体 */
  }
}

/* 右侧聊天区域 */
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
    
    .appointment-info {
          display: flex;
          align-items: center;
          padding: 24px; /* 增大内边距 */
          
          .appointment-details {
            .appointment-name {
              font-size: 20px; /* 16px * 1.25 = 20px */
              font-weight: 500;
            }
            
            .appointment-time {
              font-size: 18px; /* 14px * 1.28 = 18px */
              color: var(--text-secondary);
            }
          }
        }
  }
  
  .chat-messages {
        flex: 1;
        padding: 30px; /* 20px * 1.5 = 30px */
        overflow-y: auto;
        
        .message-item {
          margin-bottom: 30px; /* 20px * 1.5 = 30px */
          
          &.user {
            display: flex;
            justify-content: flex-end;
            
            .message-bubble {
              max-width: 60%; /* 减少宽度，减少右边空白 */
              display: flex;
              align-items: center;
              justify-content: center; /* 文字居中 */
              
              .message-content {
                background-color: #70ba96;
                color: white;
                border-radius: 12px; /* 8px * 1.5 = 12px */
                padding: 15px 22px; /* 10px 15px * 1.5 = 15px 22px */
                
                .message-text {
                  margin-bottom: 8px; /* 5px * 1.6 = 8px */
                  font-size: 16px; /* 增大字体 */
                }
                
                .message-time {
                  font-size: 14px; /* 12px * 1.17 = 14px */
                  text-align: right;
                  opacity: 0.7;
                }
              }
              
              .avatar {
                margin-left: 18px; /* 12px * 1.5 = 18px */
                order: 2;
              }
            }
          }
          
          &.counselor {
            display: flex;
            justify-content: flex-start;
            
            .message-bubble {
              max-width: 70%;
              display: flex;
              align-items: center;
              
              .message-content {
                background-color: var(--secondary-color);
                color: var(--text-color);
                border-radius: 12px; /* 8px * 1.5 = 12px */
                padding: 15px 22px; /* 10px 15px * 1.5 = 15px 22px */
                
                .message-text {
                  margin-bottom: 8px; /* 5px * 1.6 = 8px */
                  font-size: 16px; /* 增大字体 */
                }
                
                .message-time {
                  font-size: 14px; /* 12px * 1.17 = 14px */
                  text-align: right;
                  opacity: 0.7;
                }
              }
              
              .avatar {
                margin-right: 18px; /* 12px * 1.5 = 18px */
              }
            }
          }
        }
  }
  
  .video-call-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background-color: var(--secondary-color);
    border-radius: 8px;
    margin-bottom: 20px;
    
    .video-local, .video-remote {
      width: 200px;
      height: 150px;
      background-color: #000;
      border-radius: 8px;
      position: relative;
      
      video {
        width: 100%;
        height: 100%;
        border-radius: 8px;
        object-fit: cover;
      }
      
      .video-info {
        position: absolute;
        bottom: 10px;
        left: 10px;
        background-color: rgba(0, 0, 0, 0.5);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
      }
    }
    
    .video-controls {
      display: flex;
      justify-content: center;
      margin-top: 10px;
    }
  }
  
  .start-consultation {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
  }
  
  .chat-input {
        padding: 24px 30px; /* 16px 20px * 1.5 = 24px 30px */
        border-top: 1px solid var(--border-light);
        
        .el-textarea {
          margin-bottom: 18px; /* 12px * 1.5 = 18px */
          font-size: 16px; /* 增大字体 */
        }
        
        .input-actions {
          display: flex;
          gap: 15px; /* 10px * 1.5 = 15px */
          justify-content: center;
        }
      }
}

/* 弹窗样式 */
.consultation-dialog {
  .el-dialog__body {
    padding: 0;
  }
  
  .consultation-tabs {
    padding: 15px 20px 0;
    border-bottom: 1px solid #eee;
    
    .tab-button {
      margin-right: 10px;
    }
  }
  
  .chat-content {
    height: 900px;
    display: flex;
    flex-direction: column;
    
    .chat-header {
      padding: 15px 20px;
      border-bottom: 1px solid #eee;
      background-color: #f8f9fa;
      
      .appointment-info {
        display: flex;
        align-items: center;
        
        .appointment-details {
          margin-left: 15px;
          
          .appointment-name {
          font-size: 27px;
          font-weight: 600;
          color: #333;
        }
        }
      }
    }
    
    .chat-messages {
      flex: 1;
      padding: 30px;
      overflow-y: auto;
      background-color: #f5f7fa;
      
      .message-item {
        margin-bottom: 20px;
        
        .counselor-message {
          display: flex;
          align-items: flex-start;
          
          .message-avatar {
            margin-right: 12px;
            flex-shrink: 0;
          }
          
          .message-bubble {
            max-width: 70%;
            
            .message-content {
                background-color: white;
                color: #333;
                border-radius: 27px 27px 27px 6px;
                padding: 18px 24px;
                box-shadow: 0 1.5px 3px rgba(0, 0, 0, 0.1);
                margin-bottom: 7.5px;
                word-wrap: break-word;
                line-height: 1.5;
                font-size: 18px;
              }
            
            .message-time {
              font-size: 12px;
              color: #999;
              padding-left: 5px;
            }
          }
        }
        
        .user-message {
          display: flex;
          align-items: flex-start;
          justify-content: flex-end;
          
          .message-bubble {
            max-width: 60%; /* 减少宽度，减少右边空白 */
            display: flex;
            align-items: center;
            justify-content: center; /* 文字居中 */
            
            .message-content {
                background-color: #70ba96;
                color: white;
                border-radius: 27px 27px 6px 27px;
                padding: 18px 24px;
                box-shadow: 0 1.5px 3px rgba(0, 0, 0, 0.1);
                margin-bottom: 7.5px;
                font-size: 18px;
              word-wrap: break-word;
              line-height: 1.5;
            }
            
            .message-time {
              font-size: 18px;
              color: #999;
              text-align: right;
              padding-right: 7.5px;
            }
          }
          
          .message-avatar {
            margin-left: 12px;
            flex-shrink: 0;
          }
        }
      }
    }
    
    .chat-input {
      padding: 22.5px 30px;
      border-top: 1px solid #eee;
      background-color: white;
      
      .input-container {
        display: flex;
        align-items: flex-end;
        gap: 15px;
        
        .el-textarea {
          flex: 1;
          
          :deep(.el-textarea__inner) {
            border-radius: 27px;
            padding: 15px 22.5px;
            resize: none;
            font-size: 21px;
            line-height: 1.5;
          }
        }
        
        .send-button {
          height: 60px;
          border-radius: 30px;
          padding: 0 30px;
          font-weight: 500;
          font-size: 18px;
        }
      }
    }
  }
  
  .video-content {
    height: 750px;
    
    .video-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      
      .video-local, .video-remote {
        flex: 1;
        position: relative;
        background-color: #000;
        
        video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .video-info {
          position: absolute;
          bottom: 10px;
          left: 10px;
          background-color: rgba(0, 0, 0, 0.5);
          color: white;
          padding: 5px 10px;
          border-radius: 4px;
          font-size: 14px;
        }
      }
      
      .video-local {
        height: 300px;
      }
      
      .video-remote {
        flex: 1;
        min-height: 300px;
      }
      
      .video-controls {
        padding: 22.5px;
        text-align: center;
        border-top: 1px solid #eee;
      }
    }
  }
}
</style>

<style scoped lang="scss">
/* 头像样式 */
.avatar-container {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.counselor-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.message-avatar-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}
</style>