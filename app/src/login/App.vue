<template>
  <div>
    <webview ref="webview" src="https://passport.bilibili.com/ajax/miniLogin/minilogin"></webview>
  </div>
</template>

<script>
export default {
  mounted () {
    let webview = this.$refs.webview
    webview.addEventListener('will-navigate', () => {
      webview.getWebContents().session.cookies.get({url: 'http://www.bilibili.com'}, (err, cookies) => {
        let cookie = cookies.map(cookie => {
          return `${cookie.name}=${cookie.value}`
        }).join(';')
        this.$electron.ipcRenderer.send('closeLogin', cookie)
      })
    })
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

webview
  position absolute
  margin-top -76px
  margin-left -40px
  width 420px
  height 393px
</style>
