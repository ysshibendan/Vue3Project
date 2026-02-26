// 预约相关API
import request from '@/utils/request'






// 获取可预约时间段
export function getAvailableSlots(counselorId, startDate, endDate) {
  const token = localStorage.getItem('vue3project_token')
  return request({
    url: '/api/appointment/available',
    method: 'get',
    params: {
      token,
      counselor_id: counselorId,
      start_date: startDate,
      end_date: endDate
    }
  })
}

// 创建预约
export function createAppointment(counselorId, availabilityId, appointmentDate) {
  const token = localStorage.getItem('vue3project_token')
  return request({
    url: '/api/appointment',
    method: 'post',
    data: {
      token,
      counselor_id: counselorId,
      availability_id: availabilityId,
      appointment_date: appointmentDate
    }
  })
}

// 获取用户预约列表
export function getUserAppointments(page = 1, pageSize = 10, status = -1) {
  const token = localStorage.getItem('vue3project_token')
  return request({
    url: '/api/appointments/user',
    method: 'get',
    params: {
      token,
      page,
      page_size: pageSize,
      status
    }
  })
}

// 获取咨询师预约列表
export function getCounselorAppointments(page = 1, pageSize = 10, status = -1, startDate = '', endDate = '') {
  const token = localStorage.getItem('vue3project_token')
  return request({
    url: '/api/appointments/counselor',
    method: 'get',
    params: {
      token,
      page,
      page_size: pageSize,
      status,
      start_date: startDate,
      end_date: endDate
    }
  })
}

// 更新预约状态
export function updateAppointmentStatus(appointmentId, status) {
  const token = localStorage.getItem('vue3project_token')
  return request({
    url: `/api/appointment/${appointmentId}/status`,
    method: 'patch',
    data: {
      token,
      id: appointmentId,
      status
    }
  })
}

// 取消预约
export function cancelAppointment(appointmentId, reason = '') {
  const token = localStorage.getItem('vue3project_token')
  return request({
    url: `/api/appointment/${appointmentId}/cancel`,
    method: 'post',
    data: {
      token,
      id: appointmentId,
      reason
    }
  })
}