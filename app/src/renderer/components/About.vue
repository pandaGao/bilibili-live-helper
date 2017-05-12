<template>
  <div class="about-page">
    <div class="title">Bilibili直播弹幕姬</div>
    <div class="row">
      <div>
        <p>非常感谢你对这个项目的支持 如果在使用中遇到任何问题或者有任何建议 可以到B站私信我 或者发送邮件到 me@pandagao.com</p>
        <p>同时也欢迎到GitHub上提issue和PR 很希望能和各位一起完善这个项目</p>
      </div>
    </div>
    <div class="row">
      <div class="version">当前版本 {{version}}</div>
    </div>
    <div class="row">
      <div>直播弹幕姬官网 <span class="url" @click="gotoDanmakuWebsite">bilibili.danmaku.live</span></div>
    </div>
    <div class="row">
      <div class="author">作者 Ryan Gao</div>
    </div>
    <div class="row">
      <button class="button github" @click="gotoGithub">GitHub</button>
      <button class="button bilibili" @click="gotoBilibili">bilibili- ( ゜- ゜)つロ 乾杯~</button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  computed: {
    version () {
      return this.$root.version
    }
  },
  methods: {
    gotoDanmakuWebsite () {
      this.$electron.shell.openExternal('http://bilibili.danmaku.live')
    },
    gotoGithub () {
      this.$electron.shell.openExternal('https://github.com/pandaGao/bilibili-live-helper')
    },
    gotoBilibili () {
      this.$electron.shell.openExternal('http://live.bilibili.com/92052')
    }
  }
}
</script>

<style lang="stylus">
.about-page
  .button
    margin-right 8px
  .url
    color #66ccff
    text-decoration underline
    cursor pointer
  .github
    padding 3px 4px
    border-radius 4px
    color black
    background-color white
    font-weight bold
  .bilibili
    padding 3px 4px
    border-radius 4px
    color white
    background-color #f25d8e
    font-weight bold
</style>
