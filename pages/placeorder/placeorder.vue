<template>
	<view>
		<view class="place-view">
			<view class="no-addr" v-if="isAddr" @click="addAdrr">
				+ 新增收货地址
			</view>
			<!-- 已选中地址 -->
			<view class="default-addr" v-else @click="addAdrr">
				<view class="img">
					<image src="../../static/coen/address.png" mode="widthFix"></image>
				</view>
				<view class="addr-detail">
					<view>
						{{address.detailInfo}}
					</view>
					<view class="user-detail">
						<text>{{address.userName}}</text>
						<text>{{address.telNumber}}</text>
					</view>
				</view>
				<view class="addr-right">
					<image src="../../static/coen/jiantou.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="place-time">
				<image src="../../static/coen/times.png" mode="widthFix"></image>
				<text>立即送出</text>
			</view>
		</view>

		<!-- 菜单 -->
		<view class="place-view">
			<view>
				<block v-for="(item,index) in goods" :key="item">
					<view class="goods-view">
						<view class="goods-img">
							<image :src="item.image" mode="aspectFill"></image>
						</view>
						<view class="goods-title">
							<text>{{item.name}}</text>
							<text>{{`X${item.amount}`}}</text>
						</view>
						<view class="goods-price">
							{{`单价：${item.discount}`}}
						</view>
					</view>
				</block>
			</view>
		</view>
		<view class="place-view">
			<view class="delivery">
				{{`配送费：${physical}`}}
			</view>
		</view>
		<!-- 高度 -->
		<view style="height: 140upx;">

		</view>
		<view class="payment">
			<view class="pay-left">
				<text>合计：</text>
				<text>{{payment}}</text>
			</view>
			<view class="pay-right" @click="toPay">
				去支付
			</view>
		</view>
		<home-load v-if="isInition"></home-load>
		<!-- 使用消息提示组件 -->
		<HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages" @clickMessage="clickMessage"></HMmessages>
	</view>
</template>

<script>
	import {publicing} from "../../api/api.js"
	import {wxpayingurl} from "../../api/request.js"
	import HMmessages from "@/components/HM-messages/HM-messages.vue"
	const {log} = console
	export default {
		data() {
			return {
				isInition:true,
				isAddr: true,
				goods:[],
				openid:'',
				payment:'',
				physical:Number,
				merchantId:'',
				merchantName:'',
				merchantLogo:'',
				address:''
			}
		},
		components:{
			HMmessages	
		},
		methods: {
			addAdrr() {
				wx.chooseAddress({
					success:res=>{
						this.address = res;
						this.isAddr = false;
					}
				})
			},
			toPay(){
				if(this.isAddr) {
					const mes = '请填写收货地址';
					const ico = 'error';
					this.tips(mes,ico)
				}else {
					this.wxPay();
				}
			},
			async wxPay(){
				uni.showToast({
				    title: '正在下单',
					icon: 'loading',
					mask: true,
				    duration: 200000
				});
				// 搞定必填参数
				// 客户信息
				let peopleobj = {
					address:this.address.detailInfo,
					name:this.address.userName,
					iphone:this.address.telNumber
				}
				// 商家标识
				let merchantid = this.merchantId
				// 截取商家标识字符串
				let ide = this.merchantId.slice(0,7)
				// 商家名称
				let commod = this.merchantName
				// 商家logo
				let logo = this.merchantLogo
				// 把要发送到后台的数据以对象形式存储
				let Paymentinfor = {
					type:'placeOrder',
					peopleobj,
					arrinfo:this.goods,
					merchantid,
					ide,
					commod,
					logo,
					useropenid:this.openid,
					payment:this.payment
				}
				log(Paymentinfor)
				// 发起支付第一步：统一下单，await当前完成，才执行下一步
				let placeOrder = await this.palceOrder(Paymentinfor);
				log(placeOrder);
				const placeinfos = placeOrder.data.data;
				// 第二步 发起支付
				let wxpays = await this.startPay(placeinfos);
				log(wxpays);
				// 第三步 查询是否支付成功
				let paysucc = await this.paySucc(placeinfos);
				log(paysucc)
			},
			// 支付第一步 统一下单
			palceOrder(Paymentinfor) {
				return new Promise((resolve,reject)=>{
					publicing(wxpayingurl,Paymentinfor)
					.then(res=>{
						uni.hideToast();
						log(res);
						resolve(res);//执行下一步	
					})
					.catch(err=>{
						// publicing中err有提示组件
						log(err);
						uni.hideToast();
						reject('支付错误');
					})
				})
			},
			// 第二步 发起支付
			startPay(placeinfos){
				return new Promise((resolve,reject)=>{
					wx.requestPayment({
						timeStamp: placeinfos.time_stamp,
						nonceStr: placeinfos.nonceStr,
						// 未开通无此参数
						package: `prepay_id=${placeinfos.prepayId}`,
						signType: 'MD5',
						paySign: placeinfos.payauto,
						success:(res)=>{
							log(res);
							resolve(res);//执行下一步
						},
						fail:(err)=>{ 
							log(err);
							reject(err);
							let succ = '取消支付';
							let ico = 'error';
							this.tips(succ,ico);
							
							// 未开通，执行到此处，在此处对菜品的库存-num，销量+num
						}
					})
				})
			},
			paySucc(placeinfos) {
				return new Promise((resolve,reject)=>{
					let data = {
						type:'paysucc',
						out_trade_no:placeinfos.out_trade_no,
						id:placeinfos._id,
						merchantid:this.merchantId
					};
					
					publicing(wxpayingurl,data)
					.then(res=>{
						log(res);
						let succ = '支付成功'
						let ico = 'success'
						this.tips(succ,ico);
					})
					.catch((err)=>{
						log(err)
						let succ = '支付失败'
						let ico = 'error'
						this.tips(succ,ico)
					})
				})
			},
			// 提示
			tips(mes,ico) {
				this.HMmessages.show(mes,{icon:ico,fontColor:'#fff',iconColor:'#fff',background:"rgba(0,0,0,0.5)"})
			}
		},
		// 接收下单页面的路径数据，页面加载
		onLoad(e) {
			log(e)
			if(e.ide!=null){
				let orderinfos = JSON.parse(e.ide)
				log(orderinfos)
				// 商品数据
				this.goods = orderinfos.goods
				// openid
				this.openid = orderinfos.openid
				// 支付的价格
				this.payment = orderinfos.payment
				// 配送费
				this.physical = orderinfos.physical
				// 商家标识
				this.merchantId = orderinfos.merchantId
				// 商家名称
				this.merchantName = orderinfos.merchantName
				// 商家logo
				this.merchantLogo = orderinfos.merchantLogo
				
				this.isInition = false;
			}
			
		}
	}
</script>

<style>
	page {
		background: #f4f4f4;
	}

	.place-view {
		background: #FFFFFF;
		margin: 20upx;
		border-radius: 9upx;
		padding: 35upx 15upx;
	}

	.no-addr {
		border: 1rpx solid #ffb000;
		width: 400upx;
		height: 80upx;
		line-height: 80upx;
		border-radius: 50upx;
		text-align: center;
		color: #ffb000;
		margin: 0 auto;
		font-size: 30upx;
	}

	/* 收货地址 */
	.default-addr {
		display: flex;
		align-items: center;
		font-size: 30upx;
	}

	.default-addr .img {
		width: 40upx;
		height: 40upx;
		padding-right: 20upx;
	}

	.img image {
		width: 100%;
		height: 100%;
	}

	.default-addr .addr-detail {
		flex-grow: 1;
		font-size: 30upx;
	}

	.default-addr .user-detail {
		display: flex;
		align-items: center;
	}

	.user-detail text:nth-child(1) {
		padding-right: 10upx;
	}

	.default-addr .addr-right {
		width: 40upx;
		height: 40upx;
	}

	.addr-right image {
		width: 100%;
		height: 100%;
	}

	.place-time {
		display: flex;
		align-items: center;
		font-size: 30upx;
		border-top: 1rpx solid #F4f4f4;
		padding-top: 35upx;
		margin-top: 35upx;
	}

	.place-time image {
		width: 40upx;
		height: 40upx;
		padding-right: 20upx;
	}

	.goods-address {
		display: flex;
		align-items: center;
	}

	.goods-view {
		display: flex;
		justify-content: space-between;
		height: 150upx !important;
		overflow: hidden;
		margin-bottom: 15upx;
		font-size: 30upx;
	}

	.goods-view text {
		display: block;
	}

	.goods-view .goods-img {
		width: 200upx;
		height: 150upx;
		padding-right: 15upx;
	}

	.goods-img image {
		width: 100%;
		height: 100%;
	}

	.goods-view .goods-title {
		flex-grow: 1;
	}
.goods-title text:nth-child(1) {
		color: #333;
		font-size: 30upx;
		font-weight: 700;
	}
	.goods-title text:nth-child(2) {
		color: #999999;
		font-size: 25upx;
	}

	.goods-view .goods-price {
		font-size: 30upx;
		color: #333333;
	}

	.delivery {
		display: flex;
		justify-content: flex-end;
		font-size: 30upx;
	}

	/* 支付 */
	.payment {
		background: #FFFFFF;
		height: 120upx;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 30upx;
	}

	.pay-left {
		display: flex;
		align-items: center;
		font-size: 30upx;
	}

	.pay-left text:nth-child(2) {
		font-weight: bold;
		font-size: 32upx;
	}

	.pay-right {
		background: #07c160;
		color: #FFFFFF;
		padding: 20upx 60upx;
		font-size: 30upx;
		border-radius: 7upx;
	}
</style>
