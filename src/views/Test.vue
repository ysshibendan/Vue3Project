<!-- 心理测评页面 -->
<template>
  <div class="test-page">
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

    <!-- 静态轮播图 -->
    <div class="carousel-section">
      <div class="carousel-container">
        <div class="static-carousel">
          <img :src="carouselItem.image" class="carousel-image" :alt="carouselItem.title" />
          <div class="carousel-overlay">
            <h3>{{ carouselItem.title }}</h3>
            <p>{{ carouselItem.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 心理测评列表 -->
    <div class="test-section">
      <div class="container">
        <h2 class="section-title">心理测评</h2>
        <div class="test-grid">
          <div v-for="test in testList" :key="test.id" class="test-item" @click="goToTest(test)">
            <div class="test-card">
              <div class="test-icon">
                <img :src="getTestIcon(test.type)" :alt="test.title" />
              </div>
              <div class="test-info">
                <h3>{{ test.title }}</h3>
                <p>{{ test.description }}</p>
                <div class="test-meta">
                  <span class="test-type">{{ getTestTypeText(test.type) }}</span>
                  <span class="test-duration">预计用时：{{ test.duration }}分钟</span>
                </div>
              </div>
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
import { getTemplateList } from '@/api/questionnaire'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)

// 轮播图数据
const carouselItem = ref({
  id: 1,
  title: '心理健康评估',
  description: '全面评估您的心理健康状况',
  image: '/src/assets/images/轮播图1.jpg'
})

// 心理测评列表
const testList = ref([])
const loading = ref(false)

// 获取心理测评列表
const fetchTestList = async () => {
  loading.value = true
  try {
    const response = await getTemplateList({
      token: localStorage.getItem('vue3project_token'),
      page: 1,
      page_size: 20,
      type: -1, // 获取所有类型的测评
      status: -1 // 获取所有状态的测评
    })
    
    if (response.code === 200 && response.data) {
      testList.value = response.data
    } else {
      console.error('获取心理测评列表失败:', response.message)
    }
  } catch (error) {
    console.error('获取心理测评列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 获取测评图标
const getTestIcon = (type) => {
  const iconMap = {
    1: '/src/assets/images/icon-1.svg',
    2: '/src/assets/images/icon-2.svg',
    3: '/src/assets/images/icon-3.svg',
    4: '/src/assets/images/icon-4.svg'
  }
  return iconMap[type] || '/src/assets/images/icon-1.svg'
}

// 获取测评类型文本
const getTestTypeText = (type) => {
  const typeMap = {
    1: '心理健康评估',
    2: '压力测试',
    3: '抑郁量表',
    4: '焦虑测评'
  }
  return typeMap[type] || '心理测评'
}

// 跳转到测评详情
const goToTest = (test) => {
  router.push(`/test/${test.id}`)
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
  fetchTestList()
})
</script>

<style scoped lang="scss">
.test-page {
  min-height: 100vh;
  background-color: #f5f5f5;
    // 确保页面允许垂直滚动，防止被意外截断
    overflow-y: auto; 
  width: 100%;
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
  //overflow-x: hidden;
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
  gap: 50px;
  /* 防止在小屏幕上换行导致高度变化影响计算 */
  flex-wrap: nowrap; 
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
  font-size: 20px;
  line-height: 50px;
  background-color: transparent;
  text-decoration: none;
  color: #fff;
  display: block;
  position: relative;
}
/* 静态轮播图样式 */
.carousel-section {
  // 动态计算 margin-top，等于两个导航栏高度之和 (70 + 50 = 120)，加一点缓冲
  margin-top: 105px; 
  margin-bottom: 40px;
  width: 100%;
}

.carousel-container {
  width: 100%; 
  max-width: 1644px; 
  height: 400px;
  position: relative;
  overflow: hidden;
  margin: 0 auto;
  // 防止图片超出容器导致布局崩坏
  box-sizing: border-box; 
}

.static-carousel {
  width: 100%;
  height: 100%;
  position: relative;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.carousel-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
  padding: 20px;
  
  h3 {
    margin: 0 0 10px 0;
    font-size: 24px;
  }
  
  p {
    margin: 0;
    font-size: 16px;
  }
}

/* 心理测评列表样式 */
.test-section {
  padding-bottom: 60px;
  // 确保这部分能撑开高度
  min-height: 200px; 
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-title {
  font-size: 28px;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

.test-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  // 确保网格能自动延伸高度
  width: 100%; 
}

.test-item {
  cursor: pointer;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
}

.test-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  height: 100%;
}

.test-icon {
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  
  img {
    width: 80px;
    height: 80px;
    object-fit: contain;
  }
}

.test-info {
  padding: 20px;
  
  h3 {
    margin: 0 0 10px 0;
    font-size: 20px;
    color: #333;
  }
  
  p {
    margin: 0 0 15px 0;
    color: #666;
    font-size: 14px;
    line-height: 1.5;
  }
}

.test-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .test-type {
    background-color: #409eff;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
  }
  
  .test-duration {
    color: #999;
    font-size: 12px;
  }
}
</style>