<template>
	<view>
		<!-- 定位 -->
		<view class="search-view" @click="getlocation">
			<image src="../../../static/coen/dizhi.png" mode="widthFix"></image>
			<text class="search-text" >漳州市芗城区闽南师范大学</text>
			<text>></text>
		</view>
		<!-- 搜索 -->
		<view class="search-cont">
			<view class="search" @click="searchReh">
				<image src="../../../static/coen/sousuo.svg" mode="widthFix" class="search-img"></image>
				<input type="text" placeholder="火龙果" disabled />
			</view>
		</view>
		<!-- 自定义轮播 -->
		<view class="swiper-view">
			<!-- <scroll-view class="scrool-more" scroll-x="true" scroll-with-animation="true"> -->
			<swiper :autoplay="false" :interval="2000" :duration="1000" @change="bannerfun">
				<block v-for="(item,index) in lable" :key="index">
					<swiper-item>
						<view class="swiper-item">
							<block v-for="(listdata,index) in item" :key="index">
								<view class="conteng-img" >
								<!-- <view class="conteng-img" @click="toSearch(listdata.title)"> -->
									<navigator :url="'../search/search?key='+listdata.title">
										<image :src="listdata.img" mode="widthFix" class="uploadimg" style="height: 35rpx;"></image>
										<text>{{listdata.title}}</text>
									</navigator>
								</view>
							</block>
						</view>
					</swiper-item>
				</block>
			</swiper>
			</scroll-view>
			<!-- 指示点 -->
			<view class="instruct-view">
				<block v-for="(item,index) in instructdata" :key="index">
					<view class="instruct" :class="{active:index===num}">{{item}}</view>
				</block>
			</view>
		</view>
	</view>
</template>

<script>
	// 引入SDK核心类
	const QQMapWX = require('../../../libs/qqmap-wx-jssdk.js');
	import getCity from '../../../location/getlocation.js'
	export default {
		data() {
			return {
				num: 0,
				// 面板指示点
				instructdata: ['', ''],
				// 轮播数组
				lable: [
					[{
							'img': '../../../static/inster/shui.svg',
							'title': '当季水果'
						},
						{
							'img': '../../../static/inster/shucai.svg',
							'title': '有机蔬菜'
						},
						{
							'img': '../../../static/inster/guo.svg',
							'title': '有机水果'
						},
						
						{
							'img': '../../../static/inster/wugu.svg',
							'title': '五谷副食'
						},
						{
							'img': '../../../static/inster/juzi.svg',
							'title': '甜橘'
						},
						{
							'img': '../../../static/inster/putao.svg',
							'title': '生态葡萄'
						},
						
						{
							'img': '../../../static/inster/yang.svg',
							'title': '洋肚菌'
						},
						{
							'img': '../../../static/inster/cong.svg',
							'title': '紫洋葱'
						},
						{
							'img': '../../../static/inster/nangua.svg',
							'title': '老南瓜'
						},
						{
							'img': '../../../static/inster/zhurou.svg',
							'title': '猪肉'
						}
					],
					[{
							'img': '../../../static/inster/donghua.svg',
							'title': '小冬瓜'
						},
						{
							'img': '../../../static/inster/ping.svg',
							'title': '平菇'
						},
						{
							'img': '../../../static/inster/niurou.svg',
							'title': '牛肉'
						},
						{
							'img': '../../../static/inster/e.svg',
							'title': '鹅半只'
						},
						{
							'img': '../../../static/inster/yu.svg',
							'title': '野生鱼'
						},
						{
							'img': '../../../static/inster/ningm.svg',
							'title': '无核柠檬'
						},
						{
							'img': '../../../static/inster/xiangjiao.svg',
							'title': '红蕉'
						},
						{
							'img': '../../../static/inster/yanmai.svg',
							'title': '燕麦米'
						},
						
						
						{
							'img': '../../../static/inster/suantou.svg',
							'title': '大蒜头'
						},
						{
							'img': '../../../static/inster/banli.svg',
							'title': '板栗'
						}
					]
				]
			}
		},
		methods: {
			// 滑块事件
			bannerfun(e) {
				this.num = e.detail.current;
			},
			// 到搜索页面
			searchReh() {
				uni.navigateTo({
					url: '../search/search'
				})
			},
			getlocation(){
				getCity()
			},
			// 点击调到搜索
			toSearch(title){
				console.log(title);
				uni.navigateTo({
					url: '../search/search?key='+title
				})
			}
		},
		onLoad() {
			getCity()
		},
		onShow() {
			// 调用接口
			// qqmapsdk.search({
			// 	keyword: '酒店',
			// 	success: function(res) {
			// 		console.log(res);
			// 	},
			// 	fail: function(res) {
			// 		console.log(res);
			// 	},
			// 	complete: function(res) {
			// 		console.log(res);
			// 	}
			// });
			getCity()
		}
	}
</script>

<style scoped>
	.scrool-more {
		white-space: nowrap; 
		width: 100%;  
		height: 300rpx;
		display: inline-block; 
	}
	/* scoped 是样式在当前页面生效 */
	/* 定位 */

	.search-view {
		display: flex;
		align-items: center;
		font-size: 30rpx;
		font-weight: 700;
		height: 80rpx;
	}

	.search-view image {
		width: 35rpx;
		height: 35rpx;
	}

	.search-text {
		padding: 0 10rpx;
	}

	/* 搜索 */
	.search-cont {
		height: 70rpx;
	}

	.search {
		height: 70rpx;
		line-height: 70rpx;
		width: 100%;
		display: flex;
		flex-direction: row;
		background: #eff3f4;
		border-radius: 10rpx;
	}

	.search-img {
		margin: auto 0 auto 20rpx;
		width: 40rpx;
		height: 40rpx;
	}

	.search input {
		height: 70rpx;
		line-height: 70rpx;
		width: 100%;
		font-size: 25rpx;
		color: #666666;
	}

	/* 轮播 */
	swiper {
		height: 320rpx !important;
	}

	/* 九宫格 */
	.swiper-item {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		align-content: center;
		height: 320rpx;
	}

	.conteng-img {
		width: 35rpx;
		position: relative;
		text-align: center;
		/* width: calc((100% / 5) - 12px) !important; */
		margin: 10rpx 0;
		/* height: 120upx; */
		flex: 20%;
	}

	.conteng-img text {
		display: block;
		margin: 0 auto;
		padding-top: 8rpx;
		font-size: 25rpx;
	}

	.uploadimg {
		width: 70rpx;
		height: 70rpx;
		border-radius: 50rpx;
	}

	/* 指示点 */
	.instruct-view {
		display: flex;
		justify-content: center;
		padding-top: 10upx;
	}

	.instruct {
		background: #e6e6e6;
		height: 10upx;
		width: 30upx;
		border-radius: 50upx;
		margin: 0 10upx;
	}

	.active {
		background: #4CD964 !important;
	}
</style>
