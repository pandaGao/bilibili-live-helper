<template>
  <div class="statistic-container">
    <Row :gutter="8" class="tile-row">
      <Col class="tile-col" span="24">
        <Card class="tile-card">
          <div class="chart" ref="chart"></div>
        </Card>
      </Col>
    </Row>
    <Row :gutter="8" class="tile-row">
      <Col span="12" class="tile-col">
        <Card class="tile-card">
          <p slot="title">弹幕统计</p>
          <div class="danmaku-count">共有 {{commentCount}} 条评论弹幕 新增 {{fansCount}} 位粉丝</div>
          <div class="danmaku-count">收到 {{giftCount}} 件礼物 总计 {{giftPrice}} 瓜子</div>
          <div class="gift-box-container">
            <div class="gift-box" v-for="gift in giftStatistic">
              <img class="gift-img" :src="getRoomGiftImage(gift.id)">
              <div class="gift-count">×{{ gift.count }}</div>
            </div>
          </div>
        </Card>
      </Col>
      <Col span="12" class="tile-col">
        <Card class="tile-card">
          <Table size="small" height="290" :columns="userConfig" :data="userStatistic"></Table>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import * as echarts from 'echarts/dist/echarts.common.min.js'
import GiftImageMixin from '../../mixins/giftImage.js'

export default {
  mixins: [ GiftImageMixin ],
  data () {
    return {
      chart: null,
      userConfig: [
        {
          type: 'index',
          width: 80,
          align: 'center'
        },
        {
          title: '用户名',
          key: 'name'
        },
        {
          title: '赠送瓜子',
          width: 150,
          key: 'total'
        }
      ]
    }
  },
  computed: {
    danmakuService () {
      return this.$store.state.danmakuService
    },
    onlinePool () {
      return this.$store.state.onlinePool.filter((i, idx) => !(idx%3)).map(msg => {
        return {
          name: msg.ts,
          value: [msg.ts, msg.number]
        }
      })
    },
    commentCount () {
      return this.$store.state.commentPool.length
    },
    fansCount () {
      return this.$store.state.fansPool.length
    },
    giftCount () {
      return this.$store.state.giftPool.reduce((total, msg) => {
        return total + msg.gift.count*1
      }, 0)
    },
    giftPrice () {
      return this.$store.state.giftPool.reduce((total, msg) => {
        return total + msg.gift.count*msg.gift.price
      }, 0)
    },
    giftStatistic () {
      let giftMap = this.$store.state.giftPool.reduce((map, msg) => {
        let giftId = msg.gift.id
        let giftCount = msg.gift.count*1
        if (map[giftId]) {
          map[giftId] += giftCount
        } else {
          map[giftId] = giftCount
        }
        return map
      }, {})
      return Object.keys(giftMap).map(key => {
        return {
          id: key,
          count: giftMap[key]
        }
      }).sort((a,b) => b.id - a.id)
    },
    userStatistic () {
      let userMap = this.$store.state.giftPool.reduce((map, msg) => {
        let userId = msg.user.id
        let giftPrice = msg.gift.count*msg.gift.price
        if (map[userId]) {
          map[userId].total += giftPrice
        } else {
          map[userId] = {
            name: msg.user.name,
            total: giftPrice
          }
        }
        return map
      }, {})
      return Object.keys(userMap).map(key => {
        return {
          id: key,
          name: userMap[key].name,
          total: userMap[key].total
        }
      }).sort((a,b) => b.total - a.total)
    }
  },
  watch: {
    onlinePool () {
      this.chart.setOption({
        series: [{
          data: this.onlinePool
        }]
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  methods: {
    initChart () {
      this.chart = echarts.init(this.$refs.chart)
      this.chart.setOption({
        title: {
          text: '房间人气趋势图',
          top: 0,
          left: 16
        },
        grid: {
          left: '0%',
          right: '2%',
          bottom: '0%',
          top: '10%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            let date = new Date(params[0].value[0])
            let time = (date.getHours() > 9 ? date.getHours() : '0'+date.getHours())
            time += ':' + (date.getMinutes() > 9 ? date.getMinutes() : '0'+date.getMinutes())
            time += ':' + (date.getSeconds() > 9 ? date.getSeconds() : '0'+date.getSeconds())
            return `${time}<br/>人气: ${params[0].value[1]}`
          }
        },
        xAxis: {
          type: 'time',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: '#999'
            }
          },
          splitNumber: 10,
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          },
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: '#999'
            }
          },
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          },
        },
        series: [
          {
            name: 'online number',
            type: 'line',
            areaStyle: {normal: {}},
            smooth: true,
            showSymbol: false,
            data: this.onlinePool
          }
        ],
        color: ['#2d8cf0']
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.statistic-container
  display flex
  flex-direction column
  padding 10px
  height 100%
.tile-row
  display flex
  flex 1
.tile-row + .tile-row
  margin-top 8px
.tile-col
  display flex
  flex-direction column
  flex 1
.tile-card
  flex 1
.chart
  width 100%
  height 285px
.gift-box-container
  margin-top 8px
.gift-box
  display inline-block
  margin-right 8px
  margin-bottom 8px
  .gift-img
    display block
    margin 0 auto
    height 48px
    width auto
  .gift-count
    margin-top 8px
    text-align center
</style>
