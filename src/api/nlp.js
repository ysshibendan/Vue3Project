import request from '@/utils/request'

// 文本分析
export function analyzeText(data) {
  return request({
    url: '/api/v1/nlp/analyze',
    method: 'post',
    data
  })
}

// 批量分析
export function batchAnalyze(data) {
  return request({
    url: '/api/v1/nlp/batch',
    method: 'post',
    data
  })
}