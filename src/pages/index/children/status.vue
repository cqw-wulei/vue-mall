<template>
    <div class="page" v-title="'下单结果'">
        <section class="head-status">
            <p class="pay-status">
                {{payInfo[status].title}}
            </p>
            <img class="pay-status-img" v-lazy="payInfo[status].img">
        </section>
        <section class="pay-box">
            <ul class="pay-box-ul">
                <li class="pay-info clear">
                    <span class="pay-info-title fl">我的兑换码</span>
                    <span class="pay-info-c fr">{{goodsInfo.redeemCode}}</span>
                </li>
                <li class="pay-info clear">
                    <span class="pay-info-title fl">项目奖品</span>
                    <span class="pay-info-c fr">{{goodsInfo.goodsTitle}}</span>
                </li>
                <li class="pay-info clear">
                    <span class="pay-info-title fl">消耗{{unit}}</span>
                    <span class="pay-info-c fr">{{goodsInfo.num}}</span>
                </li>
                <li class="pay-info clear" v-if="status">
                    <span class="pay-info-title fl">下单时间</span>
                    <span class="pay-info-c fr">{{goodsInfo.time}}</span>
                </li>
                <li class="pay-info clear" v-if="status">
                    <span class="pay-info-title fl">支付时间</span>
                    <span class="pay-info-c fr">{{goodsInfo.time}}</span>
                </li>
            </ul>
        </section>
        <button class="newBtn" @click="toShowAward(goodsInfo.redeemCode)">前往查看开奖进程</button>
        <!--<button class="bottom-btn" @click="toShowAward(goodsInfo.redeemCode)">前往查看开奖进程 </button>-->
    </div>
</template>

<script>
  import sucImg from '../../../images/pay_suc.png'
  import failImg from  '../../../images/pay_fail.png'
  export default {
    name: 'status',
    data() {
      return {
        unit: this.GLOBAL.mallUnit,
        isFlag: false,
        status: this.$route.params.status,
        payInfo: [
          {
            title: '下单失败！',
            img: failImg
          },{
            title: '下单成功！',
            img: sucImg
          }
        ],
        goodsInfo: this.$route.query
      }
    },
    created() {//强制执行
      let that = this
      that.$bridge.callhandler('API_NAVIGATION_JUMP', {'themeColor': '#ffffff','titleColor': 0,'isHomePage': 0}, function(response) {}
      )
    },
    methods: {
      toShowAward: function (code) {
        this.isFlag = true
        this.$router.push('/award/detail/'+code)
      }
    },
    beforeRouteLeave (to, from, next) {
      if (this.isFlag) {//这是一个点击事件
        next(); //正常执行手机返回键
      } else {
        if (from.path !== '/index') { //要离开的路由
          next();//
        }
        //next(false);
        this.$router.push({path: '/index'})//指定返回的路由
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
        line-height: 40px; /*px*/
    }
    .pay-info-c {
        color: #9D9D9D;
        line-height: 40px; /*px*/
        max-width: 75%;
        text-align: justify;
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
    }
    .newBtn {
        display: block;
        margin: 30px auto 0;
        width: 400px;
        height: 70px;
        line-height: 70px;
        border: 1px solid #9D9D9D; /*no*/
        color: #9D9D9D;
        background-color: #F5F7F9;
        border-radius: 4px; /*no*/
        font-size: 28px; /*px*/
    }
</style>
