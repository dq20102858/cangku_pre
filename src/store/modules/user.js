import request from '@/utils/request'
import {
  getToken,
  setToken,
  setSystem,
  getSystem,
  removeToken
} from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    system: getSystem() || 1
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_SYSTEMS: (state, system) => {
      state.system = system
    }
  },

  actions: {
    // 用户名登录
    LoginSystem({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password.trim()
      return new Promise((resolve, reject) => {
        const data = {
          username,
          password
        }
        request({
          url: '/login/login',
          method: 'post',
          data
        }).then(response => {
          if (response.data.status) {
            const data = response.data.data
            commit('SET_TOKEN', data.token)
            commit('SET_NAME', data.name)
            setToken(data.token)
            setSystem(1)
            resolve()
          } else {
            reject(error)
          }
        })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        request({
          url: '/login/userInfo',
          method: 'get',
          params: {
            token: state.token
          }
        })
          .then(response => {
            if (!response.data) {
              // 由于mockjs 不支持自定义状态码只能这样hack
              reject('error')
            }
            const data = response.data
            commit('SET_NAME', data.name)
            commit('SET_AVATAR', data.avatar)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        request({
          url: '/login/logout',
          method: 'post',
        }).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        })
          .catch(error => {
            reject(error)
          })
      })
    },
  }
}

export default user
