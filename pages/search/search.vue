<template>
	<view>
		<view class="search-cont">
			<view class="search">
				<image src="../../static/coen/search.png" mode="widthFix"></image>
				<input type="text" value="" placeholder-class="inputclass" confirm-type="search" placeholder="请输入关键字" @confirm="onkeyInput"
				 v-model="searchData" />
			</view>
			<view class="search-code" @click="search">
				搜索
			</view>
		</view>
		<!-- 搜索历史 -->
		<view class="search-history" v-show="isHistory">
			<view class="search-title">
				<view>
					搜索历史
				</view>
				<view @click="removeStorage">
					<image src="../../static/coen/searchend.svg" mode="widthFix"></image>
				</view>
			</view>
			<!-- tab -->
			<view class="menu-block">
				<block v-for="(item,index) in historyData" :key="index">
					<view :class="activeText" @click="menuHis(item)">
						{{item}}
					</view>
				</block>
			</view>
		</view>

		<!-- 内容展示 -->
		<view class="content-left" v-show="isContent">
			<block v-for="(item,index) in shoplist" :key="index">
				<view class="content-view" @click="showMerch(item.openid)">
					<view class="content-img">
						<image :src="item.logo" mode="aspectFit"></image>
					</view>
					<view class="content-title">
						<text class="conteng-take">{{item.shop}}</text>
						<view class="conteng-monthly">
							<text>月售{{item.monsales}}</text>
							<text>约{{item.duration}}分钟</text>
						</view>
						<view class="conteng-starting">
							<text>起送¥{{item.delivering}}</text>
							<text>配送¥{{item.physical}}</text>
							<text>人均¥{{item.capita}}</text>
						</view>
						<view class="conteng-starting">
							<image src="../../static/coen/liwu.svg" mode="widthFix"></image>
							<text>{{item.types}}</text>
						</view>
					</view>
				</view>
			</block>
		</view>
		<!-- 反馈组件 -->
		<tips ref="notips"></tips>
	</view>
</template>

<script>
	import { publicing } from '../../api/api.js'
	import { searchurl } from '../../api/request.js'
	import tips from '../../components/NoFindTips.vue'
 	// 解构log
	let { log } = console
	export default {
		components:{
			tips
		},
		data() {
			return {
				// 是否显示搜索结果
				isContent:false,
				// 是否显示搜索历史
				isHistory: false,
				// 搜索关键词
				searchData: '',
				// 搜索结果
				shoplist: [],
				// 搜索历史
				historyData: ['22']
			}
		},
		methods: {
			showMerch(openid) {
				// console.log(openid);
				wx.navigateTo({
					url:'../shop/Shop?id='+openid
				})
			},
			// 点击搜索
			search() {
				// console.log(this.searchData);
				if (this.searchData != '') {
					// 隐藏搜索历史
					this.isHistory = false
					let searchKey = this.searchData
					this.requestSearch(searchKey)
					this.setStorage(searchKey)
				}
			},

			// 搜索键盘的触发
			onkeyInput(e) {
				let searchKey = e.detail.value
				if (searchKey != '') {
					this.isHistory = false
					// console.log(e.detail.value);
					this.requestSearch(searchKey)
					this.setStorage(searchKey)
				}
			},
			// 本地缓存 搜索历史
			setStorage(searchkey) {
				// 存一个数组类型
				// 先取出本地缓存的数据
				let searchArr = uni.getStorageSync('search_key') || []
				// 从前面存入数组
				searchArr.unshift(searchkey)

				uni.setStorageSync('search_key', searchArr)
			},
			// 取出本地缓存数据,不会自动执行，放到生命周期函数中
			getStorage() {
				let getData = uni.getStorageSync('search_key')
				// 数组去重
				let setData = [...new Set(getData)]

				if (setData == '') {
					this.isHistory = false
				} else {
					this.historyData = setData
					this.isHistory = true
				}
			},
			// 手动清除搜索历史缓存
			removeStorage() {
				uni.removeStorageSync('search_key');
				this.getStorage()
			},
			// 搜索历史按钮搜索
			menuHis(item){
				this.requestSearch(item)
				this.isHistory = false
			},
			// 发送请求搜索
			requestSearch(searchKey) {
				// api要求用对象发送
				let data = {
					searchdata: searchKey
				}
				publicing(searchurl, data)
					.then(res => {
						if(res.data.msg == '没有商品数据'){
							this.isContent = false;
							let bull = true;
							let tips = '没有你要找的商品'
							this.sentTips(bull,tips)
						}else {
							let bull = false;
							let tips = '';
							this.sentTips(bull,tips);
							this.isContent = true;
							this.shoplist = res.data.data
						}
						log(res);
					})
					.catch(err => {
						log(err);
					})
			},
			// 反馈提示
			sentTips(bull,tips) {
				// 页面渲染出来时执行
				this.$nextTick(()=>{
					this.$refs.notips.init(bull,tips)
				})	
			}
		},
		created() {
			this.getStorage()
			// log(this.historyData)
		},
		onLoad(e) {
			console.log(e.key);
			if(e.key){
				this.searchData = e.key
				this.requestSearch(e.key)
			}
		}

	}
</script>

<style scoped>
	@import url("../../common/city-fresh.css");

	.content-left {
		margin: 0 20upx;
	}

	.search-cont {
		display: flex;
		justify-content: space-between;
		align-items: center;

		height: 70upx;
		padding: 30upx 0;
		/* box-sizing: border-box; */
	}

	.search {
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 70upx;
		width: 100%;
		line-height: 70upx;
		margin-left: 20upx;
		border-radius: 20upx;
		background: #F8F8F8;
	}

	.search image {
		width: 30upx;
		padding-left: 20upx;
	}

	.search input {
		height: 70upx;
		line-height: 70upx;
		width: 100%;
		padding-left: 15upx;
		font-size: 30upx;
		color: #666;
		vertical-align: middle;
	}

	.search-code {
		display: inline-block;
		width: 150upx;
		height: 70upx;
		line-height: 70upx;
		text-align: center;
		font-size: 30upx
	}

	/* 搜索历史 */
	.search-history {
		margin: 20upx;
	}

	.search-title {
		display: flex;
		justify-content: space-between;
		align-items: center;

		height: 60upx;
		line-height: 60upx;
	}

	.search-title image {
		width: 36upx;
		height: 36upx;
	}

	.menu-block {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		flex-wrap: wrap;
	}

	.menu-block view {
		margin: 20upx 20upx 0 0;
		padding: 10upx;
		border-radius: 6upx;
		background: #f7f8fa;
		font-size: 27upx;
		text-align: center;
		color: #292c33;
	}
</style>
