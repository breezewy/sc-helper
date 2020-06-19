import { login, logout, getInfo, getPermissions } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  button: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_BUTTON: (state, buttons) => {
    state.button = buttons
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, captcha, userType, loginType, uuid } = userInfo
    return new Promise((resolve, reject) => {
      login({
        username: username.trim(),
        password: password,
        captcha: captcha,
        userType: userType,
        loginType: loginType,
        uuid: uuid
      }).then(response => {
        if (response.data.code !== 200) {
          return this.$message.error(response.data.error)
        }
        const { data } = response
        commit('SET_TOKEN', data.data.token)
        setToken(data.data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        if (!data) {
          reject('验证失败，请重新登录')
        }
        const { realName, avatar } = data.data
        commit('SET_NAME', realName)
        commit('SET_AVATAR', avatar)
        resolve(data.data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_NAME', '')
        commit('SET_AVATAR', '')
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  },

  // 获取按钮权限
  getPermissions({ commit, state }) {
    return new Promise((resolve, reject) => {
      getPermissions().then(response => {
        const { data } = response
        commit('SET_BUTTON', data.data)
        resolve(data.data)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

