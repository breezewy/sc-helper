import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 20000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      config.headers['Content-Type'] = 'application/json'
      config.headers['token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response
    const status = res.status
    if (res.request.responseURL.indexOf('auth/captcha') !== -1) {
      return response
    } else if (res.request.responseURL.indexOf('gatherPark/creatQrCode') !== -1) {
      return response
    }

    if (status !== 200) {
      Message({
        message: res.statusText || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
    } else {
      if (res.data.code && res.data.code === 401) {
        store.dispatch('user/resetToken')
      }
      return response
    }
  },
  error => {
    return Promise.reject(error)
  }
)

export default service
