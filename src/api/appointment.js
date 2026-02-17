// 预约相关API
import request from '@/utils/request'

// 获取预约列表
export function getAppointmentList(params) {
  return request({
    url: '/api/appointment/list',
    method: 'get',
    params
  })
}

// 删除预约
export function deleteAppointment(appointmentId) {
  return request({
    url: `/api/appointment/${appointmentId}`,
    method: 'delete'
  })
}