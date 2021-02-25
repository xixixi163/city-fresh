<template>
	<view class="no-find" v-if="isShow">
		<image src="../static/coen/meoyopu.png" mode="widthFix"></image>
		<text>{{tips}}</text>
	</view>
</template>

<script>
	export default {
		data(){
			return {
				tips:'',
				isShow:false
			}
		},
		methods:{
			init(bull,tips) {
				this.isShow = bull;
				this.tips = tips;
			}
		}
	}
</script>

<style>
	.no-find {
		width: 400upx;
		height: 400upx;
		margin: 90upx auto 0 auto;
		font-size: 28upx;
		text-align: center;
	}
	
	.no-find image {
		display: block;
		width: 250upx;
		height: 250upx;
		margin: 0 auto;
		padding-bottom: 30upx;
	}
</style>
