<template>
    <div class="alet_container">
        <section class="tip_text_container">
            <div class="tip_title">
                <span>{{ alertTitle }}</span>
            </div>
            <p class="tip_text">{{alertText}}</p>
            <div class="clear bottom_box">
                <div class="confrim surebtn fr" @click="sureTip">确认</div>
            </div>
        </section>
    </div>
</template>

<script>
  export default {
    data(){
      return{
        positionY: 0,
        timer: null,
      }
    },
    mounted(){

    },
    props: ['alertText','alertTitle'],
    methods: {
      sureTip(){
        this.$emit('sureTip')
      }
    }
  }
</script>

<style scoped>
    .alet_container{
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0,0,0,0.3);
        z-index: 90;
    }
    .tip_text_container{
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -275px;
        width: 550px;
        background-color: rgba(255,255,255,1);
        border: 1px; /*no*/
        padding-top: 26px;
        border-radius: 0.15rem;
        transform: translateY(-50%);
        color: #333;
        animation: .4s ease 0s normal none 1 running layui-m-anim-scale;
    }
    .tip_title{
        padding-bottom: 26px;
        border-radius: 50%;
        text-align: center;
    }
    .tip_title span{
        font-size: 36px; /*px*/
    }
    .tip_text{
        text-align: center;
        padding: 20px 30px 40px;
        font-size: 28px;
    }
    .bottom_box {
        padding: 16px 0;
        border-top: 1px solid #ddd; /*no*/
    }
    .confrim{
        font-weight: bold;
        padding: 16px 0;
        width: 100%;
        font-size: 28px;
        text-align: center;
        border: 1px; /*no*/
        border-bottom-left-radius: 15px;
        border-bottom-right-radius: 15px;
    }
    .surebtn {
        color: #EA3F3F;
    }
    @keyframes layui-m-anim-scale {
        0% {
            opacity: 0;
            -webkit-transform: scale(.5);
            transform: scale(.5) translateY(-50%);

        }
        100% {
            opacity: 1;
            -webkit-transform: scale(1);
            transform: scale(1) translateY(-50%);
        }
    }
</style>

