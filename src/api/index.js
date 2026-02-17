// 导出所有API模块
export * from './auth'
export * from './user'
export * from './appointment'
export * from './consultation'
export * from './questionnaire'
export * from './chat'
export * from './nlp'

// 微服务地址常量
export const MICRO_SERVICE_URLS = {
  usercenter: import.meta.env.VITE_USERCENTER_API_URL || 'http://localhost:8000',
  appointments: import.meta.env.VITE_APPOINTMENTS_API_URL || 'http://localhost:8001',
  questionnaire: import.meta.env.VITE_QUESTIONNAIRE_API_URL || 'http://localhost:8002',
  consultation: import.meta.env.VITE_CONSULTATION_API_URL || 'http://localhost:8003',
  aichat: import.meta.env.VITE_AICHAT_API_URL || 'http://localhost:8004'
}