<template>
	<view >
		<view class="modal" v-if="isModal">
			<view class="wrap-mes">
				<view class="mes-text">
					请登录后再操作哦~
				</view>
				<view class="mes-btn">
					<button @click="mesConcel">取消</button>
					<button open-type="getUserInfo" @getuserinfo="getUserInfo">登录</button>
				</view>
			</view>
		</view>
		<!-- 使用消息提示组件 -->
		<HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages" @clickMessage="clickMessage"></HMmessages>
	</view>
	
</template>

<script>
	const login = require('../login/login.js');
	import HMmessages from "@/components/HM-messages/HM-messages.vue"
	import {publicing} from '../api/api.js';
	import {wxloginurl} from '../api/request.js';
	const {log} = console
	export default {
		data() {
			return {
				isModal:false
			}
		},
		components:{
			HMmessages
		},
		methods:{
			init(){
				this.isModal = true;
			},
			mesConcel(){
				this.isModal = false;
			},
			getUserInfo(event){
				let userInfo = event.detail.userInfo;
				log(userInfo);
				const userlogin = new login(userInfo);
				userlogin.lising()
				.then(res=>{
					log(res);
					if(res === 'SUCCESS') {
						// 登录成功遮罩层隐藏
						this.isModal = false;
						const suc = '登录成功';
						const ico = 'success';
						this.tips(suc,ico);
					}else {
						log('no')
						const fail = '登录失败';
						const ico = 'error';
						this.tips(fail,ico);
					}
				})
				.catch(err=>{
					log(err);
				})
			},
			// 提示
			tips(mes,ico) {
				this.HMmessages.show(mes,{icon:ico,fontColor:'#fff',iconColor:'#fff',background:"rgba(0,0,0,0.5)"})
			}
		}
	}
</script>

<style scoped>
	.modal {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		
		background: rgba(0,0,0,.6);
		
		z-index: 9999;
	}
	.wrap-mes {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		background: #fff;
		width: 500upx;
		height: 200upx;
		border-radius: 8upx;
	}
	.wrap-mes .mes-text {
		margin-top: 30upx;
		font-size: 34upx;
		color: #666;
		text-align: center;
	}
	.wrap-mes .mes-btn {
		display: flex;
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		
		border-top: 1upx solid #EEE;
		height: 80upx;
		line-height: 80upx;
		
		/* -webkit-transform: translateZ(0); */
	}
	.mes-btn button {
		flex: 1;
		border-left: 1upx solid #EEE;
		border-radius: 0upx;
		font-size: 30upx;
		background: #fff;
		text-align: center;
	}
	.mes-btn button::after {
		border: none;
	}
</style>
