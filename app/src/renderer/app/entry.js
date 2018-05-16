import Vue from 'vue'
import Electron from 'vue-electron'
import iView from 'iview'
import './theme/base.less'

import store from './store/index.js'
import router from './router.js'

import App from './App.vue'

import * as ThemeService from '../utils/ThemeService.js'
import * as MusicService from '../utils/MusicService.js'
import LRC from 'lrc.js'

Vue.use(Electron)
Vue.use(iView)
Vue.config.debug = true

new Vue({
  data: {
    musicPlayer: document.createElement('audio'),
    isPlaying: false,
    hasMusicToPlay: false,
    musicInfo: {
      title: '暂无待播放歌曲',
      singer: ''
    },
    musicPlatforms: [],
    musicProgress: 0,
    musicPlayed: '00:00',
    musicTotal: '00:00',
    musicLyrics: null,
    musicLyricsLines: [],
    musicLyricsIdx: -1,
    lotteryWinnerList: [],
    themeList: []
  },
  computed: {
    config () {
      return this.$store.state.config
    }
  },
  watch: {
    'config.themeLink' (val) {
      this.injectTheme(val)
    }
  },
  components: { App },
  router,
  store,
  render (createElement) {
    return createElement(App)
  },
  created () {
    ThemeService.list().then(res => {
      this.themeList = res.data
    })
    if (this.config.themeLink) {
      this.injectTheme(this.config.themeLink)
    }
    MusicService.platforms().then(res => {
      if (!res.success) return
      MusicService.setHost(res.data.host)
      this.musicPlatforms = res.data.platforms
    })
    this.musicPlayer.addEventListener('loadedmetadata', () => {
      this.musicTotal = this.formatTime(this.musicPlayer.duration)
    })
    this.musicPlayer.addEventListener('play', () => {
      this.isPlaying = true
    })
    this.musicPlayer.addEventListener('pause', () => {
      this.isPlaying = false
    })
    this.musicPlayer.addEventListener('canplay', () => {
      this.musicPlayer.play()
    })
    this.musicPlayer.addEventListener('ended', () => {
      this.nextMusic()
    })
    this.musicPlayer.addEventListener('timeupdate', () => {
      if (!this.hasMusicToPlay) return
      this.musicPlayed = this.formatTime(this.musicPlayer.currentTime)
      this.musicProgress = this.musicPlayer.currentTime / this.musicPlayer.duration
      if (this.musicLyrics) {
        this.musicLyricsIdx = this.musicLyrics.findIndex(this.musicPlayer.currentTime)
      }
    })
    this.musicPlayer.addEventListener('error', (e) => {
      this.$Message.warning(`播放出错 错误代码: ${e.target.error.code}`)
      this.nextMusic()
    })
  },
  methods: {
    injectTheme (theme) {
      let link = document.querySelector('#injected-theme')
      if (link) {
        link.remove()
      }
      if (theme) {
        link = document.createElement('link')
        link.id = 'injected-theme'
        link.rel = 'stylesheet'
        link.type = 'text/css'
        link.href = theme
        document.body.appendChild(link)
      }
    },
    setMusicPlatform (platform) {
      MusicService.setPlatform(platform)
    },
    getMusicURL () {
      if (!this.$store.state.musicList.length) return Promise.resolve(false)
      return MusicService.search(this.$store.state.musicList[0].name).then(res => {
        if (res.success && res.data.length) {
          this.musicInfo.title = res.data[0].name
          this.musicInfo.singer = res.data[0].artist.map(a => a.name).join(' / ')
          MusicService.lyric(res.data[0].id).then(lrcObj => {
            if (lrcObj.success) {
              let lrc = lrcObj.data.lyric || ''
              this.musicLyrics = LRC.parse(lrc)
              this.musicLyricsLines = this.musicLyrics.lines
            } else {
              this.$Message.warning('歌词获取失败')
            }
          }).catch(res => {
            this.$Message.warning('歌词获取失败')
          })
          return MusicService.url(res.data[0].id).then(urlObj => {
            if (urlObj.success && urlObj.data.length) {
              return urlObj.data[0].url
            } else {
              this.$Message.warning('歌曲播放地址获取失败')
              return false
            }
          })
        } else {
          this.$Message.warning('歌曲信息获取失败')
          return Promise.resolve(false)
        }
      })
    },
    startPlayMusic () {
      if (this.hasMusicToPlay) return
      if (!this.$store.state.musicList.length) return
      this.getMusicURL().then(url => {
        if (url) {
          this.hasMusicToPlay = true
          this.playMusic(url)
        } else {
          this.nextMusic()
        }
      }).catch(res => {
        this.$Message.warning('歌曲信息获取失败')
      })
    },
    nextMusic () {
      this.musicPlayer.pause()
      this.$store.commit('FINISH_MUSIC_LIST', {
        index: 0
      })
      this.musicInfo = {
        title: '暂无待播放歌曲',
        singer: ''
      }
      this.isPlaying = false
      this.musicPlayed = '00:00'
      this.musicTotal = '00:00'
      this.musicProgress = 0
      this.musicLyrics = null
      this.musicLyricsLines = []
      this.musicLyricsIdx = -1
      if (!this.$store.state.musicList.length) {
        this.hasMusicToPlay = false
        return
      }
      this.getMusicURL().then(url => {
        if (url) {
          this.playMusic(url)
        } else {
          this.nextMusic()
        }
      })
    },
    playMusic (src) {
      this.musicPlayer.src = src
    },
    playerPlay () {
      if (!this.hasMusicToPlay) return
      this.musicPlayer.play()
    },
    playerPause () {
      if (!this.hasMusicToPlay) return
      this.musicPlayer.pause()
    },
    setPlayerProgress (val) {
      this.musicPlayer.currentTime = val * this.musicPlayer.duration
    },
    setPlayerVolume (val) {
      this.musicPlayer.volume = val
    },
    formatTime (second) {
      second = Math.round(second)
      let m = Math.floor(second / 60)
      m = m < 10 ? '0' + m : '' + m
      let s = second - m * 60
      s = s < 10 ? '0' + s : '' + s
      return m + ':' + s
    }
  }
}).$mount('#app')
