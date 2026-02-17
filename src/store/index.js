import { createPinia } from 'pinia'

const pinia = createPinia()

export default pinia

// 导出所有store模块
export { useAuthStore } from './auth'
export { useChatStore } from './chat'