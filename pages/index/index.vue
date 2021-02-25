<template>
	<view class="content">
		<search></search>
		<preference :preferdata="preferdata"></preference>
		<nearby-shop></nearby-shop>
		<view @click="poll" :catchtouchmove="true">
			<screen id="box-fixed" :class="{'is-fixed':isfixed}"></screen>
		</view>
		<tackout :shoplist="shoplist"></tackout>
		<home-load v-if="isInition"></home-load>
	</view>
</template>

<script>
	import Search from "./components/search.vue"
	import Preference from "./components/preference.vue"
	import NearbyShop from "./components/nearby-shop.vue"
	import Screen from "./components/screen.vue"
	import Tackout from "./components/takeout.vue"

	// 引入为你优选接口
	import {
		listing
	} from "../../api/api.js"

	// 引入请求地址
	import {
		getpreferurl,
		wxShop
	} from "../../api/request.js"
	
	// 引入vuex的mapState
	import { mapState } from 'vuex'
	
	export default {
		components: {
			Search,
			Preference,
			NearbyShop,
			Screen,
			Tackout
		},
		data() {
			return {
				// 获取滚动到页面的目标位置
				topDis: '',
				// 是否置顶
				isfixed: false,
				// 滚动的距离
				distance: '',
				// 筛选组件距离顶部的距离
				menuTop: '',
				// 为你优选
				preferdata: [],
				shoplist:[],
				// 是否需要加载
				isInition:true
			}
		},
		methods: {
			//  批量并发请求多个接口，Promise.all=> 可以并发请求多个接口。
			//  并且同时得到多个接口的数据
			// 但是如果有一个接口挂了，其他也不会显示了
			
			perference() {
				Promise.all([
						listing(getpreferurl),
						listing(wxShop)
					])
					.then((res) => {
						console.log(res);
						// 为你优选
						this.preferdata = res[0].data.data;
						// 附近商家
						this.shoplist = res[1].data.data;
						
						this.isInition = false;
						
					})
					.catch((err) => {
						console.log(err)
					})
			},

			
			

			// 点击筛选回到顶部
			poll() {
				wx.pageScrollTo({
					scrollTop: this.topDis + 2, //滚动到页面的目标位置，单位 px
					duration: 300 //滚动动画的时长，单位 ms
				})
			}
		},
		onLoad() {
			// 监听筛选组件距离顶部的距离
			const query = wx.createSelectorQuery()
			query.select('#box-fixed').boundingClientRect()
			query.selectViewport().scrollOffset()
			query.exec((res) => {
				// console.log(res[0].top);
				// res[0].top       // #box-fixed节点的上边界坐标
				// res[1].scrollTop // 显示区域的竖直滚动位置
				this.menuTop = res[0].top;
				// 获取滚动到页面的目标位置
				this.topDis = res[0].top;
			})
		},
		// 当页面返回主页重新请求数据
		onShow(){
			this.perference();
		},
		// 监听页面滚动距离 小程序提供
		onPageScroll(e) {
			this.distance = e.scrollTop;
		},
		mounted() {
			// this.perference();
			
		},
		// 计算属性 自动执行
		computed: {
			// mapState
			...mapState(['screenData']),
			// 筛选出商家数据
			shopList () {
				this.shoplist =  this.screenData.screenArr
			},
			
			// 时刻监听属性的变化,监听筛选组件置顶和不置顶
			isTop () {
				// console.log("自动执行");
				// 如果页面滚动的高度大于筛选组件距离顶部的高度，筛选组件置顶
				this.isfixed = this.distance > this.menuTop;
			}
		}
	}
</script>

<style scoped>
	.content {
		margin: 0 15rpx;
	}

	/* 置顶 */
	.is-fixed {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
	}
</style>
