<template>
  <div class="danmaku-config">
    <Row :gutter="8" class="tile-row">
      <Col span="8" class="tile-col">
        <Card class="tile-card">
          <p slot="title">基本设置</p>
          <Row class="config-row">
            <Col span="24">
              <Input v-model="roomId" placeholder="支持短位ID" @on-enter="startDanmakuService">
                <span slot="prepend">直播间ID</span>
              </Input>
            </Col>
          </Row>
          <Row class="config-row">
            <Col span="14">
              <small v-if="danmakuServiceStatus == 'close'">弹幕库状态: 未开启</small>
              <small v-if="danmakuServiceStatus == 'connect'">弹幕库状态: 连接中</small>
              <small v-if="danmakuServiceStatus == 'open'">弹幕库状态: 已连接</small>
              <small v-if="danmakuServiceStatus == 'error'">弹幕库状态: 连接出错</small>
            </Col>
            <Col span="10">
              <Button class="power-btn" v-if="danmakuService" type="warning" icon="refresh" size="small" @click="startDanmakuService">重启弹幕库</Button>
              <Button class="power-btn" v-else type="success" icon="power" size="small" @click="startDanmakuService">开启弹幕库</Button>
            </Col>
          </Row>
          <Row class="info-row" v-if="roomInfo">
            <Col span="8">
              <small>直播间标题</small>
            </Col>
            <Col span="16">
              <small>{{ roomInfo.title }}</small>
            </Col>
          </Row>
          <Row class="info-row" v-if="roomInfo">
            <Col span="8">
              <small>直播间状态</small>
            </Col>
            <Col span="16">
              <small v-if="roomInfo.liveStatus === 2" class="round-color">轮播中</small>
              <small v-else-if="roomInfo.liveStatus === 1" class="live-color">直播中 开始于{{ liveStartTime }}</small>
              <small v-else class="prepare-color">准备中</small>
            </Col>
          </Row>
          <Row class="config-row" v-if="roomInfo">
            <Col span="8">
              <small>直播间封面</small>
            </Col>
          </Row>
          <Row class="info-row" v-if="roomInfo" style="text-align: center">
            <img class="room-cover" :src="roomInfo.cover" referrerpolicy="no-referrer">
          </Row>
        </Card>
        <Card class="tile-card connect-card">
          <p slot="title">连接设置</p>
          <Row class="info-row">
            <Col span="12">
              <Checkbox v-model="config.useHttps" @on-change="startDanmakuService">使用https</Checkbox>
            </Col>
            <Col span="12">
              <Checkbox v-model="config.useWebsocket" @on-change="startDanmakuService">使用websocket</Checkbox>
            </Col>
          </Row>
        </Card>
      </Col>
      <Col span="8" class="tile-col">
        <Card class="tile-card">
          <p slot="title">弹幕视窗设置</p>
          <Row class="config-row">
            <Col span="12">
              <Checkbox v-model="config.hideToolbar">防误触模式</Checkbox>
            </Col>
            <Col span="12">
              <Checkbox v-model="config.showOnlineAndFans">显示房间人气</Checkbox>
            </Col>
          </Row>
          <Row class="config-row">
            <Col span="12">
              <Checkbox v-model="config.useGiftEnd">礼物打包提示</Checkbox>
            </Col>
            <Col span="12">
              <Checkbox v-model="config.lockWindowHeight">限制窗口高度</Checkbox>
            </Col>
          </Row>
          <Form label-position="left" :label-width="96">
            <Form-item label="弹幕停留时间">
              <Row>
                <Col span="12">
                  <Input-number :max="600" :min="5" v-model="config.danmakuDisplayTime"></Input-number>
                </Col>
                <Col span="12">
                  <p>s</p>
                </Col>
              </Row>
            </Form-item>
            <Form-item label="弹幕文字大小">
              <Row>
                <Col span="12">
                  <Input-number :max="64" :min="10" v-model="config.danmakuFontSize"></Input-number>
                </Col>
                <Col span="12">
                  <p>px</p>
                </Col>
              </Row>
            </Form-item>
            <Form-item label="窗口最大高度" v-if="config.lockWindowHeight">
              <Row>
                <Col span="12">
                  <Input-number :min="1" v-model="config.danmakuMaxHeight"></Input-number>
                </Col>
                <Col span="12">
                  <p>px</p>
                </Col>
              </Row>
            </Form-item>
            <Form-item label="背景不透明度">
              <Slider v-model="config.danmakuBackgroundOpacity" :max="100" :min="0" :tip-format="opacityTip"></Slider>
            </Form-item>
          </Form>
          <Row class="config-row">
            <Button type="info" @click="sendTestDanmaku">发送测试弹幕</Button>
          </Row>
          <Row class="config-row">
            <Col span="12">
              <Checkbox v-model="config.useNotification">启用系统通知</Checkbox>
            </Col>
            <Col span="12">
              <Checkbox v-model="config.useTTS">启动语音播报</Checkbox>
            </Col>
          </Row>
          <Form label-position="left" :label-width="96">
            <Form-item label="声音">
              <Select v-model="ttsConfig.voice" filterable>
                <Option v-for="voice in voiceList" :value="voice.idx" :key="voice.name">{{ voice.name }}</Option>
              </Select>
            </Form-item>
            <Form-item label="音高">
              <Slider v-model="ttsConfig.pitch" :min="0" :max="20" :tip-format="pitchTip"></Slider>
            </Form-item>
            <Form-item label="语速">
              <Slider v-model="ttsConfig.rate" :min="5" :max="30" :tip-format="rateTip"></Slider>
            </Form-item>
            <Form-item label="音量">
              <Slider v-model="ttsConfig.volume" :min="0" :max="100" :tip-format="volumeTip"></Slider>
            </Form-item>
          </Form>
        </Card>
      </Col>
      <Col span="8" class="tile-col">
        <Card class="tile-card">
          <p slot="title">展示弹幕</p>
          <Row class="config-row">
            <Col span="12">
              <Checkbox v-model="config.welcomeMessage">老爷进入提示</Checkbox>
            </Col>
            <Col span="12">
              <Checkbox v-model="config.welcomeGuardMessage">舰队进入提示</Checkbox>
            </Col>
          </Row>
          <Row class="config-row">
            <Col span="12">
              <Checkbox v-model="config.giftMessage">赠送礼物提示</Checkbox>
            </Col>
            <Col span="12">
              <Checkbox v-model="config.guardBuyMessage">舰队购买提示</Checkbox>
            </Col>
          </Row>
          <Row class="config-row">
            <Col span="12">
              <Checkbox v-model="config.newFansMessage">房间关注提示</Checkbox>
            </Col>
            <Col span="12">
              <Checkbox v-model="config.blockMessage">禁言用户提示</Checkbox>
            </Col>
          </Row>
        </Card>
        <Card class="tile-card">
          <p slot="title">评论弹幕组成</p>
          <Row class="config-row">
            <Col span="12">
              <Checkbox v-model="config.showUserLevel">用户等级</Checkbox>
            </Col>
            <Col span="12">
              <Checkbox v-model="config.showUserBadge">粉丝勋章</Checkbox>
            </Col>
          </Row>
          <Row class="config-row">
            <Col span="12">
              <Checkbox v-model="config.showUserVIP">年费标识</Checkbox>
            </Col>
            <Col span="12">
              <Checkbox v-model="config.showUserGuard">舰队标识</Checkbox>
            </Col>
          </Row>
          <Row class="config-row">
            <Col span="12">
              <Checkbox v-model="config.showUserTitle">活动头衔</Checkbox>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
export default {
  data () {
    return {
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
        lockWindowHeight: false,
        danmakuMaxHeight: 600,
        danmakuBackgroundOpacity: 80,
        useWebsocket: true,
        useHttps: false,
        useNotification: false,
        useTTS: false
      },
      ttsConfig: {
        voice: 0,
        pitch: 10,
        rate: 10,
        volume: 100
      },
      voiceList: [
        {
          idx: 0,
          name: 'Ting-Ting zh-CN'
        }
      ]
    }
  },
  computed: {
    roomId: {
      get () {
        return this.$store.state.roomId
      },
      set (val) {
        this.$store.dispatch({
          type: 'UPDATE_ROOMID',
          roomId: val
        })
      }
    },
    userService () {
      return this.$store.state.userService
    },
    danmakuService () {
      return this.$store.state.danmakuService
    },
    danmakuServiceStatus () {
      return this.$store.state.danmakuServiceStatus
    },
    roomInfo () {
      return this.$store.state.roomInfo
    },
    areaList () {
      return this.$store.state.areaList
    },
    areaMap () {
      if (!this.areaList) return null
      return this.areaList.reduce((map, area) => {
        map[area.id] = area.name
        area.list.forEach(subArea => {
          map[subArea.id] = area.name + '·' + subArea.name
        })
        return map
      }, {})
    },
    liveStartTime () {
      if (!this.roomInfo || !this.roomInfo.liveStartTime) return ''
      return new Date(this.roomInfo.liveStartTime).toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1")
    }
  },
  watch: {
    config: {
      handler: function () {
        this.saveConfig()
      },
      deep: true
    },
    ttsConfig: {
      handler: function () {
        this.saveTTSConfig()
      },
      deep: true
    },
    'config.useGiftEnd' (val) {
      this.danmakuService.setUseGiftBundle(val)
    },
    'config.useTTS' (val) {
      if (!val) {
        let synth = speechSynthesis
        synth.cancel()
      }
    },
    'config.hideToolbar' () {
      this.$electron.ipcRenderer.send('setHideToolbar', this.config.hideToolbar)
    }
  },
  created () {
    this.config = this.$store.state.config
    this.ttsConfig = this.$store.state.ttsConfig
    window.speechSynthesis.onvoiceschanged = () => {
      this.setVoiceList()
    }
  },
  mounted () {
    setTimeout(() => {
      this.setVoiceList()
    }, 1000)
  },
  methods: {
    saveConfig () {
      this.$store.dispatch({
        type: 'UPDATE_CONFIG',
        config: this.config
      })
    },
    saveTTSConfig () {
      this.$store.dispatch({
        type: 'UPDATE_TTS_CONFIG',
        ttsConfig: this.ttsConfig
      })
    },
    startDanmakuService () {
      if (!this.roomId) return
      this.$store.dispatch({
        type: 'START_DANMAKU_SERVICE'
      })
    },
    sendTestDanmaku () {
      this.$electron.ipcRenderer.send('sendDanmaku', [{
        type: 'test',
        content: '弹幕测试',
        ts: new Date().getTime()
      }])
    },
    setVoiceList () {
      this.voiceList = window.speechSynthesis.getVoices().map((voice, idx) => ({
        idx: idx,
        name: `${voice.name} ${voice.lang}`
      }))
    },
    pitchTip (val) {
      return val/10
    },
    rateTip (val) {
      return val/10 + 'x'
    },
    volumeTip (val) {
      return val + '%'
    },
    opacityTip (val) {
      return val + '%'
    }
  }
}
</script>

<style lang="stylus" scoped>
.row+.row
  margin-top 10px
.danmaku-config
  display flex
  flex-direction column
.config-row
  margin-bottom 8px
.info-row
  margin-bottom 0
.power-btn
  float right
  margin-right 1px
.ivu-form-item
  margin-bottom 4px
.tile-row
  flex 1
.tile-col
  height 100%
  display flex
  flex-direction column
.tile-card
  flex 1
.tile-card + .tile-card
  margin-top 8px
.connect-card
  flex 0.25
.round-color
  color #ff9900
.live-color
  color #19be6b
.prepare-color
  color #2d8cf0
.room-cover
  display inline-block
  max-width 100%
  height auto
  max-height 160px
</style>
