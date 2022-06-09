<template>
  <view class="content">
<!--    <view class="top-txt">
      <view class="tb-x">
        <uni-icons class="l-icon" type="reload" size="22"></uni-icons>
        <text class="l-txt">等待付款</text>
      </view>
    </view>-->
    <view class="address-section">
      <view class="order-content">
        <text class="yticon icon-shouhuodizhi"></text>
        <view class="cen">
          <view class="top">
            <text class="name">{{order.address.contact_name}}</text>
            <text class="mobile">{{order.address.contact_phone}}</text>
          </view>
          <text class="address">{{order.address.address}}</text>
        </view>
      </view>
    </view>
    <view
        class="order-item"
    >
      <view
          class="goods-box-single"
          v-for="(item, index) in order.items" :key="index"
      >
        <image class="goods-img" :src="item.product.image_url" mode="aspectFill"></image>
        <view class="right">
          <text class="title clamp">{{item.product.title}}</text>
          <text class="attr-box">{{item.product_sku.title}}  x {{item.amount}}</text>
          <text class="price">{{item.price}}</text>
        </view>
      </view>
    </view>
    <view class="order-item">
      <view class="text-list">
        <text class="t-left">订单编号：</text><text class="t-right">{{order.no}}</text>
      </view>
      <view class="text-list">
        <text class="t-left">下单时间：</text><text class="t-right">{{order.created_at}}</text>
      </view>
      <view class="text-list">
        <text class="t-left">物流状态：</text><text class="t-right">{{order.logistics_status}}</text>
      </view>
      <view class="text-list">
        <text class="t-left">备注：</text><text class="t-right">{{order.remark}}</text>
      </view>
    </view>
    <view class="order-item">
      <view class="text-list">
        <text class="t-left">商品总额：</text><text class="t-right">{{order.total_amount}}</text>
      </view>
      <view class="text-list">
        <text class="t-left">运费：</text><text class="t-right">0.00</text>
      </view>
      <view class="text-list">
        <text class="t-left">商品优惠：</text><text class="t-right">0.00</text>
      </view>
      <view class="text-list" style="margin-top: 5rpx;">
        <text class="t-left clt">{{order.paid_at ? '实付款：' : '需付款：'}}</text><text class="t-right state">{{order.total_amount}}</text>
      </view>
    </view>
    <view class="bottom-bar">
      <view class="action-box" >
        <button class="action-btn" v-if="order.paid_at" >申请退款</button>
        <button class="action-btn" v-if="!order.paid_at && !order.closed" >取消订单</button>
        <button class="action-btn recom" v-if="!order.paid_at && !order.closed">立即支付</button>
        <button class="action-btn" v-if="order.closed" >删除订单</button>
      </view>
    </view>
  </view>
</template>

<script>
import { getOrderDefault } from '@/api/order'
export default {
  data() {
    return {
      order:[],
    }
  },
  async onLoad(options){
    console.log(options.id)
    let order = await getOrderDefault(options.id)
    this.order = order.data.order
    console.log(this.order)
  },
  methods: {

  }
}
</script>

<style lang="scss">
page, .content {
  background: $page-color-base;
  height: 100%;
}

.address-section {
  padding: 30upx 0;
  background: #fff;
  position: relative;

  .order-content {
    display: flex;
    align-items: center;
  }

  .icon-shouhuodizhi {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 90upx;
    color: #888;
    font-size: 44upx;
  }

  .cen {
    display: flex;
    flex-direction: column;
    flex: 1;
    font-size: 28upx;
    color: $font-color-dark;
  }

  .name {
    font-size: 34upx;
    margin-right: 24upx;
  }

  .address {
    margin-top: 16upx;
    margin-right: 20upx;
    color: $font-color-light;
  }

  .icon-you {
    font-size: 32upx;
    color: $font-color-light;
    margin-right: 30upx;
  }

  .a-bg {
    position: absolute;
    left: 0;
    bottom: 0;
    display: block;
    width: 100%;
    height: 5upx;
  }
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
      width: 120rpx;
      height: 120rpx;
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
.bottom-bar{
  background: #fff;
  margin-top: 16rpx;
  position: fixed;
  bottom: 0;
  width: 100%;
  box-shadow: 0 0 4upx 0 rgba(0,0,0,.1);


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
.top-txt{
  text-align: center;
  padding: 30rpx;

  .tb-x .l-txt{
    font-size: 36rpx;
    margin-left: 10rpx;
  }
}
</style>
