<template>
  <div>
    <div class="row">
      <div class="field">
        <input class="room-input" type="text" placeholder="请输入房间号" v-model="roomId" @keyup.enter="setRoomId"><button class="button room-button" @click="setRoomId">开启弹幕姬</button>
      </div>
    </div>
    <div class="title">接收弹幕种类</div>
    <div class="row">
      <div class="field">
        <checkbox v-model="config.welcomeMessage" label="老爷进入提示"></checkbox>
      </div>
      <div class="field">
        <checkbox v-model="config.welcomeGuardMessage" label="舰队进入提示"></checkbox>
      </div>
    </div>
    <div class="row">
      <div class="field">
        <checkbox v-model="config.giftMessage" label="赠送礼物提示"></checkbox>
      </div>
      <div class="field">
        <checkbox v-model="config.guardBuyMessage" label="舰队购买提示"></checkbox>
      </div>
    </div>
    <div class="row">
      <div class="field">
        <checkbox v-model="config.newFansMessage" label="房间关注提示"></checkbox>
      </div>
      <div class="field">
        <checkbox v-model="config.blockMessage" label="禁言提示"></checkbox>
      </div>
    </div>
    <div class="title">评论弹幕组成</div>
    <div class="row">
      <div class="field">
        <checkbox v-model="config.showUserLevel" label="用户等级"></checkbox>
      </div>
      <div class="field">
        <checkbox v-model="config.showUserBadge" label="用户勋章"></checkbox>
      </div>
    </div>
    <div class="row">
      <div class="field">
        <checkbox v-model="config.showUserVIP" label="年费标识"></checkbox>
      </div>
      <div class="field">
        <checkbox v-model="config.showUserGuard" label="舰队标识"></checkbox>
      </div>
    </div>
    <div class="title">弹幕视图设置</div>
    <div class="row">
      <div class="field">
        <checkbox v-model="config.useGiftEnd" label="礼物打包提示"></checkbox>
      </div>
      <div class="field">
        <checkbox v-model="config.hideToolbar" label="游戏模式"></checkbox>
      </div>
    </div>
    <div class="row">
      <div class="field">
        <numberinput v-model="config.danmakuFontSize" label="弹幕文字大小" unit="px"></numberinput>
      </div>
    </div>
    <div class="row">
      <div class="field">
        <numberinput v-model="config.danmakuDisplayTime" label="弹幕停留时间" unit="秒"></numberinput>
      </div>
    </div>
  </div>
</template>

<script>
import Checkbox from '../utils/Checkbox'
import Numberinput from '../utils/NumberInput'

export default {
  components: {
    Checkbox,
    Numberinput
  },
  data () {
    return {
      roomId: ''
    }
  },
  computed: {
    config () {
      return this.$root.config
    },
    rootRoomId () {
      return this.$root.roomId
    }
  },
  watch: {
    rootRoomId (newVal) {
      this.roomId = newVal
    }
  },
  mounted () {
    this.roomId = this.$root.roomId
  },
  methods: {
    setRoomId () {
      if (this.roomId === 'test') {
        this.$root.currentPage = 'test'
        return
      }
      if (this.roomId) {
        this.$root.roomId = this.roomId
        this.$root.currentPage = 'danmaku'
      }
    }
  }
}
</script>

<style lang="css">
</style>
