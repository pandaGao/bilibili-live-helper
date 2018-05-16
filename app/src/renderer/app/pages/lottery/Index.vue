<template>
  <div class="lottery-container">
    <Row :gutter="8" class="tile-row">
      <Col span="12" class="tile-col">
        <Card class="tile-card">
          <p slot="title">抽奖设置</p>
          <Form label-position="left" :label-width="96">
            <Form-item label="礼物类型">
              <Radio-group v-model="giftType" class="gift-type">
                <Radio v-for="(gift, id) in giftConfig" :label="gift.id" :key="id">
                  <img :src="getRoomGiftImage(gift.id)" :alt="gift.name" class="radio-img">
                </Radio>
              </Radio-group>
            </Form-item>
            <Form-item label="礼物数量">
              <Input-number :max="99999" :min="1" v-model="giftLimit"></Input-number>
            </Form-item>
            <Form-item label="重复中奖">
              <i-switch v-model="allowLotteryAgain" size="large">
                <span slot="open">开启</span>
                <span slot="close">关闭</span>
              </i-switch>
            </Form-item>
          </Form>
          <Tooltip v-if="lotteryProcess === 0" content="建议在抽奖时关闭礼物打包提示" placement="top-start">
            <Button type="info" @click="startCollectUser">开始统计</Button>
          </Tooltip>
          <Button type="error" v-if="lotteryProcess === 0" @click="clearWinnerList" style="float: right">清空中奖列表</Button>
          <Button type="warning" v-if="lotteryProcess === 1" @click="finishCollectUser">结束统计</Button>
          <Button type="info" v-if="lotteryProcess === 2" @click="doFilterLottery">玄学时刻</Button>
          <Button type="success" v-if="lotteryProcess === 2" @click="doDirectLottery">一发入魂</Button>
          <Button type="error" v-if="lotteryProcess === 3" @click="finishLottery">结束抽奖</Button>
          <br/><br/>
          <Table v-if="lotteryProcess === 0" size="small" height="200" :columns="winnerListConfig" :data="winnerList"></Table>
          <div v-if="lotteryProcess > 0">
            <p>全部参与抽奖人数: {{ playerList.length }}</p>
            <p>当前剩余参与人数: {{ lotteryList.length }}</p>
            <p>当前总计开奖轮数: {{ lotteryRound }}</p>
          </div>
          <template v-if="lotteryProcess === 2">
            <br/>
            <p>玄学时刻:</p>
            <p>每轮每位参与者有50%概率被淘汰，可重复进行多次操作，直至场上只剩下最后的中奖者</p>
            <p>一发入魂:</p>
            <p>直接在当前全部参与者中选出一名中奖者</p>
          </template>
          <p v-if="lotteryProcess === 3 && lotteryList.length">
            恭喜 <span class="lottery-user-name">{{ lotteryList[0].name }}</span> 中奖 大吉大利!
          </p>
        </Card>
      </Col>
      <Col span="12" class="tile-col">
        <Card class="tile-card">
          <p slot="title">抽奖信息</p>
          <div class="lottery-player-list" ref="list">
            <div class="lottery-player" v-if="lotteryProcess < 2"  v-for="(player, idx) in playerList" :key="idx">
              <span class="lottery-user-name">{{ player.name }}</span>
              已参加抽奖
            </div>
            <div class="lottery-player" v-if="lotteryProcess >= 2"  v-for="(player, idx) in lotteryList" :key="idx">
              <span class="lottery-user-name">{{ player.name }}</span>
              <span v-if="lotteryProcess === 2">依然还在场上</span>
              <span v-if="lotteryProcess === 3">坚持到了最后 大吉大利！</span>
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
      giftType: 0,
      giftLimit: 1,
      lotteryProcess: 0,
      lotteryRound: 0,
      allowLotteryAgain: false,
      playerList: [],
      playerMap: {},
      winnerMap: {},
      lotteryList: [],
      winnerListConfig: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '中奖者',
          key: 'name'
        },
        {
          title: 'UID',
          width: 120,
          key: 'id'
        }
      ]
    }
  },
  computed: {
    danmakuService () {
      return this.$store.state.danmakuService
    },
    winnerList () {
      return this.$root.lotteryWinnerList
    }
  },
  watch: {
    playerList () {
      this.$nextTick(() => {
        this.$refs.list.scrollTop = this.$refs.list.scrollHeight
      })
    }
  },
  mounted () {
    if (this.danmakuService) {
      this.danmakuService.on('danmaku.message', this.giftHandler)
    }
  },
  beforeDestroy () {
    if (this.danmakuService) {
      this.danmakuService.removeListener('danmaku.message', this.giftHandler)
    }
  },
  methods: {
    startCollectUser () {
      this.lotteryProcess = 1
    },
    finishCollectUser () {
      this.lotteryProcess = 2
      this.lotteryList = this.playerList.map(player => player)
    },
    finishLottery () {
      this.playerList = []
      this.playerMap = {}
      this.lotteryList = []
      this.lotteryRound = 0
      this.lotteryProcess = 0
    },
    giftHandler (msg) {
      if (this.lotteryProcess !== 1) {
        return
      }
      if (msg.type === 'gift' && this.giftType == msg.gift.id && this.giftConfig[`${msg.gift.id}`] && msg.gift.count >= this.giftLimit) {
        if (!this.allowLotteryAgain && this.winnerMap[msg.user.id]) {
          return
        }
        if (!this.playerMap[msg.user.id]) {
          this.playerMap[msg.user.id] = true
          this.playerList.push(msg.user)
        }
      }
    },
    doFilterLottery () {
      if (!this.lotteryList.length) {
        this.lotteryProcess = 3
        return
      }
      let newList = this.lotteryList.filter(x => Math.random() >= 0.5)
      if (!newList.length) {
        newList = this.lotteryList.map(x => ({
          user: x,
          score: Math.random()
        })).sort((a, b) => a - b).slice(1).map(x => x.user)
      }
      this.lotteryList = newList
      if (this.lotteryList.length === 1) {
        this.lotteryProcess = 3
        this.winnerList.push(this.lotteryList[0])
        this.winnerMap[this.lotteryList[0].id] = true
      }
      this.lotteryRound++
    },
    doDirectLottery () {
      if (!this.lotteryList.length) {
        this.lotteryProcess = 3
        return
      }
      let lotteryIndex = Math.floor(Math.random() * (this.lotteryList.length))
      this.lotteryList = [ this.lotteryList[lotteryIndex] ]
      this.lotteryProcess = 3
      this.winnerList.push(this.lotteryList[0])
      this.winnerMap[this.lotteryList[0].id] = true
      this.lotteryRound++
    },
    clearWinnerList () {
      this.winnerMap = {}
      this.winnerList.splice(0)
    }
  }  
}
</script>

<style lang="stylus" scoped>
.lottery-container
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
.radio-img
  width 32px
.lottery-player-list
  height 566px
  overflow-y scroll
  &::-webkit-scrollbar
    width 4px
  &::-webkit-scrollbar-thumb
    border-radius 4px
    background-color #666
.lottery-user-name
  color #4fc1e9
.gift-type
  height 129px
  overflow auto
</style>
