<!-- 用户中心仪表盘 -->
<template>
    <div class="usercenter-container">
      <!-- 侧边栏 -->
      <div class="sidebar">
        <div class="user-info" v-if="userInfo">
          <div class="avatar">
            <img :src="userInfo.avatar || '/src/assets/images/default-avatar.png'" alt="用户头像">
          </div>
          <div class="user-details">
            <h3>{{ userInfo.real_name || userInfo.username }}</h3>
            <p class="user-type">{{ getUserTypeText(userInfo.role) }}</p>
          </div>
        </div>
        
        <div class="menu">
          <div class="menu-item" :class="{ active: currentRoute === 'Dashboard' }" @click="navigateTo('/usercenter')">
            <el-icon><Monitor /></el-icon>
            <span>仪表盘</span>
          </div>
          
          <div v-if="userInfo.role === 1 || userInfo.role === 2" 
             class="menu-item" 
             :class="{ active: currentRoute === 'UserManagement' }" 
             @click="navigateTo('/usercenter/users')">
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </div>
        
        <div v-if="userInfo.role === 1" 
             class="menu-item" 
             :class="{ active: currentRoute === 'StudentManagement' }" 
             @click="navigateTo('/usercenter/students')">
          <el-icon><Reading /></el-icon>
          <span>学生管理</span>
        </div>
        
        <div v-if="userInfo.role === 1 || userInfo.role === 2" 
             class="menu-item" 
             :class="{ active: currentRoute === 'CounselorManagement' }" 
             @click="navigateTo('/usercenter/counselors')">
          <el-icon><Avatar /></el-icon>
          <span>咨询师管理</span>
        </div>
        
        <div v-if="userInfo.role === 1 || userInfo.role === 2" 
             class="menu-item" 
             :class="{ active: currentRoute === 'AppointmentManagement' }" 
             @click="navigateTo('/usercenter/appointments')">
          <el-icon><Calendar /></el-icon>
          <span>预约管理</span>
        </div>
        </div>
      </div>
      
      <!-- 主内容区 -->
      <div class="main-content">
        <div class="dashboard-header">
          <h2>用户中心仪表盘</h2>
          <p>欢迎使用心理健康咨询平台管理系统</p>
        </div>
        
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon user-icon">
              <el-icon><User /></el-icon>
            </div>
            <div class="stat-info">
              <h3>{{ stats.userCount }}</h3>
              <p>用户总数</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon student-icon">
              <el-icon><Reading /></el-icon>
            </div>
            <div class="stat-info">
              <h3>{{ stats.studentCount }}</h3>
              <p>学生总数</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon counselor-icon">
              <el-icon><Avatar /></el-icon>
            </div>
            <div class="stat-info">
              <h3>{{ stats.counselorCount }}</h3>
              <p>咨询师总数</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon appointment-icon">
              <el-icon><Calendar /></el-icon>
            </div>
            <div class="stat-info">
              <h3>{{ stats.appointmentCount }}</h3>
              <p>预约总数</p>
            </div>
          </div>
        </div>
        
        <div class="chart-container">
          <div class="chart-card">
            <h3>用户类型分布</h3>
            <div class="chart-placeholder">
              <p>图表区域 - 用户类型分布饼图</p>
            </div>
          </div>
          
          <div class="chart-card">
            <h3>月度预约趋势</h3>
            <div class="chart-placeholder">
              <p>图表区域 - 月度预约趋势折线图</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useAuthStore } from '@/store/auth'
  import { 
    Monitor, 
    User, 
    Reading, 
    Avatar, 
    Calendar 
  } from '@element-plus/icons-vue'
  import { getUserInfo } from '@/api/user'
  
  const router = useRouter()
  const route = useRoute()
  const authStore = useAuthStore()
  
  const userInfo = ref(null)
  const stats = ref({
    userCount: 0,
    studentCount: 0,
    counselorCount: 0,
    appointmentCount: 0
  })
  
  const currentRoute = computed(() => {
    return route.name
  })
  
  // 获取用户类型文本
const getUserTypeText = (role) => {
  const roleMap = {
    0: '管理员',
    1: '咨询师',
    2: '学生',
    3: '普通用户'
  }
  return roleMap[role] || '未知'
}
  
  // 导航方法
  const navigateTo = (path) => {
    router.push(path)
  }
  
  // 获取用户信息
  const fetchUserInfo = async () => {
    try {
      const response = await getUserInfo()
      if (response.code === 200) {
        userInfo.value = response.data.user_info
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
    }
  }
  
  // 获取统计数据
  const fetchStats = async () => {
    // 这里应该调用API获取统计数据
    // 暂时使用模拟数据
    stats.value = {
      userCount: 1250,
      studentCount: 850,
      counselorCount: 120,
      appointmentCount: 3200
    }
  }
  
  onMounted(() => {
    fetchUserInfo()
    fetchStats()
  })
  </script>
  
  <style lang="scss" scoped>
  .usercenter-container {
    display: flex;
    min-height: calc(100vh - 60px);
    background-color: #f5f7fa;
  }
  
  .sidebar {
    width: 240px;
    background-color: #4A90E2;
    color: white;
    padding: 20px 0;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
    
    .user-info {
      padding: 0 20px 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      margin-bottom: 20px;
      
      .avatar {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        overflow: hidden;
        margin: 0 auto 15px;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      
      .user-details {
        text-align: center;
        
        h3 {
          margin: 0 0 5px;
          font-size: 18px;
        }
        
        .user-type {
          margin: 0;
          font-size: 14px;
          opacity: 0.8;
        }
      }
    }
    
    .menu {
      .menu-item {
        display: flex;
        align-items: center;
        padding: 12px 20px;
        cursor: pointer;
        transition: background-color 0.3s;
        
        &:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        &.active {
          background-color: rgba(255, 255, 255, 0.2);
          border-left: 3px solid #67C23A;
        }
        
        .el-icon {
          margin-right: 10px;
          font-size: 18px;
        }
        
        span {
          font-size: 15px;
        }
      }
    }
  }
  
  .main-content {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    
    .dashboard-header {
      margin-bottom: 30px;
      
      h2 {
        color: #303133;
        margin: 0 0 10px;
      }
      
      p {
        color: #606266;
        margin: 0;
      }
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
      
      .stat-card {
        background-color: white;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        
        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
          
          .el-icon {
            font-size: 24px;
            color: white;
          }
          
          &.user-icon {
            background-color: #4A90E2;
          }
          
          &.student-icon {
            background-color: #67C23A;
          }
          
          &.counselor-icon {
            background-color: #E6A23C;
          }
          
          &.appointment-icon {
            background-color: #F56C6C;
          }
        }
        
        .stat-info {
          h3 {
            margin: 0 0 5px;
            font-size: 24px;
            color: #303133;
          }
          
          p {
            margin: 0;
            color: #606266;
            font-size: 14px;
          }
        }
      }
    }
    
    .chart-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      
      .chart-card {
        background-color: white;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        
        h3 {
          margin: 0 0 15px;
          color: #303133;
        }
        
        .chart-placeholder {
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #909399;
          background-color: #f5f7fa;
          border-radius: 4px;
        }
      }
    }
  }
  </style>