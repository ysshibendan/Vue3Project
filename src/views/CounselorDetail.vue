<template>
  <div class="counselor-detail-page">
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
          </ul>
        </div>
      </div>
    </header>

    <!-- 咨询师详细信息 -->
    <div class="counselor-detail-section">
      <div class="container">
        <div class="counselor-info-container">
          <!-- 左边：咨询师头像 -->
          <div class="counselor-avatar-section">
            <div class="counselor-avatar-large">
              <img :src="getCounselorAvatar(counselor.userInfo?.avatar || counselor.avatar)" :alt="counselor.userInfo?.realName || counselor.realName" />
            </div>
          </div>
          
          <!-- 右边：咨询师信息 -->
          <div class="counselor-info-section">
            <!-- 姓名和年限 -->
            <div class="counselor-header">
              <h1 class="counselor-name">{{ counselor.userInfo?.realName || counselor.realName || '' }}老师</h1>
              <span class="counselor-experience">{{ (counselor.counselorInfo?.workExperience || counselor.workExperience) || 0 }}年经验</span>
            </div>
            
            <!-- 简历 -->
            <div class="counselor-resume">
              <h3>专业介绍</h3>
              <p class="specialty"><strong>擅长领域：</strong>{{ counselor.counselorInfo?.specialty || counselor.specialty || '' }}</p>
              <p class="introduction">{{ counselor.counselorInfo?.introduction || counselor.introduction || '' }}</p>
            </div>
            
            <!-- 点击咨询按钮 -->
            <div class="consult-button-container">
              <button class="consult-button" @click="startConsultation">
                <span>点击咨询</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import { useAuthStore } from '@/store/auth'
import request from '@/utils/request'
import { ElMessage, ElMessageBox } from 'element-plus'


const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const counselor = ref({})
const counselorId = ref(route.params.id)

const isAuthenticated = computed(() => authStore.isAuthenticated)

// 获取咨询师头像
const getCounselorAvatar = (avatar) => {
  if (!avatar || avatar.trim() === '') {
    return '/src/assets/images/head.webp'
  }
  
  // 如果是相对路径，则从assets/images获取
  if (avatar.startsWith('/') || !avatar.startsWith('http')) {
    const fileName = avatar.replace(/^\//, '')
    return `/src/assets/images/${fileName}`
  }
  
  return avatar
}

// 获取咨询师详情 - 从路由参数获取ID，然后从列表中找到对应咨询师
const fetchCounselorDetail = async () => {
  try {
    counselorId.value = route.params.id
    console.log('路由参数ID:', counselorId.value)
    
    if (!counselorId.value) {
      console.error('咨询师ID为空')
      return
    }
    
    // 尝试从本地存储获取咨询师列表
    const counselorsList = JSON.parse(localStorage.getItem('counselors_list') || '[]')
    console.log('本地存储的咨询师列表:', counselorsList)
    
    // 在列表中查找对应ID的咨询师
    const foundCounselor = counselorsList.find(c => c.id === counselorId.value || c.userInfo?.id === counselorId.value)
    
    if (foundCounselor) {
      counselor.value = foundCounselor
      console.log('找到咨询师:', counselor.value)
    } else {
      // 如果本地找不到，再尝试API请求
      const token = localStorage.getItem('vue3project_token')
      const data = await request({
        url: `/api/counselor/${counselorId.value}`,
        method: 'GET',
        params: { token }
      })
      
      if (data && data.code === 200) {
        counselor.value = data.data || {}
      }
    }
  } catch (error) {
    console.error('获取咨询师详情失败:', error)
  }
}

// 开始咨询 - 显示预约时间选择
const startConsultation = async () => {
  if (!isAuthenticated.value) {
    router.push('/login')
    return
  }
  
  try {
    // 获取未来7天的可预约时间
    const today = new Date()
    const endDate = new Date()
    endDate.setDate(today.getDate() + 7)
    
    const dateFormat = (date) => date.toISOString().split('T')[0]
    
    const response = await request({
      url: '/api/appointment/available',
      method: 'get',
      params: {
        token: localStorage.getItem('vue3project_token'),
        counselor_id: counselorId.value,
        start_date: dateFormat(today),
        end_date: dateFormat(endDate)
      }
    })
    
    if (response.code === 200 && response.data) {
      // 显示预约时间选择对话框
      showAppointmentDialog(response.data)
    } else {
      ElMessage.error('获取可预约时间失败')
    }
  } catch (error) {
    console.error('获取可预约时间失败:', error)
    ElMessage.error('获取可预约时间失败')
  }
}

// 显示预约时间选择对话框
const showAppointmentDialog = (availableSlots) => {
  console.log('可预约时间段数据:', availableSlots)
  
  // 检查数据格式
  if (!Array.isArray(availableSlots) || availableSlots.length === 0) {
    ElMessage.warning('该咨询师暂无可用预约时间')
    return
  }
  
  // 按日期分组可预约时间段
  const slotsByDate = {}
  availableSlots.forEach(slot => {
    if (!slotsByDate[slot.date]) {
      slotsByDate[slot.date] = []
    }
    slotsByDate[slot.date].push(slot)
  })
  
  console.log('按日期分组后的数据:', slotsByDate)
  
  // 生成日期选项
  const dateOptions = Object.keys(slotsByDate).sort().map(date => ({
    label: `${date} (${getDayOfWeek(date)})`,
    value: date
  }))
  
  // 创建弹窗内容
  const dialogContent = `
    <div class="appointment-dialog-content" style="min-width: 400px;">
      <div class="date-selection">
        <label style="display: block; margin-bottom: 10px; font-weight: bold;">选择预约日期：</label>
        <select id="appointmentDate" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 20px;">
          <option value="">请选择日期</option>
          ${dateOptions.map(option => `<option value="${option.value}">${option.label}</option>`).join('')}
        </select>
      </div>
      
      <div class="time-slots" id="timeSlotsContainer" style="max-height: 300px; overflow-y: auto; border: 1px solid #eee; border-radius: 4px; padding: 15px;">
        <p style="color: #666; text-align: center; margin: 0;">请先选择日期</p>
      </div>
    </div>
  `
  
  ElMessageBox.confirm(
    dialogContent,
    '选择预约时间',
    {
      confirmButtonText: '确认预约',
      cancelButtonText: '取消',
      showClose: true,
      closeOnClickModal: true,
      closeOnPressEscape: true,
      customClass: 'appointment-dialog',
      dangerouslyUseHTMLString: true,
      beforeClose: async (action, instance, done) => {
        if (action === 'confirm') {
          const selectedDate = document.getElementById('appointmentDate')?.value
          const selectedSlot = document.querySelector('input[name="timeSlot"]:checked')
          
          if (!selectedDate) {
            ElMessage.warning('请选择预约日期')
            return false
          }
          
          if (!selectedSlot) {
            ElMessage.warning('请选择预约时间段')
            return false
          }
          
          const availabilityId = selectedSlot.value
          const selectedSlotInfo = availableSlots.find(slot => slot.availabilityId == availabilityId)
          
          try {
            const response = await request({
              url: '/api/appointment',
              method: 'post',
              data: {
                token: localStorage.getItem('vue3project_token'),
                counselor_id: counselorId.value,
                availability_id: availabilityId,
                appointment_date: selectedDate
              }
            })
            
            if (response.code === 200) {
              ElMessage.success('预约成功！')
              done()
            } else {
              ElMessage.error(response.message || '预约失败')
              return false
            }
          } catch (error) {
            console.error('预约失败:', error)
            ElMessage.error('预约失败')
            return false
          }
        } else {
          done()
        }
      }
    }
  ).then(() => {
    // 预约成功后的处理
  }).catch(() => {
    // 用户取消预约
  })
  
  // 添加日期选择变化监听
  setTimeout(() => {
    const dateSelect = document.getElementById('appointmentDate')
    const timeSlotsContainer = document.getElementById('timeSlotsContainer')
    
    if (!dateSelect || !timeSlotsContainer) {
      console.error('弹窗元素未找到')
      return
    }
    
    dateSelect.addEventListener('change', (e) => {
      const selectedDate = e.target.value
      console.log('选择的日期:', selectedDate)
      
      if (selectedDate) {
        const slotsForDate = slotsByDate[selectedDate] || []
        console.log('对应日期的时间段:', slotsForDate)
        
        if (slotsForDate.length === 0) {
          timeSlotsContainer.innerHTML = '<p style="color: #666; text-align: center; margin: 0;">该日期暂无可用时间段</p>'
        } else {
          const timeSlotsHTML = `
            <div class="time-slots-grid">
              <h4 style="margin-bottom: 15px; margin-top: 0;">可预约时间段：</h4>
              <div class="slots-list">
                ${slotsForDate.map(slot => {
                  const isAvailable = slot.isAvailable !== false
                  const remaining = slot.maxAppointments - slot.bookedCount
                  return `
                    <div class="slot-item ${isAvailable ? 'available' : 'unavailable'}" 
                         style="margin-bottom: 10px; padding: 12px; border: 1px solid #ddd; border-radius: 4px; cursor: ${isAvailable ? 'pointer' : 'not-allowed'}; background-color: ${isAvailable ? '#f8f9fa' : '#f5f5f5'};">
                      <label style="display: flex; align-items: center; cursor: ${isAvailable ? 'pointer' : 'not-allowed'};">
                        <input type="radio" name="timeSlot" value="${slot.availabilityId}" ${!isAvailable ? 'disabled' : ''} style="margin-right: 10px;">
                        <div style="flex: 1;">
                          <div style="font-weight: bold; color: ${isAvailable ? '#333' : '#999'};">${slot.startTime} - ${slot.endTime}</div>
                          <div style="font-size: 12px; color: ${isAvailable ? '#666' : '#999'};">
                            ${isAvailable ? 
                              `剩余 ${remaining} 个名额` : 
                              '已满'
                            }
                          </div>
                        </div>
                      </label>
                    </div>
                  `
                }).join('')}
              </div>
            </div>
          `
          timeSlotsContainer.innerHTML = timeSlotsHTML
        }
      } else {
        timeSlotsContainer.innerHTML = '<p style="color: #666; text-align: center; margin: 0;">请先选择日期</p>'
      }
    })
    
    // 默认选择第一个日期
    if (dateOptions.length > 0) {
      dateSelect.value = dateOptions[0].value
      dateSelect.dispatchEvent(new Event('change'))
    }
  }, 100)
}

// 获取星期几
const getDayOfWeek = (dateString) => {
  try {
    const date = new Date(dateString)
    const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    return days[date.getDay()]
  } catch (error) {
    console.error('日期解析错误:', error)
    return '未知'
  }
}

// 导航功能
const goToHome = () => {
  router.push('/')
}

const goToProfile = () => {
  router.push('/profile')
}

const goToChat = () => {
  router.push('/chat')
}

const goToLogin = () => {
  router.push('/login')
}

onMounted(() => {
  fetchCounselorDetail()
})
</script>

<style scoped>
.counselor-detail-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-top: 0;
}

/* 导航栏样式 */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;
}

.logo h1 {
  font-size: 24px;
  color: #333;
  margin: 0;
  cursor: pointer;
}

.nav-actions {
  display: flex;
  gap: 10px;
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

/* 咨询师详细信息样式 */
.counselor-detail-section {
  padding-top: 140px; /* 导航栏高度 + 偏移 */
  min-height: calc(100vh - 140px);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.counselor-info-container {
  display: flex;
  gap: 40px;
  align-items: flex-start;
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.counselor-avatar-section {
  flex-shrink: 0;
}

.counselor-avatar-large {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #f0f0f0;
}

.counselor-avatar-large img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.counselor-info-section {
  flex: 1;
}

.counselor-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.counselor-name {
  font-size: 32px;
  color: #333;
  margin: 0;
  font-weight: bold;
}

.counselor-experience {
  background: #007bff;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.counselor-resume {
  margin-bottom: 40px;
}

.counselor-resume h3 {
  font-size: 20px;
  color: #333;
  margin-bottom: 15px;
  font-weight: 600;
}

.counselor-resume p {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 10px;
}

.counselor-resume .specialty {
  font-weight: 500;
  color: #333;
}

/* 咨询按钮样式（复用轮播图按钮样式） */
.consult-button-container {
  text-align: left;
}

.consult-button {
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  border: none;
  padding: 15px 40px;
  border-radius: 30px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
}

.consult-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4);
}

.consult-button:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .counselor-info-container {
    flex-direction: column;
    text-align: center;
    gap: 30px;
  }
  
  .counselor-header {
    flex-direction: column;
    gap: 10px;
  }
  
  .consult-button-container {
    text-align: center;
  }
}
</style>