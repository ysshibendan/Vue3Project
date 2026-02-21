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
                <el-form-item label="头像" prop="avatar">
                  <div class="avatar-upload">
                    <img v-if="studentForm.avatar" :src="getAvatarUrl(studentForm.avatar)" class="avatar-preview" />                    <el-upload
                      class="avatar-uploader"
                      action="#"
                      :show-file-list="false"
                      :before-upload="beforeAvatarUpload"
                      :http-request="() => {}"
                      accept="image/*"
                    >
                      <template #trigger>
                        <el-button size="small" type="primary">选择头像</el-button>
                      </template>
                    </el-upload>
                  </div>
                </el-form-item>
                
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
                <el-form-item label="头像" prop="avatar">
                  <div class="avatar-upload">
                    <img v-if="counselorForm.avatar" :src="getAvatarUrl(counselorForm.avatar)" class="avatar-preview" />
                    <el-upload
                      class="avatar-uploader"
                      action="#"
                      :show-file-list="false"
                      :before-upload="beforeAvatarUpload"
                      :http-request="uploadAvatar"
                      accept="image/*"
                    >
                      <template #trigger>
                        <el-button size="small" type="primary">选择头像</el-button>
                      </template>
                    </el-upload>
                  </div>
                </el-form-item>
                
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
                <div class="week-schedule" style="width: 1260px; flex-shrink: 0;">
                  <h3>预约时间段表</h3>
                  <div class="schedule-table" style="width: 1100px !important; height: 720px !important; border-collapse: separate; border: 2px solid var(--border-color); border-radius: 8px; overflow: visible; display: block !important;">
                    <table style="width: 1100px !important; height: 720px !important; border-collapse: separate; display: table !important; table-layout: fixed !important; border-spacing: 0;">
                      <thead style="display: table-header-group !important;">
                        <tr style="display: table-row !important;">
                          <th style="width: 120px !important; height: 45px !important; background-color: #f5f5f5; color: #333; font-size: 14px; font-weight: 600; text-align: center; vertical-align: middle; border: 1px solid #ddd; display: table-cell !important;"></th>
                          <th v-for="(day, index) in weekDays" :key="index" style="width: 120px !important; height: 45px !important; background-color: #f5f5f5 !important; color: #333 !important; font-weight: bold !important; font-size: 16px !important; text-align: center !important; vertical-align: middle !important; border: 1px solid #ddd; display: table-cell !important; padding: 5px !important;">{{ day.name }}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(time, timeIndex) in timeSlots" :key="timeIndex">
                          <td :style="`width: 120px !important; height: 45px !important; background-color: #f5f5f5; color: #333; font-size: 14px; font-weight: 600; text-align: center; position: relative; vertical-align: middle;`">
                            <span v-if="timeIndex % 2 === 0" style="font-size: 20px; font-weight: bold;">
                              {{ Math.floor(timeIndex / 2) + 1 }}
                            </span>
                            <div v-else style="position: absolute; top: 5px; left: 0; right: 0; font-size: 14px; display: flex; flex-direction: column; align-items: center; padding: 0;">
                              <span>{{ timeAxisLabels[Math.floor(timeIndex / 2)].split('-')[0] }}</span>
                              <span>{{ timeAxisLabels[Math.floor(timeIndex / 2)].split('-')[1] }}</span>
                            </div>
                          </td>
                          <td 
                            v-for="(day, dayIndex) in weekDays" 
                            :key="`${timeIndex}-${dayIndex}`" 
                            class="slot-cell"
                            @click="toggleTimeSlot(day.dayOfWeek, time, getNextTime(timeIndex))"
                            @dblclick="handleDoubleClick(day.dayOfWeek, time, getNextTime(timeIndex))"
                            :class="{ 'selected': isTimeSlotSelected(day.dayOfWeek, time, getNextTime(timeIndex)) }"
                            :style="getSlotStyle(day, time, getNextTime(timeIndex), timeIndex)"
                          >
                            <div v-if="hasSlot(day, time, getNextTime(timeIndex))" class="slot-indicator" style="font-size: 20px !important; font-weight: bold !important; color: white !important; text-shadow: 1px 1px 2px rgba(0,0,0,0.5) !important;">
                              {{ getSlotInfo(day, time, getNextTime(timeIndex), timeIndex) }}
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
                      <el-button type="primary" @click="addAppointmentTime" :loading="saving" style="flex: 1;">
                        添加预约时间
                      </el-button>
                      <el-button type="success" @click="saveAppointmentSettings" :loading="saving" style="flex: 1;">
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
import { ElMessage, ElMessageBox } from 'element-plus'
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
    avatarBase64: '',
    avatarBytes: null,
    status: 1
  })
  
  // 确保表单数据正确初始化
  onMounted(() => {
    fetchStudentProfile()
  })
  
  const counselorForm = reactive({
    id: '',
    user_id: '',
    specialty: '',
    work_experience: 0,
    introduction: '',
    status: 1,
    avatarBase64: '',
    avatarBytes: null
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
    { label: '07:00', value: '07:00' },
    { label: '08:00', value: '08:00' },
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
    { label: '21:00', value: '21:00' },
    { label: '22:00', value: '22:00' },
    { label: '23:00', value: '23:00' }
  ]
  
  // 时间轴标签 - 保持原来的两小时格式用于显示
  const timeAxisLabels = ref([
    '07:00-09:00', '09:00-11:00', '11:00-13:00', '13:00-15:00', 
    '15:00-17:00', '17:00-19:00', '19:00-21:00', '21:00-23:00'
  ])
  
  // 实际时间格子 - 每小时一个格子
  const timeSlots = ref([
    '07:00-08:00', '08:00-09:00', '09:00-10:00', '10:00-11:00', 
    '11:00-12:00', '12:00-13:00', '13:00-14:00', '14:00-15:00',
    '15:00-16:00', '16:00-17:00', '17:00-18:00', '18:00-19:00',
    '19:00-20:00', '20:00-21:00', '21:00-22:00', '22:00-23:00'
  ])
  
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
          // 如果有选择的头像文件，先上传
    
          
          // 直接从localStorage获取token
          const token = localStorage.getItem('vue3project_token')
          
          const data = await request({
        url: '/api/userinfo',
        method: 'PUT',
        params: {
          token: token
        },
        data: {
          token: token,
          user_info: {
            real_name: studentForm.real_name,
            gender: studentForm.gender,
            age: studentForm.age,
            avatar: studentForm.avatarFileName || studentForm.avatar,
            avatarImage: avatarBase64String || undefined,
           
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
          // 如果有选择的头像文件，先上传
      
          
          // 直接从localStorage获取token
          const token = localStorage.getItem('vue3project_token')
          
          const data = await request({
            url: '/api/counselor',
            method: 'PUT',
            data: {
              token: token,
              specialty: counselorForm.specialty,
              workExperience: counselorForm.work_experience,
              introduction: counselorForm.introduction,
              status: counselorForm.status,
              avatar: counselorForm.avatarFileName || counselorForm.avatar,
              avatarImage: avatarBase64String || undefined,
             
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
    if (index < timeSlots.value.length - 1) {
      return timeSlots.value[index + 1].split('-')[0]
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
  
  // 处理双击事件 - 用于取消预约时间
  const handleDoubleClick = (dayOfWeek, time, nextTime) => {
    const dayData = weekDays.value.find(d => d.dayOfWeek === dayOfWeek)
    if (!dayData || !dayData.slots || dayData.slots.length === 0) return
    
    // 从时间格子中提取开始时间
    const timeStart = time.split('-')[0]
    
    // 查找当前格子所属的预约时间段
    const slot = dayData.slots.find(s => {
      return timeStart >= s.start_time && timeStart < s.end_time
    })
    
    if (!slot) return
    
    // 弹窗确认是否取消
    ElMessageBox.confirm(
      `确定要取消 ${slot.start_time}-${slot.end_time} 的预约时间设置吗？`,
      '取消预约时间',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(() => {
      // 从weekDays中移除该时间段
      const slotIndex = dayData.slots.findIndex(s => 
        s.start_time === slot.start_time && s.end_time === slot.end_time
      )
      
      if (slotIndex !== -1) {
        // 使用数组替换来触发响应式更新
        dayData.slots = dayData.slots.filter((_, index) => index !== slotIndex)
        ElMessage.success('已取消预约时间设置')
      }
    }).catch(() => {
      // 用户取消操作
    })
  }
  
  // 判断时间段是否有预约
const hasSlot = (day, time, nextTime) => {
  const dayData = weekDays.value.find(d => d.dayOfWeek === day.dayOfWeek)
  if (!dayData || !dayData.slots) return false
  
  return dayData.slots.some(slot => {
    // 从时间格子中提取开始时间
    const timeStart = time.split('-')[0]
    const timeEnd = time.split('-')[1] || nextTime
    
    // 检查是否有重叠
    return (timeStart >= slot.start_time && timeStart < slot.end_time) || 
           (timeEnd > slot.start_time && timeEnd <= slot.end_time) ||
           (timeStart <= slot.start_time && timeEnd >= slot.end_time)
  })
}
  
  // 获取时间段样式
  const getSlotStyle = (day, time, nextTime, timeIndex) => {
    const baseStyle = {
      width: '150px !important',
      height: '45px !important',
      cursor: 'pointer',
      transition: 'all 0.3s',
      fontSize: '12px',
      textAlign: 'center',
      verticalAlign: 'middle',
      position: 'relative',
      padding: '0'
    }
    
    const dayData = weekDays.value.find(d => d.dayOfWeek === day.dayOfWeek)
    if (!dayData || !dayData.slots || dayData.slots.length === 0) {
      return {
        ...baseStyle,
        backgroundColor: '#fff !important'
      }
    }
    
    // 检查当前时间段是否在预约时间段内
    // 调试信息
    console.log('检查时间段 - day:', day.dayOfWeek, 'time:', time)
    console.log('dayData.slots:', dayData.slots)
    
    const hasAppointment = dayData.slots.some(slot => {
      // 从时间格子中提取开始时间
      const timeStart = time.split('-')[0]
      
      // 简化逻辑：检查格子的开始时间是否在预约时间段内
      const result = timeStart >= slot.start_time && timeStart < slot.end_time
      
      // 调试信息
      if (day.dayOfWeek === 1 && (timeStart === '09:00' || timeStart === '07:00')) {
        console.log('比较 - timeStart:', timeStart)
        console.log('比较 - slot.start_time:', slot.start_time)
        console.log('比较 - slot.end_time:', slot.end_time)
        console.log('比较 - result:', result)
      }
      
      return result
    })
    
    // 调试信息
    if (day.dayOfWeek === 1) {
      console.log('最终结果 - hasAppointment:', hasAppointment)
    }
    
    if (hasAppointment) {
      // 查找当前格子所属的预约时间段
      const slot = dayData.slots.find(s => {
        const timeStart = time.split('-')[0]
        return timeStart >= s.start_time && timeStart < s.end_time
      })
      
      if (!slot) {
        return {
          ...baseStyle,
          backgroundColor: '#70ba96 !important', // 主题绿色
          color: 'white !important'
        }
      }
      
      // 获取当前格子的开始时间
      const timeStart = time.split('-')[0]
      
      // 检查是否是时间段的第一个格子
      const isFirstSlot = timeStart === slot.start_time
      
      // 检查是否是时间段的最后一个格子
      // 计算slot.end_time前一小时的时间
      const endHour = parseInt(slot.end_time.split(':')[0])
      const endMinute = slot.end_time.split(':')[1]
      const lastSlotTime = `${endHour - 1}:${endMinute}`
      const isLastSlot = timeStart === lastSlotTime
      
      // 特殊处理：如果时间段只有一小时，则既是第一个也是最后一个
      const isOneHourSlot = slot.start_time === slot.end_time
      if (isOneHourSlot) {
        isFirstSlot = timeStart === slot.start_time
        isLastSlot = timeStart === slot.start_time
      }
      
      // 根据位置设置不同的圆角
      let borderRadius = '0 !important'
      if (isFirstSlot && isLastSlot) {
        // 只有一个格子的情况，四个角都有圆角
        borderRadius = '10px !important'
      } else if (isFirstSlot) {
        // 第一个格子，只有上面两个角有圆角
        borderRadius = '10px 10px 0 0 !important'
      } else if (isLastSlot) {
        // 最后一个格子，只有下面两个角有圆角
        borderRadius = '0 0 10px 10px !important'
      }
      
      // 根据位置设置不同的边框
      let border = '1px solid #4a8c6f !important' // 默认四边都有边框
      if (isFirstSlot && isLastSlot) {
        // 只有一个格子的情况，四边都有边框
        border = '1px solid #4a8c6f !important'
      } else if (isFirstSlot) {
        // 第一个格子，上、左、右边有边框，下边无边框
        border = '1px solid #4a8c6f !important'
        // 使用borderWidth来精确控制
        return {
          ...baseStyle,
          backgroundColor: '#70ba96 !important',
          color: 'white !important',
          border: '2px solid white !important',
          borderWidth: '2px 2px 0 2px !important',
          borderColor: 'white !important',
          borderStyle: 'solid !important',
          borderRadius: borderRadius,
          margin: '0 !important',
          padding: '2px !important',
          boxSizing: 'border-box !important'
        }
      } else if (isLastSlot) {
        // 最后一个格子，下、左、右边有边框，上边无边框
        return {
          ...baseStyle,
          backgroundColor: '#70ba96 !important',
          color: 'white !important',
          border: '2px solid white !important',
          borderWidth: '0 2px 2px 2px !important',
          borderColor: 'white !important',
          borderStyle: 'solid !important',
          borderRadius: borderRadius,
          margin: '0 !important',
          padding: '2px !important',
          boxSizing: 'border-box !important'
        }
      } else {
        // 中间格子，只有左、右边有边框
        return {
          ...baseStyle,
          backgroundColor: '#70ba96 !important',
          color: 'white !important',
          border: '2px solid white !important',
          borderWidth: '0 2px 0 2px !important',
          borderColor: 'white !important',
          borderStyle: 'solid !important',
          borderRadius: borderRadius,
          margin: '0 !important',
          padding: '2px !important',
          boxSizing: 'border-box !important'
        }
      }
      
      return {
        ...baseStyle,
        backgroundColor: '#70ba96 !important', // 主题绿色
        color: 'white !important',
        border: '2px solid white !important', // 白色边框
        borderRadius: borderRadius, // 根据位置设置的圆角
        margin: '0 !important', // 移除外边距，使格子紧密相连
        padding: '2px !important', // 内边距
        boxSizing: 'border-box !important' // 确保边框向内
      }
    }
    
    return {
      ...baseStyle,
      backgroundColor: '#fff !important'
    }
  }
  
  // 将时间字符串转换为分钟数
  const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number)
    return hours * 60 + minutes
  }
  
  // 获取时间段信息
  const getSlotInfo = (day, time, nextTime, timeIndex) => {
    const dayData = weekDays.value.find(d => d.dayOfWeek === day.dayOfWeek)
    if (!dayData || !dayData.slots || dayData.slots.length === 0) return ''
    
    // 从时间格子中提取开始时间
    const timeStart = time.split('-')[0]
    
    const slot = dayData.slots.find(s => {
      // 检查当前格子是否在预约时间段内
      // 格子代表一个小时，所以检查这个小时是否在预约时间段内
      return timeStart >= s.start_time && timeStart < s.end_time
    })
    
    if (!slot) return ''
    
    // 如果是时间段的开始，显示开始时间和结束时间
    if (timeStart === slot.start_time) {
      return `${slot.start_time}-${slot.end_time}`
    }
    
    // 如果不是时间段的开始，不显示任何内容
    return ''
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
    
    // 自动填充到表单中
    maxAppointments.value = 5
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
  
  // 添加预约时间
const addAppointmentTime = () => {
  
  // 找到对应的天
  const dayData = weekDays.value.find(d => d.dayOfWeek === selectedDay.value)
  if (!dayData) return
  
  // 检查是否已存在相同的时间段
  const exists = dayData.slots.some(slot => 
    slot.start_time === selectedStartTime.value && slot.end_time === selectedEndTime.value
  )
  
  if (exists) {
    ElMessage.warning('该时间段已存在')
    return
  }
  
  // 添加新的时间段
  const newSlot = {
    start_time: selectedStartTime.value,
    end_time: selectedEndTime.value,
    max_appointments: maxAppointments.value,
    booked_count: 0,
    is_available: true
  }
  
  // 使用Vue.set或直接替换数组来触发响应式更新
  dayData.slots = [...dayData.slots, newSlot]
  
  ElMessage.success('预约时间添加成功')
  resetAppointmentSettings()
}

  // 保存预约时间设置
const saveAppointmentSettings = async () => {
  
  saving.value = true
  try {
    // 直接从localStorage获取token
    const token = localStorage.getItem('vue3project_token')
    
    // 构建请求数据
    const requestData = {
      token: token,
      counselor_id: counselorForm.user_id,
      available_info: []
    }
    
    // 将选中的时间段添加到请求数据
    weekDays.value.forEach(day => {
      if (day.slots && day.slots.length > 0) {
        day.slots.forEach(slot => {
          requestData.available_info.push({
            day_of_week: day.dayOfWeek,
            start_time: slot.start_time,
            end_time: slot.end_time,
            max_appointments: slot.max_appointments
          })
        })
      }
    })
    
    // 所有时间段都已经在weekDays中，无需额外处理
    
    console.log('发送预约设置请求:', requestData)
    
    // 调用保存预约时间设置的API
    const data = await request({
      url: '/api/counselor/available',
      method: 'POST',
      data: requestData
    })
    
    console.log('保存预约设置响应:', data)
    
    if (data && data.code === 200) {
      ElMessage.success('预约时间设置保存成功')
      await fetchCounselorSchedule() // 重新获取数据
      resetAppointmentSettings() // 重置表单
    } else {
      throw new Error(data.message || '保存失败')
    }
  } catch (error) {
    console.error('保存预约设置错误:', error)
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
  
  // 获取头像URL
  const getAvatarUrl = (avatar) => {
  if (!avatar) return ''
  
  // 如果是blob URL，直接返回
  if (avatar.startsWith('blob:')) {
    return avatar
  }
  
  // 如果是相对路径，则从assets/images获取
  if (avatar.startsWith('/') || !avatar.startsWith('http')) {
    // 去掉开头的/，然后从assets/images获取
    const fileName = avatar.replace(/^\//, '')
    return `/src/assets/images/${fileName}`
  }
  
  return avatar
}

// 头像上传前检查
const beforeAvatarUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2
  
  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过2MB!')
    return false
  }
  
  // 存储文件但不上传
    selectedAvatarFile = file
    
    // 生成预览URL
    const previewUrl = URL.createObjectURL(file)
    
    // 更新表单中的头像预览
    const userId = userInfo.value?.id || ''
    const userRole = userInfo.value?.role === 0 ? 'student' : 'counselor'
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}.${fileExt}`
    const avatarPath = `/images/${fileName}`
    
    // 在上传前处理文件
    handleFileUpload(file).then(base64 => {
      if (base64) {
        console.log('base64转换成功，前50个字符:', base64.substring(0, 50))
        // 存储base64编码到全局变量
        avatarBase64String = base64
        
        if (userRole === 'student') {
          studentForm.avatarFileName = fileName // 存储文件名
        } else {
          counselorForm.avatarFileName = fileName // 存储文件名
        }
      } else {
        console.error('base64为空')
        ElMessage.error('图片转换失败')
      }
    }).catch(error => {
      console.error('转换图片为base64失败:', error)
      ElMessage.error('处理图片失败')
    })
    
    if (userRole === 'student') {
      studentForm.avatar = previewUrl // 使用预览URL显示图片
    } else {
      counselorForm.avatar = previewUrl // 使用预览URL显示图片
    }
  
  ElMessage.success('头像选择成功，请点击保存更改以完成上传')
  return false // 阻止自动上传
}

// 存储选择的头像文件
  let selectedAvatarFile = null
  
  // 存储base64编码字符串
  let avatarBase64String = ''
  
  // 使用FileReader将文件转换为base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
  }
  
  // 在上传前处理文件
  const handleFileUpload = async (file) => {
    try {
      console.log('开始处理文件:', file.name, file.size)
      const base64 = await fileToBase64(file)
      console.log('文件转换为base64成功，长度:', base64.length)
      // 去掉data:image/jpeg;base64,前缀，只保留纯base64编码
      const pureBase64 = base64.split(',')[1]
      console.log('去掉前缀后的base64长度:', pureBase64.length)
      return pureBase64
    } catch (error) {
      console.error('Error converting file to base64:', error)
      return null
    }
  }
  

  
  // 真正上传头像并保存到本地
  // const uploadAvatarToServer = async () => {
  //   if (!selectedAvatarFile) {
  //     ElMessage.warning('请先选择头像')
  //     return
  //   }
    
  //   try {
  //     const formData = new FormData()
      
  //     // 获取用户ID和角色
  //     const userId = userInfo.value?.id || ''
  //     const userRole = userInfo.value?.role === 0 ? 'student' : 'counselor'
      
  //     // 生成文件名：用户ID.扩展名
  //     const fileExt = selectedAvatarFile.name.split('.').pop()
  //     const fileName = `${userId}.${fileExt}`
      
  //     formData.append('file', selectedAvatarFile)
  //     formData.append('fileName', fileName)
      
  //     // 根据角色选择不同的API
  //     const apiUrl = userRole === 'student' ? '/api/userinfo' : '/api/counselor'
      
  //     const response = await fetch(apiUrl, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'multipart/form-data'
  //       },
  //       body: formData
  //     })
      
  //     // 检查响应状态
  //     if (!response.ok) {
  //       throw new Error(`上传失败: ${response.status} ${response.statusText}`)
  //     }
      
  //     let data
  //     try {
  //       data = await response.json()
  //     } catch (error) {
  //       console.error('JSON解析错误:', error)
  //       // 尝试获取响应文本
  //       const responseText = await response.text()
  //       console.error('响应文本:', responseText)
  //       throw new Error('服务器响应格式错误')
  //     }
      
  //     if (data.code === 200) {
  //       // 保存图片到本地assets/images目录
  //       saveImageToLocal(selectedAvatarFile, fileName)
        
  //       ElMessage.success('头像上传并保存成功')
  //     } else {
  //       ElMessage.error(data.message || '上传失败')
  //     }
  //   } catch (error) {
  //     console.error('上传头像错误:', error)
  //     ElMessage.error('上传失败，请重试')
  //   }
  // }
  
  // 保存图片到本地
  // const saveImageToLocal = async (file, fileName) => {
  //   try {
  //     // 创建一个临时URL来读取文件
  //     const reader = new FileReader()
  //     // 现代浏览器使用文件系统API
  //     const dirHandle = await window.showDirectoryPicker({
  //       mode: 'readwrite'
  //     })

  //     // 指定保存到特定目录
  //     const targetPath = 'C:\\Users\\ym\\Desktop\\GraduationProject\\vue3project\\src\\assets\\images'
  //     // 使用Node.js fs模块保存（如果可用）
  //     if (typeof require !== 'undefined') {
  //       const fs = require('fs')
  //       const path = require('path')
        
  //       const fullPath = path.join(targetPath, fileName)
  //       fs.writeFileSync(fullPath, Buffer.from(await file.arrayBuffer()))
        
  //       ElMessage.success(`图片已保存到 ${fileName}`)
  //       return
  //     }

  //     // 否则使用浏览器下载
  //     const url = URL.createObjectURL(file)
  //     const a = document.createElement('a')
  //     a.href = url
  //     a.download = fileName
  //     document.body.appendChild(a)
  //     a.click()
  //     document.body.removeChild(a)
  //     URL.revokeObjectURL(url)

  //     ElMessage.success(`图片已下载为 ${fileName}，请手动保存到 ${targetPath}`)
  //     const fileHandle = await dirHandle.getFileHandle(fileName)
  //     const writable = await fileHandle.createWritable()
  //     await writable.write(file) // 直接写入原始文件
  //     await writable.close()
  //     reader.onload = (e) => {
  //       try {
  //         // 创建图片元素
  //         const img = new Image()
  //         img.onload = () => {
  //           // 创建canvas来转换图片
  //           const canvas = document.createElement('canvas')
  //           const ctx = canvas.getContext('2d')
            
  //           // 设置canvas尺寸
  //           canvas.width = img.width
  //           canvas.height = img.height
            
  //           // 绘制图片到canvas
  //           ctx.drawImage(img, 0, 0)
            
  //           // 转换为blob并保存到指定路径
  //           canvas.toBlob(async (blob) => {
  //             try {
  //               // 使用File System Access API保存到本地
  //               if ('showDirectoryPicker' in window) {
  //                 // 现代浏览器使用文件系统API
  //                 const dirHandle = await window.showDirectoryPicker({
  //                   mode: 'readwrite'
  //                 })
                  
  //                 const fileHandle = await dirHandle.getFileHandle(fileName)
  //                 const writable = await fileHandle.createWritable()
  //                 await writable.write(file)
  //                 await writable.close()
                  
  //                 ElMessage.success(`图片已保存到 ${fileName}`)
  //               } else {
  //                 // 传统浏览器使用下载方式
  //                 const url = URL.createObjectURL(blob)
  //                 const a = document.createElement('a')
  //                 a.href = url
  //                 a.download = fileName
  //                 document.body.appendChild(a)
  //                 a.click()
  //                 document.body.removeChild(a)
  //                 URL.revokeObjectURL(url)
                  
  //                 ElMessage.success(`图片已下载为 ${fileName}，请手动保存到 C:\\Users\\ym\\Desktop\\GraduationProject\\vue3project\\src\\assets\\images`)
  //               }
  //             } catch (error) {
  //               console.error('保存文件失败:', error)
  //               ElMessage.error('保存文件失败')
  //             }
  //           }, 'image/jpeg', 0.9)
  //         }
          
  //         img.src = e.target.result
  //       } catch (error) {
  //         console.error('保存图片失败:', error)
  //         ElMessage.error('保存图片失败')
  //       }
  //     }
      
  //     reader.readAsDataURL(file)
  //   } catch (error) {
  //     console.error('保存图片错误:', error)
  //     ElMessage.error('保存图片失败')
  //   }
  // }

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

  /* 头像上传样式 */
  .avatar-upload {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .avatar-preview {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid #ddd;
  }

  .avatar-uploader {
    display: flex;
    align-items: center;
    justify-content: center;
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
            width: 120px;
            height: 80px;
          }
          
          th {
                background-color: var(--secondary-color);
                color: var(--text-secondary);
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
          height: 45px;
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
                display: flex !important;
                flex-direction: column !important;
                justify-content: center !important;
                align-items: center !important;
                height: 100% !important;
                font-size: 20px !important;
                font-weight: bold !important;
                white-space: pre-line !important;
                line-height: 1.2 !important;
                padding: 2px !important;
                margin: 2px !important;
                border-radius: 30px !important;
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