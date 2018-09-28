<template>
    <div class="rule">
        <section class="rule-info">
            <p>1、项目持续时间为{{item.startTime}}至{{item.endTime}}</p>
            <p>2、参与项目成功，用户会获得唯一识别兑换码，凭兑换码在参与记录中查看进展</p>
            <p>3、用户中奖成功后，易见金服官方平台将在三个工作日内联系用户发放奖品</p>
        </section>
    </div>
</template>

<script>
  export default {
    name: 'rule3',
    props: ['actInfo'],
    data() {
      return {
        item: {
          startTime: '',
          endTime: ''
        }
      }
    },
    mounted() {
      this.item.startTime = this.actInfo.startTime
      this.item.endTime = this.actInfo.endTime
    }
  }
</script>

<style src="@/style/rule.css" scoped>

</style>
