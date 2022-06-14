<template>
	<view class="container">
		<view class="carousel">
			<swiper indicator-dots circular=true duration="400">
				<swiper-item class="swiper-item" v-for="(item,index) in imgList" :key="index">
					<view class="image-wrapper">
						<image
							:src="item"
							class="loaded"
							mode="aspectFill"
						></image>
					</view>
				</swiper-item>
			</swiper>
		</view>

		<view class="introduce-section">
			<text class="title">{{product.long_title ? product.long_title : product.title}}</text>
			<view class="price-box">
				<text class="price-tip">¥</text>
				<text class="price">{{product.price}}</text>
<!--				<text class="m-price">¥488</text>
				<text class="coupon-tip">7折</text>-->
			</view>
			<view class="bot-row">
				<text>销量: {{product.sold_count}}</text>
<!--				<text>库存: 4690</text>
				<text>浏览量: 768</text>-->
			</view>
		</view>

		<!--  分享 -->
		<view class="share-section" @click="share">
			<view class="share-icon">
				<text class="yticon icon-xingxing"></text>
				 返
			</view>
			<text class="tit">该商品分享可领49减10红包</text>
			<text class="yticon icon-bangzhu1"></text>
			<view class="share-btn">
				立即分享
				<text class="yticon icon-you"></text>
			</view>

		</view>

		<view class="c-list">
			<view class="c-row b-b" @click="toggleSpec">
				<text class="tit">购买类型</text>
				<view class="con">
					<text class="selected-text" v-for="(sItem, sIndex) in specSelected" :key="sIndex">
						{{sItem.name}}
					</text>
				</view>
				<text class="yticon icon-you"></text>
			</view>
			<view class="c-row b-b">
				<text class="tit">优惠券</text>
				<text class="con t-r red">领取优惠券</text>
				<text class="yticon icon-you"></text>
			</view>
			<view class="c-row b-b">
				<text class="tit">促销活动</text>
				<view class="con-list">
					<text>新人首单送20元无门槛代金券</text>
					<text>订单满50减10</text>
					<text>订单满100减30</text>
					<text>单笔购买满两件免邮费</text>
				</view>
			</view>
			<view class="c-row b-b">
				<text class="tit">服务</text>
				<view class="bz-list con">
					<text>7天无理由退换货 ·</text>
					<text>假一赔十 ·</text>
				</view>
			</view>
		</view>

		<!-- 评价 -->
		<view class="eva-section" >
			<view class="e-header"   @click="toReview(product.id)">
				<text class="tit">评价</text>
				<text>({{product.review_count}})</text>
				<text class="tip" v-if="reviews">好评率 100%</text>
				<text class="yticon icon-you" v-if="reviews"></text>
			</view>
			<view class="eva-box" v-if="reviews">
        <image class="portrait" :src="reviews.order.user.avatar?reviews.order.user.avatar:'/static/missing-face.png'" mode="aspectFill"></image>
        <view class="right">
          <text class="name">{{reviews.order.user.name}}</text>
          <view class="rate"><uni-rate :size="18" :value="reviews.rating" disabledColor="#ffca3e" :disabled="true" /></view>
          <text class="con">{{reviews.review}}</text>
          <view class="bot">
            <text class="attr">购买类型：{{reviews.product_sku.title}}</text>
            <text class="time">{{reviews.reviewed_at}}</text>
          </view>
        </view>
			</view>
		</view>

		<view class="detail-desc">
			<view class="d-header">
				<text>图文详情</text>
			</view>
			<rich-text class="desc" :nodes="product.description"></rich-text>
		</view>

		<!-- 底部操作菜单 -->
		<view class="page-bottom">
			<navigator url="/pages/index/index" open-type="switchTab" class="p-b-btn">
				<text class="yticon icon-xiatubiao--copy"></text>
				<text>首页</text>
			</navigator>
			<navigator url="/pages/cart/cart" open-type="switchTab" class="p-b-btn">
				<text class="yticon icon-gouwuche"></text>
				<text>购物车</text>
			</navigator>
			<view class="p-b-btn" :class="{active: favored}" @click="toFavorite">
				<text class="yticon icon-shoucang"></text>
				<text>收藏</text>
			</view>

      <view class="action-btn-group action-btn-group-long"  v-if="product.type === 'seckill'">
        <button type="primary" v-if="seckill.is_before_start" class=" action-btn no-border buy-now-btn action-btn-long no-start-btn">
          <text>未开始</text>
        </button>
        <button type="primary" v-else-if="seckill.is_after_end" class=" action-btn no-border buy-now-btn action-btn-long end-btn" >
          <text>已结束</text>
        </button>
        <button type="primary" v-else-if="seckill.is_start" class=" action-btn no-border buy-now-btn action-btn-long" @click="buy">
          <text>立即抢购</text>
          <uni-countdown
              class="time-out"
              :show-day="showDay"
              :day="days"
              :hour="timeHour"
              :minute="timeMinute"
              :second="timeSecond"
              color="#FFFFFF"
              splitorColor="#FFFFFF"
              @timeup="timeup"
          />
        </button>
      </view>
			<view class="action-btn-group" v-else>
          <button type="primary" class=" action-btn no-border add-cart-btn" @click="addCart">加入购物车</button>
          <button type="primary" class=" action-btn no-border buy-now-btn" @click="buy">立即购买</button>
			</view>
		</view>


		<!-- 规格-模态层弹窗 -->
		<view
			class="popup spec"
			:class="specClass"
			@touchmove.stop.prevent="stopPrevent"
			@click="toggleSpec"
		>
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer attr-content" @click.stop="stopPrevent">
				<view class="a-t">
					<image src="https://gd3.alicdn.com/imgextra/i3/0/O1CN01IiyFQI1UGShoFKt1O_!!0-item_pic.jpg_400x400.jpg"></image>
					<view class="right">
						<text class="price">¥{{skuPrice ? skuPrice : product.price}}</text>
						<text class="stock">库存：{{skuStock}}件</text>
						<view class="selected">
							已选：
							<text class="selected-text" v-for="(sItem, sIndex) in specSelected" :key="sIndex">
								{{sItem.name}}
							</text>
						</view>
					</view>
				</view>
				<view class="attr-list">
					<text>选择</text>
					<view class="item-list">
						<text
							v-for="(item, index) in skus"
							:key="index" class="tit"
              :class="{selected: item.id==skuId}"
							@click="selectSku(index, item)"
						>
							{{item.title}}
						</text>
					</view>
				</view>
        <view class="attr-list">
          <text>数量</text>
          <view class="item-list">
            <uni-number-box
                style="position: static;"
                class="step"
                :min="1"
                :value="numberValue > skuStock && skuStock !== '' ? skuStock : numberValue"
                :max="skuStock?skuStock:9999"
                @eventChange="numberChange"
            ></uni-number-box>
          </view>
        </view>

				<button class="btn" @click="confirm">确定</button>
			</view>
		</view>
		<!-- 分享 -->
		<share
			ref="share"
			:contentHeight="580"
			:shareList="shareList"
		></share>
	</view>
</template>

<script>
	import share from '@/components/share';
  import { getProductInfo,authGetProduct,favorite,unFavorite } from '@/api/product'
  import uniNumberBox from '@/components/uni-number-box.vue'
  import { addCart } from '@/api/cart'
  import {mapGetters} from 'vuex'
	export default{
		components: {
			share,
      uniNumberBox,
		},
    computed: {
      // 用户信息
      ...mapGetters(['isLoggedIn'])
    },
		data() {
			return {
				specClass: 'none',
				specSelected:[],
				shareList: [],
				imgList: [],
        skus:[],
        product:[],
        skuId:'',
        skuPrice:'',
        skuStock:'',
        skuTitle:'',
        numberValue:1,
        buyType:'', // 1直接购买，2加入购物车
        reviews:[],
        favored:false, // 收藏
        seckill:[], // 秒杀
        // 秒杀时间
        showDay: false,
        days: 0,
        timeHour: 0,
        timeMinute: 0,
        timeSecond: 0,
			}
		},
		async onLoad(options){
			//接收传值,id里面放的是标题，因为测试数据并没写id
			let id = options.id;
			if(id){
        let data = []
        if (!this.isLoggedIn) {
          data = await getProductInfo(id)
        }else{
          data = await authGetProduct(id)
        }
        if(data.data.product.type === 'seckill'){
          // 如果是秒杀商品
          this.seckill = data.data.seckill
          if(data.data.seckill.is_start){
            // 如果秒杀开始了
            this.computTime(this.seckill.end_at)
          }
        }
        this.product = data.data.product
        this.imgList = this.product.images_url
        this.skus = data.data.skus
        this.reviews = data.data.reviews
        this.favored = data.data.favored
			}
		},
		methods:{
			//规格弹窗开关
			toggleSpec() {
				if(this.specClass === 'show'){
					this.specClass = 'hide';
					setTimeout(() => {
						this.specClass = 'none';
					}, 250);
				}else if(this.specClass === 'none'){
					this.specClass = 'show';
				}
			},
			//选择规格
      selectSku(index,item){
        this.skuId = item.id
        this.skuPrice = item.price
        this.skuStock = item.stock
        this.skuTitle = item.title
        this.numberValue = this.numberValue > this.skuStock && this.skuStock !== '' ? this.skuStock : this.numberValue
      },
      // 选择数量
      numberChange(data){
        this.numberValue = data.number

      },
      // 加入购物车
      async addCart(){
        this.buyType = 2
        this.toggleSpec()
      },
      // 确认
      async confirm(){
        if(!this.skuId){
          this.$api.msg('请选择规格');
          return
        }
        if(this.skuStock === 0){
          this.$api.msg('库存不足');
          return
        }
        // 未登录跳转到登录页面
        if (!this.isLoggedIn) {
          this.$api.msg('请先登录');
          setTimeout(function () {
            uni.navigateTo({
              url: '/pages/public/login'
            })
          }, 2000);
          return
        }
        if(this.buyType === 2){
          await addCart({
            sku_id: this.skuId,
            amount: this.numberValue,
          })
          uni.showToast({
            title: '加入购物车成功',
            icon: 'success'
          })
        }else if(this.buyType === 1){
          // 直接购买添加订单
          let goodsData = [];
          goodsData.push({
            title: this.product.title,
            sku_title: this.skuTitle,
            price:this.skuPrice,
            image:this.product.image_url,
            sku_id: this.skuId,
            amount: this.numberValue,
            type: this.product.type,
          })

          uni.navigateTo({
            url: `/pages/order/createOrder?data=${JSON.stringify({
              goodsData: goodsData
            })}`
          })
        }

        this.toggleSpec()
      },
			//分享
			share(){
				this.$refs.share.toggleMask();
			},
			//收藏
			toFavorite(){
        // 未登录跳转到登录页面
        if (!this.isLoggedIn) {
          this.$api.msg('请先登录');
          setTimeout(function () {
            uni.navigateTo({
              url: '/pages/public/login'
            })
          }, 2000);
          return
        }
        if(this.favored){
          unFavorite(this.product.id)
        }else{
          favorite(this.product.id)
        }
				this.favored = !this.favored
			},
			buy(){
        this.buyType = 1 // 直接购买
        this.toggleSpec()
			},
      toReview(id){
        uni.navigateTo({
          url: `/pages/product/reviewList?id=${id}`
        })
      },
      computTime(time) {
        // 当前时间的时间戳
        let nowTime = Date.parse(new Date());
        // 指定时间的时间戳
        let endTime = Date.parse(new Date(time));
        if (endTime < nowTime) {
          //  截止时间已过
          return false
        } else {
          // 计算相差天数
          let timeResult = endTime - nowTime;
          this.days = Math.floor(timeResult / (24 * 3600 * 1000));
          if(this.days > 0){
            this.showDay = true
          }
          // 计算出小时数
          let dayMS = timeResult % (24 * 3600 * 1000); // 计算天数后剩余的毫秒数
          this.timeHour = Math.floor(dayMS / (3600 * 1000));
          // 计算相差分钟数
          let hoursMS = dayMS % (3600 * 1000); // 计算小时数后剩余的毫秒数
          this.timeMinute = Math.floor(hoursMS / (60 * 1000));
          // 计算相差秒数
          let minutesMS = hoursMS % (60 * 1000); // 计算分钟数后剩余的毫秒数
          this.timeSecond = minutesMS / 1000;
        }
      },
      timeup() {
        // 抢购结束
        this.seckill.is_after_end = true
        this.seckill.is_before_start = false
      },
			stopPrevent(){}
		},

	}
</script>

<style lang='scss'>
	page{
		background: $page-color-base;
		padding-bottom: 160upx;
	}
	.icon-you{
		font-size: $font-base + 2upx;
		color: #888;
	}
	.carousel {
		height: 722upx;
		position:relative;
		swiper{
			height: 100%;
		}
		.image-wrapper{
			width: 100%;
			height: 100%;
		}
		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			height: 750upx;
			overflow: hidden;
			image {
				width: 100%;
				height: 100%;
			}
		}

	}

	/* 标题简介 */
	.introduce-section{
		background: #fff;
		padding: 20upx 30upx;

		.title{
			font-size: 32upx;
			color: $font-color-dark;
			height: 50upx;
			line-height: 50upx;
		}
		.price-box{
			display:flex;
			align-items:baseline;
			height: 64upx;
			padding: 10upx 0;
			font-size: 26upx;
			color:$uni-color-primary;
		}
		.price{
			font-size: $font-lg + 2upx;
		}
		.m-price{
			margin:0 12upx;
			color: $font-color-light;
			text-decoration: line-through;
		}
		.coupon-tip{
			align-items: center;
			padding: 4upx 10upx;
			background: $uni-color-primary;
			font-size: $font-sm;
			color: #fff;
			border-radius: 6upx;
			line-height: 1;
			transform: translateY(-4upx);
		}
		.bot-row{
			display:flex;
			align-items:center;
			height: 50upx;
			font-size: $font-sm;
			color: $font-color-light;
			text{
				flex: 1;
			}
		}
	}
	/* 分享 */
	.share-section{
		display:flex;
		align-items:center;
		color: $font-color-base;
		background: linear-gradient(left, #fdf5f6, #fbebf6);
		padding: 12upx 30upx;
		.share-icon{
			display:flex;
			align-items:center;
			width: 70upx;
			height: 30upx;
			line-height: 1;
			border: 1px solid $uni-color-primary;
			border-radius: 4upx;
			position:relative;
			overflow: hidden;
			font-size: 22upx;
			color: $uni-color-primary;
			&:after{
				content: '';
				width: 50upx;
				height: 50upx;
				border-radius: 50%;
				left: -20upx;
				top: -12upx;
				position:absolute;
				background: $uni-color-primary;
			}
		}
		.icon-xingxing{
			position:relative;
			z-index: 1;
			font-size: 24upx;
			margin-left: 2upx;
			margin-right: 10upx;
			color: #fff;
			line-height: 1;
		}
		.tit{
			font-size: $font-base;
			margin-left:10upx;
		}
		.icon-bangzhu1{
			padding: 10upx;
			font-size: 30upx;
			line-height: 1;
		}
		.share-btn{
			flex: 1;
			text-align:right;
			font-size: $font-sm;
			color: $uni-color-primary;
		}
		.icon-you{
			font-size: $font-sm;
			margin-left: 4upx;
			color: $uni-color-primary;
		}
	}

	.c-list{
		font-size: $font-sm + 2upx;
		color: $font-color-base;
		background: #fff;
		.c-row{
			display:flex;
			align-items:center;
			padding: 20upx 30upx;
			position:relative;
		}
		.tit{
			width: 140upx;
		}
		.con{
			flex: 1;
			color: $font-color-dark;
			.selected-text{
				margin-right: 10upx;
			}
		}
		.bz-list{
			height: 40upx;
			font-size: $font-sm+2upx;
			color: $font-color-dark;
			text{
				display: inline-block;
				margin-right: 30upx;
			}
		}
		.con-list{
			flex: 1;
			display:flex;
			flex-direction: column;
			color: $font-color-dark;
			line-height: 40upx;
		}
		.red{
			color: $uni-color-primary;
		}
	}

	/* 评价 */
	.eva-section{
		display: flex;
		flex-direction: column;
		padding: 20upx 30upx;
		background: #fff;
		margin-top: 16upx;
		.e-header{
			display: flex;
			align-items: center;
			height: 70upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;
			.tit{
				font-size: $font-base + 2upx;
				color: $font-color-dark;
				margin-right: 4upx;
			}
			.tip{
				flex: 1;
				text-align: right;
			}
			.icon-you{
				margin-left: 10upx;
			}
		}
	}
	.eva-box{
		display: flex;
		padding: 20upx 0;
		.portrait{
			flex-shrink: 0;
			width: 80upx;
			height: 80upx;
			border-radius: 100px;
		}
		.right{
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-base;
			color: $font-color-base;
			padding-left: 26upx;
			.con{
				font-size: $font-base;
				color: $font-color-dark;
				padding: 20upx 0;
			}
			.bot{
				display: flex;
				justify-content: space-between;
				font-size: $font-sm;
				color:$font-color-light;
			}
		}
	}
	/*  详情 */
	.detail-desc{
		background: #fff;
		margin-top: 16upx;
		.d-header{
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			position: relative;

			text{
				padding: 0 20upx;
				background: #fff;
				position: relative;
				z-index: 1;
			}
			&:after{
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translateX(-50%);
				width: 300upx;
				height: 0;
				content: '';
				border-bottom: 1px solid #ccc;
			}
		}
	}

	/* 规格选择弹窗 */
	.attr-content{
		padding: 10upx 30upx;
		.a-t{
			display: flex;
			image{
				width: 170upx;
				height: 170upx;
				flex-shrink: 0;
				margin-top: -40upx;
				border-radius: 8upx;;
			}
			.right{
				display: flex;
				flex-direction: column;
				padding-left: 24upx;
				font-size: $font-sm + 2upx;
				color: $font-color-base;
				line-height: 42upx;
				.price{
					font-size: $font-lg;
					color: $uni-color-primary;
					margin-bottom: 10upx;
				}
				.selected-text{
					margin-right: 10upx;
				}
			}
		}
		.attr-list{
			display: flex;
			flex-direction: column;
			font-size: $font-base + 2upx;
			color: $font-color-base;
			padding-top: 30upx;
			padding-left: 10upx;
		}
		.item-list{
			padding: 20upx 0 0;
			display: flex;
			flex-wrap: wrap;
			text{
				display: flex;
				align-items: center;
				justify-content: center;
				background: #eee;
				margin-right: 20upx;
				margin-bottom: 20upx;
				border-radius: 100upx;
				min-width: 60upx;
				height: 60upx;
				padding: 0 20upx;
				font-size: $font-base;
				color: $font-color-dark;
			}
			.selected{
				background: #fbebee;
				color: $uni-color-primary;
			}
		}
	}

	/*  弹出层 */
	.popup {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 99;

		&.show {
			display: block;
			.mask{
				animation: showPopup 0.2s linear both;
			}
			.layer {
				animation: showLayer 0.2s linear both;
			}
		}
		&.hide {
			.mask{
				animation: hidePopup 0.2s linear both;
			}
			.layer {
				animation: hideLayer 0.2s linear both;
			}
		}
		&.none {
			display: none;
		}
		.mask{
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
			background-color: rgba(0, 0, 0, 0.4);
		}
		.layer {
			position: fixed;
			z-index: 99;
			bottom: 0;
			width: 100%;
			min-height: 40vh;
			border-radius: 10upx 10upx 0 0;
			background-color: #fff;
			.btn{
				height: 66upx;
				line-height: 66upx;
				border-radius: 100upx;
				background: $uni-color-primary;
				font-size: $font-base + 2upx;
				color: #fff;
				margin: 30upx auto 20upx;
			}
		}
		@keyframes showPopup {
			0% {
				opacity: 0;
			}
			100% {
				opacity: 1;
			}
		}
		@keyframes hidePopup {
			0% {
				opacity: 1;
			}
			100% {
				opacity: 0;
			}
		}
		@keyframes showLayer {
			0% {
				transform: translateY(120%);
			}
			100% {
				transform: translateY(0%);
			}
		}
		@keyframes hideLayer {
			0% {
				transform: translateY(0);
			}
			100% {
				transform: translateY(120%);
			}
		}
	}

	/* 底部操作菜单 */
	.page-bottom{
		position:fixed;
		left: 0;
		bottom:0;
		z-index: 95;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100upx;
		background: rgba(255,255,255,.9);
		box-shadow: 0 0 10upx 0 rgba(0,0,0,.5);

		.p-b-btn{
			display:flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: $font-sm;
			color: $font-color-base;
			width: 96upx;
			height: 80upx;
			.yticon{
				font-size: 40upx;
				line-height: 48upx;
				color: $font-color-light;
			}
			&.active, &.active .yticon{
				color: $uni-color-primary;
			}
			.icon-fenxiang2{
				font-size: 42upx;
				transform: translateY(-2upx);
			}
			.icon-shoucang{
				font-size: 46upx;
			}
		}
		.action-btn-group{
			display: flex;
			height: 76upx;
			border-radius: 100px;
			overflow: hidden;
			margin-left: 20upx;
			position:relative;
			&:after{
				content: '';
				position:absolute;
				top: 50%;
				right: 50%;
				transform: translateY(-50%);
				height: 100%;
				width: 0;
				border-right: 1px solid rgba(255,255,255,.5);
			}
			.action-btn{
				display:flex;
				align-items: center;
				justify-content: center;
				width: 205upx;
				height: 100%;
				font-size: $font-base ;
				padding: 0;
				border-radius: 0;
        background-color: #fa436a;
			}
      .add-cart-btn{
        background-color: #ffb120;
      }
      .action-btn-long{
        width: 410upx;
      }
      .no-start-btn{
        background-color: #ffb120;
      }
      .end-btn{
        background-color: #8f939c;
      }
		}
    .action-btn-group-long{
      &:after{
        border-right: none;
      }
    }
	}


</style>
