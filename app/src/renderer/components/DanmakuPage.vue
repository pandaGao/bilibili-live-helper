<template>
  <div class="danmaku-page" ref="page">
    <div class="danmaku-list" ref="list">
      <transition-group name="danmaku">
        <div class="danmaku-box" v-for="danmaku in visibleDanmakuList" :key="danmaku">
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
            <span v-if="danmaku.user.guard == 1 && config.showUserGuard" class="guard-user" :class="userGuardLevel(danmaku.user.guard)">总督</span>
            <span v-if="danmaku.user.guard == 2 && config.showUserGuard" class="guard-user" :class="userGuardLevel(danmaku.user.guard)">提督</span>
            <span v-if="danmaku.user.guard == 3 && config.showUserGuard" class="guard-user" :class="userGuardLevel(danmaku.user.guard)">舰长</span>
            <span v-if="danmaku.user.isSVIP && config.showUserVIP" class="svip-user">爷</span>
            <span v-else-if="danmaku.user.isVIP && config.showUserVIP" class="vip-user">爷</span>
            <span v-if="danmaku.user.badge && config.showUserBadge" class="user-badge" :class="userBadgeLevelColor(danmaku.user.badge.level)">{{ danmaku.user.badge.title+danmaku.user.badge.level }}</span>
            <span v-if="danmaku.user.level && config.showUserLevel" class="user-level" :class="userLevelColor(danmaku.user.level)">{{ "UL "+danmaku.user.level }}</span>
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
          <div v-else>{{ danmaku }}</div>
        </div>
      </transition-group>
    </div>
    <div class="toolbar">
      <div class="online item">房间人数<span>{{ roomOnlineNumber }}</span></div>
      <div class="online item">关注人数<span>{{ fansNumber }}</span></div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        win: null,
        poolPointer: -1,
        visibleDanmakuList: []
      }
    },
    computed: {
      config () {
        return this.$root.config
      },
      danmakuPool () {
        return this.$root.danmakuPool
      },
      roomOnlineNumber () {
        return this.$root.roomOnlineUser
      },
      fansNumber () {
        return this.$root.roomFans
      }
    },
    watch: {
      danmakuPool () {
        this.updateDanmaku()
      }
    },
    mounted () {
      this.$electron.remote.getCurrentWindow().setIgnoreMouseEvents(true)
      this.updateDanmaku()
      if (this.config.danmakuDisplayTime < 5) {
        this.config.danmakuDisplayTime = 5
      }
      if (this.config.danmakuDisplayTime > 999) {
        this.config.danmakuDisplayTime = 999
      }
    },
    methods: {
      addDanmaku (payload) {
        this.visibleDanmakuList.push(payload)
        setTimeout(() => {
          this.removeDanmaku()
        }, this.config.danmakuDisplayTime*1000)
      },
      removeDanmaku () {
        this.visibleDanmakuList.splice(0,1)
      },
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
      },
      updateDanmaku () {
        let len = this.danmakuPool.length
        if (this.poolPointer < 0) {
          this.poolPointer = Math.max(0, len-10)
        }
        for (let i = this.poolPointer; i < len; i++) {
          let msg = this.danmakuPool[i]
          if (this.config[msg.type+'Message']) {
            this.addDanmaku(msg)
          }
        }
        this.poolPointer = len
      }
    }
  }
</script>

<style lang="stylus">
.danmaku-page
  overflow hidden

.toolbar
  position absolute
  left 0
  bottom 0
  width 100%
  display flex
  border-radius 5px
  overflow hidden
  .item
    flex 1
    color #fff
    background-color rgba(25,25,25,.8)
  .item + .item
    margin-left 1px
  .online
    display inline-block
    padding 5px 8px
    font-size 14px
    line-height 16px
    flex 3
    span
      float right

.danmaku-enter
  opacity 0
  transform translateY(100%)
.danmaku-leave-to
  opacity 0
  transform translateY(-75%)
.danmaku-enter-active
  transition all 1s
.danmaku-leave-active
  transition all 1s

.danmaku-list
  position absolute
  left 0
  bottom 27px
  width 100%
  border-radius 5px
  overflow hidden
  background-color rgba(25,25,25,.8)

.danmaku-box
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
    background-color #61decb
  .user-badge-level-2
    background-color #5896de
  .user-badge-level-3
    background-color #a068f1
  .user-badge-level-4
    background-color #ff86b2
  .user-badge-level-5
    background-color #f6be18
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
