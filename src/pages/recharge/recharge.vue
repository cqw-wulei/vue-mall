<template>
    <div class="page" v-title="'充值'">
        <section class="header">
            <p class="user-info">
                Hi，{{user.login}}
            </p>
        </section>
        <section class="head-box clear">
            <section class="fl brd">
                <p class="user-rb">{{user.balance}}</p>
                <p class="rb-tip" @click="goDetail">账户剩余{{unit}}数 ></p>
            </section>
            <section class="fr">
                <p class="user-rb">{{user.totalRecommendRuiCurrency}}</p>
                <p class="rb-tip" @click="goAward">奖励获得{{unit}}数 ></p>
            </section>
        </section>
        <section class="page-area">
            <p>充值金额</p>
            <ul class="pdd clear">
                <li v-for="(item, index) in rmbData" @click='changeRmb(index)' :key="index" class="recharge_box fl" :class="[chooseNumType == index ? 'on' : '']">
                    <section>
                        <p class="rb-num">{{item.goodName}}<span>{{unit}}</span></p>
                        <p class="rmb-num">售价：{{item.price}}元</p>
                    </section>
                </li>
            </ul>
        </section>
        <section class="page-area">
            <p>支付方式</p>
            <ul class="pay_type_ul">
                <li v-for="(item, index) in payType" @click='changePayType(index)' :key="index"  class="pay-type clear"  :class="[choosePayType == item.type ? 'on' : '']">
                    <img class="fl" v-lazy="item.img">
                    <p class="fl">{{item.title}}</p>
                </li>
            </ul>
        </section>
        <button class="bottom-btn" @click="toPay">确认支付</button>
        <alert-tip v-if="showAlert" @sureTip="sureTip()" :alertText="alertText" :alertTitle="alertTitle"></alert-tip>
    </div>
</template>

<script>
  import alertTip from '../../components/common/sureTip';
  export default {
    name: 'recharge',
    data() {
      return {
        unit: this.GLOBAL.mallUnit,
        rmbData: [],
        payType: this.GLOBAL.payType,
        user: {
          login: this.$store.state.phone,
          balance: this.$store.state.balance,
          totalRecommendRuiCurrency: this.$store.state.totalRecommendRuiCurrency
        },
        chooseNumType: 0,
        choosePayType: 0,
        payStatus: true,
        showAlert: false,
        alertText: null,
        alertTitle: '温馨提示'
      }
    },
    created() {//keepAlive时强制执行
      let that = this
      that.$bridge.callhandler('API_NAVIGATION_JUMP', {'themeColor': '#ED433B','titleColor': 1, 'navRightButton': {
          'btnType': 2,
          'btnImageUrl': 'http://7xt7r2.com2.z0.glb.qiniucdn.com/18-9-24/91996967.jpg',
          'btnHandler': 'API_SHARE'
        },'isHomePage': 0}, function(response) {}
      )
      that.$bridge.registerhandler('API_SHARE', (data, responseCallback) => {
        that.toShare()
      })
      that.login = that.$store.state.phone
      that.balance = that.$store.state.balance
      that.totalRecommendRuiCurrency = that.$store.state.totalRecommendRuiCurrency
    },
    mounted() {
      let that = this
      that.$axios({
        url: '/recharge/rechargeGoodList',
        type: 'post',
        success: function (res) {
          if (res.data.code == '0000') {
            for (let i = 0; i < res.data.data.length; i++) {
              that.rmbData.push(res.data.data[i])
            }
          }
        }
      })
    },
    methods: {
      changeRmb: function (index) {
        this.chooseNumType = index;
      },
      changePayType: function (index) {
        this.choosePayType = index;
      },
      goDetail: function() {//瑞币明细
        this.$router.push('/recharge/detail')
      },
      goAward: function() {//奖励明细
        this.$router.push('/recharge/request')
      },
      toPay: function () {//支付
        let that = this
        let _data = {
          token: that.$store.state.token,
          payType: that.choosePayType == 0 ? 2 : 1,
          specid: that.rmbData[that.chooseNumType].specid
        }
        if (that.payStatus) {
          that.payStatus = false
          that.$axios({
            url: '/recharge/ruiCurrency',
            type: 'post',
            data: _data,
            success: function (res) {
              if (res.data.code == '0000') {
                window.location.href = res.data.data.qrcodeUrl
              }else {
                that.payStatus = true
                that.showAlert = true
                that.alertText = res.data.msg
              }
            }
          })
        } else {
          that.showAlert = true
          that.alertText = '请勿重复点击'
        }
      },
      toShare: function() {
        let that = this
        let _data = {
          token: that.$store.state.token,
          type: 2
        }
        that.$axios({
          url: '/manage/shareAll',
          type: 'post',
          data: _data,
          success: function (res) {
            if (res.data.code == '0000') {
              that.$bridge.callhandler('API_CONTENT_SHARE', {'type': 0,'title': res.data.data.headline, 'desc': res.data.data.content,'shareUrl': res.data.data.pageUrl}, function(response) {})
            }
          }
        })
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

<style scoped>
    .header {
        height: 202px;
        background-color: #ED433B;
    }
    .user-info {
        padding-top: 46px;
        font-size: 36px; /*px*/
        font-weight: bold;
        color: #ffffff;
        text-align: center;
    }
    .head-box {
        width: 694px;
        padding: 28px 0;
        border-radius: 0.1rem;
        background-color: #ffffff;
        margin: -45px auto 0;
        z-index: 10;
        position: relative;
        box-shadow: 0px 9px 14px -2px #eee; /*no*/
    }
    .head-box > section {
        text-align: center;
        width: 50%;
        box-sizing: border-box;
    }
    .brd {
        border-right: 1px solid #D6D6D6; /*no*/
    }
    .user-rb {
        line-height: 52px; /*px*/
        font-size: 52px; /*px*/
        font-weight: bold;
        color: #EA3F3F;
    }
    .rb-tip {
        color: #9D9D9D;
        font-size: 26px; /*px*/
        padding-top: 20px;
    }
    .page-area {
        background-color: #ffffff;
        margin-top: 31px;
        margin-buttom: 31px;
        padding: 40px 0 0 29px;
        margin-left: 4px;
    }
    .page-area > p {
        color: #333;
        font-size: 30px; /*px*/
        line-height: 30px; /*px*/
        font-weight: bold;
    }
    .recharge_box {
        width: 202px;
        height: 150px;
        margin: 35px 25px 0 0;
        text-align: center;
        border-radius: 0.1rem;
        border: 2px solid #DBDADA; /*px*/
    }
    .rb-num {
        margin-top: 35px;
        font-size: 48px; /*px*/
        line-height: 26px; /*px*/
        color: #333;
    }
    .rb-num > span {
        font-size: 26px; /*px*/
        color: #9D9D9D;
        padding-left: 2px; /*no*/
    }
    .rmb-num {
        margin-top: 25px;
        font-size: 24px;
        color: #9D9D9D;
    }
    .recharge_box.on {
        border: 2px solid #EA3F3F;  /*px*/
    }
    .recharge_box.on .rb-num, .recharge_box.on .rb-num > span, .recharge_box.on .rmb-num {
        color: #EA3F3F;
    }
    .pay_type_ul {
        padding: 8px 0 160px 0;
    }
    .pay-type {
        width: calc(100% - 26px);
        height: 116px;
        background: url("../../images/no_choose_icon.png") 100% center no-repeat;
        background-size: 40px 40px;
    }
    .pay-type.on {
        background: url("../../images/choose_icon.png") 100% center no-repeat;
        background-size: 40px 40px;
    }
    .pay-type > img {
        width: 44px;
        height: 44px;
        margin-top: 36px;
        margin-left: 0px;
    }
    .pay-type > p {
        color: #333;
        font-size: 28px; /*px*/
        margin-left: 24px;
        line-height: 116px;
    }
    .pdd {
        padding-bottom: 40px;
    }
    .bottom-btn {
        color: #ffffff;
        width: 100%;
        height: 100px;
        line-height: 100px;
        font-size: 36px; /*px*/
        background-color: #EA3F3F;
        position: fixed;
        bottom: 0;
        left: 0;
    }
</style>
