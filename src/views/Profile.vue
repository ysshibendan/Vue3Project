<template>
    <div class="page-container">
      <app-header />
      
      <div class="main-content">
        <app-sidebar />
        
        <div class="content-area">
          <div class="profile-header card-container">
            <h1>个人资料</h1>
            <p>管理您的个人信息和账户设置</p>
          </div>
          
          <div class="profile-content">
            <div class="profile-info card-container">
              <h2>基本信息</h2>
              <el-form
                ref="profileFormRef"
                :model="profileForm"
                :rules="profileRules"
                label-width="100px"
                class="profile-form"
              >
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="profileForm.username" disabled />
                </el-form-item>
                
                <el-form-item label="昵称" prop="nickname">
                  <el-input v-model="profileForm.nickname" placeholder="请输入昵称" />
                </el-form-item>
                
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="profileForm.email" placeholder="请输入邮箱" />
                </el-form-item>
                
                <el-form-item label="手机号" prop="phone">
                  <el-input v-model="profileForm.phone" placeholder="请输入手机号" />
                </el-form-item>
                
                <el-form-item label="性别" prop="gender">
                  <el-radio-group v-model="profileForm.gender">
                    <el-radio label="male">男</el-radio>
                    <el-radio label="female">女</el-radio>
                    <el-radio label="other">其他</el-radio>
                  </el-radio-group>
                </el-form-item>
                
                <el-form-item label="生日" prop="birthday">
                  <el-date-picker
                    v-model="profileForm.birthday"
                    type="date"
                    placeholder="选择生日"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                  />
                </el-form-item>
                
                <el-form-item>
                  <el-button type="primary" @click="updateProfile" :loading="updating">
                    保存更改
                  </el-button>
                  <el-button @click="resetForm">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
            
            <div class="password-section card-container">
              <h2>修改密码</h2>
              <el-form
                ref="passwordFormRef"
                :model="passwordForm"
                :rules="passwordRules"
                label-width="100px"
                class="password-form"
              >
                <el-form-item label="当前密码" prop="currentPassword">
                  <el-input
                    v-model="passwordForm.currentPassword"
                    type="password"
                    placeholder="请输入当前密码"
                    show-password
                  />
                </el-form-item>
                
                <el-form-item label="新密码" prop="newPassword">
                  <el-input
                    v-model="passwordForm.newPassword"
                    type="password"
                    placeholder="请输入新密码"
                    show-password
                  />
                </el-form-item>
                
                <el-form-item label="确认密码" prop="confirmPassword">
                  <el-input
                    v-model="passwordForm.confirmPassword"
                    type="password"
                    placeholder="请再次输入新密码"
                    show-password
                  />
                </el-form-item>
                
                <el-form-item>
                  <el-button type="primary" @click="updatePassword" :loading="updatingPassword">
                    修改密码
                  </el-button>
                  <el-button @click="resetPasswordForm">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
            
            <div class="mental-health-stats card-container">
              <h2>心理健康统计</h2>
              <div class="stats-grid">
                <div class="stat-item">
                  <div class="stat-value">{{ mentalHealthStats.totalSessions }}</div>
                  <div class="stat-label">总对话次数</div>
                </div>
                
                <div class="stat-item">
                  <div class="stat-value">{{ mentalHealthStats.avgRiskScore }}</div>
                  <div class="stat-label">平均风险分数</div>
                </div>
                
                <div class="stat-item">
                  <div class="stat-value">{{ mentalHealthStats.currentStreak }}</div>
                  <div class="stat-label">连续咨询天数</div>
                </div>
                
                <div class="stat-item">
                  <div class="stat-value">{{ mentalHealthStats.improvementRate }}%</div>
                  <div class="stat-label">改善率</div>
                </div>
              </div>
              
              <div class="chart-container">
                <h3>风险趋势图</h3>
                <div class="chart-placeholder">
                  <el-empty description="图表功能正在开发中" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import { useAuthStore } from '@/store/auth'
  import { useAuth } from '@/composables/useAuth'
  import AppHeader from '@/components/common/Header.vue'
  import AppSidebar from '@/components/common/Sidebar.vue'
  
  const authStore = useAuthStore()
  const { requireAuth } = useAuth()
  
  // 检查认证状态
  if (!requireAuth()) {
    // 如果未认证，将会重定向到登录页面
  }
  
  const profileFormRef = ref()
  const passwordFormRef = ref()
  const updating = ref(false)
  const updatingPassword = ref(false)
  
  const profileForm = reactive({
    username: '',
    nickname: '',
    email: '',
    phone: '',
    gender: '',
    birthday: ''
  })
  
  const passwordForm = reactive({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const mentalHealthStats = ref({
    totalSessions: 0,
    avgRiskScore: 0,
    currentStreak: 0,
    improvementRate: 0
  })
  
  const profileRules = {
    nickname: [
      { max: 20, message: '昵称长度不能超过20个字符', trigger: 'blur' }
    ],
    email: [
      { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
    ],
    phone: [
      { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
    ]
  }
  
  const passwordRules = {
    currentPassword: [
      { required: true, message: '请输入当前密码', trigger: 'blur' }
    ],
    newPassword: [
      { required: true, message: '请输入新密码', trigger: 'blur' },
      { min: 6, max: 20, message: '密码长度在6到20个字符', trigger: 'blur' }
    ],
    confirmPassword: [
      { required: true, message: '请确认新密码', trigger: 'blur' },
      {
        validator: (rule, value, callback) => {
          if (value !== passwordForm.newPassword) {
            callback(new Error('两次输入的密码不一致'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ]
  }
  
  // 获取用户资料
  const fetchProfile = async () => {
    try {
      // 这里应该调用获取用户资料的API
      // 模拟数据
      profileForm.username = authStore.userInfo?.username || ''
      profileForm.nickname = authStore.userInfo?.nickname || ''
      profileForm.email = authStore.userInfo?.email || ''
      profileForm.phone = authStore.userInfo?.phone || ''
      profileForm.gender = authStore.userInfo?.gender || ''
      profileForm.birthday = authStore.userInfo?.birthday || ''
    } catch (error) {
      ElMessage.error(error.message || '获取用户资料失败')
    }
  }
  
  // 获取心理健康统计
  const fetchMentalHealthStats = async () => {
    try {
      // 这里应该调用获取心理健康统计的API
      // 模拟数据
      mentalHealthStats.value = {
        totalSessions: 12,
        avgRiskScore: 0.25,
        currentStreak: 5,
        improvementRate: 15
      }
    } catch (error) {
      ElMessage.error(error.message || '获取心理健康统计失败')
    }
  }
  
  // 更新个人资料
  const updateProfile = async () => {
    if (!profileFormRef.value) return
    
    await profileFormRef.value.validate(async (valid) => {
      if (valid) {
        updating.value = true
        try {
          // 这里应该调用更新个人资料的API
          ElMessage.success('个人资料更新成功')
        } catch (error) {
          ElMessage.error(error.message || '更新个人资料失败')
        } finally {
          updating.value = false
        }
      }
    })
  }
  
  // 更新密码
  const updatePassword = async () => {
    if (!passwordFormRef.value) return
    
    await passwordFormRef.value.validate(async (valid) => {
      if (valid) {
        updatingPassword.value = true
        try {
          // 这里应该调用更新密码的API
          ElMessage.success('密码修改成功')
          resetPasswordForm()
        } catch (error) {
          ElMessage.error(error.message || '密码修改失败')
        } finally {
          updatingPassword.value = false
        }
      }
    })
  }
  
  // 重置表单
  const resetForm = () => {
    fetchProfile()
  }
  
  // 重置密码表单
  const resetPasswordForm = () => {
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    if (passwordFormRef.value) {
      passwordFormRef.value.clearValidate()
    }
  }
  
  onMounted(() => {
    fetchProfile()
    fetchMentalHealthStats()
  })
  </script>
  
  <style scoped lang="scss">
  .content-area {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
  }
  
  .profile-header {
    margin-bottom: 20px;
    
    h1 {
      font-size: 24px;
      color: var(--text-color);
      margin-bottom: 10px;
    }
    
    p {
      font-size: 16px;
      color: var(--text-regular);
    }
  }
  
  .profile-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    
    .card-container {
      h2 {
        font-size: 20px;
        color: var(--text-color);
        margin-bottom: 20px;
      }
    }
    
    .mental-health-stats {
      grid-column: span 2;
      
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
        margin-bottom: 30px;
        
        .stat-item {
          text-align: center;
          padding: 20px;
          background-color: var(--secondary-color);
          border-radius: 8px;
          
          .stat-value {
            font-size: 28px;
            font-weight: 600;
            color: var(--primary-color);
            margin-bottom: 5px;
          }
          
          .stat-label {
            font-size: 14px;
            color: var(--text-secondary);
          }
        }
      }
      
      .chart-container {
        h3 {
          font-size: 18px;
          color: var(--text-color);
          margin-bottom: 20px;
        }
        
        .chart-placeholder {
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--secondary-color);
          border-radius: 8px;
        }
      }
    }
  }
  
  @media (max-width: 1200px) {
    .profile-content {
      grid-template-columns: 1fr;
      
      .mental-health-stats {
        grid-column: span 1;
        
        .stats-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
    }
  }
  </style>