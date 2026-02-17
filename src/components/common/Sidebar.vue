<template>
    <div class="app-sidebar">
      <el-menu
        :default-active="activeMenu"
        class="sidebar-menu"
        @select="handleMenuSelect"
      >
        <el-menu-item index="/home">
          <el-icon><House /></el-icon>
          <span>首页</span>
        </el-menu-item>
        
        <el-menu-item index="/chat">
          <el-icon><ChatDotRound /></el-icon>
          <span>心理咨询</span>
        </el-menu-item>
        
        <el-menu-item index="/history">
          <el-icon><Clock /></el-icon>
          <span>历史记录</span>
        </el-menu-item>
        
        <el-menu-item index="/profile">
          <el-icon><User /></el-icon>
          <span>个人资料</span>
        </el-menu-item>
        
        <el-menu-item index="/resources">
          <el-icon><Reading /></el-icon>
          <span>学习资源</span>
        </el-menu-item>
      </el-menu>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'
  
  const route = useRoute()
  const router = useRouter()
  
  const activeMenu = computed(() => route.path)
  
  const handleMenuSelect = (index) => {
    if (index === '/resources') {
      ElMessage.info('学习资源功能正在开发中')
      return
    }
    router.push(index)
  }
  </script>
  
  <style scoped lang="scss">
  .app-sidebar {
    width: var(--sidebar-width);
    height: 100%;
    background-color: var(--background-color);
    box-shadow: 1px 0 4px rgba(0, 0, 0, 0.1);
    
    .sidebar-menu {
      height: 100%;
      border-right: none;
      
      .el-menu-item {
        height: 50px;
        line-height: 50px;
        
        &:hover {
          background-color: var(--secondary-color);
        }
        
        &.is-active {
          background-color: rgba(var(--primary-color), 0.1);
          color: var(--primary-color);
          border-right: 3px solid var(--primary-color);
        }
        
        .el-icon {
          margin-right: 8px;
        }
      }
    }
  }
  </style>