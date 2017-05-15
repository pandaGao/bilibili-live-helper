<template>
  <div id="#app">
    <config v-if="currentPage == 'config'" ref="config"></config>
    <danmaku v-if="currentPage == 'danmaku'" ref="danmaku"></danmaku>
    <history v-if="currentPage == 'history'" ref="history"></history>
    <test v-if="currentPage == 'test'"></test>
  </div>
</template>

<script>
  import Config from './components/ConfigPage'
  import Danmaku from './components/DanmakuPage'
  import History from './components/HistoryPage'
  import Test from './components/TestPage'

  import Live from 'bilibili-live/src/index.js'
  import UserDataStore from './utils/UserDataStore.js'
  import Statistic from './utils/Statistic.js'
  import os from 'os'

  export default {
    components: {
      Config,
      Danmaku,
      History,
      Test
    },
    data () {
      return {
        version: '0.3.1',
        needUpdate: false,
        win: null,
        currentPage: 'config',
        roomId: '',
        cookie: '',
        config: {
          onlineMessage: true,
          fansMessage: true,
          welcomeMessage: true,
          welcomeGuardMessage: true,
          commentMessage: true,
          giftMessage: true,
          guardBuyMessage: true,
          newFansMessage: true,
          blockMessage: true,
          showUserLevel: true,
          showUserBadge: true,
          showUserVIP: true,
          showUserGuard: true,
          useGiftEnd: true,
          hideToolbar: false,
          danmakuFontSize: 14,
          danmakuDisplayTime: 10
        },
        danmakuPool: [],
        roomFansPool: [],
        roomOnlineUser: '--',
        roomFans: '--',
        danmakuService: null,
        userService: null,
        userConfigStore: null
      }
    },
    watch: {
      config: {
        handler: function () {
          this.saveConfig()
        },
        deep: true
      },
      roomId (newVal) {
        this.danmakuPool = []
        this.startDanmakuService().then(() => {
          if (this.userService) {
            this.userService.setCurrentRoom(this.danmakuService.getRoomInfo().id)
          }
        })
        this.saveConfig()
      }
    },
    mounted () {
      this.win = this.$electron.remote.getCurrentWindow()
      this.$electron.ipcRenderer.on('changePage', (evt, page) => {
        this.currentPage = page
      })
      this.$electron.ipcRenderer.on('move', (evt, x, y) => {
        this.resetWindow(x, y)
      })
      this.$electron.ipcRenderer.on('updateCookie', (evt, cookie) => {
        this.loginUser(cookie)
        this.saveConfig()
      })
      this.checkUpdate()
      this.loadConfig()
    },
    methods: {
      loadConfig () {
        this.userConfigStore = new UserDataStore({
          electron: this.$electron,
          fileName: 'UserConfig'
        })
        let userConfig = this.userConfigStore.get()
        if (!userConfig) {
          this.saveConfig()
        } else {
          this.roomId = userConfig.roomId
          this.config = Object.assign({}, this.config, userConfig.config)
          this.loginUser(userConfig.cookie)
          this.$emit('loadConfig')
        }
      },
      saveConfig () {
        this.userConfigStore.set({
          roomId: this.roomId,
          cookie: this.cookie,
          config: this.config
        })
      },
      startDanmakuService () {
        if (this.danmakuService) {
          this.danmakuService.removeAllListeners()
          this.danmakuService.disconnect()
          this.danmakuService = null
          this.roomOnlineUser = '--'
          this.roomFans = '--'
        }
        return Live.initRoom({
          roomId: this.roomId
        }).then(room => {
          room.on('data', (msg) => {
            if (msg.type == 'gift') {
              if (!this.config.useGiftEnd) {
                this.addDanmaku(msg)
              }
            } else if (msg.type == 'online') {
              this.addFans(msg)
            } else if (msg.type == 'fans') {
              this.addFans({
                type: 'fans',
                total: msg.total
              })
              msg.newFans.map((fan) => {
                this.addDanmaku({
                  type: 'newFans',
                  user: fan
                })
              })
            } else {
              this.addDanmaku(msg)
            }
            // if (this.config.useNotification && msg.type === 'comment') {
            //   let notification = new Notification(msg.user.name, {
            //     body: msg.comment
            //   })
            // }
          }).on('giftEnd', (msg) => {
            if (this.config.useGiftEnd) {
              msg.type = 'gift'
              this.addDanmaku(msg)
            }
          })
          this.danmakuService = room
        })
      },
      addDanmaku (danmaku) {
        this.danmakuPool.push(danmaku)
      },
      addFans (danmaku) {
        this.roomFansPool.push(danmaku)
        if (danmaku.type == 'online') {
          this.roomOnlineUser = danmaku.number
        } else if (danmaku.type == 'fans') {
          this.roomFans = danmaku.total
        }
      },
      resetWindow (x, y) {
        let workArea = this.$electron.screen.getPrimaryDisplay().workArea
        let bound = this.win.getBounds()
        this.win.setBounds({
          x: x,
          y: workArea.y,
          width: 320,
          height: y - workArea.y
        })
      },
      loginUser (cookie) {
        this.cookie = cookie
        Live.initUser({
          cookie: this.cookie
        }).then(user => {
          if (!user) return
          user.setCurrentRoom(this.roomId)
          this.userService = user
          Statistic.userLogin(this.version, os.platform(), user.getUserInfo().id, user.getUserRoom().id)
          this.$emit('userLogin')
        })
      },
      logoutUser () {
        this.cookie = ''
        this.userService = null
        this.$emit('userLogout')
      },
      checkUpdate() {
        Statistic.checkUpdate(this.version, os.platform()).then(res => {
          let data = res.json().then(json => {
            this.needUpdate = json.needUpdate
          })
        })
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
  line-height 16px
  cursor pointer
</style>
