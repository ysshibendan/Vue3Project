// 用户相关API
import request from '@/utils/request'

// 获取用户信息
export function getUserInfo() {
  return request({
    url: '/api/userinfo',
    method: 'get'
  })
}

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
export function getAnyUserInfo(userId) {
  return request({
    url: `/api/userinfo/${userId}`,
    method: 'get'
  })
}

// 更新用户状态
export function updateUserStatus(userId, status) {
  return request({
    url: `/api/userinfo/${userId}/status`,
    method: 'patch',
    data: { status }
  })
}

// 添加用户
export function addUser(data) {
  return request({
    url: '/api/userbase/register',
    method: 'post',
    data
  })
}

// 更新用户
export function updateUser(data) {
  return request({
    url: '/api/userinfo',
    method: 'put',
    data
  })
}

// 删除用户
export function deleteUser(userId) {
  return request({
    url: `/api/userinfo/${userId}`,
    method: 'delete'
  })
}