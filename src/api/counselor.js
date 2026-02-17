// 咨询师相关API
import request from '@/utils/request'

// 获取咨询师信息
export function getCounselorInfo() {
  return request({
    url: '/api/counselor',
    method: 'get'
  })
}

// 更新咨询师信息
export function updateCounselorInfo(data) {
  return request({
    url: '/api/counselor',
    method: 'put',
    data
  })
}

// 获取咨询师列表
export function getCounselorList(params) {
  return request({
    url: '/api/counselor/list',
    method: 'get',
    params
  })
}

// 更新咨询师状态
export function updateCounselorStatus(counselorId, status) {
  return request({
    url: `/api/counselor/${counselorId}/status`,
    method: 'patch',
    data: { status }
  })
}

// 添加咨询师
export function addCounselor(data) {
  return request({
    url: '/api/counselor',
    method: 'put',
    data: { ...data, role: 1 } // 设置角色为咨询师
  })
}

// 删除咨询师
export function deleteCounselor(counselorId) {
  return request({
    url: `/api/counselor/${counselorId}`,
    method: 'delete'
  })
}