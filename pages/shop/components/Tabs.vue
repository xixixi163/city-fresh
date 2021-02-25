<template>
	<view class="tabs">
		<block v-for="(item,index) in tabList" :key="index">
			<text :class="{active:index===num}" @click="textClick(index)">{{item}}</text>
		</block>
	</view>
</template>

<script>
	export default {
		name: 'Tabs',
		data() {
			return {
				tabList:['菜单','评价','商家'],
				num: 0
			}
		},
		methods:{
			textClick(index) {
				this.num = index;
				// 子组件访问父组件的方法
				this.$parent.fatherMethod(index);
			}
		}
	}
</script>

<style>
	.tabs {
		display: flex;
		align-items: center;
		margin: 20upx;
	}
	.tabs text {
		display: block;
		height: 60upx;
		margin-right: 60upx;
		line-height: 60upx;
		font-size: 33upx;
		color: #666666;
	}
	.active {
		color: #333;
		font-weight: 700;
		border-bottom: 5upx solid #77cd69;
	}
</style>
