<template>
	<!-- catchtouchmove 阻止遮罩层滑动穿透 -->
	<view class="loading" :catchtouchmove="true">
		<view @click="locationtest">
			<image src="../static/coen/load.png" mode="widthFix"></image>
			<!-- <text>努力加载中...</text> -->
		</view>
	</view>
</template>

<script>
	import getCity from '../location/getlocation.js'
	export default {
		methods:{
			locationtest(){
				getCity()
			}
		}
	}
</script>

<style>
	.loading {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		
		background: #fff;
		z-index: 9999;
	}
	.loading view {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
	}
	.loading image {
		width: 300px;
		height: 100px;
	}
	.loading text {
		font-size: 25upx;
	}
</style>
