<template>
  <div>
    <div class="send-message-box">
      <input type="text" class="send-message-input"
        :placeholder="messageBoxPlaceholder"
        v-model="messageContent"
        @keyup.enter="sendMessage">
      <img :src="enterIcon" class="icon">
    </div>
    <div class="toolbar">
      <button class="button item drag"><img class="icon" :src="dragIcon"></button>
      <button class="button item" @click="gotoPage('/config')"><img class="icon" :src="configIcon"> 设置</button>
      <button class="button item" @click="gotoPage('/history')"><img class="icon" :src="historyIcon"> 历史</button>
      <button class="button item" @click="gotoPage('/music')"><img class="icon" :src="musicIcon"> 点歌</button>
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
      musicIcon: 'imgs/music.svg',
      quitIcon: 'imgs/quit.svg',
      enterIcon: 'imgs/enter.svg',
      messageContent: '',
      messageBoxPlaceholder: '请输入弹幕内容 按回车发送'
    }
  },
  methods: {
    sendMessage () {
      this.$electron.ipcRenderer.send('sendMessage', this.messageContent)
      this.messageContent = ''
    },
    gotoPage (url) {
      this.$electron.ipcRenderer.send('changePage', url)
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
    font-family "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif
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

  .send-message-box
    position absolute
    top 1px
    padding 2px 0
    width 100%
    background-color rgba(25,25,25,.8)
    border-radius 5px
    overflow hidden
    .icon
      position absolute
      top 0
      right 4px
      width 16px
      padding-top 8px
      margin-right 2px
      pointer-events none
    input[type="text"]
      padding 4px 12px
      border 0
      width 100%
      font-size 14px
      line-height 16px
      outline 0
      color #fff
      background-color transparent
      &::-webkit-input-placeholder
        color #fff
</style>
