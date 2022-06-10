<template>
	<view class="content">
		<view class="navbar">
			<view
				v-for="(item, index) in navList" :key="index"
				class="nav-item"
				:class="{current: tabCurrentIndex === index}"
				@click="tabClick(index)"
			>
				{{item.text}}
			</view>
		</view>

		<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
				<scroll-view
					class="list-scroll-content"
					scroll-y
					@scrolltolower="loadBottom"
          :scroll-top="scrollTop"
				>
					<!-- 空白页 -->
					<empty v-if="resourceData.length === 0"></empty>

					<!-- 订单列表 -->
					<view
						v-for="(item,index) in resourceData" :key="index"
						class="order-item"
					>
						<view class="i-top b-b">
							<text class="time">{{item.created_at}}</text>
              <template v-if="item.paid_at">
                <text class="state" v-if="item.refund_status == 'pending'">已支付</text>
                <text class="state" v-else>{{item.order_status}}</text>
              </template>
              <template v-else-if="item.closed">
                <text class="state" style="color: #909399" >已关闭</text>
              </template>
              <template v-else>
                <text class="state" >请于{{item.order_closed}}前完成支付</text>
              </template>
							<text
								v-if="item.closed"
								class="del-btn yticon icon-iconfontshanchu1"
								@click="deleteOrder(item.id,index)"
							></text>
						</view>

						<scroll-view v-if="item.items.length > 1" class="goods-box" scroll-x @click="toOrder(item.id,index)">
							<view
								v-for="(goodsItem, goodsIndex) in item.items" :key="goodsIndex"
								class="goods-item"
							>
								<image class="goods-img" :src="goodsItem.product.image_url" mode="aspectFill"></image>
							</view>
						</scroll-view>
						<view
							v-if="item.items.length === 1"
							class="goods-box-single"
							v-for="(goodsItem, goodsIndex) in item.items" :key="goodsIndex"
              @click="toOrder(item.id,index)"
						>
							<image class="goods-img" :src="goodsItem.product.image_url" mode="aspectFill"></image>
							<view class="right">
								<text class="title clamp">{{goodsItem.product.title}}</text>
								<text class="attr-box">{{goodsItem.product_sku.title}}  x {{goodsItem.amount}}</text>
								<text class="price">{{goodsItem.price}}</text>
							</view>
						</view>

						<view class="price-box">
							共
							<text class="num">{{item.items.length}}</text>
							件商品 实付款
							<text class="price">{{item.total_amount}}</text>
						</view>
						<view class="action-box b-t" >
              <button class="action-btn" v-if="item.paid_at && item.refund_status === 'pending'" @click="applyRefund(item.id,index)" >申请退款</button>
              <button class="action-btn" v-if="!item.paid_at && !item.closed"  @click="cancelOrder(item.id,index)" >取消订单</button>
              <button class="action-btn recom" v-if="!item.paid_at && !item.closed" @click="payOrder(item.id,item.total_amount)">立即支付</button>
              <button class="action-btn recom" v-if="item.paid_at && item.ship_status === 'received'" @click="review(item.id,index)">评价</button>
						</view>
					</view>

					<uni-load-more :status="loadingType"></uni-load-more>

				</scroll-view>
			</swiper-item>
		</swiper>
    <uni-popup ref="inputDialog" type="dialog">
      <uni-popup-dialog ref="inputClose" mode="input" title="请输入退款理由" value=""
                        placeholder="请输入退款理由" @confirm="dialogInputConfirm"></uni-popup-dialog>
    </uni-popup>
	</view>
</template>

<script>
	import empty from "@/components/empty";
  import { getOrder,cancelOrder,deleteOrder,refundOrder } from '@/api/order'
	export default {
		components: {
			empty
		},
		data() {
			return {
				tabCurrentIndex: 0,
				navList: [{
						state: 0,
						text: '全部',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 1,
						text: '待付款',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 2,
						text: '待收货',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 3,
						text: '待评价',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 4,
						text: '售后',
						loadingType: 'more',
						orderList: []
					}
				],
        page: 1,
        // 数据
        resourceData: [],
        // 有没有更多数据
        noMoreData: false,
        // 是否在加载中
        isLoading: false,
        loadingType: 'more',
        status:'',
        shipStatus:'',
        scrollTop: 0,  // 切换tab时返回顶部
        index:'', // 删除，全局事件回调index
        order_id:'',
        listIndex:'',
			};
		},

    async onLoad(options){
			await this.loadData()
		},
    onShow(){
      // 移除监听事件
      uni.$off('order');
      //全局事件订阅，只要订阅了事件就可以收到值
      uni.$on("order",async (res)=>{
        //我是全局事件订阅的调用方法
        if(res.isDel){
          this.resourceData.splice(res.index,1) // 删除元素
        }
      })
    },
		methods: {
      async loadBottom(){

        // 如果没有更多内容，直接返回
        if (this.noMoreData || this.isLoading) {
          this.loadingType = 'nomore'
          return
        }

        this.isLoading = true
        this.page += 1
        await this.loadData()

        this.isLoading = false
      },
      async loadData(reset = false){
        const dataResponse = await getOrder({
          page: this.page,
          status:this.status,
          shipStatus:this.shipStatus
        })
        console.log(dataResponse)
        this.resourceData = reset ? dataResponse.data.data : this.resourceData.concat(dataResponse.data.data)

        const pagination = dataResponse.data

        // 根据分页设置是否还有更多数据
        if (pagination.current_page === pagination.last_page) {
          this.noMoreData = true
          this.loadingType = 'nomore'
        }
      },

      // 订单类型
      orderStatus(index){
        if(index === 1){
          this.status = 'pending' // 待付款
          this.shipStatus = ''
        }else if(index === 2){
          this.shipStatus = 'delivered'  // 待收货
          this.status = ''
        }else if(index === 3){
          this.shipStatus = 'received'  // 待评价
          this.status = ''
        }else if(index === 4){
          this.status = 'applied'  // 售後
          this.shipStatus = ''
        }else{
          this.status = ''
          this.shipStatus = ''
        }

      },
			//swiper 切换
			changeTab(e){
        this.page = 1
        this.noMoreData = false
        this.isLoading = false
        this.loadingType = 'more'
				this.tabCurrentIndex = e.target.current;
        this.orderStatus(this.tabCurrentIndex)
				this.loadData(true);
			},
			//顶部tab点击
			tabClick(index){
				this.tabCurrentIndex = index;
        //this.orderStatus(this.tabCurrentIndex)

			},
      toOrder(id,index){
        uni.navigateTo({
          url: `/pages/order/orderView?id=${id}&index=${index}`
        })
      },
			//删除订单
			deleteOrder(id,index){
        uni.showModal({
          content: '确定要删除订单？',
          success: (e)=>{
            if(e.confirm){
              deleteOrder(id)
              this.resourceData.splice(index,1) // 删除元素
            }
          }
        })
			},
      payOrder(id,total){
        uni.redirectTo({
          url: '/pages/money/pay?order_id=' + id + '&total=' + total
        })
      },
			//取消订单
			async cancelOrder(id,index){
        uni.showModal({
          content: '确定要取消订单？',
          success: (e)=>{
            if(e.confirm){
              cancelOrder(id)
              this.resourceData[index].closed = 1
            }
          }
        })
			},
      async dialogInputConfirm(val) {
        if(!val){
          this.$api.msg('请输入退款理由');
          return
        }
        refundOrder(this.order_id,{
          reason:val
        })
        this.$refs.inputDialog.close()
        this.resourceData[this.listIndex].refund_status = 'applied'
        this.resourceData[this.listIndex].order_status = '已申请退款'
      },
      // 申请退款
      applyRefund(id,index)
      {
        this.order_id = id
        this.listIndex = index
        this.$refs.inputDialog.open()
      },
      // 评价
      review(id,index){
        uni.navigateTo({
          url: `/pages/order/review?id=${id}&index=${index}`
        })
      }
		},
	}
</script>

<style lang="scss">
	page, .content{
		background: $page-color-base;
		height: 100%;
	}

	.swiper-box{
		height: calc(100% - 40px);
	}
	.list-scroll-content{
		height: 100%;
	}

	.navbar{
		display: flex;
		height: 40px;
		padding: 0 5px;
		background: #fff;
		box-shadow: 0 1px 5px rgba(0,0,0,.06);
		position: relative;
		z-index: 10;
		.nav-item{
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 15px;
			color: $font-color-dark;
			position: relative;
			&.current{
				color: $base-color;
				&:after{
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 44px;
					height: 0;
					border-bottom: 2px solid $base-color;
				}
			}
		}
	}

	.uni-swiper-item{
		height: auto;
	}
	.order-item{
		display: flex;
		flex-direction: column;
		padding-left: 30upx;
		background: #fff;
		margin-top: 16upx;
		.i-top{
			display: flex;
			align-items: center;
			height: 80upx;
			padding-right:30upx;
			font-size: $font-base;
			color: $font-color-dark;
			position: relative;
			.time{
				flex: 1;
			}
			.state{
				color: $base-color;
			}
			.del-btn{
				padding: 10upx 0 10upx 36upx;
				font-size: $font-lg;
				color: $font-color-light;
				position: relative;
				&:after{
					content: '';
					width: 0;
					height: 30upx;
					border-left: 1px solid $border-color-dark;
					position: absolute;
					left: 20upx;
					top: 50%;
					transform: translateY(-50%);
				}
			}
		}
		/* 多条商品 */
		.goods-box{
			height: 160upx;
			padding: 20upx 0;
			white-space: nowrap;
			.goods-item{
				width: 120upx;
				height: 120upx;
				display: inline-block;
				margin-right: 24upx;
			}
			.goods-img{
				display: block;
				width: 100%;
				height: 100%;
			}
		}
		/* 单条商品 */
		.goods-box-single{
			display: flex;
			padding: 20upx 0;
			.goods-img{
				display: block;
				width: 120upx;
				height: 120upx;
			}
			.right{
				flex: 1;
				display: flex;
				flex-direction: column;
				padding: 0 30upx 0 24upx;
				overflow: hidden;
				.title{
					font-size: $font-base + 2upx;
					color: $font-color-dark;
					line-height: 1;
				}
				.attr-box{
					font-size: $font-sm + 2upx;
					color: $font-color-light;
					padding: 10upx 12upx;
				}
				.price{
					font-size: $font-base + 2upx;
					color: $font-color-dark;
					&:before{
						content: '￥';
						font-size: $font-sm;
						margin: 0 2upx 0 8upx;
					}
				}
			}
		}

		.price-box{
			display: flex;
			justify-content: flex-end;
			align-items: baseline;
			padding: 20upx 30upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;
			.num{
				margin: 0 8upx;
				color: $font-color-dark;
			}
			.price{
				font-size: $font-lg;
				color: $font-color-dark;
				&:before{
					content: '￥';
					font-size: $font-sm;
					margin: 0 2upx 0 8upx;
				}
			}
		}
		.action-box{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			height: 100upx;
			position: relative;
			padding-right: 30upx;
		}
		.action-btn{
			width: 160upx;
			height: 60upx;
			margin: 0;
			margin-left: 24upx;
			padding: 0;
			text-align: center;
			line-height: 60upx;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
			background: #fff;
			border-radius: 100px;
			&:after{
				border-radius: 100px;
			}
			&.recom{
				background: #fff9f9;
				color: $base-color;
				&:after{
					border-color: #f7bcc8;
				}
			}
		}
	}


	/* load-more */
	.uni-load-more {
		display: flex;
		flex-direction: row;
		height: 80upx;
		align-items: center;
		justify-content: center
	}

	.uni-load-more__text {
		font-size: 28upx;
		color: #999
	}

	.uni-load-more__img {
		height: 24px;
		width: 24px;
		margin-right: 10px
	}

	.uni-load-more__img>view {
		position: absolute
	}

	.uni-load-more__img>view view {
		width: 6px;
		height: 2px;
		border-top-left-radius: 1px;
		border-bottom-left-radius: 1px;
		background: #999;
		position: absolute;
		opacity: .2;
		transform-origin: 50%;
		animation: load 1.56s ease infinite
	}

	.uni-load-more__img>view view:nth-child(1) {
		transform: rotate(90deg);
		top: 2px;
		left: 9px
	}

	.uni-load-more__img>view view:nth-child(2) {
		transform: rotate(180deg);
		top: 11px;
		right: 0
	}

	.uni-load-more__img>view view:nth-child(3) {
		transform: rotate(270deg);
		bottom: 2px;
		left: 9px
	}

	.uni-load-more__img>view view:nth-child(4) {
		top: 11px;
		left: 0
	}

	.load1,
	.load2,
	.load3 {
		height: 24px;
		width: 24px
	}

	.load2 {
		transform: rotate(30deg)
	}

	.load3 {
		transform: rotate(60deg)
	}

	.load1 view:nth-child(1) {
		animation-delay: 0s
	}

	.load2 view:nth-child(1) {
		animation-delay: .13s
	}

	.load3 view:nth-child(1) {
		animation-delay: .26s
	}

	.load1 view:nth-child(2) {
		animation-delay: .39s
	}

	.load2 view:nth-child(2) {
		animation-delay: .52s
	}

	.load3 view:nth-child(2) {
		animation-delay: .65s
	}

	.load1 view:nth-child(3) {
		animation-delay: .78s
	}

	.load2 view:nth-child(3) {
		animation-delay: .91s
	}

	.load3 view:nth-child(3) {
		animation-delay: 1.04s
	}

	.load1 view:nth-child(4) {
		animation-delay: 1.17s
	}

	.load2 view:nth-child(4) {
		animation-delay: 1.3s
	}

	.load3 view:nth-child(4) {
		animation-delay: 1.43s
	}

	@-webkit-keyframes load {
		0% {
			opacity: 1
		}

		100% {
			opacity: .2
		}
	}
</style>
