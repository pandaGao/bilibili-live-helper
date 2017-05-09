<template>
  <div>
    <button class="button" @click="login">login</button>
  </div>
</template>

<script>

export default {
  data () {
    return {
      cookie: ''
    }
  },
  methods: {
    login () {
      this.$electron.ipcRenderer.send('openLogin')
    }
  }
}
</script>

<style lang="stylus">
webview
  margin-left -45px
  height 400px
</style>
