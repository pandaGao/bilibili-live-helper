<template>
  <div class="user-config">
    <div v-if="user" class="user-info">
      <div class="title">{{userInfo.name}}</div>
      <div class="row">
        <div class="level">UL.{{userInfo.level}}</div>
        <div class="level-bar">
          <div class="exp">{{userInfo.current}} / {{userInfo.next}}</div>
          <div class="exp-bar-border">
            <div class="exp-bar" :style="userLevelBarStyle()"></div>
          </div>
        </div>
      </div>
      <div class="row" v-if="userRoom.id">
        <div class="level">UP. {{userRoom.level}}</div>
        <div class="level-bar">
          <div class="exp">{{userRoom.current}} / {{userRoom.next}}</div>
          <div class="exp-bar-border">
            <div class="exp-bar" :style="userRoomBarStyle()"></div>
          </div>
        </div>
      </div>
      <div class="row" v-if="userRoom.id">
        <div class="field">直播间ID {{userRoom.id}}</div>
        <div class="field">SAN值 {{userRoom.san}}</div>
      </div>
      <div class="row">
        <div class="text">
          <button class="button user-btn" v-if="userRoom.id" @click="gotoMyRoom">前往直播间</button>
          <button class="button user-btn" v-if="userRoom.id" @click="openMyRoom">浏览器打开直播间</button>
          <button class="button user-btn" style="float: right" @click="logout">登出</button>
        </div>
      </div>
    </div>
    <div v-else class="need-login">
      <button class="button login" @click="openLogin">点此登录</button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      user: null,
      userInfo: null,
      userRoom: null
    }
  },
  mounted () {
    this.updateUser()
    this.$root.$on('userLogin', () => {
      this.updateUser()
    })
    this.$root.$on('userLogout', () => {
      this.updateUser()
    })
  },
  methods: {
    updateUser () {
      this.user = this.$root.userService
      if (this.user) {
        this.userInfo = this.user.getUserInfo()
        this.userRoom = this.user.getUserRoom()
      }
    },
    openLogin () {
      this.$electron.ipcRenderer.send('openLogin')
    },
    gotoMyRoom () {
      this.$root.roomId = this.userRoom.id
      this.$root.currentPage = 'danmaku'
    },
    openMyRoom () {
      this.$electron.shell.openExternal('http://live.bilibili.com/'+this.userRoom.id)
    },
    logout () {
      this.$root.logoutUser()
    },
    userLevelBarStyle () {
      return {
        width: (100*this.userInfo.current/this.userInfo.next) + '%'
      }
    },
    userRoomBarStyle () {
      return {
        width: (100*this.userRoom.current/this.userRoom.next) + '%'
      }
    }
  }
}
</script>

<style lang="stylus">
.user-config
  .level
    flex 1
  .level-bar
    flex 3
    text-align center
    position relative
  .exp
    position absolute
    left 0
    top 0
    z-index 999
    width 100%
    text-align center
  .exp-bar-border
    position absolute
    top 0
    left 0
    width 100%
    height 100%
    padding 1px
    border 1px solid #66ccff
    .exp-bar
      height 100%
      background-color #66ccff
  .user-btn
    padding 2px 4px
    border 1px solid #66ccff
    border-radius 4px
    color #66ccff
    background-color transparent
  .need-login
    padding-top 1em
    text-align center
    cursor pointer
    .login
      padding 4px 6px
      border 1px solid #66ccff
      border-radius 4px
      color #66ccff
      background-color transparent
</style>
