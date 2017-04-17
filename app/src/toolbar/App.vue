<template>
  <div>
    <div class="toolbar">
      <button class="button item" @click="gotoPage('config')">设置</button>
      <button class="button item" @click="gotoPage('danmaku')">弹幕</button>
      <button class="button item" @click="gotoPage('history')">历史</button>
      <button class="button item" @click="quitApp">退出</button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      test: ''
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

  .toolbar
    position absolute
    left 0
    bottom 0
    width 100%
    display flex
    border-radius 5px
    overflow hidden
    .item
      flex 1
      color #fff
      background-color rgba(0,0,0,0.6)
    .item + .item
      margin-left 2px
    .online
      display inline-block
      padding 5px 8px 0 8px
      font-size 14px
      line-height 16px
      flex 3
      span
        float right
</style>
