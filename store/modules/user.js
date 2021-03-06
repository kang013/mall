import Vuex from 'vuex'
import { login, logout, refresh,register } from '@/api/auth'
import * as auth from '@/utils/auth'
import { getCurrentUser, updateUser } from '@/api/user'

const getDefaultState = () => {
    return {
        user: auth.getUser(),
        accessToken: auth.getToken(),
        accessTokenExpiredAt: auth.getTokenExpiredAt()
    }
}


const state = getDefaultState()

// 定义 getters
var getters = {
    isLoggedIn: state => !!state.accessToken,
    user: state => state.user,
    accessToken: state => state.accessToken,
    accessTokenExpiredAt: state => state.accessTokenExpiredAt
}

// 定义 actions
const actions = {
    async register ({ dispatch }, params = {}) {
        let registerResponse = await register(params)
        console.log(registerResponse)
        console.log(params)
        if(registerResponse){
            // 注册成功自动登录
            await dispatch('login',{
                username:params.phone,
                password:params.password
            })
        }
    },
    async login ({ dispatch, commit }, params = {}) {
        const authResponse = await login(params)
        if(authResponse){
            commit('setToken', authResponse.data)
            auth.setToken(authResponse.data)

            dispatch('getUser')
        }

    },
    async getUser ({ dispatch, commit }) {
        const userResponse = await getCurrentUser()

        commit('setUser', userResponse.data)
        auth.setUser(userResponse.data)
    },
    async refresh ({ dispatch, commit, state }, params = {}) {
        const refreshResponse = await refresh(state.accessToken, {}, false)

        commit('setToken', refreshResponse.data)
        auth.setToken(refreshResponse.data)

        dispatch('getUser')
    },
    async logout ({ commit, state }) {
        await logout(state.accessToken)

        // 清空 storage
        auth.logout()
        commit('resetState')
    },
    async updateUser ({ commit }, params = {}) {

        const editResponse = await updateUser(params)

        commit('setUser', editResponse.data)
        auth.setUser(editResponse.data)
    }
}

// 定义 mutations
const mutations = {
    setUser(state, user) {
        state.user = user
    },
    setToken(state, tokenPayload) {
        state.accessToken = tokenPayload.access_token
        state.accessTokenExpiredAt = new Date().getTime() + tokenPayload.expires_in * 1000
    },
    resetState: (state) => {
        Object.assign(state, getDefaultState())
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
