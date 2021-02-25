<template>
	<view class="takeout">
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
						<image src="../../../static/coen/liwu.svg" mode="widthFix"></image>
						<text class="type">{{item.types}}</text>
					</view>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
	export default {
		props:{
			shoplist:Array
		},
		data() {
			return {
				
			}
		},
		methods:{
			showMerch(openid) {
				// console.log(openid);
				wx.navigateTo({
					url:'../shop/Shop?id='+openid
				})
			}
		}
		
	}
</script>

<style>

	@import url("../../../common/city-fresh.css");
	.takeout {
		margin-top: 40px;
	}
	.type {
		width: 170rpx;
	}
</style>
