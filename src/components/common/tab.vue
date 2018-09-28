<template>
    <div class="page">
        <section class="swiper-container1">
            <ul class="swiper-wrapper tab">
                <li class="swiper-slide act-tab" :class="[index == hasEnd ? 'on' : '']" v-for="(key, index) in actData"  @click="showAct(index)" :key="index">
                    <p class="act-time">{{key.timeTest}}</p>
                    <p class="act-status">{{key.status == 0 ? '已结束' : key.status == 1 ? '抢购中' : '即将开始'}}</p>
                </li>
            </ul>
        </section>
        <div class="act-area" v-for="(key, index) in actData" :key="index" v-if="index == hasEnd">
            <timeCom :actInfo="key.actInfo" v-if="key.status == '2' || key.status == '1'" @timeEndFn="timeEndFn(index)"></timeCom>
            <div v-for="(item, cindex) in key.goodsList" :key="item.index"  @click="goActDetail(hasEnd,cindex)">
                <section class="act_img">
                    <img v-lazy="item.imgs[0]">
                    <div class="act-tip" v-if="key.status == '0'" :class="[item.ActivityEndStatus == 0 ? 'no' : '']">{{item.ActivityEndStatus == 0 ? '未达标' : '已达标'}}</div>
                </section>
                <section class="act-info">
                    <p class="act-title">{{item.goodsTitle}}</p>
                    <section class="act-info-center clear">
                        <p class="act-intro fl">{{item.themeDescription}}</p>
                        <div class="fr">
                            <div class="out-per fl">
                                <span class="now-per" v-bind:style="{width:item.health+'%'}"></span>
                            </div>
                            <p class="act-not-per fl" v-if="key.status == '2'">暂未开始</p>
                            <p class="act-now-per fl" v-else>已抢{{item.health}}%</p>
                        </div>
                    </section>
                    <section class="act-info-foot clear">
                        <p class="goods-price fl">¥<span>{{item.priceCash}}</span></p>
                        <div class="mr15 fr">
                            <span class="act-num fl" v-if="key.status == 0">{{item.priceScore}} <span>{{unit}}</span></span>
                            <div class="btn-cy fl" v-if="key.status == 1 || key.status == 2" :class="[key.status == 1 ? 'isLook' : '']">{{item.priceScore}} <span>{{unit}}</span> | <span class="btn-word">立即参与</span></div>
                            <div class="btn-cyxq isLook fl" v-else>查看详情</div>
                        </div>
                    </section>
                </section>
            </div>
        </div>
    </div>
</template>

<script>
  import Swiper from 'swiper';
  import 'swiper/dist/css/swiper.min.css';
  export default {
    name: 'tab',
    props: {
      actData:{
        type: Array,
        // 对象或数组默认值必须从一个工厂函数获取
        default: function () {
          return ['']
        }
      },
      hasEnd: {
        type: Number,
        default: function () {
          return 0
        }
      }
    },
    data() {
      return {
        unit: this.GLOBAL.mallUnit
      }
    },
    mounted() {
      setTimeout(function () {
        var swiper = new Swiper('.swiper-container1', {
          slidesPerView: 3,
          freeMode: true,
          spaceBetween: 0
        });
      },500)
    },
    methods: {
      timeEndFn(index) {
        if (this.actData[index].status == 1) {
          this.actData[index].status = 0
        } else {
          this.actData[index].status = 1
          this.actData[index].actInfo.status = '结束'
          this.actData[index].actInfo.time = new Date(this.actData[index].endTime).getTime()
        }
      },
      showAct(index){
        this.$emit('showAct',index)
      },
      goActDetail(index,cindex) {
        this.$emit('goActDetail',index,cindex)
      }
    }
  }
</script>

<style scoped>
    .page {
        overflow: hidden;
    }
    .tab {
        margin-top: 32px;
        background-color: #fff;
    }
    .act-area {
        position: relative;
    }
    .act-tab {
        width: 250px;
        padding: 19px 0;
        text-align: center;
        background-color: #ffffff;
    }
    .act-tab.on {
        background-color: #ED433B;
    }
    .act-time {
        color: #333;
        font-weight: bold;
        font-size: 32px; /*px*/
        line-height: 32px; /*px*/
    }
    .act-status {
        color: #7E7E7E;
        font-size: 24px; /*px*/
        line-height: 24px; /*px*/
        margin-top: 12px;
    }
    .on .act-time, .on .act-status {
        color: #ffffff;
    }
    .act_img {
        position: relative;
    }
    .act_img > img {
        width: 100%;
        height: 390px;
        display: block;
    }
    .act-tip {
        width: 102px;
        padding: 7px 0;
        line-height: 24px;
        font-size: 24px;
        color: #ffffff;
        text-align: center;
        position: absolute;
        top: 20px;
        right: 0;
        border-top-left-radius: 50px; /*no*/
        border-bottom-left-radius: 50px; /*no*/
        background-color: #ED433B;
    }
    .act-tip.no {
        background-color: #9D9D9D;
    }
    .act-info {
        background-color: #ffffff;
        padding: 29px 20px 40px;
    }
    .act-title {
        color: #333;
        font-size: 32px; /*px*/
        line-height: 32px; /*px*/
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        -ms-text-overflow: ellipsis;
        white-space: nowrap;
    }
    .act-info-center {
        padding: 19px 0 28px;
        font-size: 22px; /*px*/
        color: #9D9D9D;
    }
    .act-intro {
        width: 53%;
        overflow: hidden;
        text-overflow: ellipsis;
        -ms-text-overflow: ellipsis;
        white-space: nowrap;
    }
    .out-per {
        margin-top: 5px;
        width: 176px;
        height: 22px; /*px*/
        line-height: 18px;
        overflow: hidden;
        background-color: #EEEEEE;
        border-radius: 50px; /*no*/
    }
    .now-per {
        width: 0%;
        height: 100%;
        display: inline-block;
        background: url("../../images/per_bg.png") 100% center no-repeat;
        background-size: 100% 100%;
    }
    .act-now-per, .act-not-per {
        font-size: 20px; /*px*/
        margin-left: 10px;
    }
    .act-not-per {
        color: #9D9D9D;
    }
    .goods-price {
        color: #9D9D9D;
        font-size: 28px; /*px*/
        line-height: 60px;
        height: 60px;
        text-decoration: line-through;
    }
    .goods-price > span {
        font-size: 36px; /*px*/
        font-weight: bold;
    }
    .mr15 {
        margin-right: 15px;
    }
    .act-num {
        font-size: 34px; /*px*/
        color: #E73935;
        margin-right: 10px;
        line-height: 60px;
        height: 60px;
        font-weight: bold;
    }
    .act-num > span, .btn-cy > span, .btn-cyxq > span {
        font-size: 22px; /*px*/
        font-weight: normal;
    }
    .btn-cy {
        padding: 0 20px;
        color: #ffffff;
        height: 60px;
        line-height: 60px;
        font-size: 34px; /*px*/
        background: url("../../images/btnf_bg.png") 100% center no-repeat;
        background-size: 100% 100%;
    }
    .btn-cy > .btn-word {
        font-size: 26px; /*px*/
    }
    .btn-cy.isLook {
        background: url("../../images/btn_bg.png") 100% center no-repeat;
        background-size: 100% 100%;
    }
    .btn-cyxq.isLook {
        padding: 0 26px;
        color: #ffffff;
        height: 60px;
        line-height: 60px;
        font-size: 26px; /*px*/
        background: url("../../images/ckxq_bg@2x.png") 100% center no-repeat;
        background-size: 100% 100%;
    }
</style>
