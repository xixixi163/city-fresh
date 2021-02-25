<template>
	<view class="">
		<!-- 商家介绍 -->
		<shop-head :busiIntroData="busiIntroData"></shop-head>
		<!-- tab切换 -->
		<tabs></tabs>
		<!-- tabs以下内容固定，滑动的时候不影响上部 -->
		<view class="detail-fixed">
			<!-- 商品下单 -->
			<goods :class="[hideing===0?'activeclass':'errorclass']" :goodsData="goodsData" :busi-intro-data="busiIntroData"></goods>
			<!-- 评论 -->
			<comment :class="[hideing===1?'activeclass':'errorclass']" :comData="comData" :tabsEva="tabsEva" :isEmpty="isEmpty" ></comment>
			<!-- 商家详情 -->
			<introduce :class="[hideing===2?'activeclass':'errorclass']" :busiIntroData="busiIntroData" ></introduce>
		</view>
		<home-load v-if="isInition"></home-load>
	</view>
</template>

<script>
	import ShopHead from './components/ShopHead.vue'
	import Tabs from './components/Tabs.vue'
	import Goods from './components/Goods.vue'
	import Comment from './components/Comment.vue'
	import Introduce from './components/Introduce.vue'
	// post
	import {publicing} from '../../api/api.js'
	import {discussurl,shopurl,getdishesurl} from '../../api/request.js'
	var {log} = console;
	export default {
		components:{
			ShopHead,
			Tabs,
			Goods,
			Comment,
			Introduce
		},
		data(){
			return {
				// 是否需要加载
				isInition:true,
				hideing:0,
				// 商家介绍
				busiIntroData:{},
				// 商品数据
				goodsData:[],
				// 评论
				comData:[],
				// 分类评论标签
				tabsEva:[],
				// 评论为空
				isEmpty:false,
				// 商家唯一标识
				ids: ''
			}
		},
		methods:{
			// 被子组件评论分类调用
			commentMes(item){
				if(item == '全部'){
					let data = {
						merchantid:this.ids
					}
					this.classifMess(data);
				}else {
					let data = {
						merchantid:this.ids,
						classmessage:item
					}
					this.classifMess(data);
				}
			},
			// 请求评论分类的数据
			classifMess(data) {
				publicing(discussurl,data)
				.then(res=>{
					log(res);
					this.comData = res.data.data;
				})
				.catch(err=>{
					log(err);
				})
			},
			// 被子组件tabs调用的方法
			fatherMethod(index){
				log(index)
				this.hideing = index
			},
			// 请求接口
			takeRes(ids) {
				let data = {
					openid:ids
				}
				let disdata = {
					merchantid:ids
				}
				Promise.all([publicing(shopurl,data),publicing(getdishesurl,data),publicing(discussurl,disdata)])
				.then((res)=>{
					log(res)
					// 商家介绍
					this.busiIntroData = res[0].data.data[0];
					console.log(this.busiIntroData);
					// 商品数据 库存为0 不展示
					this.goodsData = res[1].data.data.filter(item=>item.state===1);
					// 评论
					this.comData = res[2].data.data;
					
					if(res[2].data.data.length === 0){
						this.isEmpty = true;
					}else{
						// 评论标签去重复去空
						// 取出标签分类map 标签去重Set 去空filter
						let comLable = [...new Set(res[2].data.data.map(item=>item.classmessage))].filter(item=>item)
						
						// 评论标签 ‘全部’和所有标签合并 传给子
						this.tabsEva = ['全部',...comLable];
						
						this.isEmpty = false;
					}
						
					this.isInition = false;
					
				})
				.catch((err)=>{
					log(err)
				})
			}
		},
		onLoad(e){
			this.ids = e.id;
			// log(this.ids)
			this.takeRes(this.ids);
		},
		onShow() {
			log(this.ids)
			this.takeRes(this.ids);
		}
	}
</script>

<style scoped>
	.activeclass {
		display: block;
		height: 100%;
		overflow-y: auto;
	}
	.errorclass {
		display: none;
	}
	.scoller {
		height: 100%;
		overflow-y: auto;
	}
	.detail-fixed {
		position: fixed;
		top: 230upx;
		left: 0;
		right: 0;
		bottom: 0;	
	}
</style>
