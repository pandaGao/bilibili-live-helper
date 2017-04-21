<template>
  <div class="history-page">
    <div class="history-danmaku-list" ref="list">
      <div class="history-danmaku-box" v-for="danmaku in danmakuList">
        <div v-if="danmaku.type == 'connected'" class="msg-connected">弹幕服务器连接成功...</div>
        <div v-else-if="danmaku.type == 'error'" class="msg-error">连接发生错误，3秒后自动重连...</div>
        <div v-else-if="danmaku.type == 'live'" class="msg-live">开始直播啦！</div>
        <div v-else-if="danmaku.type == 'preparing'" class="msg-preparing">直播已结束，下次再见！</div>
        <div v-else-if="danmaku.type == 'welcome'" class="msg-welcome">
          <span v-if="danmaku.user.isVIP" class="vip-user">爷</span>
          <span v-if="danmaku.user.isSVIP" class="svip-user">爷</span>
          <span class="user-name">{{ danmaku.user.name }}</span>
          <span class="welcome-message">进入直播间</span>
        </div>
        <div v-else-if="danmaku.type == 'welcomeGuard'" class="msg-welcome-guard">
          <span v-if="danmaku.user.guard == 1" class="guard-user" :class="userGuardLevel(danmaku.user.guard)">总督</span>
          <span v-if="danmaku.user.guard == 2" class="guard-user" :class="userGuardLevel(danmaku.user.guard)">提督</span>
          <span v-if="danmaku.user.guard == 3" class="guard-user" :class="userGuardLevel(danmaku.user.guard)">舰长</span>
          <span class="user-name">{{ danmaku.user.name }}</span>
          <span class="welcome-message">进入直播间</span>
        </div>
        <div v-else-if="danmaku.type == 'comment'" class="msg-comment">
          <span v-if="danmaku.user.isAdmin" class="admin-user">管</span>
          <span v-if="danmaku.user.guard == 1" class="guard-user" :class="userGuardLevel(danmaku.user.guard)">总督</span>
          <span v-if="danmaku.user.guard == 2" class="guard-user" :class="userGuardLevel(danmaku.user.guard)">提督</span>
          <span v-if="danmaku.user.guard == 3" class="guard-user" :class="userGuardLevel(danmaku.user.guard)">舰长</span>
          <span v-if="danmaku.user.isSVIP" class="svip-user">爷</span>
          <span v-else-if="danmaku.user.isVIP" class="vip-user">爷</span>
          <span v-if="danmaku.user.badge" class="user-badge" :class="userBadgeLevelColor(danmaku.user.badge.level)">{{ danmaku.user.badge.title+danmaku.user.badge.level }}</span>
          <span v-if="danmaku.user.level" class="user-level" :class="userLevelColor(danmaku.user.level)">{{ "UL "+danmaku.user.level }}</span>
          <span class="user-name">{{ danmaku.user.name }}:</span>
          <span class="user-comment">{{ danmaku.comment }}</span>
        </div>
        <div v-else-if="danmaku.type == 'gift'" class="msg-gift">
          <span class="user-name">{{ danmaku.user.name }}</span>
          <span class="gift-action">赠送</span>
          <span class="gift-img"><img :src="giftImage(danmaku.gift.id)"></span>
          <span class="user-gift">{{ `${danmaku.gift.name} × ${danmaku.gift.count}` }}</span>
        </div>
        <div v-else-if="danmaku.type == 'guardBuy'" class="msg-guard-buy">
          <span class="user-name">{{ danmaku.user.name }}</span>
          <span class="buy-msg">购买</span>
          <span v-if="danmaku.level == 1" class="guard-user" :class="userGuardLevel(danmaku.level)">总督</span>
          <span v-if="danmaku.level == 2" class="guard-user" :class="userGuardLevel(danmaku.level)">提督</span>
          <span v-if="danmaku.level == 3" class="guard-user" :class="userGuardLevel(danmaku.level)">舰长</span>
          <span class="buy-count">{{ `× ${danmaku.count}` }}</span>
        </div>
        <div v-else-if="danmaku.type == 'block'" class="msg-block">
          <span class="user-name">{{ danmaku.user.name }}</span>
          <span class="block-msg">被管理员禁言</span>
        </div>
        <div v-else-if="danmaku.type == 'newFans'" class="msg-new-fans">
          <span class="user-name">{{ danmaku.user.name }}</span>
          <span class="follow-msg">关注了直播间</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        win: null
      }
    },
    computed: {
      danmakuList () {
        return this.$root.danmakuPool.filter((danmaku) => {
          return (danmaku.type === 'welcome' || danmaku.type === 'welcomeGuard' || danmaku.type === 'comment' || danmaku.type === 'gift' || danmaku.type === 'guardBuy' || danmaku.type === 'block' || danmaku.type === 'newFans')
        })
      }
    },
    mounted () {
      this.$electron.remote.getCurrentWindow().setIgnoreMouseEvents(false)
      this.$nextTick(() => {
        this.$refs.list.scrollTop = this.$refs.list.scrollHeight
      })
    },
    methods: {
      userLevelColor (level) {
        return "user-level-"+Math.ceil(Number(level)/10)
      },
      userBadgeLevelColor (level) {
        return "user-badge-level-"+Math.ceil(Number(level)/4)
      },
      userGuardLevel (level) {
        return "guard-user-"+level
      },
      giftImage (id) {
        return `http://static.hdslb.com/live-static/live-room/images/gift-section/gift-${id}.png`
      }
    }
  }
</script>

<style lang="stylus">
.history-danmaku-list
  position absolute
  left 0
  bottom 0
  width 100%
  height 100%
  border-radius 5px
  overflow-y scroll
  background-color rgba(25,25,25,.8)
  &::-webkit-scrollbar
    width 4px
  &::-webkit-scrollbar-track
    -webkit-box-shadow inset 0 0 6px rgba(0,0,0,0.6)
  &::-webkit-scrollbar-thumb
    background-color #666

.history-danmaku-box
  padding 4px 8px
  font-size 14px
  line-height 20px
  user-select none
  cursor default
  color #fff
  .admin-user
    padding 1px 2px
    border-radius 4px
    background-color #ea9336
  .vip-user
    padding 1px 2px
    border-radius 4px
    background-color #f25d8e
  .svip-user
    padding 1px 2px
    border-radius 4px
    background-color #ffb100
  .user-name
    color #4fc1e9
  .user-level
    padding 1px 2px
    border-radius 4px
    border-width 1px
    border-style solid
  .user-level-1
    color #939393
  .user-level-2
    color #5dbb57
  .user-level-3
    color #5595d9
  .user-level-4
    color #9a65ed
  .user-level-5
    color #fc84ae
  .user-level-6
    color #fc953a
  .user-badge
    padding 1px 2px
    border-radius 4px
  .user-badge-level-1
    background-color #64d07b
  .user-badge-level-2
    background-color #20bdf2
  .user-badge-level-3
    background-color #9951db
  .user-badge-level-4
    background-color #f1586c
  .user-badge-level-5
    background-color #f2c31d
  .guard-user
    padding 1px 2px
    border-radius 4px
    border-width 1px
    border-style solid
  .guard-user-1
    color #e1dfcc
  .guard-user-2
    color #e3efef
  .guard-user-3
    color #e6c28b
  .msg-gift
    .gift-img > img
      height 32px
    .user-name
      color #ff8f34
</style>
