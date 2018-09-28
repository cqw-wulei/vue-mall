<template>
    <div class="page" :v-title="' '">
        <swiper :imgArr="actData.imgs" :isPost="isPost"></swiper>
        <section class="goods">
            <p class="goods-name">{{actData.goodsTitle}}</p>
            <section class="goods-price clear">
                <p class="fl">市场价：<span>{{actData.priceCash}}</span>元</p>
                <p class="fl">需{{unit}}：<em>{{actData.priceScore}}</em></p>
                <p class="fl">商品数：<em>{{actData.winnersNum}}</em></p>
            </section>
            <section class="time-c" v-if="actData.status == '2' || actData.status == '1'">
                <timeCom :actInfo="actData.actInfo" @timeEndFn="timeEndFn()"></timeCom>
            </section>
            <p class="act-over" v-else>活动已结束</p>
            <section class="goods-status-btn clear">
                <p class="people-num fl">{{actData.participateNum}}<span>项目参与人次</span></p>
                <button class="fr goods-info-btn" @click="goActInfo" :class="[actData.status == 1 ? '' : 'no']">查看详情</button>
            </section>
        </section>
        <section class="my-rb-detail">
            <ul class="tab clear">
                <li v-for="(item, index) in tabData" @click="chooseTab('rule' + index, index)" :key="index" class="tab-li fl" :class="[chooseType == item.type ? 'on' : '']">
                    <section>
                        <span>{{item.name}}</span>
                    </section>
                </li>
            </ul>
            <transition name="transitionRouter" mode="out-in">
                <router-view :is="currentTab" :actInfo="actData" keep-alive></router-view>
            </transition>
        </section>
        <section class="goods-detail" v-html="actData.introduction">
        </section>
        <section class="footer clear">
            <button class="share-btn fl" @click="shareBtn">分享好友</button>
            <section class="join-btn fr" @click="payRb" :class="[actData.status == 1 ? '' : 'no']">
                <section>
                    <span class="left-num">{{actData.priceScore}}<span>{{unit}}</span></span><span class="right-word">立即参与</span>
                </section>
            </section>
        </section>
        <alert-tip v-if="showAlert" @closeTip="showAlert = false" @sureTip="sureTip()" :alertText="alertText" :alertTitle="alertTitle"></alert-tip>
    </div>
</template>

<script>
  import alertTip from '../../../components/common/alertTip'
  import shop from '../../../images/shop.png'
  import rule0 from '@/pages/index/children/children/rule1'
  import rule1 from '@/pages/index/children/children/rule2'
  import rule2 from '@/pages/index/children/children/rule3'
  export default {
    name: 'detail',
    data() {
      return {
        unit: this.GLOBAL.mallUnit,
        imgSrc: [shop],
        tabData: [{type: 0, name: '商品详情'}, {type: 1, name: '活动说明'}, {type: 2, name: '活动流程'}],
        chooseType: 0,
        currentTab: rule0,
        actData: this.$store.state.nowActData,
        isPost: false,
        isJoin: true,
        firstJoin: true,
        notShareOpen: true,
        showAlert: false,
        alertText: null,
        alertTitle: '温馨提示'
      }
    },
    created() {//强制执行
      let that = this
      that.$bridge.callhandler('API_NAVIGATION_JUMP', {'themeColor': '#', 'navBackButtonUrl': 'http://7xt7r2.com2.z0.glb.qiniucdn.com/18-9-17/22240569.jpg','isHomePage': 0}, function(response) {})
    },
    mounted() {
      let that = this
      document.title = ' '
      that.getAct()
    },
    methods: {
      getAct: function() {
        let that = this
        if (that.$route.params.isShare == 1) {
          that.notShareOpen = false
        }
        /*分享点击进入 获取活动详情*/
        that.$axios({
          url: '/api/activity/queryActivityById',
          type: 'post',
          data: {
            logCode: that.$route.params.logCode
          },
          success: function (res) {
            console.log(res)
            if (res.data.code == '0000') {
              let _json = {
                timeTest: new Date(res.data.data.startTime).getDate() + '日' + ' ' + that.returnHourMin(res.data.data.startTime),
                status: res.data.data.status == 2 ? 2 : res.data.data.status == 3 ? 1 : 0,
                specid: res.data.data.specid,
                icon: res.data.data.icon,
                imgs: res.data.data.imgs.split(','),
                remark: res.data.data.remark,
                ActivityEndStatus: res.data.data.ActivityEndStatus,
                code: res.data.data.code,
                introduction: res.data.data.introduction,
                goodsid: res.data.data.goodsid,
                logCode: that.$route.params.logCode,
                goodsTitle: res.data.data.goodsTitle,
                title: res.data.data.title,
                priceCash: res.data.data.priceCashs,
                priceScore: res.data.data.priceScore,
                winnersNum: res.data.data.winnersNum,
                minParticipateNum: res.data.data.minParticipateNum,
                themeDescription: res.data.data.themeDescription,
                participateNum: res.data.data.participateNum,
                startTime: that.returnDate(res.data.data.startTime),
                endTime: that.returnDate(res.data.data.endTime),
                health: Math.floor((res.data.data.participateNum/res.data.data.minParticipateNum)*100)
              }
              _json.actInfo = {
                status: res.data.data.status == 2 ? '开始' : res.data.data.status == 3 ? '结束' : '',
                time: res.data.data.status == 2 ? res.data.data.startTime : res.data.data.status == 3 ? res.data.data.endTime : ''
              }
              that.actData = _json
              let localData = JSON.stringify(_json)
              window.sessionStorage.setItem('localData',localData)
              that.$store.commit('set_nowActData',{})
              that.$store.commit('set_nowActData',that.actData)
            }
          }
        })
      },
      timeEndFn() {
        if (this.actData.status == 1) {
          this.actData.status = 0
        } else {
          this.actData.status = 1
          this.actData.actInfo.status = '结束'
          this.actData.actInfo.time = new Date(this.actData.endTime).getTime()
        }
      },
      chooseTab: function(ruleName, index) {
        this.chooseType = index
        this.currentTab = ruleName
      },
      goActInfo: function() { //参与详情
        let that = this
        if (!that.notShareOpen) {//跳转注册页
          window.location.href = decodeURI(decodeURI(that.$route.params.shareUrl))
          return false
        }
        if (that.actData.status == 2) {
          that.showAlert = true
          that.alertText = '活动未开始，无法查看参与详情'
          that.isJoin = false
        }else {
          that.$router.push('/act/to/partyInfo')
        }
      },
      shareBtn: function () { //分享
        let that = this
        if (!that.notShareOpen) {//跳转注册页
          window.location.href = decodeURI(decodeURI(that.$route.params.shareUrl))
          return false
        }
        let _data = {
          token: that.$store.state.token,
          code: that.$route.params.logCode,
          type: 5
        }
        that.$axios({
          url: '/manage/shareAll',
          type: 'post',
          data: _data,
          success: function (res) {
            if (res.data.code == '0000') {
              that.$bridge.callhandler('API_CONTENT_SHARE', {'type': 0,'title': res.data.data.headline, 'desc': res.data.data.content,'shareUrl': res.data.data.pageUrl, 'imgUrl': res.data.data.pictureUrl}, function(response) {})
            }
          }
        })
      },
      payRb: function () { //参与
        let that = this
        if (!that.notShareOpen) {//跳转注册页
          window.location.href = decodeURI(decodeURI(that.$route.params.shareUrl))
          return false
        }
        if (that.actData.status == 1) {
          that.isJoin = true
          that.showAlert = true
          that.alertText = '确认消耗'+ that.actData.priceScore + that.unit + '参与竞购' + that.actData.goodsTitle
        }else if (that.actData.status == 0) {
          that.showAlert = true
          that.alertText = '非常抱歉！此活动已结束'
        } else {
          that.showAlert = true
          that.alertText = '活动暂未开始，请开始后再参与'
        }
      },
      closeTip(){
        that.firstJoin = true;
        this.$emit('closeTip')
      },
      sureTip: function() {
        var that = this;
        if (that.actData.status == 1) {//下单
          if (that.isJoin && that.firstJoin) {
            that.showAlert = false
            that.firstJoin = false;
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
                }else {
                  that.showAlert = true
                  that.isJoin = false
                  that.firstJoin = true;
                  that.alertText = res.data.msg
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
      }
    },
    components: {
      rule0,
      rule1,
      rule2,
      alertTip
    }
  }
</script>

<style scoped>
    .goods {
        background-color: #ffffff;
        padding: 25px 29px 35px;
    }
    .goods-name {
        color: #333;
        font-weight: bold;
        font-size: 32px; /*px*/
        line-height: 48px; /*px*/
    }
    .goods-price {
        padding: 26px 0;
        line-height: 26px; /*px*/
        font-size: 26px; /*px*/
        color: #9D9D9D;
        border-bottom: 1px solid #EDECEC;
    }
    .goods-price > p {
        margin-left: 30px;
    }
    .goods-price > p > span {
        font-size: 38px; /*px*/
        vertical-align: bottom;
    }
    .goods-price > p > span, .goods-price > p > em {
        margin-left: 10px;
    }
    .goods-price > p:first-child {
        margin-left: 0;
    }
    .time-c {
        height: 55px;
        margin-top: 20px;
        position: relative;
        background: #ffffff;
    }
    .people-num {
        color: #EE4742;
        font-size: 42px; /*px*/
        font-weight: bold;
        padding: 15px 0 0;
    }
    .people-num span {
        font-size: 24px; /*px*/
        color: #FF716D;
        padding-left: 10px;
        font-weight: normal;
        vertical-align: middle;
    }
    .my-rb-detail {
        background: #ffffff;
        margin-top: 20px;
    }
    .goods-info-btn {
        color: #ffffff;
        background-color: #EE4742;
        padding: 18px 24px;
        font-size: 28px; /*px*/
        line-height: 28px; /*px*/
        border-radius: 50px; /*no*/
    }
    .goods-info-btn.no {
        background-color: #9D9D9D;
    }
    .goods-status-btn {
        margin-top: 25px;
    }
    .act-over {
        padding: 20px 0 0;
        font-size: 28px; /*px*/
        color: #9D9D9D;
        line-height: 28px; /*px*/
    }
    .tab {
        border-bottom: 1px solid #9D9D9D; /*no*/
    }
    .tab-li {
        width: 33.33%;
        padding: 20px 0 0;
        text-align: center;
        color: #9D9D9D;
        font-size: 30px; /*px*/
    }
    .tab-li section span {
        line-height: 30px; /*px*/
        padding: 0 4px 20px;
        display: inline-block;
    }
    .tab-li.on {
        color: #EA3F3F;
    }
    .tab-li.on > section span {
        border-bottom: 6px solid #EA3F3F;
    }
    .transitionRouter-enter-active {
        transition: all 0.4s;
    }
    .transitionRouter-enter {
        transform: translate(100%, 0);
    }
    .goods-detail img {
        width: 100%;
    }
    .footer {
        position: fixed;
        bottom: 0;
        left: 0;
        height: 110px;
        width: 100%;
        background-color: #ffffff;
    }
    .share-btn {
        width: 327px;
        margin-top: 40px;
        text-align: center;
        color: #9D9D9D;
        font-size: 34px; /*px*/
        line-height: 34px; /*px*/
    }
    .join-btn {
        background-color: #EA3F3F;
        color: #ffffff;
        height: 110px;
        width: calc( 100% - 327px );
    }
    .join-btn > section {
        margin-top: 27px;
    }
    .join-btn.on {
        background-color: #9D9D9D;
    }
    .left-num, .right-word {
        display: inline-block;
        width: 50%;
        text-align: center;
        font-size: 34px; /*px*/
        padding-top: 11px;
        line-height: 34px; /*px*/
    }
    .left-num {
        font-size: 40px;
        box-sizing: border-box;
        border-right: 1px solid #ffffff; /*no*/
    }
    .left-num > span {
        font-size: 24px;
        margin-left: 3px;
    }
    .join-btn.on .left-num {
        border-right: 1px solid #FD9590; /*no*/
    }
    .goods-detail {
        width: 94%;
        margin: 20px auto;
        padding: 20px 3% 130px;
        background-color: #ffffff;
    }
</style>
