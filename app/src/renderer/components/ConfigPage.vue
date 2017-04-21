<template>
  <div class="config-page">
    <div class="row">
      <div class="field">
        <input class="room-input" type="text" placeholder="请输入房间号" v-model="roomId" @keyup.enter="setRoomId"><button class="button room-button" @click="setRoomId">开启弹幕姬</button>
      </div>
    </div>
    <div class="title">接收弹幕种类</div>
    <div class="row">
      <div class="field">
        <label><input type="checkbox" v-model="config.welcomeMessage"> 老爷进入提示</label>
      </div>
      <div class="field">
        <label><input type="checkbox" v-model="config.welcomeGuardMessage"> 舰队进入提示</label>
      </div>
    </div>
    <div class="row">
      <div class="field">
        <label><input type="checkbox" v-model="config.giftMessage"> 赠送礼物提示</label>
      </div>
      <div class="field">
        <label><input type="checkbox" v-model="config.guardBuyMessage"> 舰队购买提示</label>
      </div>
    </div>
    <div class="row">
      <div class="field">
        <label><input type="checkbox" v-model="config.newFansMessage"> 房间关注提示</label>
      </div>
      <div class="field">
        <label><input type="checkbox" v-model="config.blockMessage"> 禁言提示</label>
      </div>
    </div>
    <div class="title">评论弹幕组成</div>
    <div class="row">
      <div class="field">
        <label><input type="checkbox" v-model="config.showUserLevel"> 用户等级</label>
      </div>
      <div class="field">
        <label><input type="checkbox" v-model="config.showUserBadge"> 用户勋章</label>
      </div>
    </div>
    <div class="row">
      <div class="field">
        <label><input type="checkbox" v-model="config.showUserVIP"> 年费标识</label>
      </div>
      <div class="field">
        <label><input type="checkbox" v-model="config.showUserGuard"> 舰队标识</label>
      </div>
    </div>
    <div class="title">其他功能</div>
    <div class="row">
      <div class="field">
        <label><input type="checkbox" v-model="config.useGiftEnd"> 礼物打包提示</label>
      </div>
    </div>
    <div class="row">
      <div class="info">v0.2.0 by Ryan Gao <span class="github-page" @click="gotoGithub">查看新版</span></div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        roomId: ''
      }
    },
    computed: {
      config () {
        return this.$root.config
      }
    },
    mounted () {
      this.roomId = this.config.roomId
      this.$electron.remote.getCurrentWindow().setIgnoreMouseEvents(false)
    },
    methods: {
      setRoomId () {
        if (this.roomId) {
          this.config.roomId = this.roomId
          this.$root.currentPage = 'danmaku'
        }
      },
      gotoGithub () {
        this.$electron.shell.openExternal('https://github.com/pandaGao/bilibili-live-helper')
      }
    }
  }
</script>

<style lang="stylus">
.config-page
  position absolute
  bottom 0
  width 100%
  height 100%
  padding 8px 8px 0 8px
  border-radius 5px
  background-color rgba(25,25,25,.8)
  overflow-y scroll
  color #fff
  font-size 14px
  &::-webkit-scrollbar
    width 4px
  &::-webkit-scrollbar-thumb
    background-color #666

.row
  display flex
  padding 6px 8px
  user-select none

.field
  flex 1
  .room-input
    width 10em
    border-top-left-radius 4px
    border-bottom-left-radius 4px
    border-color #66ccff
    color #66ccff
    &::-webkit-input-placeholder
      color #66ccff
  .room-button
    padding 6px
    border 1px solid #66ccff
    border-top-right-radius 4px
    border-bottom-right-radius 4px
    vertical-align bottom
    background-color rgba(0,0,0,0)
    color #66ccff

.title
  margin 16px 8px
  margin-bottom 4px
  border-bottom 1px solid #66ccff
  font-size 16px
  color #66ccff

.info
  float right
  .github-page
    margin-left 1em
    color #66ccff
    cursor pointer

input[type="checkbox"]
  vertical-align middle

input[type="text"]
  padding 6px 8px
  border 0
  border 1px solid #fff
  border-right 0
  vertical-align bottom
  font-size 14px
  line-height 16px
  outline 0
  background-color rgba(0,0,0,0)

</style>
