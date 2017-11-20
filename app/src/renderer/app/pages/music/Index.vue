<template>
  <div class="music-container">
    <Row :gutter="8" class="tile-row">
      <Col class="tile-col" span="12">
        <Card class="tile-card">
          <p slot="title">点歌板</p>
          <Tabs size="small" value="config" class="tab-bar">
            <Tab-pane label="设置" name="config" class="tab-music">
              <Form label-position="left" :label-width="96">
                <Form-item label="点歌状态">
                  <i-switch v-model="musicConfig.start" size="large">
                    <span slot="open">开启</span>
                    <span slot="close">关闭</span>
                  </i-switch>
                </Form-item>
                <Form-item label="点歌模式">
                  <Radio-group v-model="musicConfig.mode">
                    <Radio :label="0">唱见模式</Radio>
                    <Radio :label="1">点歌模式</Radio>
                  </Radio-group>
                </Form-item>
                <Form-item label="点歌限制">
                  <Radio-group v-model="musicConfig.limitType">
                    <Radio :label="0">无</Radio>
                    <Radio :label="1">用户等级</Radio>
                    <Tooltip content="选择此项时请使用短位ID开启弹幕库" placement="top">
                      <Radio :label="2">粉丝勋章</Radio>
                    </Tooltip>
                  </Radio-group>
                </Form-item>
                <Form-item v-if="musicConfig.limitType > 0">
                  <Row>
                    <Col span="6">
                      <p v-if="musicConfig.limitType == 1">用户等级≥</p>
                      <p v-if="musicConfig.limitType == 2">粉丝勋章≥</p>
                    </Col>
                    <Col span="12">
                      <Input-number :max="60" :min="1" v-model="musicConfig.limitCount"></Input-number>
                    </Col>
                  </Row>
                </Form-item>
                <Form-item label="用户点歌间隔">
                  <Row>
                    <Col span="6">
                      <Input-number :max="99999" :min="1" v-model="musicConfig.userCD"></Input-number>
                    </Col>
                    <Col span="12"><p>s</p></Col>
                  </Row>
                </Form-item>
                <Form-item label="歌曲重复间隔">
                  <Row>
                    <Col span="6">
                      <Input-number :max="99999" :min="1" v-model="musicConfig.musicCD"></Input-number>
                    </Col>
                    <Col span="12"><p>s</p></Col>
                  </Row>
                </Form-item>
                <Form-item label="播放器音量">
                  <Row>
                    <Col span="12"><Slider v-model="musicVolume" :min="0" :max="100"></Slider></Col>
                  </Row>
                </Form-item>
              </Form>
              <Button type="info" @click="sendTestDanmaku">发送点歌示例弹幕</Button>
            </Tab-pane>
            <Tab-pane v-if="!musicConfig.mode" label="点歌列表" name="music" class="tab-music">
              <Table size="small" height="510" :columns="musicListConfig" :data="musicList"></Table>
            </Tab-pane>
            <Tab-pane v-else label="点歌列表" name="music" class="tab-music">
              <Table size="small" height="510" :columns="playerListConfig" :data="musicList"></Table>
            </Tab-pane>
            <Tab-pane label="完成列表" name="finish" class="tab-music">
              <Table size="small" height="510" :columns="finishListConfig" :data="finishList"></Table>
            </Tab-pane>
            <Tab-pane label="屏蔽列表" name="block" class="tab-music">
              <Input v-model="newBlock" class="block-input" placeholder="请输入想要屏蔽的歌曲名..." @on-enter="addNewBlock">
                <Button slot="append" @click="addNewBlock">添加</Button>
              </Input>
              <Table size="small" height="470" :columns="blockListConfig" :data="blockList"></Table>
            </Tab-pane>
          </Tabs>
        </Card>
      </Col>
      <Col class="tile-col" span="12">
        <Card class="tile-card">
          <p slot="title">点歌记录</p>
          <div class="music-log-container" ref="list">
            <div class="music-log-box" v-for="log in musicLog">
              <span class="music-log-user">{{ log.user }}</span>
              <template v-if="log.log.status">
                <span class="music-log-success">点歌成功</span>
                <span class="music-log-name">歌曲名: {{log.log.msg}}</span>
              </template>
              <template v-else>
                <span class="music-log-fail">点歌失败</span>
                <span class="music-log-result">原因: {{log.log.msg}}</span>
              </template>
            </div>
          </div>
        </Card>
        <Card class="tile-card">
          <Row type="flex" justify="center" align="middle">
            <Col span="5" class="music-player-buttons">
              <Button v-if="!isPlaying" type="primary" shape="circle" icon="ios-play" @click="playerPlay"></Button>
              <Button v-else type="primary" shape="circle" icon="ios-pause" @click="playerPause"></Button>
              <Button type="primary" shape="circle" icon="ios-skipforward" @click="nextMusic"></Button>
            </Col>
            <Col span="19" class="music-player-bar">
              <div class="music-title-box">
                <p class="music-title">{{ $root.musicInfo.title }} <small class="music-singer">{{ $root.musicInfo.singer }}</small></p>
                <div class="music-timer">
                  <small>{{ $root.musicPlayed }} / {{ $root.musicTotal }}</small>
                </div>
              </div>
              <div ref="progress" class="music-progress-bar" @click="changeMusicProgress">
                <div class="music-progress-bar-inner" :style="progressBarStyle"></div>
                <div class="music-progress-bar-button" :style="progressButtonStyle"></div>
              </div>
            </Col>
          </Row>
          <div class="music-lyrics-box">
            <div ref="lyrics" class="music-lyrics-inner-box" :style="lyricsListStyle">
              <div v-if="!$root.musicLyricsLines.length" class="placeholder">暂无歌词</div>
              <div v-else class="music-lyrics-line" :class="{current: idx === $root.musicLyricsIdx}" v-for="(line, idx) in $root.musicLyricsLines">{{ line.text }}</div>
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      newBlock: '',
      musicConfig: {
        start: false,
        mode: 0,
        limitType: 0,
        limitCount: 1,
        userCD: 60,
        musicCD: 1800
      },
      musicVolume: 100,
      musicLyrics: [],
      musicListConfig: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '歌名',
          key: 'name'
        },
        {
          title: '点歌人',
          key: 'user'
        },
        {
          title: '操作',
          key: 'action',
          width: 130,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'success',
                  size: 'small',
                  icon: 'arrow-up-a'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.topMusic(params.index)
                  }
                }
              }),
              h('Button', {
                props: {
                  type: 'success',
                  size: 'small',
                  icon: 'checkmark-round'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.finishMusic(params.index)
                  }
                }
              }),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small',
                  icon: 'close-round'
                },
                on: {
                  click: () => {
                    this.removeMusic(params.index)
                  }
                }
              })
            ])
          }
        }
      ],
      playerListConfig: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '歌名',
          key: 'name'
        },
        {
          title: '点歌人',
          key: 'user'
        },
        {
          title: '操作',
          key: 'action',
          width: 100,
          render: (h, params) => {
            if (!params.index) {
              if (this.isPlaying) {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'ghost',
                      size: 'small',
                      icon: 'ios-play'
                    },
                    on: {
                      click: () => {
                        this.playerPause()
                      }
                    }
                  }, '播放中')
                ])
              } else {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'ghost',
                      size: 'small',
                      icon: 'ios-pause'
                    },
                    on: {
                      click: () => {
                        this.playerPlay()
                      }
                    }
                  }, '已暂停')
                ])
              }
            } else {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small',
                    icon: 'arrow-up-a'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.topMusic(params.index)
                    }
                  }
                }),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small',
                    icon: 'close-round'
                  },
                  on: {
                    click: () => {
                      this.removeMusic(params.index)
                    }
                  }
                })
              ])
            }
          }
        }
      ],
      blockListConfig: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '歌名',
          key: 'name'
        },
        {
          title: '操作',
          key: 'action',
          width: 60,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small',
                  icon: 'close-round'
                },
                on: {
                  click: () => {
                    this.deleteBlock(params.index)
                  }
                }
              })
            ])
          }
        }
      ],
      finishListConfig: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '歌名',
          key: 'name'
        },
        {
          title: '点歌人',
          key: 'user',
          width: 160,
        }
      ],
      musicProgress: 10
    }
  },
  computed: {
    blockList () {
      return this.$store.state.blockList.map(block => {
        return {
          name: block
        }
      })
    },
    musicList () {
      return this.$store.state.musicList
    },
    finishList () {
      return this.$store.state.finishMusicList
    },
    musicLog () {
      return this.$store.state.musicLog
    },
    userService () {
      return this.$store.state.userService
    },
    danmakuService () {
      return this.$store.state.danmakuService
    },
    isPlaying () {
      return this.$root.isPlaying
    },
    progressBarStyle () {
      return {
        width: this.$root.musicProgress*100+'%'
      }
    },
    progressButtonStyle () {
      return {
        left: `calc(${this.$root.musicProgress*100}% - 6px)`
      }
    },
    lyricsListStyle () {
      let top = (this.$root.musicLyricsIdx - 3)*32
      top = top < 0 ? 0 : top
      return {
        top: `-${top}px`
      }
    }
  },
  watch: {
    musicConfig: {
      handler: function () {
        this.saveConfig()
      },
      deep: true
    },
    'musicConfig.mode' (val) {
      // 切换到点歌模式
      if (val == 1) {
        this.$root.startPlayMusic()
      }
    },
    musicLog () {
      this.$nextTick(() => {
        this.$refs.list.scrollTop = this.$refs.list.scrollHeight
      })
    },
    musicVolume (val) {
      this.$root.setPlayerVolume(val/100)
    }
  },
  created () {
    this.musicConfig = this.$store.state.musicConfig
    this.musicVolume = this.$root.musicPlayer.volume * 100
  },
  mounted () {
    this.$nextTick(() => {
      this.$refs.list.scrollTop = this.$refs.list.scrollHeight
    })
  },
  methods: {
    saveConfig () {
      this.$store.dispatch({
        type: 'UPDATE_MUSIC_CONFIG',
        musicConfig: this.musicConfig
      })
    },
    sendTestDanmaku () {
      if (!this.danmakuService) {
        this.$Message.warning('请先开启弹幕库')
        return
      }
      if (!this.userService) {
        this.$Message.warning('请先登录')
        return
      }
      this.userService.sendMessage('#点歌 棠梨煎雪 双笙')
    },
    topMusic (idx) {
      this.$store.commit({
        type: 'TOP_MUSIC',
        index: idx
      })
    },
    finishMusic (idx) {
      this.$store.commit({
        type: 'FINISH_MUSIC_LIST',
        index: idx
      })
    },
    removeMusic (idx) {
      this.$store.commit({
        type: 'DELETE_MUSIC_LIST',
        index: idx
      })
    },
    addNewBlock () {
      let lowerCase = this.newBlock.toLowerCase().trim()
      let passed = this.blockList.every(block => {
        return !(lowerCase == block.name)
      })
      if (passed) {
        this.$store.dispatch({
          type: 'ADD_MUSIC_BLOCK',
          block: lowerCase
        })
        this.newBlock = ''
      } else {
        this.$Message.warning('已有该歌曲')
      }
    },
    deleteBlock (index) {
      this.$store.dispatch({
        type: 'DELETE_MUSIC_BLOCK',
        index: index
      })
    },
    playerPause () {
      this.$root.playerPause()
    },
    playerPlay () {
      this.$root.playerPlay()
    },
    nextMusic () {
      this.$root.nextMusic()
    },
    changeMusicProgress (evt) {
      let evtX = evt.clientX
      let progressBarLeft = this.$refs.progress.getBoundingClientRect().left
      let progressBarWidth = this.$refs.progress.offsetWidth
      this.$root.setPlayerProgress((evtX - progressBarLeft) / progressBarWidth)
    }
  }
}
</script>

<style lang="stylus">
.ivu-tabs-nav-scroll-disabled
  display none
</style>

<style lang="stylus" scoped>
.music-container
  display flex
  flex-direction column
  padding 10px
  height 100vh
  overflow hidden
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
.ivu-form-item
  margin-bottom 4px
.tab-bar
  display relative
.tab-music
  padding 1px
.block-input
  margin-bottom 8px
.music-log-container
  height 236px
  overflow-y scroll
  &::-webkit-scrollbar
    width 4px
  &::-webkit-scrollbar-thumb
    border-radius 4px
    background-color #666
  .music-log-box
    width 100%
    font-size 14px
    .music-log-user
      color #4fc1e9
    .music-log-success
      color #19be6b
    .music-log-fail
      color #ed3f14
.music-player-buttons
  padding 4px 0
.music-player-bar
  padding-bottom 10px
.music-title
  width 75%
  height 24px
  overflow hidden
  white-space nowrap
  text-overflow ellipsis
.music-singer
  font-size 12px
.music-timer
  position absolute
  right 0
  top 0
.music-progress-bar
  width 100%
  height 6px
  border-radius 3px
  background-color #e9eaec
  position relative
  cursor pointer
  .music-progress-bar-inner
    height 6px
    border-radius 3px
    background-color #5cadff
  .music-progress-bar-button
    position absolute
    top -3px
    width 12px
    height 12px
    background-color #fff
    border 2px solid #5cadff
    border-radius 6px
    cursor pointer
.music-lyrics-box
  position relative
  margin-top 16px
  height 224px
  overflow hidden
  text-align center
  font-size 16px
  line-height 32px
  .placeholder
    margin-top 96px
  .music-lyrics-inner-box
    position absolute
    width 100%
    left 0
    transition all ease .75s
  .music-lyrics-line
    color #ccc
    transition all ease 1s
    height 32px
    overflow hidden
    &.current
      font-size 18px
      color #333
</style>
