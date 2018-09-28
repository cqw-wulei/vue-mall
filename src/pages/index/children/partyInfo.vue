<template>
    <div class="page" v-title="'参与详情'">
        <section class="header">
            <p class="goods-name">{{actData.goodsTitle}}</p>
            <section class="party-p clear">
                <span class="party-num fl" v-for="key in peopleNum">
                    {{key}}
                </span>
            </section>
            <p class="party-p-title">项目参与人数</p>
        </section>
        <section class="party-info">
            <p class="party-title"></p>
            <ul class="party-p-info" v-if="tActInfo.length > 0">
                <li class="info-area" v-for="(item, index) in tActInfo" :key="index">
                    <section class="clear">
                        <p class="info-user fl">{{item.mobile}}刚刚参与项目，兑换码为{{item.redeemCode}}</p>
                        <p class="info-word fl"></p>
                        <p class="info-award fl"></p>
                    </section>
                </li>
            </ul>
            <ul class="party-p-info" v-else-if="tActInfo.length == 0">
                <section class="no-detail">
                    <img v-lazy="noDetailImg">
                    <p>暂无参与用户</p>
                </section>
            </ul>
        </section>
        <button class="join-btn" :class="[actData.status == 1 ? '' : 'no']" @click="payRb">立即参与</button>
        <alert-tip v-if="showAlert" @closeTip="showAlert = false" @sureTip="sureTip()" :alertText="alertText" :alertTitle="alertTitle"></alert-tip>
    </div>
</template>

<script>
  import noDetailImg from '../../../images/no_detail.png'
  import alertTip from '../../../components/common/alertTip'
  export default {
    name: 'partyInfo',
    data() {
      return {
        unit: this.GLOBAL.mallUnit,
        noDetailImg: noDetailImg,
        showAlert: false,
        alertText: null,
        alertTitle: '温馨提示',
        isJoin: true,
        firstJoin: true,
        actData: this.$store.state.nowActData,
        tActInfo: [],
        peopleNum: []
      }
    },
    created() {//强制执行
      let that = this
      that.$bridge.callhandler('API_NAVIGATION_JUMP', {'themeColor': '#ffffff','titleColor': 0,'isHomePage': 0}, function(response) {}
      )
    },
    mounted() {
      let that = this
      that.peopleNum = that.$store.state.nowActData.participateNum.toString().split('')
      that.$axios({
        url: '/api/lottery/getLotteryInfoByActivityCode',
        type: 'post',
        data: {
          logCode: that.actData.logCode
        },
        success: function (res) {
          if (res.data.code == '0000' && res.data.data) {
            for (let i = 0; i < res.data.data.length; i++) {
                that.tActInfo.push(res.data.data[i])
            }
            let heigh =  window.innerHeight - (document.getElementsByClassName('header')[0].getBoundingClientRect().height + document.getElementsByClassName('party-title')[0].getBoundingClientRect().height + document.getElementsByClassName('join-btn')[0].getBoundingClientRect().height)
            document.getElementsByClassName('party-p-info')[0].setAttribute('style','max-height: '+ heigh +'px')
          }
        }
      })
    },
    methods: {
      payRb: function () {
        if (this.actData.status == 1) {
          this.isJoin = true
          this.showAlert = true
          this.alertText = '确认消耗'+ this.actData.priceScore + this.unit + '参与竞购' + this.actData.goodsTitle
        }else if (this.actData.status == 0) {
          this.showAlert = true
          this.alertText = '非常抱歉！此活动已结束'
        }
      },
      sureTip: function() {
        var that = this;
        if (that.actData.status == 1) {//下单
          if (that.isJoin && that.firstJoin) {
            that.firstJoin = false;
            that.showAlert = false
            let _data = {
              activityCode: that.actData.code,
              logCode: that.actData.logCode,
              specid: that.actData.specid,
              quality: that.actData.winnersNum,
              remark: that.actData.remark,
              disid: '999',
              token: that.$store.state.token
            }
            that.$axios({
              url: '/api/order/activityOrder',
              type: 'post',
              data: _data,
              success: function (res) {
                if (res.data.code == '0000') {
                  if (res.data.data.flag) {
                    that.$store.commit('set_getUser',true)
                    that.payStatus = 1
                    that.$router.push({path: '/detail/act/to/status/'+that.payStatus, query: {
                        time: that.returnDate(res.data.data.resultData.orderTime),
                        num: that.actData.winnersNum,
                        goodsTitle: that.actData.goodsTitle,
                        redeemCode: res.data.data.resultData.redeemCode
                      }
                    })
                  }else {
                    that.showAlert = true
                    that.isJoin = false
                    that.firstJoin = true;
                    that.alertText = res.data.data.message
                  }
                }
              },
              fail: function () {
                that.showAlert = true
                that.isJoin = false
                that.firstJoin = true;
                that.alertText = '网络错误，请稍后再试'
              }
            })
          } else {
            that.showAlert = false
          }
        } else {
          that.showAlert = false
        }
      },
      closeTip(){
        that.firstJoin = true;
        this.$emit('closeTip')
      }
    },
    components: {
      alertTip
    }
  }
</script>

<style scoped>
    .header {
        width: 100%;
        height: 345px;
        background: url("../../../images/party_bg.png") 100% center no-repeat;
        background-size: 100% 100%;
        padding-top: 73px;
    }
    .goods-name {
        text-align: center;
        color: #ffffff;
        font-size: 38px; /*px*/
        line-height: 38px; /*px*/
        font-weight: bold;
    }
    .party-p {
        text-align: center;
        margin-top: 57px;
        margin-left: 50%;
        transform: translateX(-50%);
        display: inline-block;
    }
    .party-num {
        width: 46px;
        height: 62px;
        margin-right: 8px;
        font-size: 44px; /*px*/
        line-height: 62px;
        color: #ffffff;
        background: url("../../../images/num_bg.png") 100% center no-repeat;
        background-size: 100% 100%;
    }
    .party-num:last-child {
        margin-right: 0;
    }
    .party-p-title {
        margin-top: 16px;
        font-size: 24px; /*px*/
        line-height: 24px; /*px*/
        color: #EFEDED;
        text-align: center;
    }
    .party-info {
        margin: -94px auto 0;
        width: 601px;
        border-radius: 0.1rem;
        background-color: #ffffff;
        padding: 36px 45px;
    }
    .party-title {
        width: 370px;
        height: 72px;
        margin: 0 auto;
        background: url("../../../images/party_title.png") 100% center no-repeat;
        background-size: 100% 100%;
    }
    .party-p-info {
        padding: 8px 0 0;
        overflow-y: scroll;
        -webkit-overflow-scrolling : touch;
        overflow-scrolling: touch;
        margin-bottom: 45px;
    }
    .info-area {
        padding: 39px 0 37px;
        color: #333;
        font-size: 24px; /*px*/
        line-height: 24px; /*px*/
        border-bottom: 1px solid #E5E3E3; /*no*/
    }
    .info-area:last-child {
        border: 0 none;
    }
    .info-user {
        font-size: 26px; /*px*/
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        -ms-text-overflow: ellipsis;
        white-space: nowrap;
    }
    .info-word {
        color: #9D9D9D;
    }
    .info-word, .info-award {
        margin-left: 10px;
    }
    .no-detail {
        background: #ffffff;
        padding: 150px 0 20px;
    }
    .no-detail > img {
        width: 458px;
        height: 212px;
        margin: 0 auto;
        display: block;
    }
    .no-detail > p {
        color: #9D9D9D;
        font-size: 28px; /*px*/
        line-height: 28px; /*px*/
        padding-top: 30px;
        text-align: center;
    }
    .join-btn {
        background-color: #EA3F3F;
        color: #ffffff;
        width: 100%;
        height: 100px;
        line-height: 100px;
        font-size: 36px; /*px*/
        margin-top: 30px;
        position: fixed;
        bottom: 0;
        left: 0;
    }
    .join-btn.no {
        background-color: #9D9D9D;
    }
    @media
    screen and (-webkit-min-device-pixel-ratio: 2),
    screen and (-moz-min-device-pixel-ratio: 2),
    screen and (min-device-pixel-ratio: 2) {
        .party-title {
            background: url("../../../images/party_title@2x.png") 100% center no-repeat;
            background-size: 100% 100%;
        }
    }
    @media
    screen and (-webkit-min-device-pixel-ratio: 3),
    screen and (-moz-min-device-pixel-ratio: 3),
    screen and (min-device-pixel-ratio: 3) {
        .party-title {
            background: url("../../../images/party_title@3x.png") 100% center no-repeat;
            background-size: 100% 100%;
        }
    }
</style>
