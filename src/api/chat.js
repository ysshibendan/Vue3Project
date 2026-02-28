import request from '@/utils/request'

// 发送消息
export function sendMessage(data) {
  console.log('发送消息API调用:', {
    url: '/api/v1/aichat/send',
    method: 'post',
    data
  })
  return request({
    url: '/api/v1/aichat/send',
    method: 'post',
    data
  })
}

// 获取聊天记录
export function getMessageHistory(params) {
  return request({
    url: `/api/v1/aichat/history/${params.session_id}`,
    method: 'get',
    params: {
      token: params.token
    }
  })
}

// 创建会话
export function createSession(data) {
  return request({
    url: '/api/v1/aichat/session',
    method: 'post',
    data
  })
}

// 获取会话列表
export function getSessionList(params) {
  return request({
    url: '/api/v1/aichat/sessions',
    method: 'get',
    params
  })
}