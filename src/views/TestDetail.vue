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
              <router-link to="/counselors" class="first-level">
                心理咨询师
              </router-link>
            </li>
            <li class="">
              <router-link to="/chat" class="first-level">
                智能聊天
              </router-link>
            </li>
            <li class="active">
              <router-link to="/test" class="first-level">
                心理测评
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
      
      // 计算分数（这里简化处理，实际应根据题目选项计算）
      const options = parseOptions(question.options)
      if (question.type === 1 || question.type === 4) {
        const selectedOption = options.find(opt => opt.value === answer)
        score = selectedOption ? selectedOption.score || 0 : 0
      }
      
      questionAnswers.push({
        question_id: question.id,
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
        totalScore: response.total_score,
        result: response.result,
        riskLevel: response.risk_level,
        suggestions: getSuggestions(response.risk_level)
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
}

/* 导航栏样式 */
.navbar {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  cursor: pointer;
  
  h1 {
    margin: 0;
    font-size: 24px;
    color: #333;
  }
}

.nav-menu {
  flex: 1;
}

.nav-actions {
  display: flex;
  gap: 10px;
}

.nav-bg {
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.nav {
  max-width: 1200px;
  margin: 0 auto;
  
  ul {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    
    li {
      position: relative;
      
      a {
        display: block;
        padding: 15px 20px;
        color: #666;
        text-decoration: none;
        font-size: 16px;
        transition: all 0.3s ease;
        
        &:hover {
          color: #409eff;
          background-color: #f0f0f0;
        }
        
        &.router-link-active {
          color: #409eff;
          background-color: #f0f0f0;
        }
      }
      
      &.active a {
        color: #409eff;
        background-color: #f0f0f0;
      }
      
      &.hover::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        width: 0;
        height: 2px;
        background-color: #409eff;
        transform: translateX(-50%);
      }
      
      &.active::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        width: 100%;
        height: 2px;
        background-color: #409eff;
        transform: translateX(-50%);
      }
    }
  }
}

/* 测评内容样式 */
.test-content {
  padding: 30px 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
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
}

.question-item {
  margin-bottom: 30px;
  padding-bottom: 30px;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
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
    display: block;
    margin-bottom: 15px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
}

.test-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
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