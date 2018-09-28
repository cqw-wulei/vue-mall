<template>
    <div class="page" v-bind:style="{height:mHeight+'px'}">
        <section class="header" v-title="'参与记录详情'">
            <p class="title-p">邀请好友齐参与</p>
            <p class="act-title">{{actInfo.title}}</p>
            <p class="act-time">活动时间{{actInfo.startTime}}至{{actInfo.endTime}}</p>
            <p class="my-code">我的兑换码：{{actInfo.redeemCode}}</p>
        </section>
        <section class="award-status">
            <section class="award-opening" v-if="actInfo.status != 4">
                <img v-lazy="imgSrc.openingPic">
                <p>活动等待开奖中，请耐心等待...</p>
            </section>
            <section class="award-opened" v-else-if="actInfo.status == 4 && actInfo.activityEndStatus == 1">
                <section class="final-list list">
                    <img v-lazy="imgSrc.fourPic">
                    <p class="list-title">开奖号码</p>
                    <p class="final-list-code">{{remarks.fourth.redeemCode}}</p>
                    <p class="code-tips" v-if="actInfo.winner == 1">恭喜您，成为最终中奖用户<br>点击下方完善资料领取奖品，完善前需分享好友一次</p>
                </section>
                <section class="tree-list list">
                    <img v-lazy="imgSrc.treePic">
                    <p class="list-title">对剩余用户进行算法分析</p>
                    <ul>
                        <li class="list-li clear" v-for="(item, index) in remarks.third" :key="index">
                            <p class="list-li-time fl">{{item.time}}</p>
                            <p class="list-li-code fr">{{item.redeemCode}}</p>
                        </li>
                    </ul>
                </section>
                <section class="two-list list">
                    <img v-lazy="imgSrc.twoPic">
                    <p class="list-title">删除步骤一结果中前5名与后5名数据</p>
                    <ul>
                        <li class="list-li clear" v-for="(item, index) in remarks.second" :key="index">
                            <p class="list-li-time fl">{{item.time}}</p>
                            <p class="list-li-code fr">{{item.redeemCode}}</p>
                        </li>
                    </ul>
                </section>
                <section class="first-list list">
                    <img v-lazy="imgSrc.onePic">
                    <p class="list-title">随机选择60名用户下单时间</p>
                    <ul>
                        <li class="list-li clear" v-for="(item, index) in remarks.first" :key="index">
                            <p class="list-li-time fl">{{item.time}}</p>
                            <p class="list-li-code fr">{{item.redeemCode}}</p>
                        </li>
                    </ul>
                </section>
            </section>
            <section class="award-opening" v-else>
                <img v-lazy="imgSrc.failPic">
                <p class="fail_tips">活动未达标，已失效，您支付的{{unit}}已原路退回账户！</p>
            </section>
        </section>
        <section class="footer no mrgb">
            <p class="tips">*以上活动最终解释权归四川瑞升蓉网络科技有限公司所有</p>
            <button class="footer-btn" :class="[isFixed ? 'fixed' : '']" @click="shareGoBtn" v-if="actInfo.winner == 0">邀请好友立即参与</button>
            <button class="footer-btn" :class="[isFixed ? 'fixed' : '']" @click="shareGoBtn" v-else>邀请好友，完善领奖资料</button>
        </section>
    </div>
</template>

<script>
  import openingPic from '../../../images/opening_pic.png'
  import failPic from '../../../images/fail_icon.png'
  import fourPic from '../../../images/four_pic.png'
  import treePic from '../../../images/tree_pic.png'
  import twoPic from '../../../images/two_pic.png'
  import onePic from '../../../images/one_pic.png'
  export default {
    name: 'detail',
    data() {
      return {
        unit: this.GLOBAL.mallUnit,
        isFlag: false,
        isFixed: false,
        mHeight: 0,
        imgSrc: {
          openingPic: openingPic,
          failPic: failPic,
          fourPic: fourPic,
          treePic: treePic,
          twoPic: twoPic,
          onePic: onePic
        },
        actInfo: {
          activityCode: '',
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
        remarks: {}
      }
    },
    created() {//强制执行
      let that = this
      that.$bridge.callhandler('API_NAVIGATION_JUMP', {'themeColor': '#ffffff','titleColor': 0, 'navRightButton': {
          'btnType': 1,
          'btnTitle': '中奖规则',
          'btnHandler': 'API_OPENRULE'
        },'isHomePage': 0}, function(response) {}
      )
      that.$bridge.registerhandler('API_OPENRULE', (data, responseCallback) => {
        that.toRule()
      })
      that.mHeight = document.documentElement.clientHeight
    },
    mounted() {
      let that = this
      that.$bridge.registerhandler('API_GODETAIL', (data, responseCallback) => {
        that.shareAndGoBtn()
      })
      that.getDataOne()
    },
    methods: {
      toRule: function () {//中奖规则
        this.isFlag = true
        this.$router.push('/rule')
      },
      shareGoBtn: function () {//分享
        let that = this
        let _data = {
          token: that.$store.state.token,
          code: that.actInfo.logCode,
          type: that.actInfo.winner == 1 ? 3 : 4
        }
        that.$axios({
          url: '/manage/shareAll',
          type: 'post',
          data: _data,
          success: function (res) {
            if (res.data.code == '0000') {
              if (that.actInfo.winner == 1) {
                that.$bridge.callhandler('API_CONTENT_SHARE', {'type': 0,'title': res.data.data.headline, 'desc': res.data.data.content,'shareUrl': res.data.data.pageUrl, 'imgUrl': res.data.data.pictureUrl, 'showSkip': 1}, function(response) {})
              }else {
                that.$bridge.callhandler('API_CONTENT_SHARE', {'type': 0,'title': res.data.data.headline, 'desc': res.data.data.content,'shareUrl': res.data.data.pageUrl, 'imgUrl': res.data.data.pictureUrl}, function(response) {})
              }
            }
          }
        })
      },
      getDataOne: function() {
        let that = this
        let _data = {
          pageSize: 10,
          currentPage: 1,
          redeemCode: that.$route.params.id,
          token: that.$store.state.token
        }
        that.$axios({
          url: '/api/lottery/v1/getLotteryByUser',
          type: 'post',
          data: _data,
          success: function (res) {
            if (res.data.code == '0000') {
              if (res.data.data.length > 0) {
                that.actInfo = res.data.data[0]
                that.actInfo.startTime = that.returnDate(res.data.data[0].startTime)
                that.actInfo.endTime = that.returnDate(res.data.data[0].endTime)
              }
            }
            that.getDataTwo()
          }
        })
      },
      getDataTwo: function() {
        let that = this
        that.$axios({
          url: '/api/activity/queryActivityById',
          type: 'post',
          data: {
            logCode: that.actInfo.logCode
          },
          success: function (res) {
            if (res.data.code == '0000' && res.data.data.remarks != '') {
              that.remarks = JSON.parse(res.data.data.remarks)
              if (that.remarks.third) {
                for (let i = 0; i < that.remarks.third.length; i++) {
                  that.remarks.third[i]['time'] = that.returnDate(that.remarks.third[i].createdAt)
                }
              }
              if (that.remarks.second) {
                for (let i = 0; i < that.remarks.second.length; i++) {
                  that.remarks.second[i]['time'] = that.returnDate(that.remarks.second[i].createdAt)
                }
              }
              if (that.remarks.first) {
                for (let i = 0; i < that.remarks.first.length; i++) {
                  that.remarks.first[i]['time'] = that.returnDate(that.remarks.first[i].createdAt)
                }
              }
              that.isFixed = true
            }
          }
        })
      },
      shareAndGoBtn: function () {//领取
        let that = this
        that.isFlag = true
        window.sessionStorage.setItem('myAward','')
        window.sessionStorage.setItem('myAward',JSON.stringify(that.actInfo))
        that.$router.push('/award/delivery/'+that.$route.params.id)
      }
    },
    beforeRouteLeave (to, from, next) {
      if (this.isFlag) {//这是一个点击事件
        next(); //正常执行手机返回键
      } else {
        if (from.path !== '/award') { //要离开的路由
          next();//
        }
        //next(false);
        this.$router.push({path: '/award'})//指定返回的路由
      }
    }
  }
</script>
<style scoped>
    .page {
        background-color: #ffffff;
    }
    .header {
        width: 100%;
        height: 259px;
        padding-top: 59px;
        text-align: center;
        color: #F6F7F9;
        background: url("../../../images/award_detail_bg.png") 100% center no-repeat;
        background-size: 100% 100%;
    }
    .title-p {
        font-size: 42px; /*px*/
        line-height: 42px; /*px*/
        color: #ffffff;
        font-weight: bold;
    }
    .act-title {
        margin-top: 37px;
        font-size: 26px; /*px*/
        line-height: 26px; /*px*/
    }
    .act-time {
        margin-top: 14px;
        font-size: 22px; /*px*/
        line-height: 22px; /*px*/
    }
    .my-code, .award-opening > p {
        font-size: 24px; /*px*/
        line-height: 24px; /*px*/
    }
    .award-opening > p {
        line-height: 36px; /*px*/
    }
    .my-code {
        color: #ffffff;
        display: inline-block;
        padding: 10px 21px;
        background-color: #D2442E;
        margin-top: 29px;
        border-radius: 50px;
    }
    .award-status.opening {
        background-color: #ffffff;
    }
    .award-opening {
        padding: 168px 0 271px;
        background-color: #ffffff;
    }
    .award-opening > img {
        width: 212px;
        height: 186px;
        display: block;
        margin: 0 auto;
    }
    .award-opening > p {
        color: #9D9D9D;
        text-align: center;
    }
    .fail_tips {
        width: 406px;
        margin: 0 auto;
        text-align: justify;
    }
    .list {
        text-align: center;
        padding: 66px 68px 0;
    }
    .final-list {
        padding-bottom: 90px;
    }
    .final-list, .two-list {
        background-color: #ffffff;
    }
    .tree-list, .first-list {
        background: url("../../../images/center_flower.png") 100% center no-repeat;
        background-size: 100% 100%;
        padding-bottom: 50px;
    }
    .list > img {
        width: 369px;
        height: 72px;
        margin: 0 auto;
    }
    .list-title {
        color: #EE4742;
        padding: 26px 0 32px;
        text-align: center;
        font-size: 28px; /*px*/
        line-height: 28px; /*px*/
    }
    .final-list-code {
        font-size: 56px; /*px*/
        line-height: 56px; /*px*/
        color: #333;
        padding: 38px 0 0;
    }
    .code-tips {
        font-size: 26px; /*px*/
        line-height: normal;
        color: #9D9D9D;
        padding-top: 30px;
    }
    .code-tips.no {
        display: none;
    }
    .list > ul {
        padding: 0 30px;
    }
    .list-li {
        border-top: 1px solid #EEEDED; /*no*/
        padding: 39px 0;
    }
    .list-li-time {
        color: #333;
        font-size: 28px; /*px*/
        line-height: 28px; /*px*/
    }
    .list-li-code {
        color: #9D9D9D;
        font-size: 30px; /*px*/
        line-height: 30px; /*px*/
    }
    .footer {
        background-color: #ffffff;
        padding: 40px 54px;
    }
    .tips {
        color: #EE4742;
        font-size: 22px; /*px*/
        line-height: 22px; /*px*/
        text-align: center;
        padding-bottom: 41px;
    }
    .footer-btn {
        width: 100%;
        height: 80px;
        line-height: 80px;
        font-size: 28px; /*px*/
        color: #F6F7F9;
        text-align: center;
        border-radius: 50px;
        background-color: #EE4742;
    }
    .fixed {
        position: fixed;
        bottom: 20px;
        width: 80%;
        left: 10%;
    }
    .mrgb {
        padding-bottom: 120px;
    }
</style>
