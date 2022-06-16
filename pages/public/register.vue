<template>
  <view class="container">
    <view class="left-bottom-sign"></view>
    <view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
    <view class="right-top-sign"></view>
    <!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
    <view class="wrapper">
      <view class="left-top-sign">REGISTER</view>
      <view class="welcome">
        欢迎注册！
      </view>


      <view class="input-content">
        <uni-forms ref="form" :modelValue="formData" :rules="rules" err-show-type="toast">
          <uni-forms-item class="input-item-lg" name="name">
            <input class="input" type="text" v-model="formData.name" placeholder="请输入用户名" />
          </uni-forms-item>
          <uni-forms-item class="input-item-lg input-ps-bx" name="phone">
            <input class="input" type="text" v-model="formData.phone" maxlength="11" placeholder="请输入手机号码" @blur="onPhone"  />
            <view class="send-sms" @click="sendSms" v-if="isShow">获取验证码</view>
            <view class="send-sms" v-if="!isShow" :style="!isShow ? 'color:#d0d0d0' : ''" >重新获取({{count}})秒</view>
          </uni-forms-item>
          <uni-forms-item class="input-item-lg input-flex-bg" name="code" v-show="showCode">
            <input class="input input-left" v-model="formData.code" type="text" placeholder="请输入验证码" @blur="onCode"  />
            <image class="input-img" :src="code.captcha_image_content?code.captcha_image_content:''" @click="checkCode"></image>
          </uni-forms-item>
          <uni-forms-item class="input-item-lg" name="verificationCcode" v-show="verShow">
            <input class="input" v-model="formData.verificationCcode" type="text" placeholder="验证码"  />
          </uni-forms-item>
          <uni-forms-item class="input-item-lg" name="password">
            <input class="input" v-model="formData.password" type="text" placeholder="请输入密码"  />
          </uni-forms-item>
          <uni-forms-item class="input-item-lg" name="confirmPassword">
            <input class="input" v-model="formData.confirmPassword" type="text" placeholder="请输入确认密码"  />
          </uni-forms-item>
        </uni-forms>
        <button class="confirm-btn"  @click="submit" :disabled="logining">注册</button>
      </view>

      <view class="forget-section">
        忘记密码?
      </view>
    </view>
    <view class="register-section">
      已有账号?
      <text @click="toLogin">去登录</text>
    </view>

  </view>

</template>

<script>

import { captchas,verificationCodes } from '@/api/auth'
import store from '@/store'
import {mapGetters} from 'vuex'

export default{
  store,
  computed: {
    // 用户信息
    ...mapGetters(['isLoggedIn'])
  },
  data(){
    return {
      logining: false,
      formData: {
        name: '',
        phone: '',
        password: '',
        confirmPassword: '',
        verificationCcode: '',
      },
      code:'',
      showCode:false,
      phone:'',
      isShow: true, //通过 v-show 控制显示'获取按钮'还是'倒计时'
      count: 0, //倒计时 计数器
      smsbtn: "",
      codeTxt: "",
      rules: {
        // 对name字段进行必填验证
        name: {
          rules: [{
            required: true,
            errorMessage: '请输入用户名',
          },
            {
              minLength: 1,
              maxLength: 30,
              errorMessage: '姓名长度在 {minLength} 到 {maxLength} 个字符',
            }
          ]
        },
        phone: {
          rules: [{
            required: true,
            errorMessage: '请输入手机号',
          },
            {
              pattern: /(^1[3|4|5|7|8][0-9]{9}$)/,
              errorMessage: '请输入正确的手机号码',
            }
          ]
        },
        password: {
          rules: [{
            required: true,
            errorMessage: '请输入密码',
          },{
            minLength: 6,
            maxLength: 16,
            errorMessage: '密码至少为 {minLength} 个字符',
          }]
        },
        confirmPassword: {
          rules: [{
            required: true,
            errorMessage: '请输入确认密码',
          },{
            minLength: 6,
            errorMessage: '密码至少为 {minLength} 个字符',
          }]
        }
      },
      verification:[],
      verShow:false,
    }
  },

  onLoad(){

  },
  methods: {
    async submit() {
      this.logining = true
      this.$refs.form.validate().then(res=>{
        if(res.password !== res.confirmPassword){
          this.$api.msg('两次密码不正确');
          this.logining = false;
          return
        }
        console.log('表单数据信息：', res);
        let params = {
          verification_key:this.verification.key,
          verification_code:res.verificationCcode,
          password:res.password,
          name:res.name,
          phone:res.phone,
        }
        console.log(params)
        //register(params)
        this.logining = false
        this.$store.dispatch('register', params).then(result=>{
          if(this.isLoggedIn){
            uni.switchTab({
              url: '/pages/user/user'
            });
          }
        })

      }).catch(err =>{
        this.logining = false;
       //console.log('表单错误信息：', err);
      })
    },
    async sendSms(){
      console.log(this.phone)
      if(!/(^1[3|4|5|7|8][0-9]{9}$)/.test(this.phone)){
        this.$api.msg('请输入正确的手机号码');
        return;
      }
      if(!this.code.captcha_image_content){
        this.$api.msg('请输入图片验证码');
        return;
      }
      console.log(this.codeTxt)
      let verification = await verificationCodes({
        captcha_key:this.code.captcha_key,
        captcha_code:this.codeTxt,
      })
      if(!verification){
        await this.checkCode()
        this.$api.msg('请输入正确的图片验证码');
        return
      }else{
        this.verification = verification.data
        console.log(verification)
      }




      this.isShow = false;//倒计时
      this.verShow = true // 显示验证码输入框
      this.count = 3; //赋值3秒
      let times = setInterval(() => {
        this.count--; //递减
        if (this.count <= 0) {
          // <=0 变成获取按钮
          this.isShow = true;
          clearInterval(times);
        }
      }, 1000); //1000毫秒后执行
    },
    async onPhone(e){
      //console.log(e.detail.value)
      this.phone = e.detail.value
      this.showCode = false
      let code = await captchas({phone:this.phone})
      if(code.data.captcha_image_content){
        this.showCode = true
        this.code = code.data
      }
    },
    onCode(e){
      this.codeTxt = e.detail.value
    },
    async checkCode(){
      if(this.phone){
        let code = await captchas({phone:this.phone})
        if(code.data.captcha_image_content){
          this.code = code.data
        }
      }
    },
    toLogin(){
      uni.redirectTo({
        url: '/pages/public/login'
      })
    }
  },

}
</script>

<style lang='scss'>
page{
  background: #fff;
}
.container{
  padding-top: 115px;
  position:relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #fff;
}
.wrapper{
  position:relative;
  z-index: 90;
  background: #fff;
  padding-bottom: 40upx;
}
.back-btn{
  position:absolute;
  left: 40upx;
  z-index: 9999;
  padding-top: var(--status-bar-height);
  top: 40upx;
  font-size: 40upx;
  color: $font-color-dark;
}
.left-top-sign{
  font-size: 120upx;
  color: $page-color-base;
  position:relative;
  left: -16upx;
}
.right-top-sign{
  position:absolute;
  top: 80upx;
  right: -30upx;
  z-index: 95;
  &:before, &:after{
    display:block;
    content:"";
    width: 400upx;
    height: 80upx;
    background: #b4f3e2;
  }
  &:before{
    transform: rotate(50deg);
    border-radius: 0 50px 0 0;
  }
  &:after{
    position: absolute;
    right: -198upx;
    top: 0;
    transform: rotate(-50deg);
    border-radius: 50px 0 0 0;
    /* background: pink; */
  }
}
.left-bottom-sign{
  position:absolute;
  left: -270upx;
  bottom: -320upx;
  border: 100upx solid #d0d1fd;
  border-radius: 50%;
  padding: 180upx;
}
.welcome{
  position:relative;
  left: 50upx;
  top: -90upx;
  font-size: 46upx;
  color: #555;
  text-shadow: 1px 0px 1px rgba(0,0,0,.3);
}
.input-content{
  padding: 0 60upx;
}
.input-item{
  display:flex;
  flex-direction: column;
  align-items:flex-start;
  justify-content: center;
  padding: 0 30upx;
  background:$page-color-light;
  height: 120upx;
  border-radius: 4px;
  margin-bottom: 50upx;
  &:last-child{
    margin-bottom: 0;
  }
  .tit{
    height: 50upx;
    line-height: 56upx;
    font-size: $font-sm+2upx;
    color: $font-color-base;
  }
  input{
    height: 60upx;
    font-size: $font-base + 2upx;
    color: $font-color-dark;
    width: 100%;
  }
}

.confirm-btn{
  width: 630upx;
  height: 76upx;
  line-height: 76upx;
  border-radius: 50px;
  margin-top: 70upx;
  background: $uni-color-primary;
  color: #fff;
  font-size: $font-lg;
  &:after{
    border-radius: 100px;
  }
}
.forget-section{
  font-size: $font-sm+2upx;
  color: $font-color-spec;
  text-align: center;
  margin-top: 40upx;
}
.register-section{
  position:absolute;
  left: 0;
  bottom: 50upx;
  width: 100%;
  font-size: $font-sm+2upx;
  color: $font-color-base;
  text-align: center;
  text{
    color: $font-color-spec;
    margin-left: 10upx;
  }
}
.input-item-lg{
  .input{
    background: #f5f5f5;
    border-radius: 10px;
    height: 80upx;
    padding: 0 20upx;
    font-size: 28upx;
  }
}
.input-flex-bg{
  .input-left{
    width: 350upx;
    float: left;
  }
  .input-img{
    width: 230upx;
    height: 80upx;
    float: right;
  }
}
.input-ps-bx{
  position: relative;
  .send-sms{
    color: #01aaef;
    position: absolute;
    top:22upx;
    right: 35upx;
  }
}
</style>
