<template>
	<view class="shop-head">
		<view class="shop-take">
			<view class="shop-img">
				<image :src="busiIntroData.logo" mode="widthFix"></image>
			</view>
			<view class="shop-right">
				<view class="shop-title">{{busiIntroData.shop}}
				<view @click="cliCollected(busiIntroData.openid)" style="display: inline-block;">
					<image src="../../../static/you/collewi.svg" v-if="isCollected"></image>
					<image src="../../../static/you/colle.svg" v-if="!isCollected"></image>
				</view>
				</view>
				
				<view class="shop-duration">
					<image src="../../../static/coen/shijian.svg" mode="widthFix"></image>
					<text>{{`配送约${busiIntroData.duration}分钟`}}</text>
				</view>
			</view>
		</view>
		<modal ref = 'modal'></modal>
	</view>
</template>

<script>
	import {publicing} from '../../../api/api.js'
	import {setcollectedurl} from '../../../api/request.js'
	import Modal from '../../../components/Modal.vue'
	const {log} =console
	export default {
		components:{
			Modal
		},
		props:{
			busiIntroData:Object
		},
		data(){
			return {
				isCollected:true,
				ids:'',
				bussidatas:{}
			}
		},
		watch:{
			busiIntroData(newdata,olddata){
				this.bussidatas = newdata
				this.getCollection()
			}
		},
		methods:{
			cliCollected(merchantid){
				let openid = uni.getStorageSync('userInfo').openid;
				if(!openid){
					this.$nextTick(()=>{
						this.$refs.modal.init();
					})
					return
				}
				this.isCollected = !this.isCollected
				let type = this.isCollected?'canlce':'colle'
				let data = {
					openid,
					merchantid,
					type
				}
				log(data)
				publicing(setcollectedurl,data)
				.then(res=>{
					log(res)
					if (res.data.msg == 'SUCCESS') {
							
						} else {
							
						}
					})
					.catch(err => {
						log(err);
					})
			},
			getCollection(){
				// log(this.busiIntroData)
				log(this.bussidatas)
				let openid = uni.getStorageSync('userInfo').openid;
				// log(openid)
				let merchantid = this.busiIntroData.openid
				let type = ''
				let data = {
					openid,
					merchantid,
					type
				}
				log(data)
				publicing(setcollectedurl,data)
				.then(res=>{
					log(res)
					if (res.data.data.length === 0) {
							this.isCollected = true
						} else {
							this.isCollected = false
						}
					})
					.catch(err => {
						log(err);
					})
			}
		}
		
	}
</script>

<style scoped>
	text {
		display: block;
	}
	.shop-head {
		height: 130upx;
		background: linear-gradient(to top,#bdcda2 10%,#7ccd7d 100%);
		border-bottom-left-radius: 10upx;
		border-bottom-right-radius: 10upx;
	}
	.shop-take {
		display: flex;
		height: 130upx;
		padding: 0 10upx;
	}
	.shop-img {
		height: 120upx;
		width: 120upx;
	}
	.shop-img image {
		width: 100%;
		height: 100%;
		border-radius: 10upx;
	}
	.shop-right {
		width: 100%;
		margin-left: 20upx;
	}
	.shop-right .shop-title {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
		
		font-size: 37upx;
		margin-bottom: 19upx;
	}
	.shop-title image {
		width: 40rpx;
		height: 40rpx;
		padding-left: 15rpx;
		vertical-align: middle;
	}
	.shop-right .shop-duration {
		display: flex;
		/* justify-content: center; */
		align-items: center;
		
		height: 40upx;
		line-height: 40upx;
		font-size: 27upx;
		
	}
	.shop-duration image {
		width: 27upx;
		height: 27upx;
		padding-right: 9upx;
	}
</style>
