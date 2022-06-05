<template>
  <view class="content">
    <view class="avatar">
      <image class="portrait" :src="formData.avatar || '/static/missing-face.png'" @tap="uploadAvatar"></image>
    </view>
    <uni-forms ref="form" :modelValue="formData" :rules="rules" err-show-type="toast">
    <view class="row b-b">
      <text class="tit">姓名</text>
      <uni-forms-item class="hide" name="name"></uni-forms-item>
      <input type="text" v-model="formData.name" placeholder="请输入用户名" @input="binddata('name',$event.detail.value)" />
    </view>
    <view class="row b-b">
      <text class="tit">邮箱</text>
      <uni-forms-item class="hide" name="email"></uni-forms-item>
        <input type="text" v-model="formData.email" placeholder="请输入邮箱" @input="binddata('email',$event.detail.value)" />
    </view>
    </uni-forms>
    <button class="add-btn" @click="submit">提交</button>

  </view>
</template>

<script>
import store from '@/store'
import {mapGetters} from 'vuex'
import { updateAvatar } from '@/api/user'

export default {
  store,
  data() {
    return {
      formData:{
      },
      rules: {
        // 对name字段进行必填验证
        name: {
          rules: [{
            required: true,
            errorMessage: '请输入姓名',
          },
            {
              minLength: 1,
              maxLength: 10,
              errorMessage: '姓名长度在 {minLength} 到 {maxLength} 个字符',
            }
          ]
        },
        // 对email字段进行必填验证
        email: {
          rules: [{
            required: true,
            errorMessage: '请输入邮箱',
          },{
            format: 'email',
            errorMessage: '邮箱格式错误',
          }]
        }
      }
    }
  },
  computed: {
    // 用户信息
    ...mapGetters(['user'])
  },
  onShow() {
    this.formData = this.user
    console.log(uni.getStorageSync('access_token'))
  },
  onLoad(option){

  },
  methods: {
    async submit () {
      let avatar_image_id = this.formData.avatar_image_id
      this.$refs.form.validate().then(res=>{
        if(avatar_image_id){
          res.avatar_image_id = avatar_image_id
        }
        this.$store.dispatch('updateUser', res).then(
            res=>{
              uni.showToast({
                title: '修改成功',
                duration: 2000,
                icon: "success"
              });
            }
        )
      }).catch(err =>{

      })
    },
    async uploadAvatar () {
      // 选择头像图片
      //let image = await uni.chooseImage({count: 1})
      let image = await uni.chooseImage({count: 1})

      image = image[1]
      // 获取选择的图片
      let avatar = image.tempFilePaths[0]

      // 调用上传图片接口
      let imageResponse = await updateAvatar(avatar)


      // 上传结果没有做 JSON.parse，需要手动处理
      let responseData = JSON.parse(imageResponse.data)

      this.formData = Object.assign({}, this.formData, {'avatar': responseData.path, 'avatar_image_id': responseData.id})

    }
  }
}
</script>

<style lang="scss">
page{
  background: $page-color-base;
  padding-top: 16upx;
}

.row{
  display: flex;
  align-items: center;
  position: relative;
  padding:0 30upx;
  height: 110upx;
  background: #fff;

  .tit{
    flex-shrink: 0;
    width: 120upx;
    font-size: 30upx;
    color: $font-color-dark;
  }
  .input{
    flex: 1;
    font-size: 30upx;
    color: $font-color-dark;
  }
  .icon-shouhuodizhi{
    font-size: 36upx;
    color: $font-color-light;
  }
}
.default-row{
  margin-top: 16upx;
  .tit{
    flex: 1;
  }
  switch{
    transform: translateX(16upx) scale(.9);
  }
}
.add-btn{
  display: flex;
  align-items: center;
  justify-content: center;
  width: 690upx;
  height: 80upx;
  margin: 60upx auto;
  font-size: $font-lg;
  color: #fff;
  background-color: $base-color;
  border-radius: 10upx;
  box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
}
.hide{
  display: none;
}
.avatar{
  width: 100%;
  text-align: center;
  padding: 30upx;
  background-color: #ffffff;
}
.portrait{
  width: 130upx;
  height: 130upx;
  border:5upx solid #fff;
  border-radius: 50%;
}
</style>
