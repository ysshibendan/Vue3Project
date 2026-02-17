<template>
    <div :class="['message-item', messageType === 0 ? 'user' : 'ai']">
      <div class="avatar">
        <el-avatar v-if="messageType === 0" :size="40">
          {{ userAvatar }}
        </el-avatar>
        <el-avatar v-else :size="40" style="background-color: var(--primary-color)">
          <el-icon><Robot /></el-icon>
        </el-avatar>
      </div>
      <div class="message-content">
        <div class="content-text" v-html="formattedContent"></div>
        <div class="message-time">{{ formattedTime }}</div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { Robot } from '@element-plus/icons-vue'
  import { formatDate } from '@/utils/date'
  
  const props = defineProps({
    content: {
      type: String,
      required: true
    },
    messageType: {
      type: Number,
      required: true // 0表示用户消息，1表示AI消息
    },
    createdAt: {
      type: [String, Date],
      default: () => new Date()
    },
    userAvatar: {
      type: String,
      default: 'U'
    }
  })
  
  // 格式化内容，处理换行符
  const formattedContent = computed(() => {
    return props.content.replace(/\n/g, '<br>')
  })
  
  // 格式化时间
  const formattedTime = computed(() => {
    return formatDate(props.createdAt)
  })
  </script>
  
  <style scoped lang="scss">
  .message-item {
    display: flex;
    margin-bottom: 20px;
    
    &.user {
      justify-content: flex-end;
      
      .message-content {
        background-color: var(--primary-color);
        color: white;
        border-radius: 18px 18px 4px 18px;
        
        .message-time {
          color: rgba(255, 255, 255, 0.7);
        }
      }
      
      .avatar {
        margin-left: 12px;
        margin-right: 0;
      }
    }
    
    &.ai {
      justify-content: flex-start;
      
      .message-content {
        background-color: var(--secondary-color);
        color: var(--text-color);
        border-radius: 18px 18px 18px 4px;
        
        .message-time {
          color: var(--text-secondary);
        }
      }
    }
    
    .avatar {
      margin-right: 12px;
      flex-shrink: 0;
    }
    
    .message-content {
      max-width: 70%;
      padding: 12px 16px;
      line-height: 1.5;
      word-wrap: break-word;
      
      .content-text {
        margin-bottom: 5px;
      }
      
      .message-time {
        font-size: 12px;
        text-align: right;
      }
    }
  }
  </style>