import request from '@/utils/request'
// 用户登录
export function login(data) {
  return request({
    url: '/api/v1/auth/login',
    method: 'post',
    data
  })
}
 
// 获取用户信息
export function getUserInfo() {
  const token = localStorage.getItem('vue3project_token')
  return request({
    url: '/api/userinfo',
    method: 'get',
    params: {
      token: token
    }
  })
}
 
// 用户注册
export function register(data) {
  return request({
    url: '/api/v1/auth/register',
    method: 'post',
    data
  })
}
 
// 退出登录
export function logout() {
  return request({
    url: '/api/v1/auth/logout',
    method: 'post'
  })
}
 
// 刷新Token
export function refreshToken() {
  return request({
    url: '/api/v1/auth/refresh',
    method: 'post'
  })
}
 
// 修改密码
export function changePassword(data) {
  return request({
    url: '/api/v1/auth/password',
    method: 'put',
    data
  })
}