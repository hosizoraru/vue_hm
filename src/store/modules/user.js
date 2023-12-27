export default {
  namespaced: true, // 封闭小仓库 全局->局部
  state: {
    // username: '张三'
    token: localStorage.getItem('token') ? localStorage.getItem('token') : ''
  },
  mutations: {
    // changeName(state, newName) {
    //   state.username = newName
    // }
    // 更新仓库的 token 数据
    setToken(state, newToken) {
      state.token = newToken
      localStorage.setItem('token', newToken)
    }
  },
  actions: {}
}
