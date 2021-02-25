import Vue from 'vue'
import App from './App'
import store from './store/index.js'
import HomeLoad from './components/Loading.vue'

Vue.prototype.$store = store

Vue.config.productionTip = false

Vue.component('home-load',HomeLoad);

App.mpType = 'app'

const app = new Vue({
    ...App,
	store
})
app.$mount()
