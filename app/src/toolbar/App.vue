<template>
  <div>
    <div class="toolbar">
      <button class="button item drag"><img class="icon" :src="dragIcon"></button>
      <button class="button item" @click="gotoPage('config')"><img class="icon" :src="configIcon"> 设置</button>
      <button class="button item" @click="gotoPage('danmaku')"><img class="icon" :src="danmakuIcon"> 弹幕</button>
      <button class="button item" @click="gotoPage('history')"><img class="icon" :src="historyIcon"> 历史</button>
      <button class="button item quit" @click="quitApp"><img class="icon" :src="quitIcon"></button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dragIcon: 'imgs/drag.svg',
      configIcon: 'imgs/config.svg',
      danmakuIcon: 'imgs/danmaku.svg',
      historyIcon: 'imgs/history.svg',
      quitIcon: 'imgs/quit.svg'
    }
  },
  methods: {
    gotoPage (page) {
      this.$electron.ipcRenderer.send('changePage', page)
    },
    quitApp () {
      this.$electron.ipcRenderer.send('quitApp')
    }
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
    line-height 18px

  .toolbar
    position absolute
    left 0
    bottom 0
    width 100%
    display flex
    border-radius 5px
    overflow hidden
    .icon
      margin-top -2px
      height 14px
      width 14px
      vertical-align middle
    .item
      flex 1
      color #fff
      background-color rgba(25,25,25,.8)
    .item + .item
      margin-left 1px
    .drag
      flex .5
      -webkit-app-region drag
    .quit
      flex .5
</style>
