<template>
  <div class="config-container">
    <Card class="tile-card">
      <Spin class="not-login" v-if="!userService&&loadingUserInfo" size="large">登录中...</Spin>
      <Button class="not-login" v-if="!userService&&!loadingUserInfo" type="info" @click="openLoginModal">点此登录</Button>
      <Button class="not-login" v-if="!userService&&!loadingUserInfo" type="text" icon="ios-information-outline" @click="to('/help/privacy')">隐私说明</Button>
      <Modal
        v-model="showLoginModal"
        title="登录Bilibili"
        :styles="{top: '50px'}">
        <webview class="webview" ref="webview" v-if="showLoginModal" :src="src"></webview>
        <div slot="footer">
          <Button type="info" icon="refresh" @click="reloadLoginPage">刷新</Button>
        </div>
      </Modal>
      <Row v-if="userService" type="flex" align="middle">
        <Col span="20">
          <div class="user-info" v-if="userInfo">
            <strong>{{userInfo.name}}</strong>
            <span v-if="userInfo.id" class="uid">UID {{userInfo.id}}</span>
            <span v-if="userRoom.id" class="uid">直播间 {{userRoom.id}}</span>
            <div v-if="userInfo && userRoom">
              <div class="user-progress">
                <span class="title">UL.{{userInfo.level}}</span>
                <Progress class="progress" :percent="ulProgress" :stroke-width="6"></Progress>
              </div>
              <div v-if="userRoom.id" class="user-progress">
                <span class="title">UP.{{userRoom.level}}</span>
                <Progress class="progress" :percent="upProgress" :stroke-width="6"></Progress>
              </div>
            </div>
            <Button type="ghost" size="small" @click="openMyRoomInBrowser">浏览器打开直播间</Button>
            <Button type="ghost" size="small" @click="logoutUser">登出</Button>
          </div>
        </Col>
        <Col span="4">
          <router-link v-if="$route.path == '/config/danmaku'" to="/config/user" tag="div">
            <Button type="info" size="large">直播间管理</Button>
          </router-link>
          <router-link v-if="$route.path == '/config/user'"  to="/config/danmaku" tag="div">
            <Button type="info" size="large">弹幕姬设置</Button>
          </router-link>
        </Col>
      </Row>
    </Card>
    <router-view class="tile-view"></router-view>
  </div>
</template>

<script>
import { Room, User, API } from 'bilibili-live'

import os from 'os'

export default {
  data () {
    return {
      showLoginModal: false,
      src: 'http://passport.bilibili.com/ajax/miniLogin/minilogin',
      loadingUserInfo: false
    }
  },
  computed: {
    version () {
      return this.$store.state.version
    },
    roomId () {
      return this.$store.state.roomId
    },
    cookie () {
      return this.$store.state.cookie
    },
    userService () {
      return this.$store.state.userService
    },
    userInfo () {
      return this.$store.state.userInfo
    },
    userRoom () {
      return this.$store.state.userRoom
    },
    ulProgress () {
      return Math.floor(this.userInfo.current / this.userInfo.next * 100)
    },
    upProgress () {
      return Math.floor(this.userRoom.current / this.userRoom.next * 100)
    }
  },
  watch: {
    cookie(val) {
      if (!val) {
        this.loadingUserInfo = false
      } else {
        this.loginUser()
      }
    },
    userService (val) {
      if (val) {
        this.loadingUserInfo = false
      }
    }
  },
  mounted () {
    if (this.cookie && !this.userService) {
      this.loginUser()
    }
  },
  methods: {
    to (path) {
      this.$router.push(path)
    },
    openLoginModal () {
      this.showLoginModal = true
      this.$nextTick(() => {
        this.$refs.webview.addEventListener('will-navigate', () => {
          this.$refs.webview.getWebContents().session.cookies.get({url: 'http://www.bilibili.com'}, (err, cookies) => {
            this.$store.dispatch({
              type: 'UPDATE_COOKIE',
              cookie: cookies.map(cookie => `${cookie.name}=${cookie.value}`).join(';')
            })
            this.closeLoginModal()
          })
        })
      })
    },
    closeLoginModal () {
      this.showLoginModal = false
    },
    reloadLoginPage () {
      this.$refs.webview.reload()
    },
    loginUser () {
      this.loadingUserInfo = true
      this.$store.dispatch({
        type: 'START_USER_SERVICE'
      })
    },
    logoutUser () {
      this.$store.dispatch({
        type: 'UPDATE_COOKIE',
        cookie: ''
      })
      this.$store.commit({
        type: 'SET_USER_SERVICE',
        userService: null
      })
    },
    openMyRoomInBrowser () {
      this.$electron.shell.openExternal('http://live.bilibili.com/'+this.userRoom.id)
    }
  }
}
</script>

<style lang="stylus" scoped>
.config-container
  display flex
  flex-direction column
  padding 10px
  height 100%
.tile-card
  margin-bottom 8px
  height 108px
  .not-login
    margin-top 24px
.tile-view
  flex 1
.webview
  margin 0 auto
  width 420px
  height 380px
.user-info
  .uid
    vertical-align bottom
    font-size 12px
.user-progress
  width 240px
  display inline-flex
  .title
    display inline-block
    margin-top 2px
    width 48px
    font-size 14px
    line-height 20px
    vertical-align bottom
  .progress
    flex 1
</style>
