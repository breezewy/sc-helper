import request from '@/utils/request'

export function getCaptcha(id) {
    return request({
        url: `/auth/captcha?uuid=${id}`,
        method: 'get',
        responseType: "arraybuffer"
    })
}
