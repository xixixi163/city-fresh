<template>
	<view>
		<view class="goods-show">
			<!-- 左边tab -->
				<view class="goods-tabs">
					<block v-for="(item, index) in tabList" :key="index">
						<text class="tab-text" :class="{active:index === num}" @click="tabClick(item,index)">{{item}}</text>
					</block>
				</view>
				<!-- 右边商品 -->
				<view class="goods">
					<text class="sort-name">{{sortName}}</text>
					<view>
						<block v-for="(item,index) in nowGoods" :key="index">
							<!-- 上架状态显示 -->
							<view class="content">
								<view class="content-img">
									<image :src="item.objdis.image" mode="widthFix" @click='clickImg(item.objdis.image)'></image>
								</view>
								<view class="content-text">
									<text class="con-name">{{item.objdis.input}}</text>
									<view class="con-label">
										<block v-for="(item,index) in item.objdis.tags" :key="index">
											<text>{{item}}</text>
										</block>
									</view>
									<view class="con-sale">
										<text>{{`月售${item.sales}`}}</text>
										<text>{{`库存${item.stock}`}}</text>
									</view>
									<view class="con-price">
										<view class="now-price">
											{{item.objdis.Discount}}
										</view>
										<view class="pre-price">
											{{item.objdis.Price}}
										</view>
										<view class="goods-num">
											<image src="../../../static/coen/jianhao.png" mode="widthFix" @click="item.amount > 0 && reduce(item.amount,item._id,index,item.objdis.Discount,item.objdis.input,item.objdis.image)"></image>
											<text class="amount">{{item.amount}}</text>
											<!-- 数量小于库存时可选 -->
											<image src="../../../static/coen/jiahao.png" mode="" @click="(item.amount<item.stock) && plus(item.amount,item._id,index,item.objdis.Discount,item.objdis.input,item.objdis.image)"></image>
										</view>
									</view>
								</view>
							</view>
						</block>
					</view>
				</view>
				<!-- 总价计算 -->
				<view class="calc-price">
					<!-- 骑手图片 -->
					<view class="rider">
						<image v-show="!isActive" src="../../../static/coen/wei.png" mode="widthFix"></image>
						<image v-show="isActive" src="../../../static/coen/yi.png" mode="widthFix"></image>
					</view>
					<!-- 件数 -->
					<view class="number" v-show="isActive">
						{{arrPrice.length}}
					</view>
					<!-- 金额 -->
					<view class="amount-detail">
						<view class="detail-left">
							<view class="cost-amount">
								<text class="total-amount">{{reArrPrice | toFloat}}</text>
								<text class="delivery">{{`另需配送费${physical}元`}}</text>
							</view>
						</view>
						<view class="detail-right" :class="{'dis-active': isActive}" @click="flag && settlement()">
							<text v-show="!isActive">{{`${delivering}元起送`}}</text>
							<text v-show="isActive" >{{diffMon}}</text>
						</view>
					</view>
				</view>
		</view>
		<modal ref = 'modal'></modal>
	</view>
</template>
  
<script>
	import Modal from '../../../components/Modal.vue'
	const {log} = console;
	export default {
		name:'Goods',
		components:{
			Modal
		},
		props:{
			goodsData:Array,
			busiIntroData:Object
		},
		data() {
			return {
				
				// 右边分类名字
				sortName:'',
				// 商品类别
				tabList:[],	
				num:0,
				// 是否已选
				// isActive:false,
				// 总价
				totalAmount: '',
				// 配送费
				physical: Number,
				// 起送价
				delivering: Number,
				// 还差几元
				// diffMon: 0.8,
				// 当前分类goods
				nowGoods:[],
				// 分类商品详细
				// sortGoods:{}
				// 商品件数加减
				amount:0,
				// 选择商品的信息价格
				arrPrice:[],
				// 标记是否已结算
				// flag:false
				// 商家标识
				merchantId:'',
				// 商家图片
				merchantLogo:'',
				// 商家名称
				merchantName:''
			}
		},
		methods:{
			// 点击图片方法
			clickImg(imgUrl){
				  wx.previewImage({
				    urls: [imgUrl], //需要预览的图片http链接列表，注意是数组
				    current: '', // 当前显示图片的http链接，默认是第一个
				    success: function (res) { },
				    fail: function (res) { },
				    complete: function (res) { },
				  })
			},
			// 过滤数值
			changeFloat(num){
				return parseFloat(Number(num).toFixed(10));
			},
			tabClick(item,index) {
				// 更改样式
				this.num = index;
				// 切换显示的商品 方式一
				this.sortName = item;
				// this.nowGoods = this.sortGoods[item];
				// 方式二
				this.nowGoods = this.goodsData.filter(goods=>item===goods.optidata)
			},
			// 加件数
			plus(amounts,id,index,discount,name,image) {
				this.amount = Number(amounts)+Number(1);
				this.changeAmount(amounts,id,index,discount,name,image);
			},
			// 减件数
			reduce(amounts,id,index,discount,name,image) {
				this.amount = Number(amounts)-Number(1);
				this.changeAmount(amounts,id,index,discount,name,image);
			},
			// 加减公用 
			changeAmount(amounts,id,index,discount,name,image) {
				console.log(id);
				let findarr=this.nowGoods.filter(item=>{
					// 修改amount
					if(item._id===id){
						item.amount = this.amount<1?'0':this.amount
						return item.amount;
					}
				})
				// console.log(findarr);
				// 更改到nowGoods 顺序保持不变
				this.nowGoods[index] = findarr[0];
				
				let totalNum = Number(discount)*Number(findarr[0].amount);
				// 解决总价为浮点数
				let totalPrice = parseFloat(totalNum.toFixed(10));
				
				let choosed = {
					id,
					name,
					image,
					totalPrice,
					"amount":findarr[0].amount,
					discount
				}
				
				// 放入总价数组 不足，没点击一次就要加入一次，数组不断扩大
				this.arrPrice.push(choosed);
				
				// 点击同一个商品，则商品信息，总价等要一致
				let arrTotal=this.arrPrice.map(item=>id===item.id?choosed:item)
				this.arrPrice = arrTotal;//虽然map返回新数组，但是最好赋值一下，避免个别浏览器问题	
				
				// console.log(this.arrPrice);
				
				
				// 解决数组不断增大push 以下有点麻烦 ,直接获取到被选的商品，不重复
				// this.arrPrice需要先给一个空对象，否则不能进入数组
				// 计算属性中，需要过滤总价为0的情况，并且需要不值再赋给arrPrice
				// 当都为0时，数组为空了，进入不了循环的问题未解决
				
				// this.arrPrice.forEach((item,index)=>{
				// 	// 不改变原数组，所以初始为空，则一直为空
				// 	if(JSON.stringify(item) == '{}'){
				// 		console.log("11");
				// 		this.arrPrice[index] = choosed;
				// 	}
				// 	else if(item.id===id){
				// 		this.arrPrice[index] = choosed;
				// 	}else{
				// 		if((index+1)==this.arrPrice.length){
				// 			this.arrPrice.push(choosed);
				// 		}
				// 	}
				// });
				// console.log(this.arrPrice);
				
				// // 如果总价为0 则过滤
				// this.arrPrice = this.arrPrice.filter(item=>item.totalPrice!=0);
			},
			// 处理已选商品数组,数组改变及时响应，在computed调用
			filterArr() {
				// 商品总价信息对象去重
				let arr = {};
				let arrList = this.arrPrice.reduce((preVal,curVal)=>{
					arr[curVal.id]?'':arr[curVal.id]=true&&preVal.push(curVal);
					return preVal;
				},[])
					
				// 如果总价为0 则过滤
				let arrAll = arrList.filter(item=>item.totalPrice!=0);
				// console.log(arrAll);
				this.arrPrice = arrAll;
			},
			// 点击去结算 判断是否登录
			settlement(){
				// 有登录才可以结算
				const infos = uni.getStorageSync('userInfo');
				if(!infos) {
					// this.$refs.modal.isModal = true;
					// 可调用方法
					this.$nextTick(()=>{
						this.$refs.modal.init();
					})
				}else {
					log('已登录，进行支付');
					// 传递到订单页面的参数
					// 支付金额
					// 配送费
					// 用户id
					// 商家标识
					// 商家名称
					// 商家logo
					// 点的商品个数
					let payment = this.changeFloat(this.reArrPrice+this.physical);
					const orderDetail = {
						payment,
						physical:this.physical,
						openid:infos.openid,
						merchantId:this.merchantId,
						merchantName:this.merchantName,
						merchantLogo:this.merchantLogo,
						goods:this.arrPrice
					}
					// 路径带数据不能带对象，数组，只能字符串
					// 跳转到订单页面
					const orderstr = JSON.stringify(orderDetail);
					log(orderstr);
					wx.navigateTo({
						url:"../placeorder/placeorder?ide="+orderstr
					})
					
				}
			}
		},
		filters:{
			toFloat(price){
				return parseFloat(price.toFixed(10));
			}
		},
		computed:{
			// 计算总价
			reArrPrice(){
				// 处理已选商品数组
				this.filterArr();
				// 计算总价
				let allPrice = this.arrPrice.reduce((preTotal,curVal)=>preTotal+=curVal.totalPrice,0);
				return allPrice;
			},
			// 切换是否有商品的样式
			isActive(){
				return this.reArrPrice>0?true:false;
			},
			// 还差几元，配送，结算
			diffMon(){
				return this.reArrPrice < this.delivering ?　
					`还差${this.changeFloat(this.delivering-this.reArrPrice)}元`:`去结算`;
			},
			// 标记是否已结算
			flag(){
				// 0元起送的时候，需要加总价>0，否则可以点击去支付
				return this.diffMon === '去结算' && this.reArrPrice > 0? true : false;
			}
		},
		watch:{
			// 用户进入该页面：1、默认显示第一个分类的商品。
			goodsData(newValue,oldValue){
				// 取出无重复的商品分类
				let goodsClassic = [...new Set(newValue.map(item=>item.optidata))];
				this.tabList = goodsClassic;
				this.sortName = goodsClassic[0];
				// 往商品里添加一个数量字段
				let key = 'amount';
				let value = 0;
				let goodsAddAmount = newValue.map(item=>item[key]=value);
				console.log(newValue);
				
				// 右边的商品 方式一
				// 存储分类的商品
				// let goodsDetail = goodsClassic.map(item=>{
				// 	newValue.map(goods=>{
				// 		if(item === goods.optidata){	
				// 			if(this.sortGoods[goods.optidata]){
				// 				this.sortGoods[goods.optidata].push(goods);
				// 			}else{
				// 				let key = item;
				// 				this.sortGoods[key] = [goods];
				// 			}
				// 		}
				// 	})
				// })
				// // 当前goods
				// // console.log(this.sortGoods);
				// this.nowGoods = this.sortGoods[this.sortName];
				
				// 右边的商品 方式二
				this.nowGoods = newValue.filter(goods=>this.sortName===goods.optidata)
				console.log(this.nowGoods);

				// 访问对象中元素
				// let test = {a:1,b:2}
				// console.log(test['a']);
			},
			busiIntroData(newValue,oldValue) {
				// log(newValue);
				this.physical = newValue.physical;
				this.delivering = newValue.delivering;
				this.merchantId = newValue.openid;
				this.merchantLogo = newValue.logo;
				this.merchantName = newValue.shop;
			}
		}
	}
</script>

<style scoped>
	.stop-cli {
		pointer-events: none;
	}
	.goods-show {
		display: flex;
	}
	/* 左边分类tab */
	.goods-tabs {
		width: 190upx;
		height: 100%;
		overflow-y: auto;
		background: #fafafa;
	}
	.goods-tabs text {
		display: block;
		height: 80upx;
		line-height: 80upx;
		font-size: 28upx;
		text-align: center;
		color: #a8a8a8;
		
		text-overflow: ellipsis ;
		overflow: hidden;
		white-space: nowrap;
	}
	.active {
		background: #FFFFFF;
		font-weight: 700;
	}
	/* 右边商品 */
	.goods {
		width: 100%;
		padding: 9upx 9upx 130upx 9upx;
		overflow: hidden;
		overflow-y: auto;
		
		background: #fff;
	}
	.sort-name {
		height: 60upx;
		line-height: 80upx;
		
		font-size: 28upx;
	}
	.goods .content {
		display: flex;
		justify-content: space-between;
		height: 200upx;
		margin: 30upx 0;
		color: #898989;
	}
	.content-img {
		width: 180upx;
		height: 200upx;
		overflow: hidden;
	}
	.content-img image {
		width: 100%;
		height: 100%;
		border-radius: 10upx;
		overflow: hidden;
	}
	.content-text {
		padding-left: 10upx;
		font-size: 24upx;
	}
	/* 商品名 */
	 .con-name {
		 height: 50upx;
		 line-height: 50upx;
		 
		 display: -webkit-box; /* 弹性布局的兼容写法 */
		 -webkit-box-orient: vertical; /* 子元素的排列方式 垂直 */
		 -webkit-line-clamp: 1; /* 规定显示文本的行数 */
		 overflow: hidden; /* 多余部分隐藏 */
		 text-hidden: ellipsis; /* ...表示显 */
		 
		 font-size: 33upx;
		 font-weight: 700;
	 }
	 /* 商品标签 */
	 .con-label {
		 display: flex;
	 }
	 .con-label text {
		 display: block;
		 margin-right: 9upx;
		 padding: 4upx 13upx;
		 border-radius: 7upx;
		 background: #f1f1f1;
	 }
	 /*  月销 */
	 .con-sale {
		 height: 50upx;
		 line-height: 50upx;	 
	 }
	 .con-sale text {
		 padding-right: 20upx;
	 }
	 /* 价格 */
	 .con-price {
		 display: flex;
		 align-items: center;
	 }

	 .now-price {
		 width: 180upx;
		 font-size: 33upx;
		 color: #fb4e44;
		 overflow: hidden;
	 }
	 .pre-price {
		 text-decoration: line-through;
	 }
	 .goods-num {
		 display: flex;
		 align-items: center;
		 justify-content: space-around;
		 width: 100%;
	 }
	 .goods-num image {
	 	width: 60upx;
	 	height: 60upx;
	 }
	 .goods-num .amount {
		 width: 50upx;
		 text-align: center;
	 }
	 
	 /* 价格计算 */
	 .calc-price {
		 position: fixed;
		 left: 0;
		 right: 0;
		 bottom: 0;
		 width: 100%;
	 }
	 .rider {
		 position: fixed;
		 width: 120upx;
		 height: 150upx;
		 bottom: 0;
		 left: 50upx;
	 }
	 .rider image {
		 width: 100%;
		 height: 100%;
	 }
	 .calc-price .number {
		 position: fixed;
		 bottom: 50upx;
		 left: 130upx;
		width: 40upx;
		height: 40upx;
		border-radius: 50%;
		background: red;
		
		line-height: 40upx;
		font-size: 20upx;
		text-align: center;
		color: #fff;
	 }
	 /* 金额计算 */
	 .amount-detail {
		display: flex;
		align-items: center;
		height: 130upx;
		margin: 0 20upx;
	 }
	 .detail-left {
		 /* 占两份 */
		 flex-grow: 2;
		 height: 130upx;
		 border-top-left-radius: 50upx;
		 border-bottom-left-radius: 50upx;
		 background: #000;
	 }
	 .detail-left .cost-amount {
		 height: 130upx;
		 padding-left: 170upx;
		 color: #4CD964;
	 }
	 .cost-amount text {
		 display: block;
	 }
	 .cost-amount .total-amount {
		 height: 65upx;
		 line-height: 65upx;
		 font-size: 40upx;
		 color: #fff;
	 }
	 .cost-amount .delivery {
		 height: 65upx;
		 font-size: 28upx;
		 color: #999;
	 }
	 .detail-right {
		 flex-grow: 1;
		 height: 130upx;
		 line-height: 130upx;
		 border-top-right-radius: 50upx;
		 border-bottom-right-radius: 50upx;
		 
		 background: #000;
		 font-size: 30upx;
		 text-align: center;
		 color: #7f7f7f;
	}
	/* 选择菜单 */
	.dis-active {
		background: #7ccd7d!important;
		color: #000 !important;
	}
</style>
