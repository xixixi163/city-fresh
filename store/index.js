import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutations.js'

Vue.use(Vuex)

const screenData = {
	// 存储筛选出来的数据
	screenArr:[]
}

// 数据仓库
const state = {
	screenData
}

export default new Vuex.Store({
	state,
	mutations
})
