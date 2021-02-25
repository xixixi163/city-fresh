<template>
	<view>
		<block v-for="(item,index) in neworder" :key="index">
			<view class="order-back">
				<view class="order-view">
					<view class="order-img">
						<image :src="item.logo" mode="aspectFill"></image>
					</view>
					<view class="goods-commodity" @click="toshop(item.merchantid)">{{item.body}}
					<image src="../../static/you/right_arrow.png"></image>
					</view>
					<view class="order-succ" v-if="item.status === 1">
						付款成功
					</view>
					<view class="order-succ" v-else>
						已完成
					</view>
				</view>
				<!-- 2 -->
				<view>
					<block v-for="(itemdata,index) in item.Paymentinfor" :key="index">
						<view class="order-dishes">
							<text>{{itemdata.name}}</text>
							<text>x{{itemdata.amount}}</text>
						</view>
					</block>
				</view>

				<view class="order-Total">
					<view class="order-left">
						<text v-if="item.status === 0" @click="evaluate(item.merchantid,item.body)">去评价</text>
					</view>
					<view class="order-right">
						<text>共{{item.Paymentinfor.length}}件商品</text>
						<text>合计：{{item.total_fee}}元</text>
					</view>
				</view>
			</view>
		</block>

		<!-- 提示 -->
		<tips ref="tips"></tips>

	</view>
</template>

<script>
	import {publicing} from '../../api/api.js'
	import {wxpayingurl} from '../../api/request.js'
	import tips from '../../components/NoFindTips.vue'
	const {log} = console;
	export default {
		data() {
			return {
				neworder:[],
				// 用户id
				// openid: ''
			}
		},
		components:{
			tips
		},
		methods: {
			// 跳转
			toshop(ids){
				wx.navigateTo({
					url:'../shop/Shop?id='+ids
				})
			},
			// 去评价
			evaluate(merchantid,merchantname) {
				wx.navigateTo({
					url:'../evaluate/evaluate?merchantid='+merchantid+'&merchantname='+merchantname
				})
			},
			// 未登录提示
			tipsing(bull,tips){
				this.$nextTick(()=>{
					this.$refs.tips.init(bull,tips);
				})
			},
			// 请求订单数据接口
			requestOrders(openid){
				let data = {
					type: 'myorder',
					openid
				}
				publicing(wxpayingurl,data)
				.then(res=>{
					log(res)
					if(res.data.data.length === 0){
						let bull = true
						let tips = '您还没有订单'
						this.tipsing(bull,tips)
					}else{
						let bull = false
						let tips = ''
						this.tipsing(bull,tips)
						// 筛选需要的数据
						let neworder = res.data.data.map((item)=>{
							let merchantid = item._merchantid
							let openid = item._openid
							let status = item.status
							let body = item.wxorder.body
							let logo = item.wxorder.logo
							let total_fee = item.wxorder.total_fee
							let Paymentinfor = item.wxorder.Paymentinfor.arrinfo
							return{
								merchantid,
								openid,
								status,
								body,
								logo,
								total_fee,
								Paymentinfor
							}
						})
						log(neworder)
						this.neworder = neworder
					}
				})
				.catch(err=>{
					log(err);
				})
			}
		},
		// 查看是否登录
		onShow() {
			const user = uni.getStorageSync('userInfo');
			if(user){
				const bull = false;
				const tips = ''
				const openid = user.openid;
				this.requestOrders(openid);
				this.tipsing(bull,tips);
				
			}else {
				const bull = true;
				const tips = '您还没有登录哦~'
				this.tipsing(bull,tips);
			}
		}
	}
</script>

<style>
	page {
		background: #f2f3f4;
	}

	.order-back {
		background: #FFFFFF;
		margin: 20upx;
		padding: 20upx 10upx;
		border-radius: 15upx;
	}

	.order-img {
		width: 100upx;
		height: 100upx;
		padding-right: 20upx;
	}

	.order-view image {
		width: 100upx;
		height: 100upx;
		border-radius: 10upx;
	}

	.order-view {
		height: 106upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		overflow: hidden;
	}

	.goods-commodity {
		flex-grow: 1;
		font-size: 30upx;
		font-weight: bold;
	}
	.goods-commodity image {
		width: 15upx;
		height: 17upx;
		padding-left: 20rpx;
	}
	.order-succ {
		font-size: 28upx;
		color: #666666;
	}

	.order-dishes {
		font-size: 28upx;
		color: #666666;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 80upx;
	}

	.order-Total text {
		display: block;
	}

	.order-right text:nth-child(1) {
		padding-right: 10upx;
	}

	.order-Total {
		font-size: 28upx;
		color: #666666;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 80upx;
	}

	.order-right {
		display: flex;
		align-items: center;
	}

	.order-left text {
		color: #333;
		background: #ffb000;
		border-radius: 10upx;
		padding: 5upx 10upx;
	}
</style>
