/**
 * @param {object} date
 * @returns {String}
 */
export function getDateTime(date) {
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString();
    let day = (date.getDate()).toString();

    if (month.length == 1) {
        month = '0' + month;
    }

    if (day.length == 1) {
        day = '0' + day;
    }

    let dateTime = year + '-' + month + '-' + day;
    return dateTime
}
