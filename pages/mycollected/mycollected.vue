<template>
	<view class="collect-list">
		<!-- 内容展示 -->
		<view class="content-left">
			<block v-for="(item,index) in shoplist" :key="index">
				<view class="content-view" style="background-color: #fff; margin: 15rpx 0;border-radius: 10rpx;padding: 10rpx;" @click="showMerch(item.openid)">
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
	</view>
</template>

<script>
	import {publicing} from '../../api/api.js'
	import {getcollectionurl} from '../../api/request.js'
	const {log}=console
	export default {
		data() {
			return {
				shoplist:[],
				openid:''
			}
		},
		methods: {
			showMerch(openid) {
				// console.log(openid);
				wx.navigateTo({
					url:'../shop/Shop?id='+openid
				})
			},
			getCollection() {
				let data = {
					openid:this.openid
				}
				publicing(getcollectionurl, data)
					.then(res => {						
						if (res.data.msg == '暂无收藏') {
							this.sentTips(true,res.data.msg)
						} else {
							let datas = res.data.data
							this.shoplist = datas.map(item=>item.merch[0])
							log(this.shoplist)
						}
						// log(res);
					})
					.catch(err => {
						log(err);
					})
			}
		},
		// onLoad(e) {
		// 	this.openid = uni.getStorageSync('userInfo').openid;
		// 	console.log(this.openid)
		// 	// this.takeRes(this.ids);
		// 	this.getCollection() 
		// },
		onShow() {
			this.openid = uni.getStorageSync('userInfo').openid;
			console.log(this.openid)
			// this.takeRes(this.ids);
			this.getCollection() 
		}
	}
</script>

<style>
	@import url("../../common/city-fresh.css");
	
	page {
		background-color: #F5F5F5
	}
	.collect-list {
		margin: 15upx;
	}
	.takeout {
		margin-top: 40px;
	}
	.type {
		width: 170rpx;
	}
</style>
