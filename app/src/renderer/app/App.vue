<template>
  <Row type="flex" class="app-container">
    <Col span="2">
      <Menu theme="dark" :active-name="currentPage" width="auto" class="icon-menu">
        <div class="toolbar">
          <Button icon="close-round" type="text" size="small" @click="quitApp"></Button>
          <Button icon="minus-round" type="text" size="small" @click="minimizeWindow"></Button>
        </div>
        <div class="icon-menu-group">
          <Menu-item name="/config" @click.native="to('/config')">
            <Icon type="gear-a" :size="25"></Icon>
          </Menu-item>
          <Menu-item name="/history" @click.native="to('/history')">
            <Icon type="clock" :size="iconSize"></Icon>
          </Menu-item>
          <Menu-item name="/music" @click.native="to('/music')">
            <Icon type="music-note" :style="{marginRight: '3px'}" :size="iconSize"></Icon>
          </Menu-item>
          <Menu-item name="/statistic" @click.native="to('/statistic')">
            <Icon type="podium" :size="iconSize"></Icon>
          </Menu-item>
          <Menu-item name="/help" @click.native="to('/help')">
            <Badge v-if="needUpdate" dot>
              <Icon type="help-circled" :size="iconSize"></Icon>
            </Badge>
            <Icon v-else type="help-circled" :size="iconSize"></Icon>
          </Menu-item>
        </div>
      </Menu>
    </Col>
    <Col span="22">
      <router-view class="router-view"></router-view>
    </Col>
  </Row>
</template>

<script>
import os from 'os'
import Statistic from '../utils/Statistic.js'

export default {
  data () {
    return {
      iconSize: 24,
      poolPointer: 0
    }
  },
  computed: {
    currentPage () {
      return this.$route.path.match(/^\/\w*/g)[0]
    },
    config () {
      return this.$store.state.config
    },
    onlineNumber () {
      return this.$store.state.onlineNumber
    },
    fansNumber () {
      return this.$store.state.fansNumber
    },
    danmakuPool () {
      return this.$store.state.danmakuPool
    },
    userService () {
      return this.$store.state.userService
    },
    danmakuService () {
      return this.$store.state.danmakuService
    },
    version () {
      return this.$store.state.version
    },
    needUpdate () {
      return this.$store.state.needUpdate
    }
  },
  watch: {
    config () {
      this.$electron.ipcRenderer.send('sendConfig', this.config)
    },
    onlineNumber () {
      this.$electron.ipcRenderer.send('setRoomOnline', this.onlineNumber)
    },
    fansNumber () {
      this.$electron.ipcRenderer.send('setRoomFans', this.fansNumber)
    },
    danmakuPool () {
      let newDanmaku = this.danmakuPool.slice(this.poolPointer, this.danmakuPool.length)
      this.poolPointer = this.danmakuPool.length
      this.$electron.ipcRenderer.send('sendDanmaku', newDanmaku)
    },
    danmakuService () {
      this.danmakuService.on('data', this.danmakuHandler)
      this.danmakuService.on('giftBundle', this.giftHandler)
      if (this.danmakuPool.length) return
      this.poolPointer = 0
      this.$electron.ipcRenderer.send('clearDanmaku')
    }
  },
  created () {
    this.$electron.ipcRenderer.on('changePage', (evt, url) => {
      this.to(url)
    })
    this.$electron.ipcRenderer.on('sendMessage', (evt, msg) => {
      this.sendMessage(msg)
    })
    this.checkUpdate()
  },
  methods: {
    to (path) {
      this.$router.push(path)
    },
    giftHandler (msg) {
      if (this.config.useNotification) {
        let notification = new Notification(msg.user.name, {
          body: `赠送${msg.gift.name} × ${msg.gift.count}`
        })
      }
      if (this.config.useTTS) {
        let synth = speechSynthesis
        let voices = speechSynthesis.getVoices()
        let utterThis = new SpeechSynthesisUtterance(msg.user.name+' 赠送 '+ msg.gift.count + '个' + msg.gift.name)
        utterThis.pitch = this.$store.state.ttsConfig.pitch / 10
        utterThis.rate = this.$store.state.ttsConfig.rate / 10
        utterThis.volume = this.$store.state.ttsConfig.volume / 100
        utterThis.voice = voices[this.$store.state.ttsConfig.voice]
        synth.speak(utterThis)
      }
    },
    danmakuHandler (msg) {
      if (this.config.useNotification && msg.type == 'comment') {
        let notification = new Notification(msg.user.name, {
          body: msg.comment
        })
      }
      if (this.config.useTTS && msg.type == 'comment') {
        let synth = speechSynthesis
        let voices = speechSynthesis.getVoices()
        let utterThis = new SpeechSynthesisUtterance(msg.user.name+' 说 '+ msg.comment)
        utterThis.pitch = this.$store.state.ttsConfig.pitch / 10
        utterThis.rate = this.$store.state.ttsConfig.rate / 10
        utterThis.volume = this.$store.state.ttsConfig.volume / 100
        utterThis.voice = voices[this.$store.state.ttsConfig.voice]
        synth.speak(utterThis)
      }
      if (this.$store.state.musicConfig.start && msg.type == 'comment') {
        let comment = msg.comment+''
        if (comment.startsWith('#点歌 ')) {
          let music = comment.slice(4).toLowerCase().trim()
          let validate = this.validateMusicDanmaku(msg, music)
          if (validate.passed) {
            this.$store.commit('ADD_MUSIC_LIST', {
              music: {
                name: music,
                user: msg.user.name
              }
            })
            this.$store.commit('SET_USERCD', {
              user: {
                id: msg.user.id,
                ts: new Date(new Date().getTime() + this.$store.state.musicConfig.userCD * 1000)
              }
            })
            this.$store.commit('SET_MUSICCD', {
              music: {
                name: music,
                ts: new Date(new Date().getTime() + this.$store.state.musicConfig.musicCD * 1000)
              }
            })
            if (this.$store.state.musicConfig.mode == 1) {
              this.$root.startPlayMusic()
            }
          }
          this.$store.commit('PUSH_DANMAKU_POOL', {
            danmaku: {
              type: 'musicLog',
              user: msg.user,
              passed: validate.passed,
              log: validate.msg,
              ts: new Date().getTime()
            }
          })
        }
      }
    },
    validateMusicDanmaku (msg, music) {
      let passed = true
      // 用户等级
      if (this.$store.state.musicConfig.limitType == 1) {
        passed = Number(msg.user.level) >= this.$store.state.musicConfig.limitCount
        if (!passed) {
          this.addMusicLog({
            status: false,
            user: msg.user.name,
            msg: '用户等级未达到要求'
          })
          return {
            passed: false,
            msg: '用户等级未达到要求'
          }
        }
      }
      // 粉丝勋章
      if (this.$store.state.musicConfig.limitType == 2) {
        if (!msg.user.badge) return false
        passed = this.$store.state.roomId == msg.user.badge.roomURL && Number(msg.user.badge.level) >= this.$store.state.musicConfig.limitCount
        if (!passed) {
          this.addMusicLog({
            status: false,
            user: msg.user.name,
            msg: '粉丝勋章等级未达到要求'
          })
          return {
            passed: false,
            msg: '粉丝勋章等级未达到要求'
          }
        }
      }
      // 已在点歌列表
      passed = this.$store.state.musicList.every(m => {
        return !(music == m.name)
      })
      if (!passed) {
        this.addMusicLog({
          status: false,
          user: msg.user.name,
          msg: '歌曲已在点歌列表'
        })
        return {
          passed: false,
          msg: '歌曲已在点歌列表'
        }
      }
      // 已在屏蔽列表
      passed = this.$store.state.blockList.every(m => {
        return !(music == m)
      })
      if (!passed) {
        this.addMusicLog({
          status: false,
          user: msg.user.name,
          msg: '歌曲已在屏蔽列表'
        })
        return {
          passed: false,
          msg: '歌曲已在屏蔽列表'
        }
      }
      // 用户冷却中
      passed = !this.$store.state.userCDMap.has(msg.user.id) || this.$store.state.userCDMap.get(msg.user.id) < new Date()
      if (!passed) {
        this.addMusicLog({
          status: false,
          user: msg.user.name,
          msg: '用户还在点歌冷却时间中'
        })
        return {
          passed: false,
          msg: '用户还在点歌冷却时间中'
        }
      }
      // 歌曲冷却中
      passed = !this.$store.state.musicCDMap.has(music) || this.$store.state.musicCDMap.get(music) < new Date()
      if (!passed) {
        this.addMusicLog({
          status: false,
          user: msg.user.name,
          msg: '歌曲还在冷却时间中'
        })
        return {
          passed: false,
          msg: '歌曲还在冷却时间中'
        }
      }
      this.addMusicLog({
        status: true,
        user: msg.user.name,
        msg: music
      })
      return {
        passed: true,
        msg: ''
      }
    },
    addMusicLog (log) {
      this.$store.commit('ADD_MUSIC_LOG', {
        log: {
          user: log.user,
          log: {
            status: log.status,
            msg: log.msg
          }
        }
      })
    },
    sendMessage (msg) {
      if (!msg || !this.danmakuService || !this.userService) {
        return
      }
      this.userService.asyncSendMessage(msg)
    },
    checkUpdate() {
      Statistic.checkUpdate(this.version, os.platform()).then(res => {
        let data = res.json().then(json => {
          this.$store.commit('CHECK_UPDATE', {
            needUpdate: json.needUpdate,
            latestVersion: json.latestVersion
          })
        })
      })
    },
    minimizeWindow () {
      this.$electron.remote.getCurrentWindow().minimize()
    },
    quitApp () {
      this.$electron.ipcRenderer.send('quitApp')
    }
  }
}
</script>

<style lang="stylus" scoped>
.app-container
  min-height 100vh
  overflow hidden
.toolbar
  -webkit-app-region no-drag
  padding-left 4px
  margin-bottom 10px
.icon-menu
  padding-top 4px
  height 100%
  -webkit-user-select none
  -webkit-app-region drag
.icon-menu-group
  text-align center
  -webkit-app-region no-drag
  .ivu-menu-item
    padding 18px 24px
  .ivu-icon
    margin-right 0
</style>
