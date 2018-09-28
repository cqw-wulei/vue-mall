<template>
    <div class="rule">
        <section class="rule-info">
            <p>1、关于详细的活动规则，请切换菜单并认证阅读活动说明；</p>
            <p>2、中奖名单选取规则<span class="award-rule" @click="goAwardRule">点击查看</span></p>
            <p class="rule-tips">本次活动奖品{{item.name}}，市场价<span>{{item.price}}元！</span></p>
        </section>
    </div>
</template>

<script>
  export default {
    name: 'rule1',
    props: ['actInfo'],
    data() {
      return {
        item: {
          name: '',
          price: ''
        },
        notShareOpen: true
      }
    },
    mounted() {
      if (this.$route.params.isShare == 1) {
        this.notShareOpen = false
      }
      this.item.name = this.actInfo.goodsTitle
      this.item.price = this.actInfo.priceCash
    },
    methods: {
      goAwardRule: function () {//中奖规则
        if (!this.notShareOpen) {//跳转注册页
          window.location.href = decodeURI(decodeURI(this.$route.params.shareUrl))
          return false
        }
        this.$router.push('/rule')
      }
    }
  }
</script>

<style src="@/style/rule.css" scoped>

</style>
