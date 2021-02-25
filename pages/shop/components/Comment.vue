<template>
	<view class="comment-view">
		
		<view v-if="!isEmpty">
			<!-- 分类部分 -->
			<view class="tabs-block">
				<block v-for="(item,index) in tabsEva" :key="index">
					<view :class="{activetabs:index===num}" @click="tabsBtn(item,index)">
						{{item}}
					</view>
				</block>
			</view>
			<!-- 评价 -->
			<block v-for="(item,index) in leaveWord" :key="index">
				<view class="comment-detail">
					<view class="user-info">
						<view class="user-name">
							<image :src="item.messagedata.avatarUrl" mode="widthFix"></image>
							<text>{{item.messagedata.nickName}}</text>
						</view>
						<!-- 时间 -->
						<view class="comment-time">
							{{item.messagedata.time}}
						</view>
					</view>
					<view class="comment-text">
						<text selectable>{{item.messagedata.usermess}}</text>
					</view>
					<view class="merch-replay" v-if="item.replaydata.mershmess" >
						<view >商家回复({{item.replaydata.time}})</view>
						{{item.replaydata.mershmess}}
					</view>
				</view>
			</block>
		</view>
		
		<!-- 评价为空时 -->
		<view class="empty" v-if="isEmpty">
			该商家还没有商品评论哦！
		</view>
	</view>
</template>

<script>
	
	export default {
		name:'Comment',
		props:{
			comData:Array,
			tabsEva:Array,
			isEmpty:Boolean
		},
		watch:{
			comData(newData,oldData){
				// map 取出评论
				let leaveWord = newData.map(item=>{return{messagedata:item.messagedata,replaydata:item.replaydata}})
				this.leaveWord = leaveWord
				
				// 放到父组件处理
				// if(this.num === 0) {
				// 	// 评论标签去重复去空
				// 	// 取出标签分类map 标签去重Set 去空filter
				// 	let comLable = [...new Set(newData.map(item=>item.classmessage))].filter(item=>item)
					
				// 	// 评论标签 ‘全部’和所有标签合并
				// 	this.tabsEva = ['全部',...comLable];
				// }
				
			}
		},
		data() {
			return {
				num:0,
				// isEmpty: false,
				// 评价列表
				leaveWord:[]
			}
		},
		methods:{
			// 评价分类样式
			tabsBtn(item,index) {
				this.num=index;
				// 子访问父
				this.$parent.commentMes(item);
			}
			
		}
	}
</script>

<style scoped>
	.comment-view {
		margin: 0 20upx 100upx 20upx;
	}
	.tabs-block {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		flex-wrap: wrap;
	}
	.tabs-block view {
		margin: 10upx 15upx 5upx 0;
		padding: 15upx;
		border: 1px solid #c2c5cc;
		border-radius: 6upx;
		font-size: 25upx;
		font-weight: 700;
		text-align: center;
		color: #292c33;
		background: #fff;
	}
	.comment-detail {
		margin-top: 30upx;
		border-bottom: 1upx solid #f8f8f8;
		padding-bottom: 25upx;
	}
	.comment-detail .user-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 50upx;
		margin-bottom: 15upx;
	}
	.user-info .user-name {
		display: flex;
		align-items: center;
		height: 50upx;
	}
	.user-name image {
		width: 50upx;
		height: 50upx;
		border-radius: 50%;
		margin-right: 9upx;
	}
	.user-name text {
		font-size: 30upx;
		color: #a8a8a8;
	}
	.user-info .comment-time {
		font-size: 25upx;
		color: #a8a8a8;
	}
	.comment-text text{
		font-size: 27upx;
		color: #333;
		line-height: 1.5;
		
		/* display: -webkit-box;
		-webkit-box-orient:vertical;
		-webkit-line-clamp:2;
		overflow: hidden;
		text-hidden: ellipsis; /* ...表示显 */ 
		
	}
	.merch-replay {
		margin-top: 10upx;
		font-size: 27upx;
		color: #606060;
		line-height: 1.5;
		background-color: #f7f7f3;
		padding:10upx;
		border-radius:5upx;
	}
	.merch-replay view {
		color:#333;
		font-size:27upx;
	}
	
	.empty {
		font-size: 30upx;
		color: #ccc;
		text-align: center;
		padding-top: 40upx;
	}
	.activetabs {
		background: #77cd69 !important;
		border: 1px solid #fff !important;
		/* color: #4CD964 !important; */
	}
</style>
