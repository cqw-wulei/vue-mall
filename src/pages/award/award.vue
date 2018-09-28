<template>
    <div class="page" v-title="'参与记录'">
        <ul class="my-award" v-if="myAward.length > 0">
            <li v-for="(item, index) in myAward" class="my-award-li" @click="goAwardDetail(item.redeemCode)" :key="index">
                <section class="li-img">
                    <img v-lazy="item.imgs[0]">
                    <span class="act-status" :class="[item.actType == 1 ? 'type1' : 'type2']">{{item.actType == 1 ? '已达标' : item.status == 3 ? '进行中' : '未达标'}}</span>
                </section>
                <section class="goods-info">
                    <p class="goods-title">{{item.title}}</p>
                    <section class="clear">
                        <section class="num-time fl">
                            <p class="num-p">{{item.people}}<span>项目参与人数</span></p>
                            <p class="time-p">开奖时间：<span>{{item.awardTime}}</span></p>
                        </section>
                        <p class="award-status fr" v-if="item.actType == 1" :class="[item.winner == 0 ? item.status == 3 ? 'type1' : 'type4' : 'type2']"></p>
                        <p class="award-status type4 fr" v-else :class="[item.status == 3 ? 'type1' : 'type3']"></p>
                    </section>
                </section>
            </li>
        </ul>
        <section class="no-detail" v-else>
            <img v-lazy="noDetailImg">
            <p>暂无活动参与记录</p>
        </section>
    </div>
</template>

<script>
  import noDetailImg from '../../images/no_detail.png'
  import shop from '../../images/shop.png'
  export default {
    name: 'award',
    data() {
      return {
        shop: shop,
        noDetailImg: noDetailImg,
        myAward: [],
        sw: false,
        currentPage: 1,
        isFlag: false
      }
    },
    created() {//强制执行
      let that = this
      that.$bridge.callhandler('API_NAVIGATION_JUMP', {'themeColor': '#ffffff','titleColor': 0,'isHomePage': 0}, function(response) {}
      )
    },
    mounted() {
      let that = this
      that.currentPage = 1
      that.setData()//初始化数据
      // 注册scroll事件并监听
      window.addEventListener('scroll',that.scrollHandle);
      // window.getEventListeners(window.eventList)
    },
    methods: {
      goAwardDetail: function (id) {
        this.isFlag = true
        this.$router.push('/award/detail/'+id)
      },
      scrollHandle: function(){
        let that = this
        // 判断是否滚动到底部
        let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        if(scrollTop + window.innerHeight >= document.body.offsetHeight) {
          // console.log(sw);
          // 如果开关打开则加载数据
          if(that.sw == true){
            // 将开关关闭
            that.sw = false
            that.setData()
          }
        }
      },
      setData: function () {
        let that = this
        let _data = {
          pageSize: 10,
          currentPage: that.currentPage,
          redeemCode: null,
          token: that.$store.state.token
        }
        that.$axios({
          noUseLoading: true,
          url: '/api/lottery/v1/getLotteryByUser',
          type: 'post',
          data: _data,
          success: function (res) {
            if (res.data.code == '0000') {
              if (res.data.data && res.data.data.length > 0) {
                let _json;
                for (let i = 0; i < res.data.data.length; i++) {
                  _json = {
                    redeemCode: res.data.data[i].redeemCode,
                    imgs: res.data.data[i].imgs.split(','),
                    activityTitle: res.data.data[i].activityTitle,
                    title: res.data.data[i].title,
                    actType: res.data.data[i].activityEndStatus,
                    people: res.data.data[i].participateNum,
                    awardTime: that.returnDate(res.data.data[i].endTime),
                    winner: res.data.data[i].winner,
                    status: res.data.data[i].status
                  }
                  that.myAward.push(_json)
                }
              }
              if (res.data.data && res.data.data.length == 10) {
                that.currentPage++
                that.sw = true
              }
            }
          }
        })
      }
    },
    destroyed(){
      let that = this
      window.removeEventListener('scroll',that.scrollHandle);
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
    .no-detail {
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
    .my-award-li {
        background-color: #ffffff;
        margin-bottom: 20px;
    }
    .li-img {
        position: relative;
    }
    .li-img > img {
        width: 100%;
        height: 326px;
        vertical-align: middle;
    }
    .act-status {
        width: 102px;
        height: 38px;
        line-height: 38px;
        font-size: 24px;
        color: #ffffff;
        text-align: center;
        position: absolute;
        top: 20px;
        right: 0;
        border-top-left-radius: 50px; /*no*/
        border-bottom-left-radius: 50px; /*no*/
    }
    .act-status.type1 {
        background-color: #ED433B;
    }
    .act-status.type2 {
        background-color: #9D9D9D;
    }
    .goods-info {
        padding: 29px 18px 29px 28px;
    }
    .goods-title {
        color: #333;
        font-size: 32px; /*px*/
        line-height: 32px; /*px*/
        font-weight: bold;
        padding-bottom: 34px;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        -ms-text-overflow: ellipsis;
        white-space: nowrap;
    }
    .num-p {
        font-size: 46px; /*px*/
        color: #EE4742;
        line-height: 24px; /*px*/
    }
    .num-p > span {
        color: #FF716D;
        margin-left: 10px;
        font-size: 24px; /*px*/
    }
    .time-p {
        font-size: 26px; /*px*/
        color: #9D9D9D;
        padding-top: 16px;
        line-height: 26px; /*px*/
    }
    .time-p > span {
        margin-left: 10px;
    }
    .award-status {
        width: 132px;
        height: 64px;
    }
    .award-status.type1 {
        background: url("../../images/award_type1.png") 100% center no-repeat;
        background-size: 100% 100%;
    }
    .award-status.type2 {
        background: url("../../images/award_type2.png") 100% center no-repeat;
        background-size: 100% 100%;
    }
    .award-status.type3 {
        background: url("../../images/award_type3.png") 100% center no-repeat;
        background-size: 100% 100%;
    }
    .award-status.type4 {
        background: url("../../images/award_type4.png") 100% center no-repeat;
        background-size: 100% 100%;
    }
    @media
    screen and (-webkit-min-device-pixel-ratio: 2),
    screen and (-moz-min-device-pixel-ratio: 2),
    screen and (min-device-pixel-ratio: 2) {
        .award-status.type1 {
            background: url("../../images/award_type1@2x.png") 100% center no-repeat;
            background-size: 100% 100%;
        }
        .award-status.type2 {
            background: url("../../images/award_type2@2x.png") 100% center no-repeat;
            background-size: 100% 100%;
        }
        .award-status.type3 {
            background: url("../../images/award_type3@2x.png") 100% center no-repeat;
            background-size: 100% 100%;
        }
    }
    @media
    screen and (-webkit-min-device-pixel-ratio: 3),
    screen and (-moz-min-device-pixel-ratio: 3),
    screen and (min-device-pixel-ratio: 3) {
        .award-status.type1 {
            background: url("../../images/award_type1@3x.png") 100% center no-repeat;
            background-size: 100% 100%;
        }
        .award-status.type2 {
            background: url("../../images/award_type2@3x.png") 100% center no-repeat;
            background-size: 100% 100%;
        }
        .award-status.type3 {
            background: url("../../images/award_type3@3x.png") 100% center no-repeat;
            background-size: 100% 100%;
        }
    }
</style>
