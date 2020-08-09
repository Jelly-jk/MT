
// 这模块里面是菜单对应的vuex数据

const state = () => ({menu: [], hotPlace: []}) // 这里之所以在对象外面加括号，是怕和箭头函数的{}弄混淆
                                         // 这里好像直接用对象就行，没必要用函数返回的形式。
const mutations = {
  setMenu(state, val) {
    state.menu = val
  },
  setHotPlace(state, val) {
    state.hotPlace = val
  }
}

const actions = {
  setMenu: ({
    commit
  }, menu) => {
    commit('setMenu', menu)
  },
  setHotPlace: ({
    commit
  }, hotPlace) => {
    commit('setHotPlace', hotPlace)
  }
}

export default {namespaced: true, state, mutations, actions}
