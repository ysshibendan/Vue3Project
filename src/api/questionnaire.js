import request from '@/utils/request'

// 创建问卷模板
export function createTemplate(data) {
  return request({
    url: '/api/questionnaire/template',
    method: 'post',
    data
  })
}

// 获取问卷模板列表
export function getTemplateList(params) {
  return request({
    url: '/api/questionnaire/templates',
    method: 'get',
    params
  })
}

// 获取问卷模板详情
export function getTemplateDetail(templateId, params) {
  return request({
    url: `/api/questionnaire/template/${templateId}`,
    method: 'get',
    params
  })
}

// 更新问卷模板
export function updateTemplate(templateId, data) {
  return request({
    url: `/api/questionnaire/template/${templateId}`,
    method: 'put',
    data
  })
}

// 添加问题
export function addQuestion(data) {
  return request({
    url: '/api/questionnaire/question',
    method: 'post',
    data
  })
}

// 更新问题
export function updateQuestion(questionId, data) {
  return request({
    url: `/api/questionnaire/question/${questionId}`,
    method: 'put',
    data
  })
}

// 删除问题
export function deleteQuestion(questionId) {
  return request({
    url: `/api/questionnaire/question/${questionId}`,
    method: 'delete'
  })
}

// 提交问卷
export function submitQuestionnaire(data) {
  return request({
    url: '/api/questionnaire/submit',
    method: 'post',
    data
  })
}

// 获取用户问卷结果列表
export function getUserResults(params) {
  return request({
    url: '/api/questionnaire/user/results',
    method: 'get',
    params
  })
}

// 获取问卷结果详情
export function getResultDetail(resultId, params) {
  return request({
    url: `/api/questionnaire/result/${resultId}`,
    method: 'get',
    params
  })
}