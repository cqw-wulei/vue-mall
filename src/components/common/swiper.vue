<template>
    <div class="swiper-container">
        <div class="swiper-wrapper">
            <div v-for="key in imgSrc" class="swiper-slide">
                <img :class="[!isPost ? 'detail' : '']" :src="key" alt="banner">
            </div>
        </div>
        <div class="pagination" :class="[!isPost ? 'not-index' : '']"></div>
    </div>
</template>

<script>
  import Swiper from 'swiper';
  import 'swiper/dist/css/swiper.min.css';
  export default {
    name: 'swiper',
    data() {
      return {
        imgSrc:[],
        isLoop: false
      }
    },
    props: {
      imgUrl: {
        type: String,
        // 对象或数组默认值必须从一个工厂函数获取
        default: function () {
          return ''
        }
      },
      imgArr: {
        type: Array,
        default: function () {
          return []
        }
      },
      isPost: {
        type: Boolean,
        default: function () {
          return false
        }
      }
    },
    mounted(){
      var that = this
      if (!that.isPost) {
        that.imgSrc = that.imgArr
        that.initSwiper()
      } else {
        that.$axios({
          url: that.imgUrl,
          type: 'post',
          success: function (res) {
            if (res.data.code == '0000') {
              if (res.data.data.resultData.length > 0) {
                for (let i = 0; i < res.data.data.resultData.length; i++) {
                  that.imgSrc.push(res.data.data.resultData[i].imgurl)
                }
                that.initSwiper()
              }
            }
          }
        })
      }
    },
    methods: {
      initSwiper: function () {
        let that = this
        if (that.imgSrc.length > 1) {
          that.isLoop = true
        }
        setTimeout(function () {
          that.$nextTick(function() {
            that.mySwiper = new Swiper('.swiper-container', {
              pagination: '.pagination',
              loop: that.isLoop,
              autoplay: that.isPost ? 3000 : 2000,
              observer: true,//修改swiper自己或子元素时，自动初始化swiper
              observeParents: true//修改swiper的父元素时，自动初始化swiper
            })
          })
        },500)
      }
    }
  }
</script>

<style scoped>
.swiper-slide img {
    width: 100%;
    height: 390px;
    vertical-align: middle;
}
.swiper-slide img.detail {
    height: 500px;
}
.pagination {
    position: absolute;
    bottom: 64px !important;
    z-index: 10;
    text-align: center;
}
.pagination.not-index {
    bottom: 32px !important;
}
</style>
