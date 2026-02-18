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
                  <el-input v-model="studentForm.student_id" />
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
                    <el-radio :value="1">可用</el-radio>
                    <el-radio :value="0">不可用</el-radio>
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
                  <el-radio-group v-model="studentForm.gender">
                    <el-radio value="male">男</el-radio>
                    <el-radio value="female">女</el-radio>
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
            
          </div>
          
          <!-- 独立容器：咨询师预约时间设置 -->
          <div v-if="userInfo && userInfo.role === 1" class="appointment-settings-container">
            <div class="appointment-settings card-container">
              <h2>预约时间设置</h2>
              
              <!-- 预约时间设置布局 -->
              <div class="appointment-layout" style="display: flex !important; flex-direction: row !important; align-items: flex-start !important; gap: 40px !important;">
                <!-- 一周时间段展示 -->
                <div class="week-schedule" style="width: 1360px; flex-shrink: 0;">
                  <h3>预约时间段表</h3>
                  <div class="schedule-table" style="width: 1360px !important; height: 640px !important; border-collapse: separate; border: 2px solid var(--border-color); border-radius: 8px; overflow: visible; display: block !important;">
                    <table style="width: 1360px !important; height: 640px !important; border-collapse: separate; display: table !important; table-layout: fixed !important; border-spacing: 0;">
                      <thead style="display: table-header-group !important;">
                        <tr style="display: table-row !important;">
                          <th style="width: 150px !important; height: 80px !important; background-color: #f5f5f5; color: #333; font-size: 16px; font-weight: 600; text-align: center; vertical-align: middle; border: 1px solid #ddd; display: table-cell !important;"></th>
                          <th v-for="(day, index) in weekDays" :key="index" style="width: 150px !important; height: 80px !important; background-color: #70ba96; color: white !important; font-weight: bold !important; font-size: 20px !important; text-align: center !important; vertical-align: middle !important; border: 1px solid #ddd; display: table-cell !important; padding: 10px !important;">{{ day.name }}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(time, timeIndex) in timeAxisLabels" :key="timeIndex">
                          <td style="width: 150px !important; height: 80px !important; background-color: #f5f5f5; color: #333; font-size: 21px; font-weight: 600; text-align: center; vertical-align: middle;">{{ time }}</td>
                          <td 
                            v-for="(day, dayIndex) in weekDays" 
                            :key="`${timeIndex}-${dayIndex}`" 
                            class="slot-cell"
                            @click="toggleTimeSlot(day.dayOfWeek, time, getNextTime(timeIndex))"
                            :class="{ 'selected': isTimeSlotSelected(day.dayOfWeek, time, getNextTime(timeIndex)) }"
                            :style="getSlotStyle(day, time, getNextTime(timeIndex))"
                          >
                            <div v-if="hasSlot(day, time, getNextTime(timeIndex))" class="slot-indicator">
                              {{ getSlotInfo(day, time, getNextTime(timeIndex)) }}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <!-- 预约时间选择 -->
                <div class="appointment-selection" style="flex-shrink: 0 !important; width: 350px !important; margin-top: 40px;">
                  <div class="selection-header">
                    <h3>选择预约时间</h3>
                  </div>
                  <div class="selection-content" style="display: flex !important; flex-direction: column !important; gap: 25px !important;">
                    <div class="form-item">
                      <label>选择星期：</label>
                      <el-select v-model="selectedDay" placeholder="请选择星期" @change="onDayChange" style="width: 100% !important;">
                        <el-option 
                          v-for="day in weekDays" 
                          :key="day.dayOfWeek" 
                          :label="day.name" 
                          :value="day.dayOfWeek"
                        />
                      </el-select>
                    </div>
                    <div class="form-item">
                      <label>开始时间：</label>
                      <el-select v-model="selectedStartTime" placeholder="请选择开始时间" style="width: 100% !important;">
                        <el-option 
                          v-for="time in timeOptions" 
                          :key="time.value" 
                          :label="time.label" 
                          :value="time.value"
                        />
                      </el-select>
                    </div>
                    <div class="form-item">
                      <label>结束时间：</label>
                      <el-select v-model="selectedEndTime" placeholder="请选择结束时间" style="width: 100% !important;">
                        <el-option 
                          v-for="time in timeOptions" 
                          :key="time.value" 
                          :label="time.label" 
                          :value="time.value"
                        />
                      </el-select>
                    </div>
                    <div class="form-item">
                      <label>最大预约数：</label>
                      <el-input-number v-model="maxAppointments" :min="1" :max="20" style="width: 100% !important;" />
                    </div>
                    <div class="form-actions" style="display: flex !important; gap: 15px !important; margin-top: 20px !important;">
                      <el-button type="primary" @click="saveAppointmentSettings" :loading="saving" style="flex: 1;">
                        保存设置
                      </el-button>
                      <el-button @click="resetAppointmentSettings" style="flex: 1;">重置</el-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 独立容器：心理健康统计 -->
          <!-- <div class="mental-health-container">
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
          </div> -->
            
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
    student_id: '', // 确保是字符串类型
    school: '',
    major: '',
    grade: '',
    emergency_contact: '',
    emergency_phone: '',
    psychological_status: '正常',
    // user_info部分
    real_name: '',
    gender: '',
    age: 18,
    avatar: '',
    status: 1
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
  
  // 预约时间设置相关数据
  const weekDays = ref([
    { name: '周一', dayOfWeek: 1, slots: [] },
    { name: '周二', dayOfWeek: 2, slots: [] },
    { name: '周三', dayOfWeek: 3, slots: [] },
    { name: '周四', dayOfWeek: 4, slots: [] },
    { name: '周五', dayOfWeek: 5, slots: [] },
    { name: '周六', dayOfWeek: 6, slots: [] },
    { name: '周日', dayOfWeek: 0, slots: [] }
  ])
  
  const selectedDay = ref('')
  const selectedStartTime = ref('')
  const selectedEndTime = ref('')
  const maxAppointments = ref(5)
  const saving = ref(false)
  
  const timeOptions = [
    { label: '09:00', value: '09:00' },
    { label: '10:00', value: '10:00' },
    { label: '11:00', value: '11:00' },
    { label: '12:00', value: '12:00' },
    { label: '13:00', value: '13:00' },
    { label: '14:00', value: '14:00' },
    { label: '15:00', value: '15:00' },
    { label: '16:00', value: '16:00' },
    { label: '17:00', value: '17:00' },
    { label: '18:00', value: '18:00' },
    { label: '19:00', value: '19:00' },
    { label: '20:00', value: '20:00' },
    { label: '21:00', value: '21:00' }
  ]
  
  // 时间轴标签（从早上7点到晚上21点，每两小时一个标签）
  const timeAxisLabels = ref(['07:00', '09:00', '11:00', '13:00', '15:00', '17:00', '19:00', '21:00'])
  
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
        // 设置用户信息
        if (data.data.userInfo) {
          studentForm.real_name = data.data.userInfo.realName || ''
          studentForm.gender = data.data.userInfo.gender || ''
          studentForm.age = data.data.userInfo.age || 18
          studentForm.avatar = data.data.userInfo.avatar || ''
          studentForm.status = data.data.userInfo.status || 1
        }
        
        // 设置学生信息
        if (data.data.studentInfo) {
          studentForm.id = data.data.studentInfo.id
          studentForm.user_id = data.data.studentInfo.userId
          studentForm.student_id = data.data.studentInfo.studentId ? data.data.studentInfo.studentId.toString() : ''
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
              user_info: {
                real_name: studentForm.real_name,
                gender: studentForm.gender,
                age: studentForm.age,
                avatar: studentForm.avatar,
                status: studentForm.status
              },
              student_info: {
                student_id: parseInt(studentForm.student_id),
                school: studentForm.school,
                major: studentForm.major,
                grade: studentForm.grade,
                emergency_contact: studentForm.emergency_contact,
                emergency_phone: studentForm.emergency_phone,
                psychological_status: studentForm.psychological_status
              }
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
  
  // 获取咨询师预约时间设置
  const fetchCounselorSchedule = async () => {
    try {
      // 直接从localStorage获取token
      const token = localStorage.getItem('vue3project_token')
      
      // 调试信息
      console.log('获取咨询师预约时间，token:', token)
      console.log('获取咨询师预约时间，counselorForm:', counselorForm)
      console.log('获取咨询师预约时间，counselorForm.userId:', counselorForm.userId)
      
      // 调用获取咨询师预约时间设置的API
      const data = await request({
        url: '/api/appointment/available',
        method: 'GET',
        params: {
          token: token,
          counselor_id: counselorForm.user_id
        }
      })
      
      console.log('获取咨询师预约时间响应:', data)
      
      if (data && data.code === 200 && data.data) {
        // 重置weekDays数据
        weekDays.value = weekDays.value.map(day => ({
          ...day,
          slots: []
        }))
        
        // 更新weekDays数据
        data.data.forEach(item => {
          const dayIndex = weekDays.value.findIndex(day => day.dayOfWeek === item.dayOfWeek)
          if (dayIndex !== -1) {
            weekDays.value[dayIndex].slots.push({
              start_time: item.startTime,
              end_time: item.endTime,
              max_appointments: item.maxAppointments,
              booked_count: item.bookedCount,
              is_available: item.isAvailable
            })
          }
        })
        
        console.log('更新后的weekDays:', weekDays.value)
      }
    } catch (error) {
      ElMessage.error(error.message || '获取预约时间设置失败')
    }
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
  
  // 判断时间段是否被选中
  const isSelected = (dayOfWeek, startTime, endTime) => {
    return selectedDay.value === dayOfWeek && 
           selectedStartTime.value === startTime && 
           selectedEndTime.value === endTime
  }
  
  // 获取下一个时间点（用于确定时间段）
  const getNextTime = (index) => {
    if (index < timeAxisLabels.value.length - 1) {
      return timeAxisLabels.value[index + 1]
    }
    return '23:00' // 最后一个时间段的结束时间
  }
  
  // 判断表格单元格是否被选中
  const isTimeSlotSelected = (dayOfWeek, startTime, endTime) => {
    // 检查是否有已保存的时间段包含这个时间段
    const day = weekDays.value.find(d => d.dayOfWeek === dayOfWeek)
    if (day && day.slots) {
      return day.slots.some(slot => 
        slot.start_time === startTime && slot.end_time === endTime
      )
    }
    return false
  }
  
  // 判断时间段是否有预约
  const hasSlot = (day, time, nextTime) => {
    const dayData = weekDays.value.find(d => d.dayOfWeek === day.dayOfWeek)
    if (!dayData || !dayData.slots) return false
    
    return dayData.slots.some(slot => {
      // 检查当前时间段是否在预约时间段内
      return time >= slot.start_time && time < slot.end_time
    })
  }
  
  // 获取时间段样式
  const getSlotStyle = (day, time, nextTime) => {
    const baseStyle = {
      width: '150px !important',
      height: '80px !important',
      cursor: 'pointer',
      transition: 'all 0.3s',
      fontSize: '16px',
      textAlign: 'center',
      verticalAlign: 'middle',
      position: 'relative',
      padding: '0'
    }
    
    const dayData = weekDays.value.find(d => d.dayOfWeek === day.dayOfWeek)
    if (!dayData || !dayData.slots) {
      return {
        ...baseStyle,
        backgroundColor: '#fff'
      }
    }
    
    // 检查当前时间段是否在预约时间段内
    const hasAppointment = dayData.slots.some(slot => {
      return time >= slot.start_time && time < slot.end_time
    })
    
    if (hasAppointment) {
      return {
        ...baseStyle,
        backgroundColor: '#70ba96', // 主题绿色
        color: 'white'
      }
    }
    
    return {
      ...baseStyle,
      backgroundColor: '#fff'
    }
  }
  
  // 获取时间段信息
  const getSlotInfo = (day, time, nextTime) => {
    const dayData = weekDays.value.find(d => d.dayOfWeek === day.dayOfWeek)
    if (!dayData || !dayData.slots) return ''
    
    const slot = dayData.slots.find(s => {
      return time >= s.start_time && time < s.end_time
    })
    
    if (!slot) return ''
    
    // 如果是时间段的开始，显示开始时间和结束时间
    if (time === slot.start_time) {
      return `${slot.start_time}-${slot.end_time}\n(${slot.max_appointments - slot.booked_count}/${slot.max_appointments})`
    }
    
    // 如果不是时间段的开始，只显示一个指示器
    return '●'
  }
  
  // 切换时间段选择
  const toggleTimeSlot = (dayOfWeek, startTime, endTime) => {
    if (isSelected(dayOfWeek, startTime, endTime)) {
      // 取消选择
      selectedDay.value = ''
      selectedStartTime.value = ''
      selectedEndTime.value = ''
    } else {
      // 选择时间段
      selectedDay.value = dayOfWeek
      selectedStartTime.value = startTime
      selectedEndTime.value = endTime
    }
  }
  
  // 生成网格单元格
  const generateGridCells = () => {
    const cells = []
    
    // 左上角空白单元格
    cells.push({
      class: 'corner-cell',
      content: '',
      style: 'grid-column: 1; grid-row: 1;',
      clickHandler: null
    })
    
    // 第一行：周几标题
    weekDays.value.forEach((day, index) => {
      cells.push({
        class: 'day-header-cell',
        content: day.name,
        style: `grid-column: ${index + 2}; grid-row: 1;`,
        clickHandler: null
      })
    })
    
    // 其他行：时间段和单元格
    timeAxisLabels.value.forEach((time, timeIndex) => {
      // 时间标签
      cells.push({
        class: 'time-label-cell',
        content: time,
        style: `grid-column: 1; grid-row: ${timeIndex + 2};`,
        clickHandler: null
      })
      
      // 每天的单元格
      weekDays.value.forEach((day, dayIndex) => {
        const endTime = getNextTime(timeIndex)
        cells.push({
          class: `time-slot-cell ${isTimeSlotSelected(day.dayOfWeek, time, endTime) ? 'selected' : ''}`,
          content: '',
          style: `grid-column: ${dayIndex + 2}; grid-row: ${timeIndex + 2};`,
          clickHandler: () => toggleTimeSlot(day.dayOfWeek, time, endTime)
        })
      })
    })
    
    return cells
  }
  
  // 日期改变时的处理
  const onDayChange = () => {
    // 重置时间选择
    selectedStartTime.value = ''
    selectedEndTime.value = ''
  }
  
  // 保存预约时间设置
  const saveAppointmentSettings = async () => {
    if (!selectedDay.value || !selectedStartTime.value || !selectedEndTime.value) {
      ElMessage.warning('请选择完整的预约时间设置')
      return
    }
    
    saving.value = true
    try {
      // 直接从localStorage获取token
      const token = localStorage.getItem('vue3project_token')
      
      // 调用保存预约时间设置的API
      const data = await request({
        url: '/api/appointment/available',
        method: 'POST',
        params: {
          token: token
        },
        data: {
          counselor_id: counselorForm.id,
          day_of_week: selectedDay.value,
          start_time: selectedStartTime.value,
          end_time: selectedEndTime.value,
          max_appointments: maxAppointments.value
        }
      })
      
      if (data && data.code === 200) {
        ElMessage.success('预约时间设置保存成功')
        await fetchCounselorSchedule() // 重新获取数据
        resetAppointmentSettings() // 重置表单
      } else {
        throw new Error(data.message || '保存失败')
      }
    } catch (error) {
      ElMessage.error(error.message || '保存预约时间设置失败')
    } finally {
      saving.value = false
    }
  }
  
  // 重置预约时间设置表单
  const resetAppointmentSettings = () => {
    selectedDay.value = ''
    selectedStartTime.value = ''
    selectedEndTime.value = ''
    maxAppointments.value = 5
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
        await fetchCounselorSchedule()
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
  
  // 独立容器样式
    .appointment-settings-container {
      margin-top: 20px;
      
      .appointment-settings {
        h2 {
          margin-bottom: 20px;
        }
      }
    }
    
    // 预约时间布局样式
    .appointment-layout {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      gap: 40px;
      
      .week-schedule {
        flex-shrink: 0;
        
        h3 {
          font-size: 20px;
          color: var(--text-color);
          margin-bottom: 20px;
        }
        
        .schedule-table {
          width: 800px;
          height: 640px;
          border-collapse: collapse;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          overflow: hidden;
          
          table {
            width: 100%;
            height: 100%;
            border-collapse: collapse;
            table-layout: fixed;
          }
          
          th, td {
            border: 1px solid var(--border-color);
            padding: 0;
            text-align: center;
            width: 150px;
            height: 80px;
          }
          
          th {
            background-color: var(--primary-color);
            color: white;
            font-weight: 600;
            font-size: 16px;
          }
          
          th:first-child,
          td:first-child {
            background-color: var(--secondary-color);
            color: var(--text-secondary);
            font-size: 14px;
            width: 150px;
            font-weight: 600;
          }
          
          .slot-cell {
            background-color: var(--background-color);
            cursor: pointer;
            transition: all 0.3s;
            font-size: 14px;
            width: 150px;
            height: 80px;
          }
          
          .slot-cell:hover {
            background-color: rgba(var(--primary-color), 0.1);
          }
          
          .slot-cell.selected {
          background-color: var(--primary-color);
          color: white;
          box-shadow: 0 2px 8px rgba(var(--primary-color), 0.3);
        }
        
        .slot-indicator {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100%;
          font-size: 12px;
          font-weight: bold;
          white-space: pre-line;
        }
        }
      }
      
      .appointment-selection {
        flex-shrink: 0;
        width: 350px;
        margin-top: 40px;
        
        .selection-header {
          margin-bottom: 30px;
          
          h3 {
            font-size: 20px;
            color: var(--text-color);
          }
        }
        
        .selection-content {
          display: flex;
          flex-direction: column;
          gap: 25px;
          
          .form-item {
            
            label {
              display: block;
              margin-bottom: 10px;
              font-weight: 500;
              color: var(--text-color);
              font-size: 16px;
            }
            
            .el-select,
            .el-input-number {
              width: 100%;
            }
          }
          
          .form-actions {
            display: flex;
            gap: 15px;
            margin-top: 20px;
            
            .el-button {
              flex: 1;
            }
          }
        }
      }
    }
    
    // 心理健康统计容器样式
    .mental-health-container {
      margin-top: 20px;
      
      .mental-health-stats {
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
              font-size: 24px;
              font-weight: 600;
              color: var(--primary-color);
              margin-bottom: 8px;
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
            margin-bottom: 15px;
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