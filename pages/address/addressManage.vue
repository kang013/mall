<template>
	<view class="content">
		<view class="row b-b">
			<text class="tit">联系人</text>
			<input class="input" type="text" v-model="addressData.contact_name" placeholder="收货人姓名" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">手机号</text>
			<input class="input" type="number" v-model="addressData.contact_phone" placeholder="收货人手机号码" placeholder-class="placeholder" />
		</view>
    <view class="row b-b" @click="openPicker">
      <text class="tit">地址</text>
      <text  class="input">
        {{lotusAddressData.provinceName}}{{lotusAddressData.cityName}}{{lotusAddressData.townName}}
      </text>
    </view>
		<view class="row b-b"> 
			<text class="tit">门牌号</text>
			<input class="input" type="text" v-model="addressData.address" placeholder="楼号、门牌" placeholder-class="placeholder" />
		</view>
		
		<view class="row default-row">
			<text class="tit">设为默认</text>
			<switch :checked="addressData.default1" color="#fa436a" @change="switchChange" />
		</view>
		<button class="add-btn" @click="confirm">提交</button>
    <lotus-address v-on:choseVal="choseValue" :lotusAddressData="lotusAddressData"></lotus-address>
	</view>

</template>

<script>
	import lotusAddress from '@/components/Winglau14-lotusAddress/Winglau14-lotusAddress.vue'
  import { addAddress,editAddress } from '@/api/address'
	export default {
    components:{
      "lotus-address":lotusAddress
    },
		data() {
			return {
				addressData: {
          contact_name: '',
          contact_phone: '',
          address: '',
          default1: false
				},
        lotusAddressData:{
          visible:false,
          provinceName:'',
          cityName:'',
          townName:'',
        },
        region:'',
        id:''
			}
		},
		onLoad(option){
			let title = '新增收货地址';
			if(option.type==='edit'){
				title = '编辑收货地址'
				this.addressData = JSON.parse(option.data)
        console.log(this.addressData)
        this.id = this.addressData.id
        this.lotusAddressData.provinceName = this.addressData.province;
        this.lotusAddressData.cityName = this.addressData.city;
        this.lotusAddressData.townName = this.addressData.district;

			}
			this.manageType = option.type;
			uni.setNavigationBarTitle({
				title
			})
		},
		methods: {
      //打开picker
      openPicker() {
        this.lotusAddressData.visible = true;

      },
      //回传已选的省市区的值
      choseValue(res){
        //res数据源包括已选省市区与省市区code

        this.lotusAddressData.visible = res.visible;//visible为显示与关闭组件标识true显示false隐藏
        //res.isChose = 1省市区已选 res.isChose = 0;未选
        if(res.isChose){
          this.lotusAddressData.provinceName = res.province;//省
          this.lotusAddressData.cityName = res.city;//市
          this.lotusAddressData.townName = res.town;//区
          this.region = `${res.province} ${res.city} ${res.town}`; //region为已选的省市区的值
          console.log(this.region);
        }
      },



			switchChange(e){
				this.addressData.default1 = e.detail.value;
			},
			
			//提交
			async confirm(){
				let data = this.addressData;
				if(!data.contact_name){
					this.$api.msg('请填写收货人姓名');
					return;
				}
				if(!/(^1[3|4|5|7|8][0-9]{9}$)/.test(data.contact_phone)){
					this.$api.msg('请输入正确的手机号码');
					return;
				}
				if(!this.lotusAddressData.provinceName || !this.lotusAddressData.cityName || !this.lotusAddressData.townName){
					this.$api.msg('请在选择所地址');
					return;
				}
				if(!data.address){
					this.$api.msg('请填写门牌号信息');
					return;
				}

        let _data = {
          province:this.lotusAddressData.provinceName,
          city:this.lotusAddressData.cityName,
          district:this.lotusAddressData.townName,
          address:data.address,
          contact_name:data.contact_name,
          contact_phone:data.contact_phone,
          default: this.addressData.default1
        }

        if(this.manageType == 'edit'){
          await editAddress(this.id,_data)
        }else{
          await addAddress(_data)
        }

				
				//this.$api.prePage()获取上一页实例，可直接调用上页所有数据和方法，在App.vue定义
				//this.$api.prePage().refreshList(data, this.manageType);
				this.$api.msg(`地址${this.manageType=='edit' ? '修改': '添加'}成功`);
				setTimeout(()=>{
					uni.navigateBack()
				}, 800)
			},
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
</style>
