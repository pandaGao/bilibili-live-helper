<template>
  <div class="history-container">
    <Row :gutter="8" class="tile-row">
      <Col class="tile-col" span="12">
        <Card class="tile-card">
          <p slot="title">历史弹幕设置</p>
          <Form label-position="left" :label-width="96">
            <Form-item label="过滤弹幕">
              <Row>
                <Col span="12">
                  <Checkbox v-model="historyConfig.welcomeMessage">老爷进入弹幕</Checkbox>
                </Col>
                <Col span="12">
                  <Checkbox v-model="historyConfig.welcomeGuardMessage">舰队进入弹幕</Checkbox>
                </Col>
              </Row>
            </Form-item>
            <Form-item>
              <Row>
                <Col span="12">
                  <Checkbox v-model="historyConfig.giftMessage">赠送礼物弹幕</Checkbox>
                </Col>
                <Col span="12">
                  <Checkbox v-model="historyConfig.guardBuyMessage">舰队购买弹幕</Checkbox>
                </Col>
              </Row>
            </Form-item>
            <Form-item>
              <Row>
                <Col span="12">
                  <Checkbox v-model="historyConfig.newFansMessage">房间关注弹幕</Checkbox>
                </Col>
                <Col span="12">
                  <Checkbox v-model="historyConfig.blockMessage">禁言用户弹幕</Checkbox>
                </Col>
              </Row>
            </Form-item>
            <Form-item>
              <Row>
                <Col span="12">
                  <Checkbox v-model="historyConfig.commentMessage">评论弹幕</Checkbox>
                </Col>
              </Row>
            </Form-item>
            <Form-item label="其他功能">
              <Row>
                <Col span="12">
                  <Checkbox v-model="historyConfig.useBlock">快速禁言</Checkbox>
                </Col>
                <Col span="12">
                  <Checkbox v-model="historyConfig.useAdmin">任命房管</Checkbox>
                </Col>
              </Row>
            </Form-item>
            <Form-item>
              <Row>
                <Col span="12">
                  <Checkbox v-model="historyConfig.lockDanmakuList">锁定弹幕列表</Checkbox>
                </Col>
              </Row>
            </Form-item>
          </Form>
        </Card>
        <Card class="tile-card">
          <p slot="title">弹幕发送设置</p>
          <Form label-position="left" :label-width="96">
            <Form-item label="弹幕位置">
              <Radio-group v-model="danmakuMode">
                <Radio label="scroll">滚动</Radio>
                <Radio label="top">顶部</Radio>
                <Radio label="bottom">底部</Radio>
              </Radio-group>
            </Form-item>
            <Form-item label="弹幕颜色">
              <Radio-group v-model="danmakuColor">
                <Radio label="white"><span class="danmaku-color-option color-white"></span></Radio>
                <Radio label="red"><span class="danmaku-color-option color-red"></span></Radio>
                <Radio label="blue"><span class="danmaku-color-option color-blue"></span></Radio>
                <Radio label="purple"><span class="danmaku-color-option color-purple"></span></Radio>
                <Radio label="cyan"><span class="danmaku-color-option color-cyan"></span></Radio>
                <Radio label="green"><span class="danmaku-color-option color-green"></span></Radio>
                <Radio label="yellow"><span class="danmaku-color-option color-yellow"></span></Radio>
                <Radio label="orange"><span class="danmaku-color-option color-orange"></span></Radio>
                <Radio label="pink"><span class="danmaku-color-option color-pink"></span></Radio>
              </Radio-group>
            </Form-item>
          </Form>
          <Input v-model="danmakuContent" type="textarea" placeholder="请输入弹幕内容，按回车发送" :rows="4" @on-enter="sendMessage"></Input>
          <div class="danmaku-send-btn">
            <Button type="text" size="small">弹幕长度: {{danmakuContent.length}}</Button>
            <Button type="info" size="small" @click="sendMessage">发送</Button>
          </div>
        </Card>
      </Col>
      <Col class="tile-col" span="12">
        <Card class="tile-card danmaku-card">
          <p slot="title">历史弹幕列表</p>
          <div class="history-danmaku-list" ref="list"
            @mouseenter="enterDanmakuList"
            @mouseleave="leaveDanmakuList">
            <div class="history-danmaku-box" v-for="(danmaku, index) in danmakuPool">
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
                <span v-if="danmaku.user.guard > 0" class="guard-user" :class="userGuardLevel(danmaku.user.guard)"></span>
                <span class="user-name">{{ danmaku.user.name }}</span>
                <span class="welcome-message">进入直播间</span>
              </div>
              <div v-else-if="danmaku.type == 'comment'" class="msg-comment"
                @mouseenter="showCommentActions(index)"
                @mouseleave="hideCommentActions(index)">
                <span v-if="danmaku.user.guard > 0" class="guard-user" :class="userGuardLevel(danmaku.user.guard)"></span>
                <span v-if="danmaku.user.isAdmin" class="admin-user">管</span>
                <span v-if="danmaku.user.isSVIP" class="svip-user">爷</span>
                <span v-else-if="danmaku.user.isVIP" class="vip-user">爷</span>
                <span v-if="danmaku.user.badge" class="user-badge" :class="userBadgeLevelColor(danmaku.user.badge.level)"><span class="user-badge-title">{{ danmaku.user.badge.title }}</span><span class="user-badge-level">{{ danmaku.user.badge.level }}</span></span>
                <span v-if="danmaku.user.title" class="user-title"><img :src="titleImage(danmaku.user.title.source)"></span>
                <span v-if="danmaku.user.level" class="user-level" :class="userLevelColor(danmaku.user.level)">{{ "UL "+danmaku.user.level }}</span>
                <span class="user-name">{{ danmaku.user.name }}:</span>
                <span class="user-comment">{{ danmaku.comment }}</span>
                <span class="user-actions">
                  <Button v-if="hoverIndex == index && historyConfig.useBlock" type="error" size="small" @click="blockUser(danmaku.user.id)">禁言</Button>
                  <Button v-if="hoverIndex == index && historyConfig.useAdmin" type="warning" size="small" @click="setAdmin(danmaku.user.id)">任命房管</Button>
                </span>
              </div>
              <div v-else-if="danmaku.type == 'gift'" class="msg-gift">
                <span class="user-name">{{ danmaku.user.name }}</span>
                <span class="gift-action">赠送</span>
                <span class="gift-img"><img :src="getRoomGiftImage(danmaku.gift.id)"></span>
                <span class="user-gift">{{ `${danmaku.gift.name} × ${danmaku.gift.count}` }}</span>
              </div>
              <div v-else-if="danmaku.type == 'guardBuy'" class="msg-guard-buy">
                <span class="user-name">{{ danmaku.user.name }}</span>
                <span class="buy-msg">购买</span>
                <span class="guard-user-gift" :class="userGuardLevel(danmaku.level)"></span>
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
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import GiftImageMixin from '../../mixins/giftImage.js'

export default {
  mixins: [ GiftImageMixin ],
  data () {
    return {
      historyConfig: {
        welcomeMessage: true,
        welcomeGuardMessage: true,
        commentMessage: true,
        giftMessage: true,
        guardBuyMessage: true,
        newFansMessage: true,
        blockMessage: true,
        useBlock: true,
        useAdmin: false,
        lockDanmakuList: false
      },
      inDanmakuList: false,
      hoverIndex: -1,
      danmakuContent: ''
    }
  },
  computed: {
    danmakuPool () {
      return this.$store.state.danmakuPool.filter(msg => {
        return this.historyConfig[msg.type+'Message']
      })
    },
    userService () {
      return this.$store.state.userService
    },
    danmakuService () {
      return this.$store.state.danmakuService
    },
    danmakuMode: {
      get () {
        return this.$store.state.danmakuConfig.mode
      },
      set (val) {
        this.$store.dispatch({
          type: 'UPDATE_DANMAKU_MODE',
          mode: val
        })
      }
    },
    danmakuColor: {
      get () {
        return this.$store.state.danmakuConfig.color
      },
      set (val) {
        this.$store.dispatch({
          type: 'UPDATE_DANMAKU_COLOR',
          color: val
        })
      }
    }
  },
  watch: {
    danmakuPool () {
      if (!this.inDanmakuList && !this.historyConfig.lockDanmakuList) {
        this.$nextTick(() => {
          this.$refs.list.scrollTop = this.$refs.list.scrollHeight
        })
      }
    }
  },
  mounted () {
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
    titleImage (source) {
      if (!source) {
        return ''
      }
      let uri = source.replace('title-', 'title/')
      return `http://s1.hdslb.com/bfs/static/blive/live-assets/${uri}.png`
    },
    enterDanmakuList () {
      this.inDanmakuList = true
    },
    leaveDanmakuList () {
      this.inDanmakuList = false
    },
    showCommentActions (idx) {
      this.hoverIndex = idx
    },
    hideCommentActions (idx) {
      this.hoverIndex = -1
    },
    sendMessage () {
      if (!this.danmakuContent) {
        this.$Message.warning('请输入弹幕内容')
        return
      }
      if (!this.danmakuService) {
        this.$Message.warning('请先开启弹幕库')
        return
      }
      if (!this.userService) {
        this.$Message.warning('请先登录')
        return
      }
      this.userService.sendMessage(this.danmakuContent)
      this.danmakuContent = ''
      // this.userService.sendMessage(this.danmakuContent).then(res => {
      //   let msg = JSON.parse(res)
      //   if (msg.code == 0) {
      //     if (msg.msg) {
      //       this.$Message.warning(msg.msg)
      //     } else {
      //       this.$Message.success('弹幕发送成功')
      //       this.danmakuContent = ''
      //     }
      //   } else {
      //     this.$Message.warning(msg.msg)
      //   }
      // }, res => {
      //   this.$Message.error('网络错误')
      // })
    },
    blockUser (uid) {
      if (!this.userService) {
        this.$Message.warning('请先登录')
        return
      }
      this.userService.api.blockUser(uid, 720).then(res => {
        if (res.msg) {
          this.$Message.error(res.msg)
        } else {
          this.$Message.success('成功禁言该用户')
        }
      })
    },
    setAdmin (uid) {
      if (!this.userService) {
        this.$Message.warning('请先登录')
        return
      }
      this.userService.api.setAdmin(uid).then(res => {
        if (res.msg) {
          this.$Message.error(res.msg)
        } else {
          this.$Message.success('成功任命管理员')
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.history-container
  display flex
  flex-direction column
  padding 10px
  height 100%
.tile-row
  flex 1
.tile-col
  height 100%
  display flex
  flex-direction column
.tile-card
  flex 1
.tile-card + .tile-card
  margin-top 8px
.danmaku-color-option
  display inline-block
  width 20px
  height 20px
  vertical-align middle
  border 1px solid #999
  border-radius 4px
.color-white
  background-color #fff
.color-red
  background-color rgb(255, 104, 104)
.color-blue
  background-color rgb(102, 204, 255)
.color-purple
  background-color rgb(227, 63, 255)
.color-cyan
  background-color rgb(0, 255, 252)
.color-green
  background-color rgb(126, 255, 0)
.color-yellow
  background-color rgb(255, 237, 79)
.color-orange
  background-color rgb(255, 152, 0)
.color-pink
  background-color rgb(255, 115, 154)
.ivu-form-item
  margin-bottom 4px
.danmaku-send-btn
  float right
  margin-top 6px
.history-danmaku-list
  height 566px
  overflow-y scroll
  &::-webkit-scrollbar
    width 4px
  &::-webkit-scrollbar-thumb
    border-radius 4px
    background-color #666

.history-danmaku-box
  padding 4px 8px
  font-size 14px
  line-height 20px
  user-select none
  cursor default
  color #000
  position relative
  &:hover
    background-color rgba(99,99,99,.1)
  .admin-user
    padding 1px 2px
    border-radius 4px
    background-color #ea9336
    color #fff
  .vip-user
    padding 1px 2px
    border-radius 4px
    background-color #f25d8e
    color #fff
  .svip-user
    padding 1px 2px
    border-radius 4px
    background-color #ffb100
    color #fff
  .user-name
    color #4fc1e9
  .user-level
    padding 0 2px
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
    border-width 1px
    border-style solid
    border-radius 4px
    overflow hidden
    .user-badge-title
      padding 0 4px
      color #fff
    .user-badge-level
      border-top-right-radius 3px
      border-bottom-right-radius 3px
      padding 0 3px
  .user-badge-level-1
    background-color #61decb
    border-color #61decb
    .user-badge-level
      background-color #fff
      color #61decb
  .user-badge-level-2
    background-color #5896de
    border-color #5896de
    .user-badge-level
      background-color #fff
      color #5896de
  .user-badge-level-3
    background-color #a068f1
    border-color #a068f1
    .user-badge-level
      background-color #fff
      color #a068f1
  .user-badge-level-4
    background-color #ff86b2
    border-color #ff86b2
    .user-badge-level
      background-color #fff
      color #ff86b2
  .user-badge-level-5
    background-color #f6be18
    border-color #f6be18
    .user-badge-level
      background-color #fff
      color #f6be18
  .user-title
    img
      vertical-align middle
  .guard-user
    display inline-block
    width 20px
    height 20px
    vertical-align top
    background-image url(http://static.hdslb.com/live-static/live-room/images/guard/icon-guard-big.png)
    background-size auto 20px
  .guard-user-1
    background-position 100% 0
  .guard-user-2
    background-position 50% 0
  .guard-user-3
    background-position 0% 0
  .guard-user-gift
    display inline-block
    width 32px
    height 32px
    vertical-align bottom
    background-image url(http://static.hdslb.com/live-static/live-room/images/guard/icon-guard-big.png)
    background-size auto 32px
  .user-actions
    position absolute
    display inline-block
    right 0
    top 50%
    margin-top -12px
    margin-right 8px
  .msg-gift
    .gift-img > img
      height 32px
    .user-name
      color #ff8f34
</style>
