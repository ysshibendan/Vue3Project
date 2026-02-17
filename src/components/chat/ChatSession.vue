<template>
    <div class="chat-session">
      <div class="session-header">
        <h3>会话列表</h3>
        <el-button type="primary" :icon="Plus" @click="createNewSession">新建会话</el-button>
      </div>
      
      <div class="session-list">
        <div v-if="loading" class="loading-container">
          <el-skeleton :rows="5" animated />
        </div>
        
        <div v-else-if="sessions.length === 0" class="empty-state">
          <el-empty description="暂无会话" />
        </div>
        
        <div v-else>
          <div
            v-for="session in sessions"
            :key="session.id"
            :class="['session-item', { active: currentSessionId === session.id }]"
            @click="selectSession(session)"
          >
            <div class="session-info">
              <h4 class="session-title">{{ session.title }}</h4>
              <p class="session-preview">{{ session.lastMessage || '暂无消息' }}</p>
              <span class="session-time">{{ formatDate(session.updatedAt) }}</span>
            </div>
            
            <div class="session-actions">
              <el-dropdown @command="handleCommand" trigger="click">
                <el-button type="text" :icon="MoreFilled" />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item :command="{ action: 'rename', id: session.id }">
                      重命名
                    </el-dropdown-item>
                    <el-dropdown-item :command="{ action: 'delete', id: session.id }" divided>
                      删除
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { Plus, MoreFilled } from '@element-plus/icons-vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { formatDate } from '@/utils/date'
  
  const props = defineProps({
    sessions: {
      type: Array,
      default: () => []
    },
    currentSessionId: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    }
  })
  
  const emit = defineEmits(['create-session', 'select-session', 'rename-session', 'delete-session'])
  
  // 创建新会话
  const createNewSession = () => {
    emit('create-session')
  }
  
  // 选择会话
  const selectSession = (session) => {
    emit('select-session', session)
  }
  
  // 处理下拉菜单命令
  const handleCommand = ({ action, id }) => {
    switch (action) {
      case 'rename':
        handleRename(id)
        break
      case 'delete':
        handleDelete(id)
        break
    }
  }
  
  // 重命名会话
  const handleRename = (sessionId) => {
    ElMessageBox.prompt('请输入新名称', '重命名会话', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /^.{1,20}$/,
      inputErrorMessage: '名称长度在1到20个字符'
    }).then(({ value }) => {
      emit('rename-session', { sessionId, title: value })
    }).catch(() => {
      // 用户取消操作
    })
  }
  
  // 删除会话
  const handleDelete = (sessionId) => {
    ElMessageBox.confirm('确定要删除该会话吗？此操作不可恢复。', '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      emit('delete-session', sessionId)
    }).catch(() => {
      // 用户取消操作
    })
  }
  </script>
  
  <style scoped lang="scss">
  .chat-session {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: var(--background-color);
    border-right: 1px solid var(--border-light);
    
    .session-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid var(--border-light);
      
      h3 {
        margin: 0;
        font-size: 16px;
        color: var(--text-color);
      }
    }
    
    .session-list {
      flex: 1;
      overflow-y: auto;
      
      .session-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        cursor: pointer;
        transition: background-color 0.3s;
        
        &:hover {
          background-color: var(--secondary-color);
        }
        
        &.active {
          background-color: rgba(var(--primary-color), 0.1);
          border-right: 3px solid var(--primary-color);
        }
        
        .session-info {
          flex: 1;
          min-width: 0;
          
          .session-title {
            font-size: 14px;
            font-weight: 500;
            color: var(--text-color);
            margin: 0 0 5px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          
          .session-preview {
            font-size: 12px;
            color: var(--text-secondary);
            margin: 0 0 5px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          
          .session-time {
            font-size: 11px;
            color: var(--text-placeholder);
          }
        }
        
        .session-actions {
          margin-left: 10px;
        }
      }
    }
  }
  </style>