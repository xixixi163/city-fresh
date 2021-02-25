<template>
	<view>
		<view class="my-home">
			<!-- 已登录 -->
			<view class="wx-userinfo" v-if="wxlogin">
				<view class="img" >
					<image :src="userInfos.avatarUrl" mode="widthFix" ></image>
				</view>
				<view class="wx-username">
					<text>{{userInfos.nickName}}</text>
				</view>
			</view>
			<!-- 未登陆 -->
			<view class="wx-button" v-if="!wxlogin">
				<view class="lg-title">
					登录云上生鲜，极速享受新鲜的味道
				</view>
				<view class="">
					<button open-type="getUserInfo" @getuserinfo="getUserInfo">去登录</button>
				</view>
			</view>
		</view>
		<view class="my-instruce">
			<view class="my-img" @click="goindex">
				<image src="../../static/you/profile.jpg" mode="widthFix"></image>
			</view>
			<view class="my-mes">
				我的评价
				<image src="../../static/you/moreData.png" mode="widthFix" @click="toComment"></image>
			</view>
			<view class="my-mes">
				我的收藏
				<image src="../../static/you/moreData.png" mode="widthFix" @click="toCollection"></image>
			</view>
		</view>
		<view class="footer">
			{{`—————— 云上生鲜 ——————`}}
		</view>
		<!-- 使用消息提示组件 -->
		<HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages" @clickMessage="clickMessage"></HMmessages>
	</view>
</template>

<script>
	import HMmessages from "@/components/HM-messages/HM-messages.vue"
	const login = require('../../login/login.js')
	import {publicing} from '../../api/api.js';
	import {wxloginurl} from '../../api/request.js';
	const {log} = console
	export default {
		components:{
			HMmessages	
		},
		data() {
			return {
				// 是否登录
				wxlogin: false,
				// 用户信息
				userInfos: {}
			}
		},
		
		methods: {
			// 用户点击该按钮时，会返回获取到的用户信息，从返回参数的detail中获取到的值同uni.getUserInfo
			// 生效时机 open-type="getUserInfo"	
			getUserInfo(event){
				let userInfo = event.detail.userInfo;
				// log(userInfo);
				// 登录类
				const logins = new login(userInfo);
				logins.lising()
				.then(res=>{
					log(res);
					this.getStoreInfos();
				})
				.catch(err=>{
					log(err);
				})
			},
				
			// 取出用户信息
			getStoreInfos(){
				const infos = uni.getStorageSync('userInfo');
				if(infos){
					this.userInfos = infos;
					this.wxlogin = true;
				}else {
					this.wxlogin = false;
				}
			},
		
			toComment(){
				const infos = uni.getStorageSync('userInfo');
				if(!infos) {
					this.tips('请登录','info');					
				}else {
					log('已登录');
					wx.navigateTo({
						url:"../mycomment/mycomment?ide="+infos
					})
					
				}
			},
			toCollection(){
				const infos = uni.getStorageSync('userInfo');
				if(!infos) {
					this.tips('请登录','info');
				}else {
					log('已登录');
					wx.navigateTo({
						url:"../mycollected/mycollected?ide="+infos
					})
					
				}
			},
			// 首页
			goindex(){
				// wx.navigateTo({
				// 	url:"../index/index"
				// })
			},
			// 提示
			tips(mes,ico) {
				this.HMmessages.show(mes,{icon:ico,fontColor:'#fff',iconColor:'#fff',background:"rgba(0,0,0,0.5)"})
			}
		},
		onShow() {
			this.getStoreInfos();
		}
	}
</script>

<style >
page{
	background-color: #f5f5f5;
}
.my-home {
	display: flex;
	align-items: center;
	height: 350upx;
	background: linear-gradient(to top,#bdcda2 10%,#7ccd7d 100%);
	border-bottom-left-radius: 25rpx;
	border-top-right-radius: 25rpx;
}
.wx-userinfo {
	display: flex;
	align-items: center;
	height: 200upx;
	padding: 0 30upx;
}
.wx-username text{
	color: #606060;
	font-size: 35upx;
}
.img image {
	width: 120upx;
	height: 120upx;
	border-radius: 50%;
	margin-right: 20upx;
	border: 10upx solid #999;
}
.wx-button {
	margin: 0 auto;
}
.wx-button .lg-title {
	color: #fff;
	font-size: 35upx;
	margin-bottom: 25upx;
}
.wx-button button {
	background:  linear-gradient(to right,#28a6f1 10%,#0e8dd7 80%);
	border: none;
	border-radius: 50upx;
	font-size: 30upx;
	color: #fff;
}
/* 图片 */
.my-instruce {
	margin: 25upx;
	display: flex;
	flex-direction: column;
	/* background-color: #007AFF; */
}
.my-instruce .my-img {
	width: 100%;
	height: 100%;
	height: 300upx;
	border-radius:15upx;
	margin-bottom: 30upx;
}
.my-img image {
	width: 100%;
	height: 100%;
	border-radius: 20rpx;
}
.my-instruce .my-mes {
	position: relative;
	height: 100upx;
	line-height: 60upx;
	margin-top: 20upx;
	background-color: #fff;
	border-radius: 20upx;
	font-size: 16px;
	color: #606060;
	font-weight: 600;
	padding: 20rpx;
	box-sizing: border-box;
}
.my-mes image {
	position: absolute;
	height: 50upx;
	width: 50upx;
	right: 30rpx;
}
.footer {
	height: 150rpx;
	line-height: 150rpx;
	text-align: center;
	color: #A8A8A8;
	font-size: 25rpx;
}
</style>
