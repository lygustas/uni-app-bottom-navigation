<template>
	<view>
		<swiper :style="'min-height:'+height+'px'" :current="active" duration="0" @change="swiperChange">
			<swiper-item>
				<view class="swiper-item">首页</view>
			</swiper-item>
			<swiper-item>
				<view class="swiper-item" style="background-color: #20D785;">分类</view>
			</swiper-item>
			<swiper-item>
				<view class="swiper-item" style="background-color: #307DCA;">发布</view>
			</swiper-item>
			<swiper-item>
				<view class="swiper-item" style="background-color: #6641E2;">购物车</view>
			</swiper-item>
			<swiper-item>
				<view class="swiper-item" style="background-color: #FF4081;">我的</view>
			</swiper-item>
		</swiper>
		<view class="tab">
			<view :class="active==0?'item active':'item'" @click="active=0">
				<view>
					<view class="uni-icon uni-icon-home"></view>
				</view>
				<view>首页</view>
			</view>
			<view :class="active==1?'item active':'item'" @click="active=1">
				<view>
					<view class="uni-icon uni-icon-list"></view>
				</view>
				<view>分类</view>
			</view>
			<view :class="active==2?'item-add active':'item-add'" @click="active=2">
				<view>
					<view class="uni-icon uni-icon-plus-filled"></view>
				</view>
				<view class="text">发布</view>
			</view>
			<view :class="active==3?'item active':'item'" @click="active=3">
				<view>
					<view class="uni-icon uni-icon-compose"></view>
				</view>
				<view>购物车</view>
			</view>
			<view :class="active==4?'item active':'item'" @click="active=4">
				<view>
					<view class="uni-icon uni-icon-person"></view>
				</view>
				<view>我的</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data: {
			active: 0,
			height:0
		},
		methods:{
			swiperChange(e) {
				this.active = e.detail.current;
			}
		},
		onLoad:function(){
			uni.getSystemInfo({
				success:res=>{
					this.height = res.screenHeight;
				}
			})
		}
	}
</script>

<style>
	@import "../../common/icon.css";
	.swiper-item {
		display: flex;
		width: 100%;
		height: 100%;
		text-align: center;
		background-color: #00BFFF;
		justify-content: center;
		align-items: center;
	}

	.uni-icon {
		margin-top: 0;
		color: #929292;
	}

	.tab {
		position: fixed;
		z-index: 999;
		height: 100px;
		width: 100%;
		bottom: 0;
		background-color: #F7F7F7;
		display: flex;
		border-top: #CCCCCC 2px solid;
	}

	.tab .item-add {
		width: 20%;
		color: #929292;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		position: relative;
		text-align: center;
	}

	.item-add .uni-icon {
		position: absolute;
		color: #929292;
		border-radius: 50%;
		font-size: 100px;
		left: 25px;
		top: -50px;
		box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 1), 0 5px 8px 0 rgba(0, 0, 0, .14), 0 1px 14px 0 rgba(0, 0, 0, .12);
	}

	.item-add .text {
		font-size: 24px;
		padding-top: 36px;
	}

	.tab .item {
		width: 20%;
		color: #929292;
		font-size: 24px;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
	}

	.active {
		color: #20D785 !important;
	}

	.active .uni-icon {
		color: #20D785;
	}
</style>
