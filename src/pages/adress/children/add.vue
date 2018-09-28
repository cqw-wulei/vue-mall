<template>
    <div class="page" v-title="'添加地址'">
        <section class="form1">
            <section class="form-group1 clear">
                <p class="contro-title1 fl">收货人姓名：</p>
                <div class="ovh">
                    <input type="text" class="form-control1" name="" placeholder="请输入收货人姓名" v-model="userInfo.realname">
                </div>
            </section>
            <section class="form-group1 clear">
                <p class="contro-title1 fl">联系人电话：</p>
                <div class="ovh">
                    <input type="text" class="form-control1" name="" placeholder="请输入收货人电话" v-model="userInfo.mobile" maxlength="11">
                </div>
            </section>
            <section class="form-group1 clear">
                <p class="contro-title1 fl">所在省市区：</p>
                <div class="ovh" @click="choose">
                    <input id="showCityPicker" type="text" readonly name="" class="form-control1 fl select-c" placeholder="请选择收货省市区" v-model="allAddress">
                </div>
            </section>
            <section class="form-group1 clear">
                <p class="contro-title1 fl">详细地址：</p>
                <div class="ovh">
                    <input type="text" class="form-control1 fl" name="" placeholder="请输入收货人详细地址" v-model="userInfo.address">
                </div>
            </section>
            <section class="form-group1 clear" :class="[tshow ? '' : 'tshow']">
                <p class="contro-title1 fl">是否设为默认地址：</p>
                <div class="form-control2 fr" :class="[isFirst ? 'none' : '' ]" @click="changeType">
                    <button class="emulate-ios-button" :class="[userInfo.distype == 1 ? 'on' : '']"></button>
                </div>
            </section>
        </section>
        <section v-if="show">
            <div class="cover" v-on:click.self="choose"></div>
            <section class="divwrap">
                <distpicker type="mobile" @province="onChangeProvince" @city="onChangeCity" @area="onChangeArea"></distpicker>
            </section>
        </section>

        <button class="btn" @click="goAdress" :class="[tshow ? '' : 'tshow']">保存添加</button>
        <alert-tip v-if="showAlert" @sureTip="sureTip()" :alertText="alertText" :alertTitle="alertTitle"></alert-tip>
    </div>
</template>

<script>
  import alertTip from '../../../components/common/sureTip';
  export default {
    name: 'add',
    data() {
      return {
        show: false,
        userInfo: {
          token: this.$store.state.token,
          realname: '',
          mobile: '',
          address: '',
          province: '',
          city: '',
          district: '',
          adressData: '',
          distype: 1
        },
        province: '',
        city: '',
        area: '',
        tshow: false,
        adressData: [],
        isShow: false,
        isFirst: false,
        showAlert: false,
        alertText: null,
        alertTitle: '温馨提示'
      }
    },
    created() {//强制执行
      let that = this
      that.$bridge.callhandler('API_NAVIGATION_JUMP', {'themeColor': '#ffffff','titleColor': 0,'isHomePage': 0}, function(response) {})
      setTimeout(function () {
        that.tshow = true
      },250)
    },
    computed: {
      allAddress: function () {
       return this.province + this.city + this.area
      }
    },
    methods: {
      changeType: function () {
        if (this.userInfo.distype == 1) {
          this.userInfo.distype = 2
        } else {
          this.userInfo.distype = 1
        }
      },
      goAdress: function () {
        let that = this;
        var regPos = /^\d+$/;
        if (that.userInfo.realname == '') {
          this.showAlert = true
          this.alertText = '请输入收货人姓名'
        }else if (that.userInfo.mobile == '') {
          this.showAlert = true
          this.alertText = '请输入收货人电话'
        }else if (!regPos.test(that.userInfo.mobile)){
          this.showAlert = true
          this.alertText = '请输入正确的电话号码'
        }else if (that.userInfo.district == ''){
          this.showAlert = true
          this.alertText = '请选择省市区'
        }else if (that.userInfo.address == ''){
          this.showAlert = true
          this.alertText = '请输入详细收货地址'
        }else {
          that.$axios({
            url: '/user/disadd/add',
            type: 'post',
            data: that.userInfo,
            success: function (res) {
              if (res.data.code == '0000') {
                that.userInfo.adressData = that.province + that.city + that.area
                that.userInfo.disid = res.data.result
                that.userInfo.allAddress = that.userInfo.adressData + that.userInfo.adress
                window.sessionStorage.setItem('adress', JSON.stringify(that.userInfo))
                if (window.sessionStorage.getItem('lastPage') == 1) {
                  let lastPageId = window.sessionStorage.getItem('lastPageId')
                  that.$router.push('/award/delivery/'+lastPageId)
                }else {
                  that.$router.push('/adress')
                }
              }
            }
          })
        }
      },
      choose(){
        this.show = !this.show
      },
      onChangeProvince(a){
        this.userInfo.province = a.code
        this.province = a.value
      },
      onChangeCity(a){
        this.userInfo.city = a.code
        this.city = a.value
      },
      onChangeArea(a) {
        this.userInfo.district = a.code
        this.area = a.value
        this.show = false
      },
      sureTip(){
        this.showAlert = false
      }
    },
    components: {
      alertTip
    }
  }
</script>
<style src="../../../style/plugins/mui.picker.css"></style>
<style src="../../../style/plugins/mui.poppicker.css"></style>
<style scoped>
    #showCityPicker {
        overflow: hidden;
        text-overflow: ellipsis;
        -ms-text-overflow: ellipsis;
        white-space: nowrap;
    }
    .ovh {
        overflow: hidden;
    }
    .tshow {
        display: none;
    }
    .form1 {
        padding: 0 30px;
        font-size: 32px; /*px*/
        line-height: 32px; /*px*/
        color: #333;
        background-color: #ffffff;
    }
    .form-group1 {
        padding: 20px 0;
        border-bottom: 1px solid #EBEBEB; /*no*/
    }
    .form-group1:last-child {
        border: 0 none;
    }
    .contro-title1 {
        padding: 20px 0; /*px*/
    }
    .form-control1{
        touch-action: none;
        text-indent: 20px;
        width: 100%;
        font-size: 32px; /*px*/
        height: 72px; /*px*/
    }
    .select-c {
        background: url("../../../images/right_arr_icon.png") 98% center no-repeat;
        background-size: 21px 21px;
    }
    .form-control2 {
        padding: 20px 0;
        text-indent: 20px;
     }
    .none {
        display: none;
    }
    .emulate-ios-button {
        display: block;
        width: 110px;
        height: 50px;
        background: #ccc;
        border-radius: 5rem;
        cursor: pointer;
        position: relative;
        -webkit-transition: all .3s ease;
        transition: all .3s ease;
    }
    .emulate-ios-button:after {
        content: '';
        display: block;
        width: 40px;
        height: 40px;
        border-radius: 100%;
        background: #fff;
        box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
        position: absolute;
        left: 5px;
        top: 5px;
        -webkit-transform:translateZ(0);
        transform:translateZ(0);
        -webkit-transition: all .3s ease;
        transition: all .3s ease;
    }
    .emulate-ios-button:active:after {
        width: 110px;
    }
    .emulate-ios-button {
        background: #CFCECE;
        pointer-events: none;
    }
    .emulate-ios-button:after {
        background: #ffffff;
    }
    .emulate-ios-button.on {
        background: #EE4742;
    }
    .emulate-ios-button.on:after {
        background: #ffffff;
        left: 65px;
    }
    .emulate-ios-button.on:active:after {
        left: 45px;
    }
    .btn {
        color: #ffffff;
        width: 100%;
        height: 100px;
        line-height: 100px;
        font-size: 36px; /*px*/
        margin-top: 30px;
        position: fixed;
        bottom: 0;
        left: 0;
        background-color: #EA3F3F;
    }
    .cover {
        position: fixed;
        left: 0;
        bottom: 0;
        height: 100%;
        width: 100%;
        z-index: 9;
        background-color: rgba(0,0,0,0.6);
    }
    .divwrap{
        /*height: 600px;*/
        overflow-y: hidden;
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        z-index: 10;
        background-color: #ffffff;
    }
    .divwrap>>>.distpicker-address-wrapper{
        color: #999;
    }
    .divwrap>>>.address-header{
        width: 100%;
        background: #fff;
        color:#333;
    }
    .divwrap>>>.address-header ul li{
        flex-grow: 1;
        font-size: 32px; /*px*/
        text-align: center;
    }
    .divwrap>>>.address-header .active{
        color: #333;
        border-bottom: #e5e5e5 solid 8px /*no*/
    }
    .divwrap>>>.address-container .active{
        color: #000;
    }
</style>
