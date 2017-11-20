<template>
  <div>
    <h4 class="title">Bilibili直播弹幕库</h4>
    <p>当前版本: {{ version }}</p>
    <h4 v-if="needUpdate">最新版本: {{ latestVersion }} 请点击下方官网链接前往下载</h4>
    <p v-else>已是最新版本</p>
    <br>
    <p>首先 非常感谢你对这个项目的支持!</p>
    <p>如果在使用中遇到任何问题或者有任何建议 可以通过以下方式联系到我</p>
    <Row class="info-row">
      <Col span="6">① B站私信 </Col>
      <Col span="12"><Button class="bilibili" type="ghost" size="small" @click="gotoBilibili">bilibili- ( ゜- ゜)つロ 乾杯~</Button></Col>
    </Row>
    <Row class="info-row">
      <Col span="6">② QQ群 552745835 </Col>
      <Col span="12"><Button class="qq" type="info" size="small" @click="gotoQQ">QQ群 请备注B站昵称</Button></Col>
    </Row>
    <Row class="info-row">
      <Col span="6">③ Github Issue </Col>
      <Col span="12"><Button class="github" type="ghost" size="small" @click="gotoGithub">GitHub</Button></Col>
    </Row>
    <Row class="info-row">
      <Col span="6">④ 发送邮件至 </Col>
      <Col span="12">me@pandagao.com</Col>
    </Row>
    <p>同时也欢迎到GitHub上提PR 很希望能和各位一起完善这个项目</p>
    <br>
    <div>直播弹幕库官网 <span class="url" @click="gotoDanmakuWebsite">bilibili.danmaku.live</span></div>
    <div class="author">作者 清古</div>
    <br>
    <br>
    <p>最后 如果希望支持一下这个项目 可以通过下方的二维码进行赞助</p>
    <Row class="qrcode-row">
      <Col span="4">
        <img class="qrcode-logo" :src="wechatLogo">
        <img class="qrcode" :src="wechatQRCode">
      </Col>
      <Col span="4">
        <img class="qrcode-logo" :src="alipayLogo">
        <img class="qrcode" :src="alipayQRCode">
      </Col>
    </Row>
    <p>赞助时请务必留下B站昵称哦</p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      wechatLogo: 'imgs/wechat_logo.png',
      wechatQRCode: 'imgs/wechat_qrcode.png',
      alipayLogo: 'imgs/alipay_logo.png',
      alipayQRCode: 'imgs/alipay_qrcode.png',
    }
  },
  computed: {
    version () {
      return this.$store.state.version
    },
    needUpdate () {
      return this.$store.state.needUpdate
    },
    latestVersion () {
      return this.$store.state.latestVersion
    }
  },
  methods: {
    gotoDanmakuWebsite () {
      this.$electron.shell.openExternal('http://bilibili.danmaku.live')
    },
    gotoQQ () {
      this.$electron.shell.openExternal('https://shang.qq.com/wpa/qunwpa?idkey=63117d1a50d396d6b009af1b6afc41a8fa952356963e7853f7157c23adf698f1')
    },
    gotoGithub () {
      this.$electron.shell.openExternal('https://github.com/pandaGao/bilibili-live-helper')
    },
    gotoBilibili () {
      this.$electron.shell.openExternal('http://space.bilibili.com/1326986')
    }
  }
}
</script>

<style lang="stylus" scoped>
.title
  margin-bottom 8px
.button
  margin-right 8px
.info-row
  margin 4px 0
.url
  color #66ccff
  text-decoration underline
  cursor pointer
.github
  color black
  background-color white
  font-weight bold
.bilibili
  color white
  background-color #f25d8e
  border-color #f25d8e
  font-weight bold
.qrcode-row
  margin-top 4px
.qrcode-logo
  display block
  height 24px
.qrcode
  width 100px

</style>
