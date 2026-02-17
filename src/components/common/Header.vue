<template>
    <div class="app-header">
      <div class="header-left">
        <h1 class="logo" @click="goToHome">心理健康咨询平台</h1>
      </div>
      
      <div class="header-right">
        <el-dropdown @command="handleCommand">
          <span class="user-info">
            <el-avatar :size="32">{{ userInfo?.username?.charAt(0) || 'U' }}</el-avatar>
            <span class="username">{{ userInfo?.username || '用户' }}</span>
            <el-icon class="el-icon--right"><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">个人资料</el-dropdown-item>
              <el-dropdown-item command="settings">设置</el-dropdown-item>
              <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { useAuthStore } from '@/store/auth'
  
  const router = useRouter()
  const authStore = useAuthStore()
  
  const userInfo = computed(() => authStore.userInfo)
  
  const handleCommand = (command) => {
    switch (command) {
      case 'profile':
        router.push('/profile')
        break
      case 'settings':
        ElMessage.info('设置功能正在开发中')
        break
      case 'logout':
        ElMessageBox.confirm('确定要退出登录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          authStore.logout()
          router.push('/login')
          ElMessage.success('已退出登录')
        }).catch(() => {
          // 用户取消操作
        })
        break
    }
  }
  
  const goToHome = () => {
    // 如果当前就在主页，强制刷新到顶部
    if (router.currentRoute.value.path === '/') {
      window.location.href = '/'
    } else {
      router.push('/')
    }
  }
  </script>
  
  <style scoped lang="scss">
  .app-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: var(--header-height);
    padding: 0 20px;
    background-color: var(--background-color);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }
  
  .header-left {
    .logo {
      font-size: 20px;
      font-weight: 600;
      color: var(--primary-color);
      margin: 0;
      cursor: pointer;
      transition: opacity 0.3s;
      
      &:hover {
        opacity: 0.8;
      }
    }
  }
  
  .header-right {
    .user-info {
      display: flex;
      align-items: center;
      cursor: pointer;
      
      .username {
        margin: 0 8px;
        font-size: 14px;
        color: var(--text-color);
      }
    }
  }
  </style>
  