import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    token: localStorage.getItem('token'),
    roleId: '',
    admin: JSON.parse(localStorage.getItem('admin')),
    menuList: JSON.parse(localStorage.getItem('menuList'))
  },
  mutations: {
    setToken(state, data) {
      state.token = data
    },
    setAdmin(state, data) {
      state.admin = data
    },
    setMenuList(state, data) {
      state.menuList = data
    },
    setRoleId(state, data) {
      state.roleId = data
    }
  },
  actions: {}
})
export default store
