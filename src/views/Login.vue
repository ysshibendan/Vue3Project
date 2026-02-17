<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h2>心理健康咨询平台</h2>
        <div class="tabs">
          <div 
            :class="['tab', { active: activeTab === 'login' }]" 
            @click="activeTab = 'login'"
          >
            登录
          </div>
          <div 
            :class="['tab', { active: activeTab === 'register' }]" 
            @click="activeTab = 'register'"
          >
            注册
          </div>
        </div>
        <p v-if="activeTab === 'login'">欢迎回来，请登录您的账户</p>
        <p v-if="activeTab === 'register'">创建新账户，加入我们</p>
      </div>
      
      <!-- 登录表单 -->
      <form 
        v-if="activeTab === 'login'"
        class="login-form"
        @submit.prevent="handleLogin"
      >
        <div class="form-item">
          <input
            v-model="loginForm.username"
            type="text"
            placeholder="用户名"
            class="form-input"
          />
        </div>
        
        <div class="form-item">
          <input
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
            class="form-input"
          />
        </div>
        
        <div class="form-item">
          <button 
            type="submit" 
            class="login-button"
            :disabled="loading"
          >
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </div>
      </form>
      
      <!-- 注册表单 -->
      <form 
          v-if="activeTab === 'register'"
          class="login-form"
          @submit.prevent="handleRegister"
        >
        <div class="form-item">
          <input
            v-model="registerForm.username"
            type="text"
            placeholder="用户名"
            class="form-input"
          />
        </div>
        
        <div class="form-item">
          <input
            v-model="registerForm.password"
            type="password"
            placeholder="密码"
            class="form-input"
          />
        </div>
        
        <div class="form-item">
          <input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="确认密码"
            class="form-input"
          />
        </div>
        
        <div class="form-item">
          <input
            v-model="registerForm.email"
            type="email"
            placeholder="邮箱"
            class="form-input"
          />
        </div>
        
        <div class="form-item">
          <input
            v-model="registerForm.phone"
            type="tel"
            placeholder="手机号"
            class="form-input"
          />
        </div>
        
        <div class="form-item">
          <input
            v-model="registerForm.realName"
            type="text"
            placeholder="真实姓名"
            class="form-input"
          />
        </div>
        
        <div class="form-item">
          <select v-model="registerForm.gender" class="form-select">
            <option value="">请选择性别</option>
            <option value="male">男</option>
            <option value="female">女</option>
            <option value="unknown">其他</option>
          </select>
        </div>
        
        <div class="form-item">
          <button 
            type="submit" 
            class="login-button"
            :disabled="registerLoading"
          >
            {{ registerLoading ? '注册中...' : '注册' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { register } from '@/api/auth'

const router = useRouter()
const authStore = useAuthStore()

// 当前激活的标签页
const activeTab = ref('login')

// 登录表单相关
const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

// 注册表单相关
const registerLoading = ref(false)

const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  phone: '',
  realName: '',
  gender: ''
})

// 处理登录
const handleLogin = async () => {
  if (!loginForm.username || !loginForm.password) {
    alert('请输入用户名和密码')
    return
  }
  
  loading.value = true
  try {
    await authStore.login(loginForm)
    console.log('登录成功，准备跳转')
     // 使用nextTick确保状态更新后再跳转
     await router.push('/')
    console.log('跳转完成')
  } catch (error) {
    console.error('登录失败:', error)
    alert(error.message || '登录失败')
  } finally {
    loading.value = false
  }
}

// 处理注册
const handleRegister = async () => {
  if (!registerForm.username || !registerForm.password || !registerForm.email) {
    alert('请填写必填项')
    return
  }
  
  if (registerForm.password !== registerForm.confirmPassword) {
    alert('两次输入的密码不一致')
    return
  }
  
  registerLoading.value = true
  try {
    const response = await register({
      username: registerForm.username,
      password: registerForm.password,
      email: registerForm.email,
      phone: registerForm.phone,
      real_name: registerForm.realName,
      gender: registerForm.gender
    })
    
    if (response.code === 200) {
      alert('注册成功，请登录')
      activeTab.value = 'login' // 切换到登录标签
      
      // 清空注册表单
      Object.keys(registerForm).forEach(key => {
        registerForm[key] = ''
      })
    } else {
      alert(response.message || '注册失败')
    }
  } catch (error) {
    alert(error.message || '注册失败')
  } finally {
    registerLoading.value = false
  }
}
  </script>
  <style scoped>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  }
  
  .login-card {
    width: 400px;
    padding: 40px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  
  .login-header {
    text-align: center;
    margin-bottom: 30px;
  }
  
  .login-header h2 {
    font-size: 24px;
    color: #303133;
    margin-bottom: 20px;
  }
  
  .tabs {
    display: flex;
    margin-bottom: 20px;
  }
  
  .tab {
    flex: 1;
    padding: 10px;
    text-align: center;
    cursor: pointer;
    border-bottom: 2px solid #e4e7ed;
  }
  
  .tab.active {
    color: #409eff;
    border-bottom: 2px solid #409eff;
  }
  
  .login-header p {
    color: #909399;
    font-size: 14px;
    margin-top: 10px;
  }
  
  .login-form {
    display: flex;
    flex-direction: column;
  }
  
  .form-item {
    margin-bottom: 15px;
  }
  
  .form-input, .form-select {
    width: 100%;
    padding: 12px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    font-size: 14px;
  }
  
  .form-input:focus, .form-select:focus {
    outline: none;
    border-color: #409eff;
  }
  
  .login-button {
    width: 100%;
    padding: 12px;
    background-color: #409eff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
  }
  
  .login-button:hover {
    background-color: #66b1ff;
  }
  
  .login-button:disabled {
    background-color: #a0cfff;
    cursor: not-allowed;
  }
  </style>