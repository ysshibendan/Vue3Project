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
          </ul>
        </div>
      </div>
    </header>
    <!-- 主要内容 -->
    <main>
      <!-- 英雄区域轮播图 -->
      <section class="hero">
        <div class="hero-carousel" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
          <div class="carousel-images" :style="{ transform: `translateX(-${currentImageIndex * 100}%)` }">
            <div v-for="(image, index) in carouselImages" :key="index" class="carousel-image">
              <img :src="image" alt="心理健康咨询">
              <!-- 轮播图1的小容器 -->
              <div v-if="index === 0" class="image-overlay" @click="goToTest">
                <div class="overlay-title"></div>
                <div class="overlay-desc"></div>
                <div class="overlay-button carousel1-button">
                  <span>我要测评 ></span>
                </div>
              </div>
              <!-- 轮播图2的小容器 -->
              <div v-if="index === 1" class="image-overlay">
                <div class="overlay-title">心 理 A I</div>
                <div class="overlay-desc">沉浸式心理咨询/AI心理疏导/AI辅助治疗</div>
                <div class="overlay-button">
                  <span>去聊聊 ></span>
                </div>
              </div>
              <!-- 轮播图3的小容器 -->
              <div v-if="index === 2" class="image-overlay">
                <div class="overlay-title">心理咨询预约</div>
                <div class="overlay-desc">24小时心理咨询预约/免费咨询师推荐</div>
                <div class="overlay-button">
                  <span>立即预约 ></span>
                </div>
              </div>
            </div>
          </div>
          <!-- 翻页控制 -->
          <div class="carousel-controls">
            <el-button 
              @click="prevImage"
              circle
              icon="ArrowLeft"
              class="control-btn"
            />
            <span class="page-info">{{ currentImageIndex + 1 }} / {{ carouselImages.length }}</span>
            <el-button 
              @click="nextImage"
              circle
              icon="ArrowRight"
              class="control-btn"
            />
          </div>
        </div>

      </section>

      <!-- 心理问题介绍 -->
      <section class="page-bg">
        <div class="container">
          <div class="page-title">
            <h2>这些心理问题困扰着我们</h2>
            <p>求助心理咨询师，帮你找到渡口</p>
          </div>
          
          <div class="fw-fanwei">
            <ul>
              <li>
                <div class="box">
                  <a title="亲子关系" href="/qinzi/">
                    <div class="img"><img :src="icon2" alt="亲子关系"></div>
                    <h3>亲子关系</h3>
                    <p>行为矫正丨亲子沟通丨厌学丨孤独自闭丨早恋丨网瘾丨叛逆</p>
                  </a>
                </div>
              </li>
              <li>
                <div class="box">
                  <a title="婚恋情感" href="/qinggan/">
                    <div class="img"><img :src="icon3" alt="婚恋情感"></div>
                    <h3>婚恋情感</h3>
                    <p>重建亲密关系丨失恋丨婚外情丨感情破裂丨婚姻修复丨产前后抑郁丨性心理问题</p>
                  </a>
                </div>
              </li>
              <li>
                <div class="box">
                  <a title="情绪管理" href="/qingxu/">
                    <div class="img"><img :src="icon1" alt="情绪管理"></div>
                    <h3>情绪管理</h3>
                    <p>抑郁丨强迫丨焦虑丨失眠丨恐惧丨疑病症丨癔症丨心理创伤</p>
                  </a>
                </div>
              </li>
              <li>
                <div class="box">
                  <a title="自我成长" href="/chengzhang/">
                    <div class="img"><img :src="icon4" alt="自我成长"></div>
                    <h3>自我成长</h3>
                    <p>自我认同低下丨自卑丨回避人格丨社交障碍丨偏执性人格丨成瘾矫正丨冲动性人格</p>
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
      
      <!-- 心理疾病介绍 -->
      <section class="xiaoguo-section">
        <div class="container">
          <div class="page-title">
            <h2>求助最多的心理症状</h2>
            <p>资深心理咨询师疏导化解，帮你走出渡口</p>
          </div>
      
      <!-- 轮播容器 -->
      <div class="symptom-carousel">
        <!-- 轮播内容区 -->
        <div class="carousel-container">
          <div class="carousel-track" :style="{ transform: `translateY(-${currentIndex * 70}px)` }">
            <div 
              v-for="(page, pageIndex) in allDisplayOptions" 
              :key="pageIndex" 
              class="carousel-page"
            >
              <div 
                v-for="(symptom, index) in page" 
                :key="`${pageIndex}-${index}`" 
                class="symptom-item"
              >
                <div class="symptom-title" :style="{ backgroundColor: symptom.titleBgColor }">
                  <h3>{{ symptom.title }}</h3>
                </div>
                <div class="symptom-desc">
                  <p>{{ symptom.desc }} <a title="了解更多" href="#" @click.prevent="handleSymptomClick(symptom.title)">了解更多</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 翻页控制 -->
        <div class="carousel-controls">
          <el-button 
            @click="prevItem"
            circle
            icon="ArrowLeft"
            class="control-btn"
          />
          <span class="page-info">{{ currentIndex + 1 }} / {{ totalPages }}</span>
          <el-button 
            @click="nextItem"
            circle
            icon="ArrowRight"
            class="control-btn"
          />
        </div>
      </div>
    </div>
  </section>

      <!-- 靠谱的心理咨询师 -->
      <section class="xiaoguo-section counselor-section">
        <div class="container">
          <div class="page-title">
            <h2>靠谱的心理咨询师</h2>
            <p>平台严选师资，客服点对点沟通、一对一推荐</p>
          </div>
          
          <!-- 咨询师列表 -->
          <div class="counselor-list">
            <div 
            v-for="(counselor, index) in counselorList" 
              :key="index" 
              class="counselor-card"
               @click="goToCounselorDetail(counselor.userInfo.id)"
              @mouseenter="handleCardHover(index, true)"
              @mouseleave="handleCardHover(index, false)"
            >
              <!-- 咨询师头像 -->
              <div class="counselor-avatar">
                <img 
                  :src="getCounselorAvatar(counselor.userInfo.avatar)" 
                  :alt="counselor.userInfo.realName"
                />
              </div>
              
              <!-- 咨询师信息 -->
              <div class="counselor-info" :class="{ 'hovered': counselor.hovered }">
                <!-- 基本信息行 -->
                <div class="counselor-basic">
                  <span>{{ counselor.userInfo.realName || '' }}老师</span>
                  <span class="divider" v-if="counselor.userInfo.realName && counselor.counselorInfo.workExperience">|</span>
                  <span>{{ counselor.counselorInfo.workExperience ? counselor.counselorInfo.workExperience + '年经验老师' : '' }}</span>
                </div>
                
                <!-- 咨询师详细信息 -->
                <div class="counselor-detail">
                  <p class="specialty-title">擅长领域：</p>
                  <p class="specialty">{{ counselor.counselorInfo.specialty || '' }}</p>
                  <p class="introduction">{{ counselor.counselorInfo.introduction || '' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 功能介绍 -->
      <section id="features" class="features">
        <div class="container">
          <h2>我们的服务</h2>
          <div class="feature-grid">
            <div class="feature-card">
              <div class="feature-icon">
                <el-icon size="48"><ChatDotRound /></el-icon>
              </div>
              
              <h3>AI智能咨询</h3>
              <p>基于先进AI技术，提供即时心理健康支持和建议</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">
                <el-icon size="48"><User /></el-icon>
              </div>
              
              <h3>专业咨询师</h3>
              <p>连接专业心理咨询师，获得一对一深度咨询</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">
                <el-icon size="48"><Document /></el-icon>
              </div>
              
              <h3>心理评估</h3>
              <p>专业心理健康评估，了解您的心理状态</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">
                <el-icon size="48"><Clock /></el-icon>
              </div>
              <h3>24/7全天候</h3>
              <p>随时为您提供心理健康支持，不受时间限制</p>
            </div>
          </div>
          
        </div>
      </section>
      <!-- 关于我们 -->
      <section id="about" class="about">
        <div class="container">
          <div class="about-content">
            <div class="about-text">
              <h2>关于心理健康咨询平台</h2>
              <p>我们致力于为每个人提供专业、便捷、保密的心理健康服务。通过结合先进的人工智能技术和专业心理咨询师团队，我们希望能够帮助更多人解决心理困扰，提升生活质量。</p>
              <p>无论您是面临日常压力、情绪问题，还是需要专业心理支持，我们都在这里为您提供帮助。</p>
            </div>
            
            <div class="about-image">
              <div class="placeholder-image">
                <el-icon size="120"><ChatDotRound /></el-icon>
              </div>
            </div>
          </div>
          
        </div>
      </section>
      <!-- 联系方式 -->
      <section id="contact" class="contact">
        <div class="container">
          <h2>联系我们</h2>
          <div class="contact-info">
            <div class="contact-item">
              <el-icon size="24"><Message /></el-icon>
              <span>邮箱：support@mentalhealth.com</span>
            </div>
            <div class="contact-item">
              <el-icon size="24"><Phone /></el-icon>
              <span>电话：400-123-4567</span>
            </div>
            <div class="contact-item">
              <el-icon size="24"><Location /></el-icon>
              <span>地址：北京市朝阳区心理健康中心</span>
            </div>
        </div>
      </div>
      </section>
    </main>
    <!-- 页脚 -->
    <footer class="footer">
      <div class="container">
        <p>&copy; 2026 心理健康咨询平台. 保留所有权利.</p>
        </div>
    </footer>
  </div>
</template>
  
<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { 
  ChatDotRound, 
  User, 
  Document, 
  Clock, 
  Message, 
  Phone, 
  Location,
  ArrowLeft,
  ArrowRight
} from '@element-plus/icons-vue'
// 导入SVG图片
import icon1 from '@/assets/images/icon-1.svg'
import icon2 from '@/assets/images/icon-2.svg'
import icon3 from '@/assets/images/icon-3.svg'
import icon4 from '@/assets/images/icon-4.svg'
// 导入轮播图
import carousel1 from '@/assets/images/轮播图1.jpg'
import carousel2 from '@/assets/images/轮播图2.jpg'
import carousel3 from '@/assets/images/轮播图3.jpg'
// 尝试导入PNG图片
try {
  const png1 = require('@/assets/images/轮播图1.png')
  const png2 = require('@/assets/images/轮播图2.png')
  const png3 = require('@/assets/images/轮播图3.png')
  // 如果PNG图片存在，使用PNG图片
  if (png1 && png2 && png3) {
    carouselImages.value = [png1, png2, png3]
  }
} catch (e) {
  console.error('PNG图片导入失败:', e)
}
const router = useRouter()
const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)

// 心理疾病展示轮播功能
const currentIndex = ref(0) // 当前起始索引 (0-7)
const itemsToShow = 7 // 每次显示7个项目
const totalPages = 8 // 总页数
const counselorList = ref([]) // 咨询师列表数据
// 轮播图数据
const carouselImages = [carousel1, carousel2, carousel3]
const currentImageIndex = ref(0)
let autoPlayInterval = null

// 自动轮播功能
const startAutoPlay = () => {
  stopAutoPlay()
  autoPlayInterval = setInterval(() => {
    nextImage()
  }, 5000) // 每5秒切换一次
}

const stopAutoPlay = () => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
    autoPlayInterval = null
  }
}

// 鼠标悬停时停止自动轮播
const handleMouseEnter = () => {
  stopAutoPlay()
}

// 鼠标离开时开始自动轮播
const handleMouseLeave = () => {
  startAutoPlay()
}

// 心理疾病数据
const symptoms = [
  { title: '亲子关系', desc: '协助家长解决孩子叛逆/厌学/沉迷手机/抑郁焦虑/对抗/躺平等成长问题，儿童心理咨询疏导，帮助孩子健康成长。' },
  { title: '婚恋情感', desc: '婚姻家庭情感问题可以引发很多心理问题，如焦虑、抑郁等，进而影响到自己和家人的工作、人际关系甚至身体健康。' },
  { title: '情绪管理', desc: '做情绪的主人，停止精神内耗。学会正确地情绪表达，包括控制愤怒、焦虑等负面情绪，拥有积极的情绪状态。' },
  { title: '自我成长', desc: '助力个人成长和发展，提升自我内在力量、疏导职场焦虑，调节行为习惯、改善人际关系、建立亲密合作关系。' },
  { title: '高敏感症HSP', desc: '世界上有20%的人群感知世界的方式更加细腻、复杂，通常伴随着更强烈的内心体验，需要特殊的理解和应对方式。' },
  { title: '焦虑症', desc: '人群中最常见的情绪障碍，90%的焦虑症患者在35岁以前发病，女性多于男性，及时干预可以有效改善症状。' },
  { title: '抑郁症', desc: '情绪低落、悲观、啥事都提不起精神，甚至还会出现消极自杀的想法，专业心理咨询可以帮助走出阴霾。' },
  { title: '职场迷茫', desc: '在漫漫的职场生涯里，总有各种各样的原因过的并不开心，逐渐变得怠惰、迷茫，需要重新找回职业方向。' }
]

// 创建所有可能的显示组合，用于轮播
const allDisplayOptions = computed(() => {
  const options = []
  for (let start = 0; start < totalPages; start++) {
    const pageItems = []
    for (let i = 0; i < itemsToShow; i++) {
      const index = (start + i) % symptoms.length
      // 根据实际索引而不是位置来决定颜色，避免连续两个相同颜色
      const actualIndex = (start + i) % symptoms.length
      pageItems.push({
        ...symptoms[index],
        bgColor: i % 2 === 0 ? '#f0f7ff' : '#f5faff',
        titleBgColor: actualIndex % 2 === 0 ? '#85ce61' : '#f7ba2a' // 根据实际索引决定颜色
      })
    }
    options.push(pageItems)
  }
  return options
})

// 获取当前页显示的症状
const displayedSymptoms = computed(() => {
  return allDisplayOptions.value[currentIndex.value] || []
})

// 翻页方法 - 每次滚动一个项目
const prevItem = () => {
  currentIndex.value = currentIndex.value === 0 ? totalPages - 1 : currentIndex.value - 1
}

const nextItem = () => {
  currentIndex.value = (currentIndex.value + 1) % totalPages
}

// 轮播图翻页方法
const prevImage = () => {
  currentImageIndex.value = currentImageIndex.value === 0 ? carouselImages.length - 1 : currentImageIndex.value - 1
  // 手动切换后重新开始自动轮播
  startAutoPlay()
}

const nextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % carouselImages.length
  // 手动切换后重新开始自动轮播
  startAutoPlay()
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
const goToHome = () => {
  // 强制重新加载页面，回到顶部
  window.location.href = '/'
}
const handleStartConsultation = () => {
  if (isAuthenticated.value) {
    goToChat()
  } else {
    goToLogin()
  }
  
}

const goToTest = () => {
  router.push('/test')
}
const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

// 处理症状点击
const handleSymptomClick = (title) => {
  if (isAuthenticated.value) {
    // 如果已登录，跳转到咨询页面并传递症状信息
    router.push({ path: '/chat', query: { symptom: title } })
  } else {
    // 如果未登录，跳转到登录页面
    router.push({ path: '/login', query: { redirect: '/chat', symptom: title } })
  }
}
// 组件挂载时开始自动轮播
onMounted(() => {
  startAutoPlay()
  fetchCounselorList()
})

// 获取咨询师列表
const fetchCounselorList = async () => {
  try {
    // 从localStorage获取token
    const token = localStorage.getItem('vue3project_token')
    
    // 构建请求参数
    const params = new URLSearchParams({
      token: token || '',
      status: '-1',
      is_available: '1',
      page: '1',
      page_size: '50',
      keyspecialty: ''
    })
    
    const response = await fetch(`/api/counselor/list?${params}`)
    const data = await response.json()
    
    if (data.code === 200 && data.data) {
      // 获取前三个咨询师，如果不足三个则用空数据填充
      const counselors = data.data.slice(0, 3)
      const counselorCount = counselors.length
      
      // 如果不足三个，用空数据填充
      for (let i = counselorCount; i < 3; i++) {
        counselors.push({
          userInfo: {
            id: '',
            username: '',
            email: '',
            phone: '',
            role: 1,
            realName: '',
            gender: '',
            age: 0,
            avatar: '',
            status: 0,
            lastLoginAt: '',
            createdAt: '',
            updatedAt: ''
          },
          counselorInfo: {
            id: '',
            userId: '',
            specialty: '',
            introduction: '',
            workExperience: 0,
            createdAt: '',
            updatedAt: ''
          },
          hovered: false
        })
      }
      
      counselorList.value = counselors
    } else {
      // 如果请求失败，创建三个空数据
      counselorList.value = Array(3).fill(null).map(() => ({
        userInfo: {
          id: '',
          username: '',
          email: '',
          phone: '',
          role: 1,
          realName: '',
          gender: '',
          age: 0,
          avatar: '',
          status: 0,
          lastLoginAt: '',
          createdAt: '',
          updatedAt: ''
        },
        counselorInfo: {
          id: '',
          userId: '',
          specialty: '',
          introduction: '',
          workExperience: 0,
          createdAt: '',
          updatedAt: ''
        },
        hovered: false
      }))
    }
  } catch (error) {
    console.error('获取咨询师列表失败:', error)
  }
}

// 处理卡片悬浮事件
const handleCardHover = (index, isHovered) => {
  if (counselorList.value[index]) {
    counselorList.value[index].hovered = isHovered
  }
}

// 获取咨询师头像
const getCounselorAvatar = (avatar) => {
  if (!avatar || avatar.trim() === '') {
    // 使用默认头像
    return '/images/head.webp'
  }
  
  // 如果是相对路径，则从assets/images获取
  if (avatar.startsWith('/') || !avatar.startsWith('http')) {
    // 去掉开头的/，然后从assets/images获取
    const fileName = avatar.replace(/^\//, '')
    return `/src/assets/images/${fileName}`
  }
  
  return avatar
}
// 跳转到咨询师详情页
// 跳转到咨询师详情页
const goToCounselorDetail = (counselorId) => {
  console.log('点击咨询师，ID:', counselorId)
  if (counselorId) {
    // 保存咨询师列表到本地存储，供详情页使用
    localStorage.setItem('counselors_list', JSON.stringify(counselorList.value))
    router.push(`/counselor/${counselorId}`)
  } else {
    console.error('咨询师ID为空，无法跳转')
  }
}
// 组件卸载时清除自动轮播
onUnmounted(() => {
  stopAutoPlay()
})
</script>
  }
  
  
  
  <style scoped>
  .home-page {
  min-height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  max-width: 100vw;
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
  /* 主要内容样式 */
main {
  padding-top: 70px;
  height: auto;
  min-height: calc(100vh - 70px);
  overflow-x: hidden;
  box-sizing: border-box;
  margin: 0;
  padding-bottom: 0;
  max-width: 100%;
  width: 100%;
}
  /* 英雄区域样式 */
.hero {
  padding: 38px 0 0 0;
  text-align: center;
  
  position: relative;
  overflow: hidden;
}

.hero-carousel {
  width: 1644px;
  height: 400px;
  position: relative;
  overflow: hidden;
  margin: 0 auto;
}

.carousel-images {
  display: flex;
  height: 100%;
  transition: transform 0.5s ease;
}

.carousel-image {
  min-width: 100%;
  height: 100%;
  flex-shrink: 0;
}

.carousel-image {
  position: relative;
}

.carousel-image img {
  width: 1644px;
  height: 400px;
  object-fit: contain;
  display: block;
}

/* 轮播图上的小容器样式 */
.image-overlay {
  position: absolute;
  bottom: 30px;
  left: 20px;
  background-color: transparent;
  border-radius: 30px;
  padding: 15px;
  color: white;
  text-align: center;
  min-width: 180px;
}

/* 轮播图1的小容器样式 */
.carousel-image:nth-child(1) .image-overlay {
  position: absolute;
  top: 72.9%;
  left: 43.1%;
  transform: translateY(-50%);
  background-color: transparent;
  border-radius: 30px;
  padding: 17px;
  color: white;
  text-align: center;
  min-width: 190px;
}

/* 轮播图2的小容器样式 */
.carousel-image:nth-child(2) .image-overlay {
  position: absolute;
  top: 50%;
  right: 75%;
  transform: translateY(-50%);
  background-color: transparent;
  border-radius: 30px;
  padding: 15px;
  color: white;
  text-align: center;
  min-width: 180px;
}

/* 轮播图3的小容器样式 */
.carousel-image:nth-child(3) .image-overlay {
  position: absolute;
  top: 15%;
  left: 50%;
  transform: translateX(-50%);
  background-color: transparent;
  border-radius: 30px;
  padding: 15px;
  color: white;
  text-align: center;
  min-width: 180px;
}

.overlay-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #70ba96;
}

.overlay-desc {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 12px;
  line-height: 1.4;
  color: #70ba96;
}

.overlay-button {
  background-color: #ff8c00;
  color: white;
  border-radius: 60px;
  padding: 10px 30px;
  font-size: 20px;
  font-weight: normal;
  display: inline-block;
  cursor: pointer;
  transition: all 0.3s ease;
}

.overlay-button:hover {
  background-color: #e67300;
  transform: translateY(-2px);
}

/* 轮播图翻页控制样式 */
.hero .carousel-controls {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 15px;
  z-index: 10;
  
  padding: 8px 15px;
  border-radius: 20px;
}



.hero h2 {
  font-size: 48px;
  color: white;
  margin-bottom: 20px;
  font-weight: 700;
}

.hero p {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 30px;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
}
  /* 功能介绍样式 */
  .features {
    padding: 80px 0;
    background-color: #f9f9f9;
  }
  .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
  box-sizing: border-box;
}
  .features h2 {
    text-align: center;
    font-size: 36px;
    margin-bottom: 50px;
    color: var(--text-color);
  }
  .feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 30px;
  }
  .feature-card {
    background-color: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    text-align: center;
    transition: transform 0.3s, box-shadow 0.3s;
  }
  .feature-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  }
  .feature-icon {
    color: var(--primary-color);
    margin-bottom: 20px;
  }
  .feature-card h3 {
    font-size: 22px;
    margin-bottom: 15px;
    color: var(--text-color);
  }
  .feature-card p {
    color: var(--text-regular);
    line-height: 1.6;
  }
  /* 关于我们样式 */
  .about {
    padding: 80px 0;
  }
  .about-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
  }
  .about-text h2 {
    font-size: 36px;
    margin-bottom: 30px;
    color: var(--text-color);
  }
  .about-text p {
    font-size: 18px;
    line-height: 1.7;
    margin-bottom: 20px;
    color: var(--text-regular);
  }
  .about-image {
    display: flex;
    justify-content: center;
  }
  .placeholder-image {
    width: 300px;
    height: 300px;
    background-color: #f0f0f0;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ccc;
  }
  /* 联系方式样式 */
  .contact {
    padding: 80px 0;
    background-color: #f9f9f9;
  }
  .contact h2 {
    text-align: center;
    font-size: 36px;
    margin-bottom: 50px;
    color: var(--text-color);
  }
  .contact-info {
    display: flex;
    justify-content: center;
    gap: 50px;
    flex-wrap: wrap;
  }
  .contact-item {
    display: flex;
    align-items: center;
    gap: 15px;
    font-size: 18px;
    color: var(--text-regular);
  }
  .contact-item .el-icon {
    color: var(--primary-color);
  }
  /* 心理问题介绍样式 */
.page-bg {
  font-family: Arial, 'Microsoft Yahei', 'Helvetica Neue', Helvetica, 'Lucida Grande', 'Hiragino Sans GB', 'WenQuanYi Micro Hei', STHeiti, SimSun, sans-serif;
  font-size: 14px;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
  list-style: none;
  margin: 0;
  text-align: justify;
  background: #fff;
  padding: 80px 0;
  position: relative;
  z-index: 2;
}

.fw-fanwei {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.fw-fanwei ul {
  display: flex;
  justify-content: center;
  gap: 30px;
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

.fw-fanwei li {
  width: 280px;
  flex: 1;
}

.fw-fanwei .box {
  font-family: Arial, 'Microsoft Yahei', 'Helvetica Neue', Helvetica, 'Lucida Grande', 'Hiragino Sans GB', 'WenQuanYi Micro Hei', STHeiti, SimSun, sans-serif;
  font-size: 14px;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
  list-style: none;
  text-align: center;
  background-color: transparent;
  text-decoration: none;
  color: #414558;
  outline: 0;
  padding: 25px;
  border-radius: 10px;
  transition: none;
}

.fw-fanwei .box:hover {
  transform: none;
  box-shadow: none;
}



.fw-fanwei .box a {
  display: block;
  text-decoration: none;
  color: #414558;
  outline: 0;
}

.fw-fanwei .img {
  width: 124px;
  height: 124px;
  margin: 0 auto 20px;
  background-color: #fff;
  border: 4px solid #70ba96;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.fw-fanwei .img::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(112, 186, 150, 0.12);
  z-index: 1;
  transform: translateX(-100%);
  transition: transform 1.2s ease, opacity 1.2s ease;
  border-radius: 16px;
  opacity: 0;
}

.fw-fanwei .img:hover::before {
  transform: translateX(0);
  opacity: 1;
}

.fw-fanwei .img img {
  width: 80px;
  height: 80px;
}

.fw-fanwei h3 {
  font-size: 18px;
  margin: 0 0 10px;
  color: #333;
}

.fw-fanwei p {
  font-size: 14px;
  margin: 0;
  color: #666;
  line-height: 1.5;
}

/* 心理疾病介绍样式 */
.xiaoguo-section {
  padding: 60px 0;
  background-color: #d4edd4;
}

.counselor-section {
  background-color: white;
}

/* 咨询师列表样式 */
.counselor-list {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 40px;
}

/* 咨询师卡片样式 */
.counselor-card {
  position: relative;
  width: 370px;
  height: 370px;
  border-radius: 10px;
  border: 10px solid white;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  pointer-events: auto;
}

.counselor-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

/* 咨询师头像样式 */
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

/* 咨询师信息样式 */
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

/* 咨询师基本信息 */
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

/* 咨询师详细信息 */
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
  max-height: 100px;
}

.counselor-detail .specialty-title {
  font-weight: bold;
  color: #ff8c00;
  margin-bottom: 5px;
  font-size: 14px;
}

.counselor-detail .specialty,
.counselor-detail .introduction {
  font-size: 14px;
  color: #666;
  margin: 5px 0;
  line-height: 1.4;
}

.counselor-detail p {
  margin: 5px 0;
  line-height: 1.4;
}

.counselor-detail .specialty {
  font-size: 14px;
  color: #333;
}

/* 移除重复的样式规则，使用统一样式 */

.page-title {
  text-align: center;
  margin-bottom: 10px;
}

.page-title h2 {
  font-size: 37px;
  color: #000000;
  margin-bottom: 8px;
  position: relative;
  display: inline-block;
  font-weight: normal;
  padding: 0 30px;
}

.page-title h2::before,
.page-title h2::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 60px;
  height: 2px;
  background-color: #000000;
}

.page-title h2::before {
  left: -70px;
}

.page-title h2::after {
  right: -70px;
}

.page-title p {
  font-size: 17px;
  color: #606266;
  max-width: 600px;
  margin: 0 auto 30px;
}

/* 轮播容器样式 */
.symptom-carousel {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  margin-top: 0;
}

.carousel-container {
  height: 490px; /* 7行 × 60px每行 + 6个空隙 */
  overflow: hidden;
  border-radius: 20px;
  box-shadow: none;
  background-color: #d4edd4;
  padding: 0;
  box-sizing: border-box;
}

.carousel-track {
  transition: transform 0.8s ease; /* 增加过渡时间，使滚动更慢 */
}

.carousel-page {
  height: 490px; /* 7行 × 60px每行 + 6个空隙 */
  background-color: #d4edd4;
}

.symptom-item {
  display: flex;
  height: 60px;
  margin-bottom: 10px;
  border-radius: 25px;
  overflow: hidden;
  box-shadow: none;
  border: none;
  outline: none;
  transition: transform 0.3s ease;
}

.symptom-item:hover {
  transform: translateY(-3px);
}

.symptom-item:last-child {
  margin-bottom: 0;
}

.symptom-title {
  width: 150px;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: none;
  position: relative;
  z-index: 1;
  border-top-left-radius: 25px;
  border-bottom-left-radius: 25px;
  border-top-right-radius: 50px;
  border-bottom-right-radius: 0;
  margin-right: 0;
  clip-path: polygon(0 0, 100% 0, 100% 50%, 100% 100%, 0 100%);
}

.symptom-title h3 {
  margin: 0;
  font-size: 18px;
  color: white;
  font-weight: 600;
  text-align: center;
}

.symptom-desc {
  flex: 1;
  padding: 12px 15px;
  background-color: white;
  display: flex;
  align-items: center;
  border-top-right-radius: 25px;
  border-bottom-right-radius: 25px;
  margin-left: 10px;
  position: relative;
}

.symptom-desc::before {
  content: '';
  position: absolute;
  left: -10px;
  top: 0;
  width: 10px;
  height: 100%;
  background-color: white;
  z-index: 0;
}

.symptom-desc p {
  margin: 0;
  font-size: 16px;
  color: #606266;
  line-height: 1.5;
}

.symptom-desc a {
  color: #85ce61;
  font-size: 14px;
  text-decoration: none;
  transition: color 0.3s;
  font-weight: 500;
  margin-left: 5px;
}

.symptom-desc a:hover {
  color: #a0da7a;
  text-decoration: underline;
}

/* 心理疾病翻页控制样式 */
.symptom-carousel .carousel-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 15px;
 
  padding: 8px 15px;
  border-radius: 20px;
}

.control-btn {
  background-color: white;
  border-color: #409eff;
  color: #409eff;
}

.control-btn:hover {
  background-color: #409eff;
  color: white;
}

.page-info {
  font-size: 16px;
  color: #606266;
  min-width: 60px;
  text-align: center;
}

/* 页脚样式 */
.footer {
  background-color: var(--text-color);
  color: white;
  padding: 30px 0;
  text-align: center;
}

.footer p {
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    height: auto;
    padding: 15px 20px;
  }
  
  .nav-menu {
    margin: 15px 0;
  }
  
  main {
    padding-top: 120px;
  }
  
  .hero h2 {
    font-size: 36px;
  }
  
  .hero p {
    font-size: 18px;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .about-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .contact-info {
    flex-direction: column;
    gap: 20px;
  }
  
  .carousel-container {
    height: 490px;
  }
  
  .symptom-title {
    width: 120px;
  }
  
  .symptom-title h3 {
    font-size: 14px;
  }
  
  .symptom-desc p {
    font-size: 13px;
  }
}
</style>