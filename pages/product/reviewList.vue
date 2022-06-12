<template>
  <view class="content">
    <view class="eva-section">
      <view class="eva-box" v-for="(item, index) in resourceData" :key="index">
        <image class="portrait" :src="item.order.user.avatar?item.order.user.avatar:'/static/missing-face.png'" mode="aspectFill"></image>
        <view class="right">
          <text class="name">{{item.order.user.name}}</text>
          <view class="rate"><uni-rate :size="18" :value="item.rating" disabledColor="#ffca3e" :disabled="true" /></view>
          <text class="con">{{item.review}}</text>
          <view class="bot">
            <text class="attr">购买类型：{{item.product_sku.title}}</text>
            <text class="time">{{item.reviewed_at}}</text>
          </view>
        </view>
      </view>
    </view>
    <uni-load-more :status="loadingType"></uni-load-more>
  </view>
</template>

<script>
import { getReview } from '@/api/product'
import listRefresh from '@/mixins/list-refresh.js'
export default {
  mixins: [ listRefresh ],
  data() {
    return {
      list:[],
      product_id:'',
    }
  },
  async onLoad(options){
    this.product_id = options.id
    this.loadData()
  },
  methods: {
    async fetchData() {
      let params = {
        page: this.page,
      }
      // 获取评论数据
      return getReview(this.product_id,params)
    },
  }
}
</script>

<style  lang='scss'>
page, .content {
  background: $page-color-base;
  height: 100%;
}
.eva-box{
  display: flex;
  padding: 20upx 20upx;
  background: #ffffff;
  margin-bottom: 20rpx;
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
  .rate{
    padding-top: 20upx;
  }
}
}
</style>