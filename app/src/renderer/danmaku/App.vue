<template>
  <div class="danmaku-page" :class="danmakuResetHint" ref="page">
    <div class="danmaku-list" ref="list" :style="danmakuListStyle">
      <transition-group name="danmaku">
        <div class="danmaku-box"
          v-for="(danmaku, idx) in danmakuList"
          :key="danmaku.transCount"
          :style="danmakuBoxStyle">
          <div v-if="danmaku.type == 'connected'" class="msg-connected">弹幕服务器连接成功...</div>
          <div v-else-if="danmaku.type == 'error'" class="msg-error">连接发生错误，3秒后自动重连...</div>
          <div v-else-if="danmaku.type == 'live'" class="msg-live">开始直播啦！</div>
          <div v-else-if="danmaku.type == 'preparing'" class="msg-preparing">直播已结束，下次再见！</div>
          <div v-else-if="danmaku.type == 'welcome'" class="msg-welcome">
            <span v-if="danmaku.user.isVIP" class="vip-user">爷</span>
            <span v-if="danmaku.user.isSVIP" class="svip-user">爷</span>
            <span class="user-name">{{ danmaku.user.name }}</span>
            <span class="welcome-message">进入直播间</span>
          </div>
          <div v-else-if="danmaku.type == 'welcomeGuard'" class="msg-welcome-guard">
            <span v-if="danmaku.user.guard > 0" class="guard-user" :class="userGuardLevel(danmaku.user.guard)" :style="guardStyle"></span>
            <span class="user-name">{{ danmaku.user.name }}</span>
            <span class="welcome-message">进入直播间</span>
          </div>
          <div v-else-if="danmaku.type == 'comment'" class="msg-comment">
            <span v-if="danmaku.user.guard > 0" class="guard-user" :class="userGuardLevel(danmaku.user.guard)" :style="guardStyle"></span>
            <span v-if="danmaku.user.isAdmin" class="admin-user">管</span>
            <span v-if="danmaku.user.isSVIP && config.showUserVIP" class="svip-user">爷</span>
            <span v-else-if="danmaku.user.isVIP && config.showUserVIP" class="vip-user">爷</span>
            <span v-if="danmaku.user.badge && config.showUserBadge" class="user-badge" :class="userBadgeLevelColor(danmaku.user.badge.level)"><span class="user-badge-title">{{ danmaku.user.badge.title }}</span><span class="user-badge-level">{{ danmaku.user.badge.level }}</span></span>
            <span v-if="danmaku.user.title && config.showUserTitle" class="user-title"><img :src="titleImage(danmaku.user.title.source)"></span>
            <span v-if="danmaku.user.level && config.showUserLevel" class="user-level" :class="userLevelColor(danmaku.user.level)">{{ "UL "+danmaku.user.level }}</span>
            <span class="user-name">{{ danmaku.user.name }}:</span>
            <span class="user-comment">{{ danmaku.comment }}</span>
          </div>
          <div v-else-if="danmaku.type == 'gift'" class="msg-gift">
            <span class="user-name">{{ danmaku.user.name }}</span>
            <span class="gift-action">赠送</span>
            <span class="gift-img"><img :src="giftImage(danmaku.gift.id)"></span>
            <span class="user-gift">{{ `${danmaku.gift.name} × ${danmaku.gift.count}` }}</span>
          </div>
          <div v-else-if="danmaku.type == 'guardBuy'" class="msg-guard-buy">
            <span class="user-name">{{ danmaku.user.name }}</span>
            <span class="buy-msg">购买</span>
            <span class="guard-user-gift" :class="userGuardLevel(danmaku.level)" :style="guardStyle"></span>
            <span class="buy-count">{{ `× ${danmaku.count}` }}</span>
          </div>
          <div v-else-if="danmaku.type == 'block'" class="msg-block">
            <span class="user-name">{{ danmaku.user.name }}</span>
            <span class="block-msg">被管理员禁言</span>
          </div>
          <div v-else-if="danmaku.type == 'newFans'" class="msg-new-fans">
            <span class="user-name">{{ danmaku.user.name }}</span>
            <span class="follow-msg">关注了直播间</span>
          </div>
          <div v-else-if="danmaku.type == 'test'" class="msg-test">
            <span class="test-content">{{ danmaku.content }}</span>
          </div>
          <div v-else-if="danmaku.type == 'musicLog'" class="msg-music">
            <span class="user-name">{{ danmaku.user.name }}</span>
            <span v-if="danmaku.passed" class="success">点歌成功</span>
            <span v-else class="failed">点歌失败</span>
            <span v-if="danmaku.log" class="music-log">{{ danmaku.log }}</span>
          </div>
          <div v-else-if="danmaku.type == 'sendLog'" class="msg-send">
            <span v-if="danmaku.success" class="success">弹幕发送成功</span>
            <span v-else class="failed">弹幕发送失败</span>
            <span v-if="danmaku.msg" class="send-log">{{ danmaku.msg }}</span>
          </div>
          <div v-else>{{ danmaku }}</div>
        </div>
      </transition-group>
    </div>
    <div class="toolbar" v-if="config.showOnlineAndFans">
      <div class="online item">房间人气<span>{{ onlineNumber }}</span></div>
      <div class="online item">关注人数<span>{{ fansNumber }}</span></div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        giftConfig: {},
        danmakuCount: 0,
        danmakuList: [],
        onlineNumber: '--',
        fansNumber: '--',
        showResetHint: false,
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
          showUserTitle: true,
          showUserBadge: true,
          showUserVIP: true,
          showUserGuard: true,
          useGiftEnd: true,
          hideToolbar: false,
          showOnlineAndFans: true,
          danmakuFontSize: 14,
          danmakuDisplayTime: 10,
          danmakuBackgroundOpacity: 80,
          lockWindowHeight: false,
          danmakuMaxHeight: 600,
          useWebsocket: true,
          useHttps: false,
          useNotification: false,
          useTTS: false
        }
      }
    },
    computed: {
      danmakuBoxStyle () {
        return {
          fontSize: this.config.danmakuFontSize + 'px',
          lineHeight: (this.config.danmakuFontSize*3/2) + 'px'
        }
      },
      danmakuListStyle () {
        return {
          backgroundColor: `rgba(25, 25, 25, ${this.config.danmakuBackgroundOpacity / 100})`,
          bottom: !this.config.showOnlineAndFans ? 0 : '27px'
        }
      },
      guardStyle () {
        return {
          width: (this.config.danmakuFontSize*3/2) + 'px',
          height: (this.config.danmakuFontSize*3/2) + 'px',
          backgroundSize: 'auto ' + (this.config.danmakuFontSize*3/2) + 'px'
        }
      },
      danmakuResetHint () {
        return this.showResetHint ? 'reset-hint' : ''
      }
    },
    watch: {
      'config.lockWindowHeight' () {
        this.resetWindow(false)
      },
      'config.danmakuMaxHeight' () {
        this.resetWindow(false)
      }
    },
    created () {
      this.$electron.ipcRenderer.on('newConfig', (evt, config) => {
        this.config = config
      })
      this.$electron.ipcRenderer.on('clearDanmaku', (evt) => {
        this.danmakuList = []
      })
      this.$electron.ipcRenderer.on('newDanmaku', (evt, danmaku) => {
        danmaku.filter(msg => {
          return msg.type == 'test' || msg.type == 'musicLog' || msg.type == 'sendLog' || this.config[msg.type+'Message']
        }).map(msg => {
          this.addDanmaku(msg)
        })
      })
      this.$electron.ipcRenderer.on('onlineNumber', (evt, number) => {
        this.onlineNumber = number
      })
      this.$electron.ipcRenderer.on('fansNumber', (evt, number) => {
        this.fansNumber = number
      })
      this.$electron.ipcRenderer.on('move', (evt, x, y) => {
        this.resetWindow(true, x, y)
      })
      this.$electron.ipcRenderer.on('roomGiftConfig', (evt, res) => {
        if (res.length) {
          this.giftConfig = res.reduce((config, gift) => {
            config[`${gift.id}`] = gift
            return config
          }, {})
        }
      })
    },
    mounted () {
      this.$electron.ipcRenderer.send('getRoomGiftConfig')
    },
    methods: {
      addDanmaku (danmaku) {
        danmaku.transCount = '' + this.danmakuCount++
        this.danmakuList.push(danmaku)
        setTimeout(() => {
          this.removeDanmaku()
        }, this.config.danmakuDisplayTime*1000)
      },
      removeDanmaku () {
        this.danmakuList.splice(0,1)
      },
      userLevelColor (level) {
        return "user-level-"+Math.ceil(Number(level)/10)
      },
      userBadgeLevelColor (level) {
        return "user-badge-level-"+Math.ceil(Number(level)/4)
      },
      userGuardLevel (level) {
        return "guard-user-"+level
      },
      giftImage (id) {
        return this.giftConfig[`${id}`] ? this.giftConfig[`${id}`]['img_dynamic'] : ''
      },
      titleImage (source) {
        if (!source) {
          return ''
        }
        let uri = source.replace('title-', 'title/')
        return `http://s1.hdslb.com/bfs/static/blive/live-assets/${uri}.png`
      },
      resetWindow (moved, x, y) {
        let workArea = this.$electron.screen.getPrimaryDisplay().workArea
        let win = this.$electron.remote.getCurrentWindow()
        let bound = win.getBounds()
        if (moved) {
          if (this.config.lockWindowHeight) {
            let windowHeight = Math.min(y - workArea.y, this.config.danmakuMaxHeight)
            win.setBounds({
              x: x,
              y: y - windowHeight,
              width: 320,
              height: windowHeight
            })
          } else {
            win.setBounds({
              x: x,
              y: workArea.y,
              width: 320,
              height: y - workArea.y
            })
          }
        } else {
          let x = bound.x
          let y = bound.y + bound.height
          if (this.config.lockWindowHeight) {
            let windowHeight = Math.min(y - workArea.y, this.config.danmakuMaxHeight)
            win.setBounds({
              x: x,
              y: y - windowHeight,
              width: 320,
              height: windowHeight
            })
          } else {
            win.setBounds({
              x: x,
              y: workArea.y,
              width: 320,
              height: y - workArea.y
            })
          }
        }
        this.showResetHint = true
        setTimeout(() => {
          this.showResetHint = false
        }, 300)
      }
    }
  }
</script>

<style lang="stylus">
*
  margin 0
  padding 0
  font-family "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif

.danmaku-page
  height 100vh
  overflow hidden
.reset-hint
  background-color rgba(25,25,25,.4)

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
    background-color rgba(25,25,25,.8)
  .item + .item
    margin-left 1px
  .online
    display inline-block
    padding 5px 8px
    font-size 14px
    line-height 16px
    flex 3
    span
      float right

.danmaku-enter
  opacity 0
  transform translateY(100%)
.danmaku-leave-to
  opacity 0
  transform translateY(-75%)
.danmaku-enter-active
  transition all 1s
.danmaku-leave-active
  transition all 1s

.danmaku-list
  position absolute
  left 0
  width 100%
  border-radius 5px
  overflow hidden

.danmaku-box
  padding 4px 8px
  user-select none
  cursor default
  color #fff
  .admin-user
    padding 1px 2px
    border-radius 4px
    background-color #ea9336
  .vip-user
    padding 1px 2px
    border-radius 4px
    background-color #f25d8e
  .svip-user
    padding 1px 2px
    border-radius 4px
    background-color #ffb100
  .user-name
    color #4fc1e9
  .user-level
    padding 0 2px
    border-radius 4px
    border-width 1px
    border-style solid
  .user-level-1
    color #939393
  .user-level-2
    color #5dbb57
  .user-level-3
    color #5595d9
  .user-level-4
    color #9a65ed
  .user-level-5
    color #fc84ae
  .user-level-6
    color #fc953a
  .user-badge
    border-width 1px
    border-style solid
    border-radius 4px
    overflow hidden
    .user-badge-title
      padding 0 4px
    .user-badge-level
      border-top-right-radius 3px
      border-bottom-right-radius 3px
      padding 0 3px
  .user-badge-level-1
    background-color #61decb
    border-color #61decb
    .user-badge-level
      background-color #fff
      color #61decb
  .user-badge-level-2
    background-color #5896de
    border-color #5896de
    .user-badge-level
      background-color #fff
      color #5896de
  .user-badge-level-3
    background-color #a068f1
    border-color #a068f1
    .user-badge-level
      background-color #fff
      color #a068f1
  .user-badge-level-4
    background-color #ff86b2
    border-color #ff86b2
    .user-badge-level
      background-color #fff
      color #ff86b2
  .user-badge-level-5
    background-color #f6be18
    border-color #f6be18
    .user-badge-level
      background-color #fff
      color #f6be18
  .user-title
    img
      vertical-align middle
  .guard-user
    display inline-block
    vertical-align top
    background-image url(http://static.hdslb.com/live-static/live-room/images/guard/icon-guard-big.png)
  .guard-user-1
    background-position 100% 0
  .guard-user-2
    background-position 50% 0
  .guard-user-3
    background-position 0% 0
  .guard-user-gift
    display inline-block
    width 32px
    height 32px
    vertical-align bottom
    background-image url(http://static.hdslb.com/live-static/live-room/images/guard/icon-guard-big.png)
    background-size auto 32px
  .msg-gift
    .gift-img > img
      height 32px
    .user-name
      color #ff8f34
  .success
    color #19be6b
  .failed
    color #ed3f14

</style>
