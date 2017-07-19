<template>
  <div>
    <h4 class="title">Bilibili直播弹幕姬</h4>
    <p>当前版本: {{version}}</p>
    <br>
    <p>非常感谢你对这个项目的支持 如果在使用中遇到任何问题或者有任何建议 可以到B站私信我</p>
    <p>或者发送邮件到 me@pandagao.com</p>
    <p>同时也欢迎到GitHub上提issue和PR 很希望能和各位一起完善这个项目</p>
    <div>直播弹幕姬官网 <span class="url" @click="gotoDanmakuWebsite">bilibili.danmaku.live</span></div>
    <div class="author">作者 Ryan Gao</div>
    <div>
      <Button class="github" type="ghost" size="small" @click="gotoGithub">GitHub</Button>
      <Button class="bilibili" type="ghost" size="small" @click="gotoBilibili">bilibili- ( ゜- ゜)つロ 乾杯~</Button>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    version () {
      return this.$store.state.version
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

<style lang="stylus" scoped>
.title
  margin-bottom 8px
.button
  margin-right 8px
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
  font-weight bold
</style>
