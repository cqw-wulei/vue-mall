import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    nowActData: JSON.parse(window.sessionStorage.getItem('localData')) || {},
    balance: window.sessionStorage.getItem('balance') || 0,
    totalRecommendRuiCurrency: window.sessionStorage.getItem('totalRecommendRuiCurrency') || 0,
    token: window.sessionStorage.getItem('token') || '',
    phone: window.sessionStorage.getItem('phone') || '-',
    getUser: false
  },
  mutations: {
    set_nowActData: function (state, data) {
      state.nowActData = data
    },
    set_balance: function (state, data) {
      state.balance = data
    },
    set_totalRecommendRuiCurrency: function (state, data) {
      state.totalRecommendRuiCurrency = data
    },
    set_token: function (state, data) {
      state.token = data
    },
    set_phone: function (state, data) {
      state.phone = data
    },
    set_getUser: function (state, data) {
      state.getUser = data
    }
  }
})
export default store
