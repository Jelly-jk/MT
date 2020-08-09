
// 这模块里面是定位信息对应的vuex数据

const state = () => ({
  position: {}
})

const mutations = {
  setPosition(state, val) {
    state.position = val
  }
}

const actions = {
  setPosition: ({commit}, position) => {
    commit('setPosition', position)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
