import request from '@/utils/request'

// 更新用户信息
export function updateUserInfo(data) {
  return request({
    url: '/api/userinfo',
    method: 'put',
    data
  })
}

// 获取用户列表
export function getUserList(params) {
  return request({
    url: '/api/userinfo/list',
    method: 'get',
    params
  })
}

// 获取指定用户信息
export function getAnyUserInfo(userId, params) {
  return request({
    url: `/api/userinfo/${userId}`,
    method: 'get',
    params
  })
}

// 更新用户状态
export function updateUserStatus(userId, data) {
  return request({
    url: `/api/userinfo/${userId}/status`,
    method: 'patch',
    data
  })
}

// 获取咨询师信息
export function getCounselorInfo(params) {
  return request({
    url: '/api/counselor',
    method: 'get',
    params
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
export function updateCounselorStatus(counselorId, data) {
  return request({
    url: `/api/counselor/${counselorId}/status`,
    method: 'patch',
    data
  })
}

// 设置咨询师可用时间
export function setAvailable(data) {
  return request({
    url: '/api/counselor/available',
    method: 'post',
    data
  })
}