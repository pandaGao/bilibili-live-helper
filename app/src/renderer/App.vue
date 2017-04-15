<template>
  <div id="#app">
    <config v-if="currentPage == 'config'" ref="config"></config>
    <danmaku v-if="currentPage == 'danmaku'" ref="danmaku"></danmaku>
  </div>
</template>

<script>
  import Config from './components/ConfigPage'
  import Danmaku from './components/DanmakuPage'

  export default {
    components: {
      Config,
      Danmaku
    },
    data () {
      return {
        currentPage: 'config',
        config: {
          roomId: ''
        }
      }
    },
    mounted () {
      this.$electron.ipcRenderer.on('changePage', (evt, page) => {
        this.currentPage = page
      })
    }
  }
</script>

<style lang="stylus">

*
  margin 0
  padding 0
  box-sizing border-box

html, body
  height 100%
  background-color rgba(0,0,0,0)
  border-radius 0
  overflow hidden
  font-family -apple-system,SF UI Text,Arial,PingFang SC,Hiragino Sans GB,Microsoft YaHei,WenQuanYi Micro Hei,sans-serif
#app
  width 100%
  height 100%
  overflow hidden

.button
  display inline-block
  padding 4px 0
  border 0
  text-align center
  vertical-align middle
  user-select none
  white-space nowrap
  outline 0
  font-size 14px
</style>
