export default {
	storeScreen(state, payload) {
		// console.log(payload);
		// 存储到数据仓库
		state.screenData = {
			screenArr:payload
		}
	}
}