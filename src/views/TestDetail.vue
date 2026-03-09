<!-- 心理测评详情页面 -->
<template>
  <div class="test-detail-page">
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

    <!-- 测评内容 -->
    <div class="test-content">
      <div class="container">
        <div class="test-header">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/test' }">心理测评</el-breadcrumb-item>
            <el-breadcrumb-item>{{ testDetail.title }}</el-breadcrumb-item>
          </el-breadcrumb>
          <h1 class="test-title">{{ testDetail.title }}</h1>
          <p class="test-description">{{ testDetail.description }}</p>
          <div class="test-info">
            <span class="test-type">{{ getTestTypeText(testDetail.type) }}</span>
            <span class="test-questions">共{{ questions.length }}题</span>
            <span class="test-duration">预计用时：{{ testDetail.duration }}分钟</span>
          </div>
        </div>

        <!-- 测评问题 -->
        <div class="test-questions" v-if="!showResult">
          <div v-for="(question, index) in questions" :key="question.id" class="question-item">
            <div class="question-header">
              <span class="question-number">{{ index + 1 }}</span>
              <div class="question-content">{{ question.content }}</div>
            </div>
            <div class="question-options">
              <!-- 单选题 -->
              <el-radio-group v-model="answers[question.id]" v-if="question.type === 1">
                <el-radio 
                  v-for="(option, optIndex) in parseOptions(question.options)" 
                  :key="optIndex" 
                  :label="option.value"
                  class="option-item"
                >
                  {{ option.label }}
                </el-radio>
              </el-radio-group>
              
              <!-- 多选题 -->
              <el-checkbox-group v-model="multiAnswers[question.id]" v-else-if="question.type === 2">
                <el-checkbox 
                  v-for="(option, optIndex) in parseOptions(question.options)" 
                  :key="optIndex" 
                  :label="option.value"
                  class="option-item"
                >
                  {{ option.label }}
                </el-checkbox>
              </el-checkbox-group>
              
              <!-- 填空题 -->
              <el-input 
                v-else-if="question.type === 3"
                v-model="answers[question.id]"
                type="textarea"
                :rows="3"
                placeholder="请输入您的答案"
              />
              
              <!-- 量表题 -->
              <el-radio-group v-model="answers[question.id]" v-else-if="question.type === 4">
                <el-radio 
                  v-for="(option, optIndex) in parseOptions(question.options)" 
                  :key="optIndex" 
                  :label="option.value"
                  class="option-item"
                >
                  {{ option.label }}
                </el-radio>
              </el-radio-group>
            </div>
          </div>
          
          <div class="test-actions">
            <el-button size="large" @click="goBack">返回</el-button>
            <el-button type="primary" size="large" @click="submitTest" :loading="submitting">
              提交测评
            </el-button>
          </div>
        </div>
        
        <!-- 测评结果 -->
        <div class="test-result" v-else>
          <div class="result-card">
            <div class="result-header">
              <h2>测评结果</h2>
              <div class="result-score">
                <span class="score-label">总分：</span>
                <span class="score-value">{{ testResult.totalScore }}</span>
              </div>
            </div>
            <div class="result-content">
              <div class="result-level">
                <span class="level-label">风险等级：</span>
                <el-tag :type="getRiskLevelType(testResult.riskLevel)" size="large">
                  {{ getRiskLevelText(testResult.riskLevel) }}
                </el-tag>
              </div>
              <div class="result-description">
                <h3>结果分析</h3>
                <p>{{ testResult.result }}</p>
              </div>
              <div class="result-suggestions" v-if="testResult.suggestions">
                <h3>建议</h3>
                <p>{{ testResult.suggestions }}</p>
              </div>
            </div>
            <div class="result-actions">
              <el-button @click="goBack">返回测评列表</el-button>
              <el-button type="primary" @click="goToCounselors">咨询专业咨询师</el-button>
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
import { getTemplateDetail, submitQuestionnaire } from '@/api/questionnaire'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const testId = ref(route.params.id)

// 测评详情
const testDetail = ref({})
const questions = ref([])
const answers = ref({})
const multiAnswers = ref({})
const submitting = ref(false)
const showResult = ref(false)
const testResult = ref({})

// 获取测评详情
const fetchTestDetail = async () => {
  // 重置状态
  showResult.value = false
  
  try {
    const response = await getTemplateDetail(testId.value, {
      token: localStorage.getItem('vue3project_token')
    })
    
    if (response.code === 200) {
      testDetail.value = {
        ...response.template,
        duration: Math.floor(Math.random() * 20) + 10 // 随机生成10-30分钟的预计用时
      }
      questions.value = response.questions || []
      
      // 初始化答案对象
      questions.value.forEach(question => {
        if (question.type === 2) {
          multiAnswers.value[question.id] = []
        } else {
          answers.value[question.id] = ''
        }
      })
    } else {
      ElMessage.error(response.message || '获取测评详情失败')
      goBack()
    }
  } catch (error) {
    console.error('获取测评详情失败:', error)
    ElMessage.error('获取测评详情失败')
    goBack()
  }
}

// 解析选项
const parseOptions = (optionsStr) => {
  try {
    return JSON.parse(optionsStr)
  } catch (e) {
    console.error('解析选项失败:', e)
    return []
  }
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

// 获取风险等级文本
const getRiskLevelText = (level) => {
  const levelMap = {
    1: '低风险',
    2: '中风险',
    3: '高风险'
  }
  return levelMap[level] || '未知'
}

// 获取风险等级类型
const getRiskLevelType = (level) => {
  const typeMap = {
    1: 'success',
    2: 'warning',
    3: 'danger'
  }
  return typeMap[level] || 'info'
}

// 提交测评
const submitTest = async () => {
  // 检查是否登录
  if (!isAuthenticated.value) {
    ElMessage.warning('请先登录后再进行测评')
    router.push('/login')
    return
  }
  
  // 检查是否所有题目都已回答
  let allAnswered = true
  questions.value.forEach(question => {
    if (question.type === 2) {
      if (!multiAnswers.value[question.id] || multiAnswers.value[question.id].length === 0) {
        allAnswered = false
      }
    } else {
      if (!answers.value[question.id]) {
        allAnswered = false
      }
    }
  })
  
  if (!allAnswered) {
    ElMessage.warning('请回答所有题目后再提交')
    return
  }
  
  submitting.value = true
  
  try {
    // 构建答案数组
    const questionAnswers = []
    
    questions.value.forEach(question => {
      let answer = ''
      let score = 0
      
      if (question.type === 2) {
        // 多选题
        answer = JSON.stringify(multiAnswers.value[question.id])
      } else {
        // 单选题、填空题、量表题
        answer = answers.value[question.id]
      }
      
      // 计算分数 - 根据题目数量动态计算每道题的分值
      const options = parseOptions(question.options)
      if (question.type === 1 || question.type === 4) {
        const selectedOptionIndex = options.findIndex(opt => opt.value === answer)
        
        // 计算每道题的分值 = 100分 / 题目总数
        const questionScore = 100 / questions.value.length
        
        // 五个选项的分值按比例分配，使用更精确的方法确保总分是100
        const scoreMap = [
          Math.floor(questionScore * 1),      // 第一个选项：100%
          Math.floor(questionScore * 0.75),   // 第二个选项：75%
          Math.floor(questionScore * 0.5),    // 第三个选项：50%
          Math.floor(questionScore * 0.25),   // 第四个选项：25%
          0                  // 第五个选项：0%
        ]
        
        score = selectedOptionIndex >= 0 && selectedOptionIndex < scoreMap.length ? scoreMap[selectedOptionIndex] : 0
      }
      
      questionAnswers.push({
        question_id: parseInt(question.id),
        answer: answer,
        score: score
      })
    })
    
    // 提交测评
    const response = await submitQuestionnaire({
      token: localStorage.getItem('vue3project_token'),
      template_id: testId.value,
      answers: questionAnswers
    })
    
    if (response.code === 200) {
      testResult.value = {
        totalScore: response.totalScore || response.total_score, // 兼容两种命名方式
        result: response.result,
        riskLevel: response.riskLevel || response.risk_level, // 兼容两种命名方式
        suggestions: getSuggestions(response.riskLevel || response.risk_level) // 兼容两种命名方式
      }
      showResult.value = true
      ElMessage.success('测评提交成功')
    } else {
      ElMessage.error(response.message || '提交测评失败')
    }
  } catch (error) {
    console.error('提交测评失败:', error)
    ElMessage.error('提交测评失败')
  } finally {
    submitting.value = false
  }
}

// 获取建议
const getSuggestions = (riskLevel) => {
  const suggestionsMap = {
    1: '您的心理状态良好，请继续保持健康的生活方式，适当进行放松活动。',
    2: '您的心理状态存在一定压力，建议适当调整生活节奏，增加放松活动，如持续感到不适，可考虑咨询专业心理咨询师。',
    3: '您的心理状态需要关注，建议尽快咨询专业心理咨询师，获得专业的帮助和指导。'
  }
  return suggestionsMap[riskLevel] || ''
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

const goBack = () => {
  router.push('/test')
}

const goToCounselors = () => {
  router.push('/counselors')
}

onMounted(() => {
  fetchTestDetail()
})
</script>

<style scoped lang="scss">
.test-detail-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-top: 105px; /* 为固定导航栏留出空间 */
  // 确保页面可以滚动，防止内容被截断
  overflow-x: hidden; 
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
  gap: 50px;
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

/* 测评内容样式 */
.test-content {
  padding: 30px 0 60px 0;
  min-height: calc(100vh - 105px); /* 确保内容区域至少占满剩余空间 */
  position: relative; /* 确保定位上下文正确 */
  overflow: visible; /* 确保内容不被裁剪 */
  padding-bottom: 100px; /* 为按钮留出足够空间 */
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative; /* 确保定位上下文正确 */
  z-index: 1; /* 确保在导航栏下方 */
}

.test-header {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
  
  .test-title {
    margin: 15px 0;
    font-size: 28px;
    color: #333;
  }
  
  .test-description {
    margin: 0 0 20px 0;
    font-size: 16px;
    color: #666;
    line-height: 1.6;
  }
  
  .test-info {
    display: flex;
    gap: 20px;
    
    span {
      padding: 6px 12px;
      background-color: #f0f0f0;
      border-radius: 20px;
      font-size: 14px;
      color: #666;
    }
  }
}

.test-questions {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
   // 关键：确保内容溢出可见，不要隐藏底部
   overflow: visible; 
  position: relative;
}

.question-item {
  margin-bottom: 30px;
  padding-bottom: 30px;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    margin-bottom: 20px;
    padding-bottom: 20px;
    
  }
}

.question-header {
  display: flex;
  margin-bottom: 20px;
  
  .question-number {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background-color: #409eff;
    color: white;
    border-radius: 50%;
    font-weight: bold;
    margin-right: 15px;
    flex-shrink: 0;
  }
  
  .question-content {
    font-size: 16px;
    line-height: 1.6;
    color: #333;
    flex: 1;
  }
}

.question-options {
  padding-left: 51px;
  
  .option-item {
    display: block; // 改为 block 防止换行问题
    align-items: center;
    margin-bottom: 15px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
}

/* 修复Element Plus单选框和复选框的样式 */
:deep(.el-radio),
:deep(.el-checkbox) {
  margin-right: 10px;
  margin-bottom: 15px;
  white-space: normal;
  line-height: 1.5;
}

:deep(.el-radio__label),
:deep(.el-checkbox__label) {
  font-size: 16px;
  line-height: 1.5;
  word-wrap: break-word;
  white-space: normal;
  padding-left: 8px;
}

/* 确保单选框和复选框组正确排列 */
:deep(.el-radio-group),
:deep(.el-checkbox-group) {
  display: flex;
  flex-direction: row;
  flex-direction: column;
  width: 100%;
  align-items: flex-start;
}

:deep(.el-radio),
:deep(.el-checkbox) {
  display: inline-flex;
  align-items: center;
  margin-right: 20px;
  margin-bottom: 15px;
  vertical-align: top;
}

/* 确保所有选项在同一水平线上 */
:deep(.el-radio__input),
:deep(.el-checkbox__input) {
  vertical-align: top;
  margin-top: 0;
}

:deep(.el-radio__label),
:deep(.el-checkbox__label) {
  display: inline-block;
  vertical-align: top;
  line-height: 1.4;
}
.test-actions-wrapper {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px dashed #eee; // 添加虚线分隔，视觉上更明显
  display: flex;
  justify-content: center;
  width: 100%;
}
.test-actions {
  display: flex !important;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
  margin-bottom: 50px; /* 增加底部边距确保完全显示 */
  position: relative;
  z-index: 10;
  height: auto !important;
  min-height: 60px !important;
  overflow: visible !important;
}

/* 确保按钮可见 */
:deep(.el-button) {
  display: inline-flex !important;
  visibility: visible !important;
  opacity: 1 !important;
  position: relative;
  z-index: 10;
  height: auto !important;
  min-height: 40px !important;
  overflow: visible !important;
  min-width: 120px;
  font-size: 16px;
}

/* 测评结果样式 */
.test-result {
  display: flex;
  justify-content: center;
}

.result-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  max-width: 600px;
  width: 100%;
}

.result-header {
  text-align: center;
  margin-bottom: 30px;
  
  h2 {
    margin: 0 0 20px 0;
    font-size: 28px;
    color: #333;
  }
  
  .result-score {
    .score-label {
      font-size: 18px;
      color: #666;
    }
    
    .score-value {
      font-size: 36px;
      font-weight: bold;
      color: #409eff;
      margin-left: 10px;
    }
  }
}

.result-content {
  .result-level {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    
    .level-label {
      font-size: 16px;
      color: #666;
      margin-right: 10px;
    }
  }
  
  .result-description,
  .result-suggestions {
    margin-bottom: 20px;
    
    h3 {
      margin: 0 0 10px 0;
      font-size: 18px;
      color: #333;
    }
    
    p {
      margin: 0;
      font-size: 16px;
      line-height: 1.6;
      color: #666;
    }
  }
}

.result-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}
</style>