<template>
    <div class="page" v-title="'瑞购商城'">
        <swiper :imgUrl="imgUrl" :isPost="isPost"></swiper>
        <section class="head-box">
            <section class="clear pdbox">
                <p class="user-info fl"> <span class="bold"> 我的账户：</span><span class="rb-num">{{balance}}</span>{{unit}}</p>
                <button class="btn-cz fr" v-on:click="goCz"></button>
            </section>
        </section>
        <tabCom :actData="actData" :hasEnd="hasEnd" @showAct="_showAct" @goActDetail="_goActDetail"></tabCom>
        <div class="act-footer clear">
            <section class="fl area-lf" @click="goMydb">
                <p class="footer-box-title">参与记录</p>
                <p class="footer-box-tip">点击查看参与<br>项目的进度</p>
                <img class="footer-box-img" v-lazy="footerIcon.footer_img1">
            </section>
            <div class="fr">
                <section class="area-lr clear" @click="goAward">
                    <section class="fl_box fl">
                        <p class="footer-box-title">邀1人奖10{{unit}}</p>
                        <p class="footer-box-tip">邀请即获{{unit}}</p>
                    </section>
                    <img class="footer-box-img fr" v-lazy="footerIcon.footer_img2">
                </section>
                <section class="area-lr clear" @click="goReward">
                    <section class="fl_box fl">
                        <p class="footer-box-title">积分商城</p>
                        <p class="footer-box-tip">积分好享兑多种优惠类型</p>
                    </section>
                    <img class="footer-box-img fr" v-lazy="footerIcon.footer_img3">
                </section>
            </div>
        </div>
        <alert-tip v-if="showAlert" @closeTip="showAlert = false" @sureTip="sureTip()" :alertText="alertText" :alertTitle="alertTitle"></alert-tip>
    </div>
</template>

<script>
  import alertTip from '../../components/common/alertTip'
  export default {
    name: 'Index',
    data() {
      return {
        unit: this.GLOBAL.mallUnit,
        footerIcon: {
          footer_img1: this.GLOBAL.footer_img1,
          footer_img2: this.GLOBAL.footer_img2,
          footer_img3: this.GLOBAL.footer_img3
        },
        showAlert: false,
        alertText: null,
        alertTitle: null,
        imgUrl: '/api/activity/last',
        hasEnd: 0,
        actData: [],
        chooseData: {},
        balance: this.$store.state.balance,
        isPost: true,
        isFirstLogin: true
      }
    },
    created() {//keepAlive时强制执行隐式登录操作
      let that = this
      that.$bridge.registerhandler('API_INDEX', (data, responseCallback) => {})
      that.getUser()
      that.$bridge.callhandler('API_NAVIGATION_JUMP', {'themeColor': '#','isHomePage': 1,'titleColor': 1}, function(response) {})
    },
    mounted() {
      var that = this
      that.$axios({
        url: '/api/activity/queryActivityFiveRecords',
        type: 'post',
        success: function (res) {
          that.initAct(res)
        }
      })
      if (that.$store.state.getUser) {
        that.getUser()
        that.$store.commit('set_getUser',false)
      }
    },
    methods: {
        getUser() {
          let that = this
          that.$bridge.callhandler('API_USERTOKEN', {}, function(response) {
            that.userLogin(JSON.parse(response).token,JSON.parse(response).termCode)
          })
        },
        userLogin: function(token,tcode) {
          if (!this.isFirstLogin) {
            return false
          }
          this.isFirstLogin = false
          let that = this
          let _code = tcode - 0 + 100
          let _data = {
            acctype: _code,
            token: token
          }
          that.$axios({
            noUseLoading: true,
            url: '/user/loginAndRegister',
            type: 'post',
            data: _data,
            success: function (res) {
              if (res.data.code == '0000') {
                window.sessionStorage.setItem('phone',res.data.data.userInfo.mobile)
                that.$store.commit('set_phone',res.data.data.userInfo.mobile)
                window.sessionStorage.setItem('token',res.data.data.token)
                that.$store.commit('set_token',res.data.data.token)
                that.initUser()
              }
            }
          })
        },
        initUser: function() {
          let that = this
          let _data = {
            'token': that.$store.state.token
          }
          that.balance = 0
          that.$axios({
            noUseLoading: true,
            url: '/account/info',
            type: 'post',
            data: _data,
            success: function (res) {
              console.log(res)
              if (res.data.code == '0000') {
                window.sessionStorage.setItem('balance',res.data.data.ruiCurrencyBalance)
                window.sessionStorage.setItem('totalRecommendRuiCurrency',res.data.data.totalRecommendRuiCurrency)
                that.$store.commit('set_balance',res.data.data.ruiCurrencyBalance)
                that.$store.commit('set_totalRecommendRuiCurrency',res.data.data.totalRecommendRuiCurrency)
                that.balance = that.$store.state.balance
              }
            }
          })
        },
        initAct: function(res) {
          console.log(res)
          var that = this
          if (res.data.code == '0000') {
            if (res.data.data.length > 0) {
              for (let i = 0; i < res.data.data.length; i++) {
                let timeTest;
                if (that.returnMonth() != that.returnMonth(res.data.data[i].startTime)) {
                  timeTest = that.returnMonth(res.data.data[i].startTime) + '月' + new Date(res.data.data[i].startTime).getDate() + '日' + ' ' + that.returnHourMin(res.data.data[i].startTime)
                }else {
                  timeTest = new Date(res.data.data[i].startTime).getDate() + '日' + ' ' + that.returnHourMin(res.data.data[i].startTime)
                }
                let _json = {
                  timeTest: timeTest,
                  status: res.data.data[i].status == 2 ? 2 : res.data.data[i].status == 3 ? 1 : 0,
                  code: res.data.data[i].code,
                  title: res.data.data[i].title,
                  startTime: that.returnDate(res.data.data[i].startTime),
                  endTime: that.returnDate(res.data.data[i].endTime),
                  goodsList: []
                }
                for (let j = 0;j < res.data.data[i].list.length; j++) {
                  let _goodsJson = {
                    specid: res.data.data[i].list[j].specid,
                    icon: res.data.data[i].list[j].icon,
                    logCode: res.data.data[i].list[j].logCode,
                    imgs: res.data.data[i].list[j].imgs.split(','),
                    remark: res.data.data[i].list[j].remark,
                    ActivityEndStatus: res.data.data[i].list[j].activityEndStatus,
                    goodsid: res.data.data[i].list[j].goodsid,
                    goodsTitle: res.data.data[i].list[j].goodsTitle,
                    priceCash: res.data.data[i].list[j].priceCashs,
                    priceScore: res.data.data[i].list[j].priceScore,
                    winnersNum: res.data.data[i].list[j].winnersNum,
                    minParticipateNum: res.data.data[i].list[j].minParticipateNum,
                    themeDescription: res.data.data[i].list[j].themeDescription,
                    participateNum: res.data.data[i].list[j].participateNum,
                    health: Math.floor((res.data.data[i].list[j].participateNum/res.data.data[i].list[j].minParticipateNum)*100)
                  }
                  _json.goodsList.push(_goodsJson)
                }
                _json.actInfo = {
                  status: res.data.data[i].status == 2 ? '开始' : res.data.data[i].status == 3 ? '结束' : '',
                  time: res.data.data[i].status == 2 ? res.data.data[i].startTime : res.data.data[i].status == 3 ? res.data.data[i].endTime : ''
                }
                that.actData.push(_json)
              }
              if (that.actData[0].status == '0') {
                that.hasEnd = 1
              }else {
                that.hasEnd = 0
              }
            }
          }
        },
        _showAct: function(index) {//切换tab
          this.hasEnd = index
        },
        _goActDetail: function(index,cindex) {//活动详情页
          let that = this
          that.chooseData = {
            status: that.actData[index].status,
            code: that.actData[index].code,
            title: that.actData[index].title,
            startTime: that.actData[index].startTime,
            endTime: that.actData[index].endTime,
            actInfo: that.actData[index].actInfo,
            specid: that.actData[index].goodsList[cindex].specid,
            icon: that.actData[index].goodsList[cindex].icon,
            imgs: that.actData[index].goodsList[cindex].imgs,
            ActivityEndStatus: that.actData[index].goodsList[cindex].ActivityEndStatus,
            goodsid: that.actData[index].goodsList[cindex].goodsid,
            goodsTitle: that.actData[index].goodsList[cindex].goodsTitle,
            priceCash: that.actData[index].goodsList[cindex].priceCash,
            priceScore: that.actData[index].goodsList[cindex].priceScore,
            winnersNum: that.actData[index].goodsList[cindex].winnersNum,
            minParticipateNum: that.actData[index].goodsList[cindex].minParticipateNum,
            themeDescription: that.actData[index].goodsList[cindex].themeDescription,
            participateNum: that.actData[index].goodsList[cindex].participateNum,
            health: that.actData[index].goodsList[cindex].health,
            logCode: that.actData[index].goodsList[cindex].logCode
          }
          let localData = JSON.stringify(that.chooseData)
          window.sessionStorage.setItem('localData',localData)
          that.$store.commit('set_nowActData',{})
          that.$store.commit('set_nowActData',JSON.parse(localData))
          that.$router.push('/detail/'+that.actData[index].goodsList[cindex].logCode+'/0/0')
        },
        goCz: function() {//充值页
          this.$router.push('/recharge')
        },
        goMydb: function() {//参与记录
          this.$router.push('/award')
        },
        goAward: function() {//奖励明细
          this.$router.push('/recharge/request')
        },
        goReward: function() {//积分
          let that = this
          that.$bridge.callhandler('API_NAVIGATION_JUMP', {'jumpAddress': 'integralShopVC'}, function(response) {})
        },
        closeTip(){
          this.$emit('closeTip')
        },
        showBox: function () {
          this.showAlert = true;
          this.alertText = '确认消耗多少来购买吗';
          this.alertTitle = '温馨提示';
        }
    },
    components: {
      alertTip,
    }
  }
</script>

<style lang="scss" scoped>
    .head-box {
        width: 694px;
        padding: 40px 0 25px;
        border-radius: 0.1rem;
        background-color: #ffffff;
        margin: -45px auto 0;
        z-index: 10;
        position: relative;
        box-shadow: 0px 9px 14px -2px #eee; /*no*/
    }
    .pdbox {
        padding: 0 30px 0 20px;
    }
    .user-info {
        color: #333;
        font-size: 28px; /*px*/
    }
    .bold {
        font-weight: bold;
    }
    .rb-num {
        color: #E73935;
        font-size: 40px; /*px*/
        font-weight: bold;
        padding: 0 10px;
    }
    .btn-cz {
        width: 164px;
        height: 79px;
        margin-top: -6px;
        background: url("../../images/cz-btn.png") 100% center no-repeat;
        background-size: 100% 100%;
    }

    .act-footer {
        margin: 20px 0 20px;
        background-color: #ffffff;
        padding: 35px 29px;
    }
    .area-lf, .area-lr {
        border: 1px solid #E6E5E5; /*no*/
        width: 188px;
        height: 350px;
        border-radius: 0.1rem;
        text-align: center;
    }
    .area-lr {
        width: 474px;
        height: 160px;
        margin-bottom: 28px;
    }
    .footer-box-title {
        margin-top: 42px;
        font-size: 32px; /*px*/
        line-height: 32px; /*px*/
        color: #333;
    }
    .footer-box-tip {
        font-size: 22px; /*px*/
        line-height: 36px; /*px*/
        margin-top: 15px;
        color: #9D9D9D;
    }
    .footer-box-img {
        margin: 50px auto 0;
        width: 112px;
        height: 112px;
        display: block;
    }
    .fl_box {
        padding: 0 0 42px 32px;
        text-align: left;
    }
    .footer-box-img.fr {
        padding: 0 31px 24px 0;
        margin-top: 24px;
    }
    @media
    screen and (-webkit-min-device-pixel-ratio: 2),
    screen and (-moz-min-device-pixel-ratio: 2),
    screen and (min-device-pixel-ratio: 2) {
        .btn-cz {
            background: url("../../images/cz-btn@2x.png") 100% center no-repeat;
            background-size: 100% 100%;
        }
    }
    @media
    screen and (-webkit-min-device-pixel-ratio: 3),
    screen and (-moz-min-device-pixel-ratio: 3),
    screen and (min-device-pixel-ratio: 3) {
        .btn-cz {
            background: url("../../images/cz-btn@3x.png") 100% center no-repeat;
            background-size: 100% 100%;
        }
    }
</style>
