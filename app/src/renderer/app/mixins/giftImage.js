export default {
  data () {
    return {
      giftConfig: {}
    }
  },
  created () {
    this.danmakuService._api.getRoomGiftConfig().then(res => {
      if (res.length) {
        this.giftConfig = res.reduce((config, gift) => {
          config[`${gift.id}`] = gift
          return config
        }, {})
      }
    })
  },
  methods: {
    getRoomGiftImage (id) {
      return this.giftConfig[`${id}`] ? this.giftConfig[`${id}`]['img_dynamic'] : ''
    }
  }
}
