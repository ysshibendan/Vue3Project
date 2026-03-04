import request from '@/utils/request'

// 开始咨询会话
export function startConsultation(data) {
  return request({
    url: '/v1/consultation/start',
    method: 'post',
    data
  })
}

// 发送消息
export function sendMessage(data) {
  return request({
    url: '/v1/consultation/message',
    method: 'post',
    data
  })
}

// 获取消息历史
export function getMessageHistory(appointmentId, params) {
  return request({
    url: `/v1/consultation/messages/${appointmentId}`,
    method: 'get',
    params
  })
}

// 结束咨询会话
export function endConsultation(data) {
  return request({
    url: '/v1/consultation/end',
    method: 'post',
    data
  })
}

// 获取活跃咨询会话
export function getActiveConsultation(data) {
  return request({
    url: '/v1/consultation/active',
    method: 'post',
    data
  })
}

// 提交咨询反馈
export function submitFeedback(data) {
  return request({
    url: '/v1/consultation/feedback',
    method: 'post',
    data
  })
}

// 获取咨询反馈
export function getFeedback(appointmentId, params) {
  return request({
    url: `/v1/consultation/feedback/${appointmentId}`,
    method: 'get',
    params
  })
}

// 连接WebSocket
export function connectWebSocket(data) {
  return request({
    url: '/v1/consultation/ws/connect',
    method: 'post',
    data
  })
}

// 获取视频通话状态
export function getVideoCallStatus(appointmentId, params) {
  return request({
    url: `/v1/consultation/video/status/${appointmentId}`,
    method: 'get',
    params
  })
}

// 发起视频通话
export function startVideoCall(data) {
  return request({
    url: '/v1/consultation/video/start',
    method: 'post',
    data
  })
}

// 结束视频通话
export function endVideoCall(data) {
  return request({
    url: '/v1/consultation/video/end',
    method: 'post',
    data
  })
}