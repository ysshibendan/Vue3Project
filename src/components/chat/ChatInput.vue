<template>
    <div class="chat-input">
      <div class="input-container">
        <el-input
          v-model="inputMessage"
          type="textarea"
          :rows="3"
          :placeholder="placeholder"
          resize="none"
          @keydown.ctrl.enter="handleSend"
          :disabled="disabled"
        />
      </div>
      <div class="input-actions">
        <div class="action-left">
          <el-tooltip content="清空输入" placement="top">
            <el-button
              type="text"
              :icon="Delete"
              @click="handleClear"
              :disabled="disabled || !inputMessage.trim()"
            />
          </el-tooltip>
          <el-tooltip content="表情" placement="top">
            <el-button
              type="text"
              :icon="ChatDotRound"
              @click="handleEmoji"
              :disabled="disabled"
            />
          </el-tooltip>
        </div>
        <div class="action-right">
          <el-button
            type="primary"
            @click="handleSend"
            :disabled="disabled || !inputMessage.trim()"
            :loading="loading"
          >
            发送 (Ctrl+Enter)
          </el-button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  import { Delete, ChatDotRound } from '@element-plus/icons-vue'
  
  const props = defineProps({
    modelValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请输入您想说的话...'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  })
  
  const emit = defineEmits(['update:modelValue', 'send', 'clear', 'emoji'])
  
  const inputMessage = ref(props.modelValue)
  
  // 监听外部变化
  watch(() => props.modelValue, (newVal) => {
    inputMessage.value = newVal
  })
  
  // 监听内部变化
  watch(inputMessage, (newVal) => {
    emit('update:modelValue', newVal)
  })
  
  // 发送消息
  const handleSend = () => {
    if (!inputMessage.value.trim() || props.disabled || props.loading) return
    emit('send', inputMessage.value)
  }
  
  // 清空输入
  const handleClear = () => {
    inputMessage.value = ''
    emit('clear')
  }
  
  // 处理表情
  const handleEmoji = () => {
    emit('emoji')
  }
  </script>
  
  <style scoped lang="scss">
  .chat-input {
    display: flex;
    flex-direction: column;
    padding: 16px 20px;
    border-top: 1px solid var(--border-light);
    background-color: var(--background-color);
    
    .input-container {
      margin-bottom: 10px;
    }
    
    .input-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .action-left {
        display: flex;
        gap: 8px;
      }
    }
  }
  </style>