<template>
	<!-- 评价页面 -->
	<view>
		<view class="comment-text">
			<textarea :placeholder="place" v-model="comment" focus="true" />
			</view>
		<!-- 发表按钮 -->
		<view class="published" @click="isbtn && pubBtn()">
			发表
		</view>
		<!-- 使用消息提示组件 -->
		<HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages" @clickMessage="clickMessage"></HMmessages>
	</view>
</template>

<script>
	import {publicing} from "../../api/api.js"
	import {commenturl} from "../../api/request.js"
	import HMmessages from "@/components/HM-messages/HM-messages.vue";
	const {log} = console;
	export default {
		data() {
			return {
				// 是否可以评论，提交后按钮不可用，完成后按钮可用
				isbtn: true,
				comment:'',
				place:'',
				merchantid:'',
				userInfos:''
			}
		},
		components:{
			HMmessages
		},
		methods: {
			pubBtn(){
				log(this.comment);
				if(this.comment === ''){
					let succ = '请填写评论哦';
					let ico = 'error';
					this.tips(succ,ico);
					return false;
				}
				// 提交后 如果还没有完成 禁止再次点击提交
				this.isbtn = false;
				log('可以评论');
				this.evaluate();
			},
			// 评论
			evaluate(){
				const data = {
					messages:this.comment,
					avatarUrl:this.userInfos.avatarUrl,
					nickName:this.userInfos.nickName,
					openid:this.userInfos.openid,
					merchantid:this.merchantid
				}
				publicing(commenturl,data)
				.then(res=>{
					log(res);
					this.comment = '';
					let succ = '评论成功';
					let ico = 'success';
					this.tips(succ,ico);
					// 成功后 发表按钮触发的点击事件可用
					this.isbtn = true;
				})
				.catch(err=>{
					log(err)
				})
			},
			// 提示
			tips(mes,ico) {
				this.HMmessages.show(mes,{icon:ico,fontColor:'#fff',iconColor:'#fff',background:"rgba(0,0,0,0.5)"})
			}
		},
		onLoad(e) {
			this.place = '请写下你对商家'+e.merchantname+'的评价';
			this.merchantid = e.merchantid;
			this.userInfos = uni.getStorageSync('userInfo');
		}
	}
</script>

<style>
page{background: #F1F1F1;}
	.comment-text textarea{width: 100%; color: #808080 !important; font-size: 30upx;
							padding: 8upx;}
	.comment-text{background: #FFFFFF;}
	.published{font-size: 35upx; background: #ffdd00;
				width: 300upx;
				text-align: center;
				margin: 20upx auto;
				padding: 10upx 0;
				border-radius: 10upx;}
</style>
