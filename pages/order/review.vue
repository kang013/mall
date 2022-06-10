<template>
  <view class="content">
    <uni-rate v-model="value" @change="onChange"/>
  </view>
</template>

<script>

export default {
  data() {
    return {
      title: 'Hello',
      value: 2,
    }
  },
  onLoad() {

  },
  methods: {
    // todo..
    onChange(e) {
      console.log('rate发生改变:' + JSON.stringify(e))
    }
  }
}
</script>

<style scoped>
.content{
  height: 100%;
}
</style>
