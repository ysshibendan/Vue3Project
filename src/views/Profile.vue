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
            <!-- 基本信息 - 根据角色显示不同内容 -->
            <div class="profile-info card-container">
              <h2>基本信息</h2>
              
              <!-- 学生基本信息 -->
              <el-form
                v-if="userInfo && userInfo.role === 0"
                ref="profileFormRef"
                :model="studentForm"
                :rules="studentRules"
                label-width="100px"
                class="profile-form"
              >
                <el-form-item label="学号" prop="student_id">
                  <el-input v-model="studentForm.student_id" disabled />
                </el-form-item>
                
                <el-form-item label="学校" prop="school">
                  <el-input v-model="studentForm.school" />
                </el-form-item>
                
                <el-form-item label="专业" prop="major">
                  <el-input v-model="studentForm.major" />
                </el-form-item>
                
                <el-form-item label="年级" prop="grade">
                  <el-input v-model="studentForm.grade" />
                </el-form-item>
                
                <el-form-item label="紧急联系人" prop="emergency_contact">
                  <el-input v-model="studentForm.emergency_contact" />
                </el-form-item>
                
                <el-form-item label="紧急联系电话" prop="emergency_phone">
                  <el-input v-model="studentForm.emergency_phone" />
                </el-form-item>
                

                
                <el-form-item>
                  <el-button type="primary" @click="updateStudentProfile" :loading="updating">
                    保存更改
                  </el-button>
                  <el-button @click="resetForm">重置</el-button>
                </el-form-item>
              </el-form>
              
              <!-- 咨询师基本信息 -->
              <el-form
                v-else-if="userInfo && userInfo.role === 1"
                ref="profileFormRef"
                :model="counselorForm"
                :rules="counselorRules"
                label-width="100px"
                class="profile-form"
              >
                <el-form-item label="专业领域" prop="specialty">
                  <el-input v-model="counselorForm.specialty" />
                </el-form-item>
                
                <el-form-item label="工作经验" prop="work_experience">
                  <el-input-number v-model="counselorForm.work_experience" :min="0" />
                </el-form-item>
                
                <el-form-item label="简介" prop="introduction">
                  <el-input v-model="counselorForm.introduction" type="textarea" :rows="4" />
                </el-form-item>
                
                <el-form-item label="状态" prop="status">
                  <el-radio-group v-model="counselorForm.status">
                    <el-radio :label="1">可用</el-radio>
                    <el-radio :label="0">不可用</el-radio>
                  </el-radio-group>
                </el-form-item>
                
                <el-form-item>
                  <el-button type="primary" @click="updateCounselorProfile" :loading="updating">
                    保存更改
                  </el-button>
                  <el-button @click="resetForm">重置</el-button>
                </el-form-item>
              </el-form>
              
              <!-- 管理员基本信息 -->
              <el-form
                v-else-if="userInfo && userInfo.role === 2"
                ref="profileFormRef"
                :model="adminForm"
                :rules="adminRules"
                label-width="100px"
                class="profile-form"
              >
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="adminForm.username" disabled />
                </el-form-item>
                
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="adminForm.email" />
                </el-form-item>
                
                <el-form-item label="手机号" prop="phone">
                  <el-input v-model="adminForm.phone" />
                </el-form-item>
                
                <el-form-item label="真实姓名" prop="real_name">
                  <el-input v-model="adminForm.real_name" />
                </el-form-item>
                
                <el-form-item label="性别" prop="gender">
                  <el-radio-group v-model="adminForm.gender">
                    <el-radio label="male">男</el-radio>
                    <el-radio label="female">女</el-radio>
                  </el-radio-group>
                </el-form-item>
                
                <el-form-item label="年龄" prop="age">
                  <el-input-number v-model="adminForm.age" :min="18" :max="100" />
                </el-form-item>
                
                <el-form-item>
                  <el-button type="primary" @click="updateAdminProfile" :loading="updating">
                    保存更改
                  </el-button>
                  <el-button @click="resetForm">重置</el-button>
                </el-form-item>
              </el-form>
              
              <!-- 如果没有用户信息，显示加载状态 -->
              <div v-if="!userInfo" style="text-align: center; padding: 20px;">
                <el-icon class="is-loading"><loading /></el-icon>
                <p style="margin-top: 10px;">正在加载用户信息...</p>
              </div>
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
  import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/store/auth'
import { useAuth } from '@/composables/useAuth'
import request from '@/utils/request'
import AppHeader from '@/components/common/Header.vue'
import AppSidebar from '@/components/common/Sidebar.vue'
  
  const authStore = useAuthStore()
const { requireAuth } = useAuth()

// 获取用户信息
const userInfo = computed(() => authStore.userInfo)

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
  
  const studentForm = reactive({
    id: '',
    user_id: '',
    student_id: '',
    school: '',
    major: '',
    grade: '',
    emergency_contact: '',
    emergency_phone: '',
    psychological_status: '正常'
  })
  
  const counselorForm = reactive({
    id: '',
    user_id: '',
    specialty: '',
    work_experience: 0,
    introduction: '',
    status: 1
  })
  
  const adminForm = reactive({
    id: '',
    username: '',
    email: '',
    phone: '',
    real_name: '',
    gender: '',
    age: 18
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
  
  const studentRules = {
    student_id: [
      { required: true, message: '学号不能为空', trigger: 'blur' }
    ],
    school: [
      { max: 50, message: '学校名称长度不能超过50个字符', trigger: 'blur' }
    ],
    major: [
      { max: 50, message: '专业名称长度不能超过50个字符', trigger: 'blur' }
    ],
    grade: [
      { max: 20, message: '年级长度不能超过20个字符', trigger: 'blur' }
    ],
    emergency_contact: [
      { max: 20, message: '紧急联系人长度不能超过20个字符', trigger: 'blur' }
    ],
    emergency_phone: [
      { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
    ]
  }
  
  const counselorRules = {
    specialty: [
      { required: true, message: '专业领域不能为空', trigger: 'blur' },
      { max: 100, message: '专业领域长度不能超过100个字符', trigger: 'blur' }
    ],
    work_experience: [
      { required: true, message: '工作经验不能为空', trigger: 'blur' },
      { type: 'number', min: 0, message: '工作经验必须大于等于0', trigger: 'blur' }
    ],
    introduction: [
      { max: 500, message: '简介长度不能超过500个字符', trigger: 'blur' }
    ],
    status: [
      { required: true, message: '状态不能为空', trigger: 'blur' }
    ]
  }
  
  const adminRules = {
    username: [
      { required: true, message: '用户名不能为空', trigger: 'blur' }
    ],
    email: [
      { required: true, message: '邮箱不能为空', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
    ],
    phone: [
      { required: true, message: '手机号不能为空', trigger: 'blur' },
      { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
    ],
    real_name: [
      { required: true, message: '真实姓名不能为空', trigger: 'blur' },
      { max: 20, message: '真实姓名长度不能超过20个字符', trigger: 'blur' }
    ],
    gender: [
      { required: true, message: '性别不能为空', trigger: 'blur' }
    ],
    age: [
      { required: true, message: '年龄不能为空', trigger: 'blur' },
      { type: 'number', min: 18, max: 100, message: '年龄必须在18到100之间', trigger: 'blur' }
    ]
  }
  
  const validateConfirmPassword = (rule, value, callback) => {
    if (value !== passwordForm.newPassword) {
      callback(new Error('两次输入的密码不一致'))
    } else {
      callback()
    }
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
      { validator: validateConfirmPassword, trigger: 'blur' }
    ]
  }
  
  // 获取学生资料
  const fetchStudentProfile = async () => {
    try {
      // 直接从localStorage获取token
      const token = localStorage.getItem('vue3project_token')
      
      // 调用获取学生资料的API
      const data = await request({
        url: '/api/userinfo',
        method: 'GET',
        params: {
          token: token
        }
      })
      

      
      if (data && data.code === 200 && data.data) {
        // 设置学生信息
        if (data.data.studentInfo) {
          studentForm.id = data.data.studentInfo.id
          studentForm.user_id = data.data.studentInfo.userId
          studentForm.student_id = data.data.studentInfo.studentId || ''
          studentForm.school = data.data.studentInfo.school || ''
          studentForm.major = data.data.studentInfo.major || ''
          studentForm.grade = data.data.studentInfo.grade || ''
          studentForm.emergency_contact = data.data.studentInfo.emergencyContact || ''
          studentForm.emergency_phone = data.data.studentInfo.emergencyPhone || ''
          studentForm.psychological_status = data.data.studentInfo.psychologicalStatus || '良好'

        }
        
        // 更新store中的用户信息
        if (data.data.userInfo) {
          authStore.setUserInfo(data.data.userInfo)
        }
      }
    } catch (error) {
      ElMessage.error(error.message || '获取学生资料失败')
    }
  }
  
  // 强制刷新方法
  const forceRefresh = async () => {
    // 强制更新视图
    await new Promise(resolve => setTimeout(resolve, 0))
    
    // 强制触发响应式更新
    await new Promise(resolve => {
      if (userInfo.value && userInfo.value.role === 0) {
        studentForm.id = studentForm.id
        studentForm.user_id = studentForm.user_id
        studentForm.student_id = studentForm.student_id
        studentForm.school = studentForm.school
        studentForm.major = studentForm.major
        studentForm.grade = studentForm.grade
        studentForm.emergency_contact = studentForm.emergency_contact
        studentForm.emergency_phone = studentForm.emergency_phone
        studentForm.psychological_status = studentForm.psychological_status
      } else if (userInfo.value && userInfo.value.role === 1) {
        counselorForm.id = counselorForm.id
        counselorForm.user_id = counselorForm.user_id
        counselorForm.specialty = counselorForm.specialty
        counselorForm.work_experience = counselorForm.work_experience
        counselorForm.introduction = counselorForm.introduction
        counselorForm.status = counselorForm.status
      } else if (userInfo.value && userInfo.value.role === 2) {
        adminForm.id = adminForm.id
        adminForm.username = adminForm.username
        adminForm.email = adminForm.email
        adminForm.phone = adminForm.phone
        adminForm.real_name = adminForm.real_name
        adminForm.gender = adminForm.gender
        adminForm.age = adminForm.age
      }
      resolve()
    })
  }
  
  // 获取咨询师资料
  const fetchCounselorProfile = async () => {
    try {
      // 直接从localStorage获取token
      const token = localStorage.getItem('vue3project_token')
      console.log('获取咨询师资料时使用的token:', token)
      
      // 调用获取咨询师资料的API
      const data = await request({
        url: '/api/counselor',
        method: 'GET',
        params: {
          token: token
        }
      })
      
      console.log('咨询师资料响应:', data)
      
      if (data && data.code === 200 && data.data) {
        // 设置咨询师信息
        if (data.data.counselorInfo) {
          counselorForm.id = data.data.counselorInfo.id
          counselorForm.user_id = data.data.counselorInfo.userId
          counselorForm.specialty = data.data.counselorInfo.specialty || ''
          counselorForm.work_experience = data.data.counselorInfo.workExperience || 0
          counselorForm.introduction = data.data.counselorInfo.introduction || ''
          counselorForm.status = data.data.counselorInfo.status !== undefined ? data.data.counselorInfo.status : 1
        }
        
        // 更新store中的用户信息
        if (data.data.userInfo) {
          authStore.setUserInfo(data.data.userInfo)
        }
      }
    } catch (error) {
      ElMessage.error(error.message || '获取咨询师资料失败')
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
  
  // 获取个人资料
  const fetchProfile = async () => {
    try {
      // 根据用户角色获取不同的资料
      if (userInfo.value && userInfo.value.role === 0) {
        await fetchStudentProfile()
      } else if (userInfo.value && userInfo.value.role === 1) {
        await fetchCounselorProfile()
      }
      
      // 获取基本信息
      if (userInfo.value) {
        profileForm.username = userInfo.value.username || ''
        profileForm.nickname = userInfo.value.nickname || ''
        profileForm.email = userInfo.value.email || ''
        profileForm.phone = userInfo.value.phone || ''
        profileForm.gender = userInfo.value.gender || ''
        profileForm.birthday = userInfo.value.birthday || ''
      }
    } catch (error) {
      ElMessage.error(error.message || '获取个人资料失败')
    }
  }
  
  // 更新个人资料
  const updateProfile = async () => {
    if (!profileFormRef.value) return
    
    await profileFormRef.value.validate(async (valid) => {
      if (valid) {
        updating.value = true
        try {
          // 根据用户角色更新不同的资料
          if (userInfo.value && userInfo.value.role === 0) {
            await updateStudentProfile()
          } else if (userInfo.value && userInfo.value.role === 1) {
            await updateCounselorProfile()
          }
        } catch (error) {
          ElMessage.error(error.message || '更新个人资料失败')
        } finally {
          updating.value = false
        }
      }
    })
  }
  
  // 更新学生资料
  const updateStudentProfile = async () => {
    if (!profileFormRef.value) return
    
    await profileFormRef.value.validate(async (valid) => {
      if (valid) {
        updating.value = true
        try {
          // 直接从localStorage获取token
          const token = localStorage.getItem('vue3project_token')
          
          const data = await request({
            url: '/api/userinfo',
            method: 'PUT',
            params: {
              token: token
            },
            data: {
              studentId: studentForm.student_id,
              school: studentForm.school,
              major: studentForm.major,
              grade: studentForm.grade,
              emergencyContact: studentForm.emergency_contact,
              emergencyPhone: studentForm.emergency_phone,
              psychologicalStatus: studentForm.psychological_status
            }
          })
          
          if (data && data.code === 200) {
            ElMessage.success('学生资料更新成功')
            fetchStudentProfile()
          } else {
            throw new Error(data.message || '更新失败')
          }
        } catch (error) {
          ElMessage.error(error.message || '更新学生资料失败')
        } finally {
          updating.value = false
        }
      }
    })
  }
  
  // 更新咨询师资料
  const updateCounselorProfile = async () => {
    if (!profileFormRef.value) return
    
    await profileFormRef.value.validate(async (valid) => {
      if (valid) {
        updating.value = true
        try {
          // 直接从localStorage获取token
          const token = localStorage.getItem('vue3project_token')
          
          const data = await request({
            url: '/api/counselor',
            method: 'PUT',
            params: {
              token: token
            },
            data: {
              specialty: counselorForm.specialty,
              workExperience: counselorForm.work_experience,
              introduction: counselorForm.introduction,
              status: counselorForm.status
            }
          })
          
          if (data && data.code === 200) {
            ElMessage.success('咨询师资料更新成功')
            fetchCounselorProfile()
          } else {
            throw new Error(data.message || '更新失败')
          }
        } catch (error) {
          ElMessage.error(error.message || '更新咨询师资料失败')
        } finally {
          updating.value = false
        }
      }
    })
  }
  
  // 获取管理员资料
  const fetchAdminProfile = async () => {
    try {
      // 直接从localStorage获取token
      const token = localStorage.getItem('vue3project_token')
      console.log('获取管理员资料时使用的token:', token)
      
      // 调用获取管理员资料的API
      const data = await request({
        url: '/api/userinfo',
        method: 'GET',
        params: {
          token: token
        }
      })
      
      console.log('管理员资料响应:', data)
      
      if (data && data.code === 200 && data.data && data.data.userInfo) {
        adminForm.id = data.data.userInfo.id
        adminForm.username = data.data.userInfo.username || ''
        adminForm.email = data.data.userInfo.email || ''
        adminForm.phone = data.data.userInfo.phone || ''
        adminForm.real_name = data.data.userInfo.realName || ''
        adminForm.gender = data.data.userInfo.gender || ''
        adminForm.age = data.data.userInfo.age || 18
      }
    } catch (error) {
      ElMessage.error(error.message || '获取管理员资料失败')
    }
  }
  
  // 更新管理员资料
  const updateAdminProfile = async () => {
    if (!profileFormRef.value) return
    
    await profileFormRef.value.validate(async (valid) => {
      if (valid) {
        updating.value = true
        try {
          // 直接从localStorage获取token
          const token = localStorage.getItem('vue3project_token')
          
          const data = await request({
            url: '/api/userinfo',
            method: 'PUT',
            params: {
              token: token
            },
            data: {
              email: adminForm.email,
              phone: adminForm.phone,
              realName: adminForm.real_name,
              gender: adminForm.gender,
              age: adminForm.age
            }
          })
          
          if (data && data.code === 200) {
            ElMessage.success('管理员资料更新成功')
            fetchAdminProfile() // 重新获取数据
          } else {
            throw new Error(data.message || '更新失败')
          }
        } catch (error) {
          ElMessage.error(error.message || '更新管理员资料失败')
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
          // 直接从localStorage获取token
          const token = localStorage.getItem('vue3project_token')
          console.log('更新密码时使用的token:', token)
          
          // 调用更新密码的API
          const data = await request({
            url: '/api/user/password',
            method: 'PUT',
            params: {
              token: token
            },
            data: {
              currentPassword: passwordForm.currentPassword,
              newPassword: passwordForm.newPassword
            }
          })
          
          if (data && data.code === 200) {
            ElMessage.success('密码修改成功')
            resetPasswordForm()
          } else {
            throw new Error(data.message || '密码修改失败')
          }
        } catch (error) {
          ElMessage.error(error.message || '更新密码失败')
        } finally {
          updatingPassword.value = false
        }
      }
    })
  }
  
  // 重置表单
  const resetForm = () => {
    if (userInfo.value && userInfo.value.role === 0) {
      fetchStudentProfile()
    } else if (userInfo.value && userInfo.value.role === 1) {
      fetchCounselorProfile()
    } else if (userInfo.value && userInfo.value.role === 2) {
      fetchAdminProfile()
    }
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
  
  onMounted(async () => {
    try {
      // 直接从localStorage获取token
      const token = localStorage.getItem('vue3project_token')
      
      // 如果localStorage中有token但store中没有，更新store
      if (token && !authStore.token) {
        authStore.token = token
      }
      
      // 先获取用户信息以确定角色
      await authStore.fetchUserInfo()
      
      // 根据用户角色获取不同的资料
      if (userInfo.value && userInfo.value.role === 0) {
        await fetchStudentProfile()
      } else if (userInfo.value && userInfo.value.role === 1) {
        await fetchCounselorProfile()
      } else if (userInfo.value && userInfo.value.role === 2) {
        await fetchAdminProfile()
      }
      
      fetchMentalHealthStats()
    } catch (error) {
      console.error('获取用户信息失败:', error)
      ElMessage.error('获取用户信息失败')
    }
  })
  </script>
  
  <style scoped lang="scss">
  .page-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    overflow: hidden; // 防止整个页面滚动
  }

  .main-content {
    display: flex;
    flex: 1;
    overflow: hidden; // 防止主内容区域滚动
  }
  .content-area {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    height: calc(100vh - 60px); // 确保内容区域有固定高度
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
    
    .profile-form {
      .el-form-item {
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