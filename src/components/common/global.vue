<template>

</template>

<script>
  import footer_img1 from '../../images/footer_img1.png'
  import footer_img2 from '../../images/footer_img2.png'
  import footer_img3 from '../../images/footer_img3.png'
  import weixin_icon from '../../images/wexin_icon.png'
  import zfb_icon from '../../images/zfb_icon.png'
  const mallUnit = '瑞豆';
  const payType = [
    {
      type: 0,
      title: '微信支付',
      img: weixin_icon
    },{
      type: 1,
      title: '支付宝支付',
      img: zfb_icon
    }
  ];
  export default {
    mallUnit,
    payType,
    footer_img1,
    footer_img2,
    footer_img3
  }
</script>

<style scoped>

</style>
