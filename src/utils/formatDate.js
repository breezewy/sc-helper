/**
 * @param {object} date
 * @returns {String}
 */
export function getDateTime(date) {
  const year = date.getFullYear()
  let month = (date.getMonth() + 1).toString()
  let day = (date.getDate()).toString()
  const hour = date.getHours().toString()
  const minute = date.getMinutes().toString()
  const second = date.getSeconds().toString()
  if (month.length === 1) {
    month = '0' + month
  }
  if (day.length === 1) {
    day = '0' + day
  }

  const dateTime = year + '年' + month + '月' + day + '日' + hour + '点' + minute + '分' + second + '秒'
  return dateTime
}
