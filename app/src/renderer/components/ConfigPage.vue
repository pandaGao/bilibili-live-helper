<template>
  <div class="config-page">
    <div class="form">
      <input class="input is-small" type="text" placeholder="请输入房间号" v-model="roomId" @keyup.enter="setRoomId">
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        roomId: '',
        win: null
      }
    },
    computed: {
      config () {
        return this.$root.config
      }
    },
    mounted () {
      this.roomId = this.config.roomId
      this.win = this.$electron.remote.getCurrentWindow()
      this.win.setIgnoreMouseEvents(false)
    },
    methods: {
      setRoomId () {
        if (this.roomId) {
          this.config.roomId = this.roomId
          this.$root.currentPage = 'danmaku'
        }
      }
    }
  }
</script>

<style lang="stylus">
.config-page
  position absolute
  bottom 0
  width 100%
  padding 16px 8px
  border-radius 5px
  background-color rgba(0,0,0,0.6)
  overflow hidden

input
  padding 2px 4px
  border 0
  border-bottom 1px solid rgba(255,255,255,0.6)
  font-size 14px
  outline 0
  color #fff
  background-color rgba(0,0,0,0)
  &::-webkit-input-placeholder
    color #fff
</style>
