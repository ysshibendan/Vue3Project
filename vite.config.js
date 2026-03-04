import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler', // 使用现代Sass编译器
        silenceDeprecations: ['legacy-js-api', 'import'] // 静默弃用警告
      }
    }
  },
  // 添加静态资源处理
  assetsInclude: ['src/assets/images'],
  server: {
    fs: {
      strict: false
    }
  },
  server: {
    port: 3000,
    proxy: {
      // 用户中心服务代理
      '/api/v1/auth': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      },
      '/api/userinfo': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/api/counselor': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      
      // 预约服务代理
      '/api/appointment': {
        target: 'http://localhost:8001',
        changeOrigin: true,
      },
      '/api/appointments': {
        target: 'http://localhost:8001',
        changeOrigin: true,
      },
      
      // 问卷服务代理
      '/api/questionnaire': {
        target: 'http://localhost:8002',
        changeOrigin: true,
      },
      
      // 咨询服务代理
      '/v1/consultation': {
        target: 'http://localhost:8003',
        changeOrigin: true,
      },
      
      // AI聊天服务代理
      '/api/v1/aichat': {
        target: 'http://localhost:8004',
        changeOrigin: true,
      },
      '/api/v1/nlp': {
        target: 'http://localhost:8004',
        changeOrigin: true,
      }
    }
  }
})