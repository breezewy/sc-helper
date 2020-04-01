/**
 * @param {object} date
 * @returns {String}
 */
import { getDateTime } from './formatDate'
export function handleExport(data) {
  const filename = getDateTime(new Date())
  const blob = new Blob([data])
  const elink = document.createElement('a')
  elink.download = `${filename}.xls` // a标签的download属性规定下载文件的名称
  elink.style.display = 'none'
  elink.href = URL.createObjectURL(blob) // 生成一个Blob URL
  document.body.appendChild(elink)
  elink.click()
  URL.revokeObjectURL(elink.href) // 释放URL 对象
  document.body.removeChild(elink)
}
