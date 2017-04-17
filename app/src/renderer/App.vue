<template>
  <div id="#app">
    <config v-if="currentPage == 'config'" ref="config"></config>
    <danmaku v-if="currentPage == 'danmaku'" ref="danmaku"></danmaku>
    <history v-if="currentPage == 'history'" ref="history"></history>
  </div>
</template>

<script>
  import Config from './components/ConfigPage'
  import Danmaku from './components/DanmakuPage'
  import History from './components/HistoryPage'

  import Live from 'bilibili-live/src/index.js'

  export default {
    components: {
      Config,
      Danmaku,
      History
    },
    data () {
      return {
        currentPage: 'config',
        config: {
          roomId: '',
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
          useGiftEnd: true
        },
        danmakuPool: [],
        danmakuService: null
      }
    },
    computed: {
      roomId () {
        return this.config.roomId
      }
    },
    watch: {
      roomId () {
        this.danmakuPool = []
        this.startDanmakuService()
      }
    },
    mounted () {
      this.$electron.ipcRenderer.on('changePage', (evt, page) => {
        this.currentPage = page
      })
    },
    methods: {
      startDanmakuService () {
        if (this.danmakuService) {
          this.danmakuService.removeAllListeners()
        }
        Live.initRoom({
          roomId: this.config.roomId
        }).then(room => {
          room.on('data', (msg) => {
            if (msg.type == 'gift') {
              if (!this.config.useGiftEnd) {
                this.addDanmaku(msg)
              }
            } else if (msg.type == 'fans') {
              this.addDanmaku({
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
</style>
