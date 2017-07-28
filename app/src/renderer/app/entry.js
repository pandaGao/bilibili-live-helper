import Vue from 'vue'
import Electron from 'vue-electron'
import iView from 'iview'
import './theme/dist/iview.css'

import store from './store/index.js'
import router from './router.js'

import App from './App.vue'

import * as NeteaseMusic from 'simple-netease-cloud-music'
import LRC from '../utils/LRCParser.js'

const NM = new NeteaseMusic()

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
    musicProgress: 0,
    musicPlayed: '00:00',
    musicTotal: '00:00',
    musicLyrics: null,
    musicLyricsLines: [],
    musicLyricsIdx: -1
  },
  components: { App },
  router,
  store,
  render (createElement) {
    return createElement(App)
  },
  created () {
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
        this.musicLyricsIdx = this.musicLyrics.findIndex(this.musicPlayer.currentTime*1000)
      }
    })
    this.musicPlayer.addEventListener('error', (e) => {
      this.$Message.warning(`播放出错 错误代码: ${e.target.error.code}`)
      this.nextMusic()
    })
  },
  methods: {
    getMusicURL () {
      if (!this.$store.state.musicList.length) return Promise.resolve(false)
      return NM.search(this.$store.state.musicList[0].name).then(res => {
        if (res.code === 200 && res.result.songCount && res.result.songs.length) {
          this.musicInfo.title = res.result.songs[0].name
          this.musicInfo.singer = res.result.songs[0].ar.map(s => s.name).join(' / ')
          NM.lyric(res.result.songs[0].id).then(lrcObj => {
            if (lrcObj.code === 200 && !lrcObj.nolyric && lrcObj.lrc) {
              let lrc = lrcObj.lrc.lyric
              this.musicLyrics = new LRC(lrc).parse()
              this.musicLyricsLines = this.musicLyrics.lines
            } else {
              this.$Message.warning('歌词获取失败')
            }
          })
          return NM.url(res.result.songs[0].id).then(urlObj => {
            if (urlObj.code === 200 && urlObj.data.length) {
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
      })
    },
    nextMusic () {
      this.musicPlayer.pause()
      this.$store.commit('FINISH_MUSIC_LIST',{
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
      m = m < 10 ? '0'+m : ''+m
      let s = second - m*60
      s = s < 10 ? '0'+s : ''+s
      return m+':'+s
    }
  }
}).$mount('#app')
