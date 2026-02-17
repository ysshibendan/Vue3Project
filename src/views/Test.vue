<template>
    <div class="test-container">
      <h1>测试页面</h1>
      <p>如果您能看到这个页面，说明Vue项目已成功启动！</p>
      <button @click="testClick">点击测试</button>
      <p v-if="clicked">按钮已被点击</p>
    </div>
  </template>
   
  <script setup>
  import { ref } from 'vue'
   
  const clicked = ref(false)
   
  const testClick = () => {
    clicked.value = true
    console.log('测试按钮被点击')
  }
  </script>
   
  <style scoped>
  .test-container {
    padding: 20px;
    text-align: center;
  }
   
  button {
    padding: 10px 20px;
    background-color: #409eff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
   
  button:hover {
    background-color: #66b1ff;
  }
  </style>