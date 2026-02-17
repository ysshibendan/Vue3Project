<template>
    <div class="app-sidebar">
      <el-menu
        :default-active="activeMenu"
        class="sidebar-menu"
        @select="handleMenuSelect"
      >
      </el-menu>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  
  const route = useRoute()
  const router = useRouter()
  
  const activeMenu = computed(() => route.path)
  
  const handleMenuSelect = (index) => {
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