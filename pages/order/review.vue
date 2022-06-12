<template>
  <view class="content">
    <view
        class="order-item"
    >
      <view
          class="goods-box-single"
          v-for="(item, index) in data.items" :key="index"
      >
        <image class="goods-img" :src="item.product.image_url" mode="aspectFill"></image>
        <view class="right">
          <text class="title clamp">{{item.product.title}}</text>
          <text class="attr-box">{{item.product_sku.title}}  x {{item.amount}}</text>
        </view>
      </view>
    </view>
    <view class="uni-padding-wrap uni-common-mt">
      <view class="uni-flex uni-row">
        <view class="flex-item flex-left"><text>商品评价</text></view>
        <view class="flex-item flex-right"> <uni-rate v-model="rating" @change="onChange"/></view>
      </view>
      <view>
        <textarea  class="textarea" v-model="review" placeholder="请输入评价内容" />
      </view>
    </view>
  </view>
</template>

<script>
import { getReview,sendReview } from '@/api/order'

export default {
  data() {
    return {
      rating: 5,
      data:[],
      review:'',
      index:'',
    }
  },
  async onLoad(options) {
    this.index = options.index
    let review = await getReview(options.id)
    this.data = review.data.order
    console.log(this.data)
  },
  async onNavigationBarButtonTap(e) {
    if(!this.review){
      this.$api.msg('请输入评价内容');
      return
    }
    await sendReview(this.data.id,{
      review:this.review,
      rating:this.rating,
      id:this.data.items[0].id,
    })
    uni.$emit("order", {
      reviewed: 1,
      index: this.index,
    }) // 全局事件
    uni.navigateBack()
  },
  methods: {
    onChange(e) {
      this.rating = e.value
      console.log(this.rating)
    }
  }
}
</script>

<style lang="scss">
.content{
  height: 100%;
}
.order-item {
  display: flex;
  flex-direction: column;
  padding-left: 30rpx;
  background: #fff;
  margin-top: 16rpx;
  padding-top: 18rpx;
  padding-bottom: 18rpx;

.i-top {
  display: flex;
  align-items: center;
  height: 80rpx;
  padding-right: 30rpx;
  font-size: $font-base;
  color: $font-color-dark;
  position: relative;

.time {
  flex: 1;
}

.state {
  color: $base-color;
}

.del-btn {
  padding: 10rpx 0 10rpx 36rpx;
  font-size: $font-lg;
  color: $font-color-light;
  position: relative;

&:after {
   content: '';
   width: 0;
   height: 30rpx;
   border-left: 1px solid $border-color-dark;
   position: absolute;
   left: 20rpx;
   top: 50%;
   transform: translateY(-50%);
 }
}
}

/* 单条商品 */
.goods-box-single {
  display: flex;
  padding: 20rpx 0;

.goods-img {
  display: block;
  width: 80rpx;
  height: 80rpx;
}

.right {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 30rpx 0 24rpx;
  overflow: hidden;

.title {
  font-size: $font-base + 2upx;
  color: $font-color-dark;
  line-height: 1;
}

.attr-box {
  font-size: $font-sm + 2upx;
  color: $font-color-light;
  padding: 10rpx 12rpx;
}

.price {
  font-size: $font-base + 2upx;
  color: $font-color-dark;

&:before {
   content: '￥';
   font-size: $font-sm;
   margin: 0 2rpx 0 8rpx;
 }
}
}
}

.price-box {
  display: flex;
  justify-content: flex-end;
  align-items: baseline;
  padding: 20rpx 30rpx;
  font-size: $font-sm + 2upx;
  color: $font-color-light;

.num {
  margin: 0 8rpx;
  color: $font-color-dark;
}

.price {
  font-size: $font-lg;
  color: $font-color-dark;

&:before {
   content: '￥';
   font-size: $font-sm;
   margin: 0 2rpx 0 8rpx;
 }
}
}

.action-box {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 100rpx;
  position: relative;
  padding-right: 30rpx;
}

.action-btn {
  width: 160rpx;
  height: 60rpx;
  margin: 0;
  margin-left: 24rpx;
  padding: 0;
  text-align: center;
  line-height: 60rpx;
  font-size: $font-sm + 2upx;
  color: $font-color-dark;
  background: #fff;
  border-radius: 100px;

&:after {
   border-radius: 100px;
 }

&.recom {
   background: #fff9f9;
   color: $base-color;

&:after {
   border-color: #f7bcc8;
 }
}
}

.text-list {
  padding:7rpx 0;
}
.text-list .t-left {
  font-size: 14rpx;
  color: $font-color-light;
}
.text-list .t-right {
  float: right;
  margin-right: 30rpx;
}
.text-list .clt {
  font-size: 32rpx;
  color: #000000;
}
.text-list .state {
  font-size: 40rpx;
  color: $base-color;
}

}
.uni-padding-wrap{
  padding: 30rpx;
}
.uni-flex{
  display: flex;
}
.uni-flex .flex-left{
  margin-right: 20rpx;
}
.textarea{
  padding: 10rpx;
  margin-top: 20rpx;
  width: 100%;
  border: 1px solid #dbdbdb;
  border-radius: 10rpx;
}
</style>
