// store.js
import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import authService from '@/services/authService'

const store = createStore({
    state() {
        return {
            user: null,
            isAdmin: null,
            token: null
        }
    },
    mutations: {
        setUser(state, user) {
            state.user = user
            state.isAdmin = user.isAdmin
            state.token = user.accessToken
        },
        clearUser(state) {
            state.user = null
            state.isAdmin = null
            state.token = null
        }
    },
    getters: {
        isAdmin(state) {
            return state.isAdmin === true
        },
        isLoggedIn(state) {
            return !!state.user
        },
        user(state) {
            return state.user
        },
        token(state){
            return state.token
        }
    },
    actions: {
        async login({ commit }, { email, password }) {
            const user = await authService.login(email, password)
            commit('setUser', user.user)
        },
        async signup({ commit }, { email, password, name }) {
            const user = await authService.signup(email, password, name)
            commit('setUser', user)
        },
        logout({ commit }) {
            localStorage.clear()
            commit('clearUser')
        }
    },
    plugins: [createPersistedState({
        key: 'myApp',
        storage: window.sessionStorage,
        reducer: (state) => ({ user: state.user, isAdmin: state.isAdmin, token: state.token }) // Only persist user and role
    })]
})

export default store
