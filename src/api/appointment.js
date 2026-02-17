import request from '@/utils/request'

// 创建预约
export function createAppointment(data) {
  return request({
    url: '/api/appointment',
    method: 'post',
    data
  })
}

// 获取用户预约列表
export function getUserAppointments(params) {
  return request({
    url: '/api/appointments/user',
    method: 'get',
    params
  })
}

// 获取咨询师预约列表
export function getCounselorAppointments(params) {
  return request({
    url: '/api/appointments/counselor',
    method: 'get',
    params
  })
}

// 更新预约状态
export function updateAppointmentStatus(id, data) {
  return request({
    url: `/api/appointment/${id}/status`,
    method: 'patch',
    data
  })
}

// 取消预约
export function cancelAppointment(id, data) {
  return request({
    url: `/api/appointment/${id}/cancel`,
    method: 'post',
    data
  })
}

// 获取可预约时间
export function getAvailableSlots(params) {
  return request({
    url: '/api/appointment/available',
    method: 'get',
    params
  })
}