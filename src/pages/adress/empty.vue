<template>

</template>

<script>
  export default {
    name: 'empty',
    data() {
      return {
      }
    },
    created () {
      /*let mydpr = window.localStorage.getItem('mydpr')
      document.getElementsByTagName('html')[0].setAttribute('data-dpr',mydpr)
      if (mydpr == 3) {
        document.getElementsByTagName('meta')[6].content = 'initial-scale=0.3333333333333333, maximum-scale=0.3333333333333333, minimum-scale=0.3333333333333333, user-scalable=no'
      } else if (mydpr == 2) {
        document.getElementsByTagName('meta')[6].content = 'initial-scale=0.5, maximum-scale=0.5, minimum-scale=0.5, user-scalable=no'
      } else {
        document.getElementsByTagName('meta')[6].content = 'initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no'
      }*/
        /*if (window.localStorage.getItem('lastPage') == 1) {
          let lastPageId = window.localStorage.getItem('lastPageId')
          this.$router.push('/award/delivery/'+lastPageId)
        }else {
          this.$router.replace('/adress')
        }*/
    },
    beforeRouteEnter(to, from, next){
      next(vm => {
        let _url = from.path
        let lastPageId = window.sessionStorage.getItem('lastPageId')
        let _toUrl = '/award/delivery/'+lastPageId
        alert(lastPageId)
        alert(_url)
        /*if (_url == '/adress') {
          vm.$router.push('/award/delivery/'+lastPageId)
        }else if (_url == _toUrl) {
          vm.$router.push('/award/detail/'+lastPageId)
        }*/
      })
    }
  }
</script>

<style scoped>

</style>
