<template>
    <div class="page" v-title="'领取结果'">
        <section class="head">
            <p class="tip">资料填写成功，奖品将在3个工作日内发放</p>
            <img v-lazy="successPic">
        </section>
        <ul class="goods">
            <li class="goods-li clear">
                <p class="li-title fl">奖品信息</p>
                <p class="li-content fr">{{goodsInfo.title}}</p>
            </li>
            <li class="goods-li clear">
                <p class="li-title fl">收件人</p>
                <p class="li-content fr">{{goodsInfo.realname}}</p>
            </li>
            <li class="goods-li clear">
                <p class="li-title fl">联系电话</p>
                <p class="li-content fr">{{goodsInfo.mobile}}</p>
            </li>
            <li class="goods-li clear">
                <p class="li-title fl">收货地址</p>
                <p class="li-content fr">{{goodsInfo.allAddress}}</p>
            </li>
        </ul>
        <button class="btn" @click="goIndex">确定</button>
    </div>
</template>

<script>
    import successPic from '../../../images/success.png'
  export default {
    name: 'sure',
    data() {
      return {
        isFlag: false,
        successPic: successPic,
        goodsInfo: this.$route.query
      }
    },
    created() {//强制执行
      let that = this
      that.$bridge.callhandler('API_NAVIGATION_JUMP', {'themeColor': '#ffffff','titleColor': 0,'isHomePage': 0}, function(response) {}
      )
    },
    methods: {
      goIndex: function () {
        this.$router.push('/index')
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
    .head {
        padding: 0 0 72px;
        background-color: #ffffff;
    }
    .tip {
        padding: 20px 30px;
        background-color: #FFF4F1;
        color: #EE4742;
        font-size: 26px; /*px*/
        line-height: 26px; /*px*/
    }
    .head > img {
        display: block;
        width: 190px;
        height: 134px;
        margin: 69px auto 72px;
    }
    .goods {
        padding: 0 30px 20px;
        background: url("../../../images/bottom_flower.png") 100% center no-repeat;
        background-size: 100% 100%;
    }
    .goods-li {
        border-top: 1px solid #EEEDED;
        padding: 36px 0;
        font-size: 30px; /*px*/
        line-height: 30px; /*px*/
    }
    .li-title {
        color: #333;
    }
    .li-content {
        color: #9D9D9D;
        width: 427px;
        text-align: right;
        line-height: normal;
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
</style>
