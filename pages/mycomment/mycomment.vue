<template>
	<view>
		<view class="mes-list">
			<view class="mes-num">
				已贡献 {{mesLength}} 条评价
			</view>
			<block v-for="(item,index) in mesDatas" :key="index">
				<view class="banner">
					<view class="shop-img">
						<image :src="item.merch[0].logo" mode="widthFix"></image>
					</view>
					<view class="user-mes">
						<view class="shop-name" @click="toshop(item.merch[0].openid)">
							<text>{{item.merch[0].shop}}</text>
							<image src="../../static/you/right_arrow.png"></image>
							<text class="utime">{{item.messagedata.time}}</text>
						</view>
						<view class="mesdata">
							{{item.messagedata.usermess}}
						</view>
						<view class="shop-mes" v-if="item.replaydata.mershmess">
							<view>
								商家回复({{item.replaydata.time}})
							</view>
							{{item.replaydata.mershmess}}
						</view>
						<view class="del-mes">
							<view class="img" @click="deleteMes(item._id)">
								<image src="../../static/you/delete.png"></image>
								删除
							</view>
						</view>
					</view>

				</view>
			</block>
		</view>
		<!-- 反馈组件 -->
		<tips ref="notips"></tips>
		<!-- 使用消息提示组件 -->
		<HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages" @clickMessage="clickMessage"></HMmessages>
	</view>
</template>

<script>
	import {publicing} from '../../api/api.js'
	import {getusermesurl,delusermesurl} from '../../api/request.js'
	import tips from '../../components/NoFindTips.vue'
	import HMmessages from "@/components/HM-messages/HM-messages.vue"
	const {log}=console
	export default {
		components:{
			tips,
			HMmessages
		},
		data() {
			return {
				mesDatas: [],
				openid:'',
				mesLength:0
			}
		},
		methods: {
			// 跳转
			toshop(ids){
				wx.navigateTo({
					url:'../shop/Shop?id='+ids
				})
			},
			deleteMes(ids) {
				let that = this
				wx.showModal({
					title: '确定删除吗',
					content: '确认删除该评价吗？',
					success(res) {
						if (res.confirm) {
							console.log('用户点确定了')
							that.delUsermes(ids)
						} else if (res.cancel) {
							// console.log('用户点击取消')
						}
					}
				})
			},
			delUsermes(ids){
				let data = {
					ids
				}
				publicing(delusermesurl, data)
				.then(res=>{
					if (res.data.msg == 'SUCCESS') {
						let succ = '删除成功'
						let ico = 'success'
						this.getUserMes()
						this.tips(succ,ico)
					} else {
						let succ = '删除失败'
						let ico = 'error'
						this.tips(succ,ico)
					}
				})
				.catch(err => {
					log(err);
				})
			},
			getUserMes() {
				let data = {
					openid:this.openid
				}
				publicing(getusermesurl, data)
					.then(res => {
						
						if (res.data.msg == '暂无评价内容') {
							this.sentTips(true,res.data.msg)
						} else {
							let datas = res.data.data
							this.mesLength = datas.length
							this.mesDatas = datas
						}
						// log(res);
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
			},
			// 提示
			tips(mes,ico) {
				this.HMmessages.show(mes,{icon:ico,fontColor:'#fff',iconColor:'#fff',background:"rgba(0,0,0,0.5)"})
			}
		},
		onLoad(e) {
			this.openid = uni.getStorageSync('userInfo').openid;
			console.log(this.openid)
			// this.takeRes(this.ids);
			this.getUserMes() 
		},
	}
</script>

<style>
	page {
		background-color: #f5f5f5;
	}

	.mes-list {
		margin: 15upx;
	}

	.mes-num {
		margin-bottom: 25upx;
	}

	.banner {
		background-color: #fff;
		display: flex;
		padding: 20upx;
		margin-bottom: 20upx;
		box-sizing: border-box;
		border-radius: 10rpx;
	}

	.shop-img {
		max-width: 50upx;
	}
	.shop-img image{
		width: 50upx;
	}
	.user-mes {
		position: relative;
	}

	.user-mes .shop-name {
		position: relative;
		font-size: 30upx;
		color: #333;
		font-weight: 700;
		margin-bottom: 20upx;
	}

	.shop-name image {
		width: 15upx;
		height: 17upx;
		padding-left: 20rpx;
	}

	.shop-name .utime {
		position: absolute;
		right: 0;
		font-size: 20upx;
		color: #a8a8a8;
	}

	.user-mes .mesdata {
		font-size: 26upx;
		color: #333;
		line-height: 1.5;
	}

	.user-mes .shop-mes {
		margin-top: 10upx;
		font-size: 24upx;
		color: #606060;
		line-height: 1.5;
		background-color: #f7f7f3;
		padding: 10upx;
		border-radius: 5upx;
	}

	.user-mes .del-mes {
		margin-top: 20upx;

		font-size: 28upx;
		color: #555555;
		height: 30rpx;
		width: 630rpx;
	}

	.del-mes .img {
		position: absolute;
		right: 0;
		bottom: 0;
	}

	.img:hover {
		color: #333333 !important;
	}

	.img:active {
		color: #7F7F7F !important;
	}

	.del-mes image {
		width: 30upx;
		height: 30upx;
		padding-right: 10upx;
	}

	.shop-mes view {
		color: #a8a8a8;
		font-size: 27upx;
	}
</style>
