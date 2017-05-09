<template>
  <div class="config-page">
    <danmaku-config></danmaku-config>
    <user-config></user-config>
  </div>
</template>

<script>
  import UserConfig from './UserConfig.vue'
  import DanmakuConfig from './DanmakuConfig.vue'

  export default {
    components: {
      DanmakuConfig,
      UserConfig
    },
    data () {
      return {
        currentConfig: 'danmaku'
      }
    },
    computed: {
      config () {
        return this.$root.config
      }
    },
    mounted () {
      this.$electron.remote.getCurrentWindow().setIgnoreMouseEvents(false)
    },
    methods: {
      gotoTab (tab) {
        this.currentConfig = tab
      },
      gotoGithub () {
        this.$electron.shell.openExternal('https://github.com/pandaGao/bilibili-live-helper')
      }
    }
  }
</script>

<style lang="stylus">
.config-menu
  position fixed
  top 0
  left 0
  display flex
  width 100%
  border-radius 5px
  overflow hidden
  .item
    flex 1
    padding 5px 8px
    font-size 14px
    line-height 16px
    text-align center
    background-color rgba(25,25,25,.8)
  .item + .item
    margin-left 1px

.config-page
  position absolute
  top 0
  width 100%
  height 100%
  padding 8px 8px 0 8px
  border-radius 5px
  background-color rgba(25,25,25,.8)
  overflow-y scroll
  color #fff
  font-size 14px
  &::-webkit-scrollbar
    width 4px
  &::-webkit-scrollbar-thumb
    background-color #666

.row
  display flex
  padding 6px 8px
  user-select none
  .text
    flex 1
    font-size 14px
    line-height 16px

.field
  flex 1
  label
    user-select none
  .room-input
    width 10em
    border-top-left-radius 4px
    border-bottom-left-radius 4px
    border-color #66ccff
    color #66ccff
    &::-webkit-input-placeholder
      color #66ccff
  .room-button
    padding 6px
    border 1px solid #66ccff
    border-top-right-radius 4px
    border-bottom-right-radius 4px
    vertical-align bottom
    background-color rgba(0,0,0,0)
    color #66ccff

.title
  margin 16px 8px
  margin-bottom 4px
  border-bottom 1px solid #66ccff
  font-size 16px
  color #66ccff

.info
  float right
  .github-page
    margin-left 1em
    color #66ccff
    cursor pointer

input[type="checkbox"]
  vertical-align middle

input[type="text"]
  padding 6px 8px
  border 0
  border 1px solid #fff
  border-right 0
  vertical-align bottom
  font-size 14px
  line-height 16px
  outline 0
  background-color rgba(0,0,0,0)

</style>
