<template>
  <div class="counselors-page">
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
    
    <!-- 顶部轮播图 -->
    <div class="banner-section">
      <img src="/src/assets/images/轮播图3.jpg" alt="心理咨询师轮播图" class="banner-image" />
    </div>
    
    <!-- 咨询师列表 -->
    <div class="counselors-section">
      <div class="container">
        <h2 class="section-title">专业心理咨询师团队</h2>
        <div class="counselors-grid">
          <div 
          v-for="counselor in counselors" 
            :key="counselor.userInfo.id"  
            class="counselor-card"
            @click="goToCounselorDetail(counselor.userInfo.id)"  
            @mouseenter="() => handleCounselorHover(counselor.userInfo.id)"
            @mouseleave="handleCounselorLeave"
          >
            <!-- 咨询师头像 -->
            <div class="counselor-avatar">
              <img :src="getCounselorAvatar(counselor.userInfo?.avatar || counselor.avatar)" :alt="counselor.userInfo?.realName || counselor.realName" />
            </div>
            
            <!-- 咨询师信息 -->
            <div 
              class="counselor-info" 
              :class="{ 'hovered': hoveredCounselor === counselor.userInfo.id }"            >
              <!-- 基本信息 -->
              <div class="counselor-basic">
                <span>{{ counselor.userInfo?.realName || counselor.realName || '' }}老师</span>
                <span class="divider" v-if="(counselor.userInfo?.realName || counselor.realName) && (counselor.counselorInfo?.workExperience || counselor.workExperience)">|</span>
                <span>{{ (counselor.counselorInfo?.workExperience || counselor.workExperience) ? (counselor.counselorInfo?.workExperience || counselor.workExperience) + '年经验老师' : '' }}</span>
              </div>
              
              <!-- 详细信息 -->
              <div class="counselor-detail">
                <p><strong>擅长领域：</strong>{{ counselor.counselorInfo?.specialty || counselor.specialty || '' }}</p>
                <p><strong>简介：</strong>{{ counselor.counselorInfo?.introduction || counselor.introduction || '' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)

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
import { ref, onMounted } from 'vue'
import request from '@/utils/request'

// 咨询师列表
const counselors = ref([])
const hoveredCounselor = ref(null)

// 获取咨询师头像
const getCounselorAvatar = (avatar) => {
  if (!avatar || avatar.trim() === '') {
    return '/images/head.webp'
  }
  
  // 如果是相对路径，则从assets/images获取
  if (avatar.startsWith('/') || !avatar.startsWith('http')) {
    const fileName = avatar.replace(/^\//, '')
    return `/src/assets/images/${fileName}`
  }
  
  return avatar
}

// 处理鼠标悬停
const handleCounselorHover = (counselorId) => {
  hoveredCounselor.value = counselorId
}

const handleCounselorLeave = () => {
  hoveredCounselor.value = null
}
// 跳转到咨询师详情页
// 跳转到咨询师详情页
const goToCounselorDetail = (counselorId) => {
  console.log('点击咨询师，ID:', counselorId)
  if (counselorId) {
    // 保存咨询师列表到本地存储，供详情页使用
    localStorage.setItem('counselors_list', JSON.stringify(counselors.value))
    router.push(`/counselor/${counselorId}`)
  } else {
    console.error('咨询师ID为空，无法跳转')
  }
}
// 获取咨询师列表
const fetchCounselors = async () => {
  try {
    const token = localStorage.getItem('vue3project_token')
    const data = await request({
      url: '/api/counselor/list',
      method: 'GET',
      params: {
        token: token,
        status: -1,
        is_available: 1,
        page: 1,
        page_size: 50
      }
    })
    
    if (data && data.code === 200) {
      counselors.value = data.data || []
    }
  } catch (error) {
    console.error('获取咨询师列表失败:', error)
  }
}

onMounted(() => {
  fetchCounselors()
})
</script>

<style scoped>
.counselors-page {
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

/* 轮播图需要向下偏移导航栏高度 */
.banner-section {
  margin-top: 115px; /* 60px + 50px = 110px */
}

/* 轮播图样式 */
.banner-section {
  width: 100%;
  height: 380px; /* 400px - 20px = 380px */
  overflow: hidden;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 咨询师列表样式 */
.counselors-section {
  padding: 50px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-title {
  text-align: center;
  font-size: 32px;
  color: #333;
  margin-bottom: 40px;
  font-weight: bold;
}

.counselors-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

/* 咨询师卡片样式（复用Home.vue的样式） */
.counselor-card {
  position: relative;
  width: 100%;
  height: 300px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  cursor: pointer;
}

.counselor-card:hover {
  transform: translateY(-5px);
}

.counselor-avatar {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.counselor-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.counselor-info {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  height: 28px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  transition: all 0.3s ease;
  color: #333;
  z-index: 2;
  overflow: hidden;
  padding-left: 10px;
}

.counselor-info.hovered {
  height: 180px;
  transform: translateY(0px);
  background-color: rgba(255, 255, 255, 0.95);
}

.counselor-basic {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  text-align: left;
  padding-left: 10px;
}

.counselor-basic span:first-child {
  font-size: 20px;
  font-weight: bold;
}

.counselor-basic span:last-child {
  font-size: 14px;
}

.counselor-basic .divider {
  margin: 0 8px;
  color: #999;
}

.counselor-detail {
  width: 100%;
  padding: 15px;
  text-align: left;
  font-size: 14px;
  color: #666;
  opacity: 0;
  max-height: 0;
  overflow: hidden;
  transition: all 0.3s ease;
  padding-left: 10px;
}

.counselor-info.hovered .counselor-detail {
  opacity: 1;
  max-height: 150px;
}

@media (max-width: 768px) {
  .counselors-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .counselors-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
}
</style>