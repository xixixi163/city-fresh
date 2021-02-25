<template>
	<view class="screen">
		<!-- 筛选区显示在最上面 -->
		<view class="delica">
			<!-- 筛选区 -->
			<view class="delica-view">
				<view class="delica-list delica-grow" @click="multiple">
					<text>{{synthesize}}</text>
					<image src="../../../static/coen/paixu.png" mode="widthFix"></image>
				</view>
				<view class="delica-grow" @click="sales">销量高</view>
				<view class="delica-list delica-right" @click="screen">
					<text>筛选</text>
					<image src="../../../static/coen/shaixuan.png" mode="widthFix"></image>
				</view>
			</view>
			<!-- 综合排序筛选 -->
			<view class="sortlist sortliteltle" v-if="drop">
				<block v-for="(item,index) in sortlist" :key="index">
					<text @click="sortClick(item.name,index,item.screen,item.nums)" :class="{activeb: index == num}">{{item.name}}</text>
				</block>
			</view>
			<!-- 多个筛选区 -->
			<view class="sortlist sortlist-view" v-if="sortmen">
				<!-- 多选：商家特色 -->
				<block v-for="(item,index) in screendata" :key="index">
					<view>
						<view class="sortlist-title">{{item.title}}</view>
						<view class="sortlist-flex">
							<block v-for="(itemdata,indexs) in item.datas" :key="indexs">
								<text class="choice" :class="{scractive: itemdata.id === 2}" @click="mulChoose(indexs,itemdata.sign)">{{itemdata.name}}</text>
							</block>
						</view>
					</view>
				</block>
				<!-- 单选：人均价 -->
				<block v-for="(item,index) in person" :key="index">
					<view>
						<view class="sortlist-title">{{item.title}}</view>
						<view class="sortlist-flex">
							<block v-for="(itemdata,indexs) in item.datas" :key="indexs">
								<text class="choice" :class="{scractive: indexs == scrnum}" @click="simpleChoose(indexs,itemdata.per)">{{itemdata.name}}</text>
							</block>
						</view>
					</view>
				</block>
				<!-- 置顶 -->
				<view class="sortlist-bottom">
					<text @click="emptyScreen">清空</text>
					<text @click="flag&&competeScreen()">完成</text>
				</view>
			</view>
		</view>
		<!-- 透明背景 遮罩层-->
		<view class="yin" v-if="isYin" @click="backClick">

		</view>
	</view>
</template>

<script>
	// 引入POST请求
	import {
		publicing
	} from "../../../api/api.js"
	// 引入请求地址
	import {
		startingurl,multipleurl,heightsaleurl
	} from "../../../api/request.js"
	const {log} = console
	export default {
		data() {
			return {
				// 传入的请求数据是否为空
				flag:false,
				// 接收筛选的对象
				mulObj:{},
				// 人均价选中
				scrnum:-1,
				// 透明背景
				isYin: false,
				synthesize: '综合排序',
				// 商家特色 选中样式num
				num: 0,
				sortmen: false,
				drop: false,
				// 多选
				screendata: [{
					"title": "商家特色(可多选)",
					"datas": [{
							"id": 1,
							"sign": 'duration',
							"name": '配送最快'
						},
						{
							"id": 1,
							"sign": 'deliver',
							"name": '0元起送'
						},
						{
							"id": 1,
							"sign": 'physi',
							"name": '免配送费'
						}
					],
				}],
				// 人均价筛选
				person: [{
					"title": "人均价",
					// 按理应该从后端拿到
					"datas": [{
							"name": "20元以下",
							"per": {
								"$lt": 20
							},
						},
						{
							"name": "20-40元",
							"per": {
								"$lte": 40,
								"$gte": 20
							},
						},
						{
							"name": "40元以上",
							"per": {
								"$gt": 40
							},
						},
					]
				}],
				// 筛选分类
				sortlist: [{
						"name": "综合排序",
						"screen": "_id",
						"nums": 1
					},
					{
						"name": "起送价最低",
						"screen": "delivering",
						"nums": 1
					},
					{
						"name": "配送费最低",
						"screen": "physical",
						"nums": 1
					},
					{
						"name": "人均高到低",
						"screen": "capita",
						"nums": -1
					},
					{
						"name": "人均低到高",
						"screen": "capita",
						"nums": 1
					}
				],
			}
		},
		methods: {
			// 综合排序
			multiple() {
				this.drop = true;
				this.sortmen = false;
				this.backOpacity();
			},
			// 综合排序替换
			sortClick(name, index, screen, nums) {
				this.synthesize = name;
				this.num = index;
				// console.log(screen,nums);
				this.backClick();
				this.starTing(screen, nums);
			},
			// 综合排序请求
			starTing(screen, nums) {
				let Data = {
					screen,
					nums
				}
				// Promise
				publicing(startingurl, Data)
					.then((res) => {
						// console.log(res);
						// 存储到Vuex数据仓库
						this.$store.commit('storeScreen', res.data.data);
					})
					.catch((err) => {
						console.log(err);
					})
			},
			// 销量高，速度快，津贴
			sales() {
				this.backClick()
				publicing(heightsaleurl, {})
					.then((res) => {
						log(res)
						// 存储到Vuex数据仓库
						this.$store.commit('storeScreen', res.data.data);
					})
					.catch((err) => {
						console.log(err);
					})
			},
			// 筛选
			screen() {
				this.drop = false;
				this.sortmen = true
				this.backOpacity()
			},

			// 透明背景
			backOpacity() {
				setTimeout(() => {
					this.isYin = true;
				}, 300)
			},
			// 商家特色 多选 
			// sign 键值
			mulChoose(indexs,sign) {
				let id = this.screendata[0].datas[indexs].id;
				if(id== 1){
					// 选中
					this.screendata[0].datas[indexs].id = 2;
					// 选中的放入筛选对象 以请求数据
					// this.$set(mulObj,sign,sign) => 对象，键，值
					this.$set(this.mulObj,sign,sign);
					
				}else {
					this.screendata[0].datas[indexs].id = 1;
					// this.$delete(this.mulObj,sign) => 对象，键
					this.$delete(this.mulObj,sign)
				}
				console.log(this.mulObj);
			},
			// 人均价 单选
			simpleChoose (indexs,per) {
				if (this.scrnum == indexs){
					// 未选中
					this.scrnum = -1
					this.$delete(this.mulObj,'capita')
				}else {
					this.scrnum = indexs
					this.$set(this.mulObj,'capita',per)
				}
			},
			// 清空
			emptyScreen(){
				// 商家特色
				this.screendata.forEach((item)=>{
					item.datas.map((items)=>{
						items.id = 1;
						return items
					})
				})
				
				// 人均价
				this.scrnum = -1;
				
				// 筛选条件参数清空
				this.mulObj = {}
				
				// 隐藏
				this.backClick()
				
			},
			// 完成
			competeScreen(){
				// 隐藏
				this.backClick()
				
				publicing(multipleurl,this.mulObj)
				.then(res=>{
					console.log(res);
					// 存储到Vuex数据仓库
					this.$store.commit('storeScreen', res.data.data);
				})
				.catch(err=>{
					console.log(err);
				})
			},
			
			// 隐藏透明背景和筛选
			backClick() {
				this.isYin = false;
				this.drop = false;
				this.sortmen = false;
			}

		},
		computed:{
			// 如果用户没有点击任何筛选条件，完成按钮禁用
			// 使用短路与,后面的方法加()
			isEmpty() {
				let obj= JSON.stringify(this.mulObj) == '{}'
				console.log(obj);
				if(obj){
					this.flag = false
				}else {
					this.flag = true
				}
				console.log(this.flag);
			}
		}
	}
</script>

<style>
	/* 筛选区 */
	.delica {
		position: absolute;
		left: 0;
		right: 0;
		width: 100%;
		z-index: 99;
	}

	.delica-view {
		display: flex;
		align-items: center;
		height: 70rpx;
		padding: 0 15rpx;
		background: #FFFFFF;
		font-size: 30rpx;
		color: #666666;
	}

	.delica-view image {
		/* display: inline-block; */
		width: 30rpx;
		height: 30rpx;
	}


	.delica-list {
		display: flex;
		align-items: center;
	}

	.delica-right {
		justify-content: flex-end;
		/* 元素的宽度为其他元素的5倍 */
		flex-grow: 5;
	}

	.delica-grow {
		flex-grow: 1;
	}

	/* 排序 */
	.sortlist {
		background: #ffffff;
	}

	.sortliteltle text {
		display: block;
		height: 70rpx;
		line-height: 70rpx;
		padding: 0 15rpx;
		font-size: 30rpx;
		border-top: 1rpx solid #ededed;
	}

	.activeb {
		color: #f89903 !important;
	}

	/* 选择 */
	/*相对定位*/
	.sortlist-view {
		position: relative;
		height: 700rpx;
		overflow: hidden;
		overflow-y: scroll;
	}

	.sortlist-title {
		height: 60rpx;
		line-height: 60rpx;
		padding: 0 15rpx;
		font-size: 30rpx;
	}

	.sortlist-flex {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		margin-bottom: 30rpx;
	}

	.choice {
		display: block;
		height: 55rpx;
		width: calc((100% / 3) - 15px) !important;
		line-height: 55rpx;
		margin: 7.5px;
		text-align: center;
		background: #f8f8f8;
		font-size: 28rpx;
		color: #666666;
		border-radius: 5rpx;
	}

	.sortlist-bottom {
		display: flex;
		justify-content: space-around;
		align-items: center;
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background: #ffffff;
		height: 80rpx;
		border-top: 1rpx solid #e4e4e4;
	}

	.sortlist-bottom text {
		flex-grow: 1;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
	}

	.sortlist-bottom text:nth-child(1) {
		border-right: 1rpx solid #e4e4e4;
	}

	.sortlist-bottom text:nth-child(2) {
		background: #ffd348;
	}

	/* 透明背景 */
	.yin {
		background: rgba(0, 0, 0, 0.5);
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}

	/* 商家特色加样式 */
	.scractive {
		background: #fef6df !important;
		color: #f29909 !important;
	}
</style>
