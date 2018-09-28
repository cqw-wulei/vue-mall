<template>
    <div class="page" v-title="'领奖信息'">
        <section class="award clear">
            <img class="fl" v-lazy="actInfo.icon" :key="actInfo.icon">
            <section class="goods-info fl">
                <p class="goods-title">{{actInfo.title}}</p>
                <p class="get-status" v-if="actInfo.winnerStatus == 0">已中奖，待领取</p>
                <p class="get-status" v-else>已领取</p>
            </section>
        </section>
        <div v-if="actInfo.winnerStatus == 0">
            <section class="adress">
                <p class="adress-title">收货信息</p>
                <section class="no-adress" v-if="adressInfo.realname == ''">
                    <span>暂无收货人信息</span>
                    <button @click="goAdress">立即添加</button>
                </section>
                <section class="mr-adress" @click="changeAdress" v-else>
                    <p class="name" :class="[adressInfo.distype == 1 ? 'ismr' : '']">{{adressInfo.realname}}</p>
                    <p class="phone">{{adressInfo.mobile}}</p>
                    <p class="adress-info">{{adressInfo.allAddress}}</p>
                </section>
            </section>
            <button class="s-btn" @click="goConf" :class="[tshow ? '' : 'tshow']">确认领取</button>
        </div>
        <div v-else>
            <section class="adress">
                <p class="adress-title">温馨提示</p>
                <p class="tips">此奖品已被领取</p>
            </section>
            <button class="s-btn" @click="goIndex" :class="[tshow ? '' : 'tshow']">确认</button>
        </div>
        <alert-tip v-if="showAlert" @sureTip="sureTip()" :alertText="alertText" :alertTitle="alertTitle"></alert-tip>
    </div>
</template>

<script>
  import alertTip from '../../../components/common/sureTip';
  export default {
    name: 'delivery',
    data() {
      return {
        isFlag: false,
        adressInfo: {
          realname: '',
          mobile: '',
          allAddress: '',
          distype: '',
          disid: null
        },
        actInfo: {
          activityEndStatus: '',
          activityTitle: '',
          endTime: '',
          icon: '',
          minParticipateNum: '',
          participateNum: '',
          redeemCode: '',
          startTime: '',
          status: '',
          title: '',
          winner: '',
          winnerStatus: ''
        },
        tshow: false,
        showAlert: false,
        alertText: null,
        alertTitle: '温馨提示'
      }
    },
    beforeCreate() {
      let that = this
      that.Indicator.open({//打开loading
        text: 'loading...',
        spinnerType: 'fading-circle'
      });
    },
    created() {//强制执行
      let that = this
      that.$bridge.callhandler('API_NAVIGATION_JUMP', {'themeColor': '#ffffff','titleColor': 0, 'navRightButton': {
          'btnType': 1,
          'btnTitle': '地址管理',
          'btnHandler': 'API_ADDRESS'
        },'isHomePage': 0}, function(response) {}
      )
      that.$bridge.registerhandler('API_ADDRESS', (data, responseCallback) => {
        that.changeAdress()
      })
    },
    mounted() {
      let that = this
      let _json = JSON.parse(window.sessionStorage.getItem('myAward'))
      that.actInfo = _json
      if (that.actInfo.winnerStatus == 1) {
        that.$bridge.callhandler('API_NAVIGATION_JUMP', {'themeColor': '#ffffff','titleColor': 0,'isHomePage': 0}, function(response) {})
      }
      let _data = {
        token: that.$store.state.token
      }
      if (window.sessionStorage.getItem('adress')) {
        let _adress = JSON.parse(window.sessionStorage.getItem('adress'));
        that.adressInfo.realname = _adress.realname
        that.adressInfo.mobile = _adress.mobile
        that.adressInfo.allAddress = _adress.allAddress
        that.adressInfo.distype = _adress.distype
        that.adressInfo.disid = _adress.disid
        setTimeout(function () {
          that.tshow = true
          that.Indicator.close();//关闭loading
        },300)
      } else {
        that.$axios({
          noUseLoading: true,
          url: '/user/disadd/findDefault',
          type: 'post',
          data: _data,
          success: function (res) {
            setTimeout(function () {
              that.tshow = true
              that.Indicator.close();//关闭loading
            },300)
            if (res.data.code == '0000') {
              if (res.data.result) {
                that.adressInfo = res.data.result
                that.adressInfo.allAddress = res.data.result.address
              }
            }
          }
        })
      }
    },
    methods: {
      goAdress: function() { //添加地址
        this.isFlag = true
        window.sessionStorage.setItem('lastPageId',this.$route.params.id)
        window.sessionStorage.setItem('lastPage',1)
        this.$router.push('/adress/add')
      },
      goConf: function () { //确认领取
        this.isFlag = true
        let that = this
        if (that.adressInfo.disid == null) {
          that.showAlert = true
          that.alertText = '请完善收货地址'
        } else {
          let _data1 = {
            specid: that.actInfo.specid,
            redeemCode: that.actInfo.redeemCode,
            remark: '999',
            disid: 1,
            token: that.$store.state.token
          }
          that.$axios({//确认领取
            url: '/api/order/activityGoodsOrder',
            type: 'post',
            data: _data1,
            success: function (res) {
              if (res.data.code == '0000') {
                if (res.data.data.flag) {
                  let smobile = that.adressInfo.mobile
                  smobile.split('').splice(4,7,'*').join('')
                  that.$router.push({path: '/award/sure', query: {
                      realname: that.adressInfo.realname,
                      mobile: smobile,
                      allAddress: that.adressInfo.allAddress,
                      title: that.actInfo.title
                    }
                  })
                }else {
                  that.showAlert = true
                  that.alertText = res.data.data.message
                }
              }
            }
          })

        }
      },
      goIndex: function() { //首页
        this.isFlag = true
        this.$router.push('/index')
      },
      changeAdress: function () { //选择地址
        this.isFlag = true
        if (this.$route.params.id) {
          window.sessionStorage.setItem('lastPage',0)
          window.sessionStorage.setItem('lastPageId',this.$route.params.id)
        }
        this.$router.push('/adress')
      },
      sureTip(){
        this.showAlert = false
      }
    },
    components: {
      alertTip
    },
    destroyed() {
      window.sessionStorage.removeItem('adress')
    },
    beforeRouteLeave (to, from, next) {
      let lastPageId = window.sessionStorage.getItem('lastPageId')
      if (this.isFlag) {//这是一个点击事件
        next(); //正常执行手机返回键
      } else {
        if (from.path !== '/award/detail/'+lastPageId) { //要离开的路由
          next();//
        }
        //next(false);
        this.$router.push({path: '/award/detail/'+lastPageId})//指定返回的路由
      }
    }
  }
</script>

<style scoped>
    .tshow {
        display: none;
    }
    .tips {
        padding: 20px 0;
        color: #333333;
        font-size: 28px; /*px*/
    }
    .award {
        padding: 29px 20px 57px;
        background-color: #ffffff;
    }
    .award > img {
        display: inline-block;
        width: 210px;
        height: 210px;
    }
    .goods-info {
        width: calc( 100% - 243px);
        padding-left: 33px;
    }
    .goods-title {
        padding-top: 6px;
        font-weight: bold;
        font-size: 32px; /*px*/
        line-height: 48px; /*px*/
        color: #333;
    }
    .get-status {
        color: #9D9C9C;
        font-size: 28px; /*px*/
        line-height: 28px; /*px*/
        padding-top: 29px;
    }
    .adress {
        margin-top: 14px;
        background-color: #ffffff;
        padding: 29px;
    }
    .adress-title {
        font-size: 28px; /*px*/
        line-height: 28px; /*px*/
        color: #9D9D9D;
    }
    .no-adress {
        padding: 97px 0 108px;
        text-align: center;
        color: #333;
        font-size: 30px;
        font-weight: bold;
    }
    .no-adress > button {
        color: #EE4742;
        text-decoration: underline;
    }
    .mr-adress {
        color: #333;
        font-weight: bold;
        padding: 59px 0 31px;
        font-size: 32px; /*px*/
        line-height: 32px; /*px*/
    }
    .name {
        padding-bottom: 46px;

    }
    .name.ismr {
        background: url("../../../images/mr_adr.png") 100% top no-repeat;
        background-size: 114px 42px;
    }
    .phone {
        padding-bottom: 18px;
        background: url("../../../images/right_arr_icon.png") 100% top no-repeat;
        background-size: 21px 21px;
    }
    .adress-info {
        font-weight: normal;
        color: #9D9D9D;
        font-size: 28px; /*px*/
    }
    .s-btn {
        color: #ffffff;
        width: 100%;
        height: 100px;
        line-height: 100px;
        font-size: 36px; /*px*/
        position: fixed;
        bottom: 0;
        left: 0;
        background-color: #EA3F3F;
    }

    @media
    screen and (-webkit-min-device-pixel-ratio: 2),
    screen and (-moz-min-device-pixel-ratio: 2),
    screen and (min-device-pixel-ratio: 2) {
        .name.ismr {
            background: url("../../../images/mr_adr@2x.png") 100% top no-repeat;
            background-size: 114px 42px;
        }
    }
    @media
    screen and (-webkit-min-device-pixel-ratio: 3),
    screen and (-moz-min-device-pixel-ratio: 3),
    screen and (min-device-pixel-ratio: 3) {
        .name.ismr {
            background: url("../../../images/mr_adr@3x.png") 100% top no-repeat;
            background-size: 114px 42px;
        }
    }
</style>
