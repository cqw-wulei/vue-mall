<template>
    <div class="page"  v-title="'充值结果'">
        <section class="head-status">
            <p class="pay-status">
                {{payInfo[payData.status].title}}
            </p>
            <img class="pay-status-img" v-lazy="payInfo[payData.status].img">
        </section>
        <section class="pay-box">
            <ul class="pay-box-ul">
                <li class="pay-info clear">
                    <span class="pay-info-title fl">充值{{unit}}</span>
                    <span class="pay-info-c fr">{{payData.goodName}}</span>
                </li>
                <li class="pay-info clear">
                    <span class="pay-info-title fl">订单号</span>
                    <span class="pay-info-c fr">{{payData.payCode}}</span>
                </li>
                <li class="pay-info clear">
                    <span class="pay-info-title fl">支付金额</span>
                    <span class="pay-info-c fr">{{payData.price}}元</span>
                </li>
                <li class="pay-info clear" v-if="payData.status == 1">
                    <span class="pay-info-title fl">支付时间</span>
                    <span class="pay-info-c fr">{{payData.time}}</span>
                </li>
            </ul>
        </section>
        <button class="bottom-btn" @click="toIndex" :class="[tshow ? 'on' : '']">确定</button>
    </div>
</template>

<script>
  import sucImg from '../../../images/pay_suc.png'
  import failImg from  '../../../images/pay_fail.png'
  export default {
    name: 'comp',
    data() {
      return {
        unit: this.GLOBAL.mallUnit,
        tshow: false,
        payInfo: [
          {
            title: '充值失败！',
            img: failImg
          },{
            title: '充值成功！',
            img: sucImg
          }
        ],
        payData:{
          status: 0,
          price: 0,
          goodName: 0,
          time: '-',
          payCode: '-'
        }
      }
    },
    created() {//强制执行
      let that = this
      that.$bridge.callhandler('API_NAVIGATION_JUMP', {'themeColor': '#ffffff','titleColor': 0,'isHomePage': 0}, function(response) {})
    },
    mounted() {
      let that = this
      that.$axios({
        url: '/api/order/queryPayResult',
        type: 'post',
        data: {
          payid: that.$route.params.status
        },
        success: function (res) {
          if (res.data.code == '0000') {
            that.payData.status = res.data.data.success ? 1 : 0
            if (that.payData.status == 1) {
              let newBalance = that.$store.state.balance - 0 + res.data.data.ruiNum
              that.$store.commit('set_balance',newBalance)
              that.$store.commit('set_getUser',true)
            }
            that.payData.price = res.data.data.amount
            that.payData.goodName = res.data.data.ruiNum
            that.payData.payCode = res.data.data.orderid
            that.payData.time = res.data.data.payCreate ? that.returnDate(res.data.data.payCreate) : '-'
          }
          setTimeout(function () {
            that.tshow = true
          },250)
        }
      })
    },
    methods: {
      toIndex: function () {
        this.$router.push('/index')
      }
    }
  }
</script>

<style scoped>
    .head-status {
        padding: 79px 0 18px;
        text-align: center;
        background-color: #ffffff;
    }
    .pay-status {
        color: #333;
        font-size: 42px; /*px*/
        line-height: 42px; /*px*/
        padding-bottom: 37px;
    }
    .pay-status-img {
        width: 230px;
        height: 196px;
    }
    .pay-box {
        background: url("../../../images/flower_bg.png") 100% center no-repeat;
        background-size: 100% 100%;
    }
    .pay-box-ul {
        padding: 0 28px 20px;
    }
    .pay-info {
        font-size: 30px; /*px*/
        padding: 37px 0;
        border-top: 1px solid #EEEDED; /*no*/
    }
    .pay-info-title {
        color: #333;
        line-height: 30px; /*px*/
    }
    .pay-info-c {
        color: #9D9D9D;
        line-height: 30px; /*px*/
    }
    .bottom-btn {
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
        display: none;
    }
    .bottom-btn.on {
        display: block;
    }
</style>
