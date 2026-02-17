import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
 
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')
 
/**
 * 格式化日期
 * @param {string|Date} date 日期
 * @param {string} format 格式，默认为 'YYYY-MM-DD HH:mm:ss'
 * @returns {string} 格式化后的日期字符串
 */
export function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) return ''
  return dayjs(date).format(format)
}
 
/**
 * 格式化为相对时间
 * @param {string|Date} date 日期
 * @returns {string} 相对时间字符串
 */
export function formatRelativeTime(date) {
  if (!date) return ''
  return dayjs(date).fromNow()
}
 
/**
 * 格式化为短日期
 * @param {string|Date} date 日期
 * @returns {string} 短日期字符串
 */
export function formatShortDate(date) {
  if (!date) return ''
  return dayjs(date).format('MM-DD')
}
 
/**
 * 格式化为短时间
 * @param {string|Date} date 日期
 * @returns {string} 短时间字符串
 */
export function formatShortTime(date) {
  if (!date) return ''
  return dayjs(date).format('HH:mm')
}
 
/**
 * 判断是否为今天
 * @param {string|Date} date 日期
 * @returns {boolean} 是否为今天
 */
export function isToday(date) {
  if (!date) return false
  return dayjs(date).isSame(dayjs(), 'day')
}
 
/**
 * 判断是否为昨天
 * @param {string|Date} date 日期
 * @returns {boolean} 是否为昨天
 */
export function isYesterday(date) {
  if (!date) return false
  return dayjs(date).isSame(dayjs().subtract(1, 'day'), 'day')
}
 
/**
 * 格式化聊天时间
 * @param {string|Date} date 日期
 * @returns {string} 聊天时间字符串
 */
export function formatChatTime(date) {
  if (!date) return ''
  
  if (isToday(date)) {
    return formatShortTime(date)
  } else if (isYesterday(date)) {
    return '昨天 ' + formatShortTime(date)
  } else {
    return formatDate(date, 'MM-DD HH:mm')
  }
}