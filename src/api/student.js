// 学生相关API
import request from '@/utils/request'

// 获取学生列表
export function getStudentList(params) {
  return request({
    url: '/api/userinfo/list',
    method: 'get',
    params: { ...params, role: 2 } // 学生角色为2
  })
}

// 添加学生
export function addStudent(data) {
  return request({
    url: '/api/userinfo',
    method: 'put',
    data: { ...data, role: 2 } // 设置角色为学生
  })
}

// 更新学生
export function updateStudent(data) {
  return request({
    url: '/api/userinfo',
    method: 'put',
    data
  })
}

// 删除学生
export function deleteStudent(studentId) {
  return request({
    url: `/api/userinfo/${studentId}`,
    method: 'delete'
  })
}