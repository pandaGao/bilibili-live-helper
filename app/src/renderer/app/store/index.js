import Vue from 'vue'
import Vuex from 'vuex'
import UserDataStore from '../../utils/UserDataStore.js'
import Live from 'bilibili-live'

Vue.use(Vuex)

const RECONNECT_DELAY = 3e3
let restartService = null

let userConfigStore = new UserDataStore({
  fileName: 'UserConfig'
})

let userConfig = userConfigStore.get()
let roomId = ''
let cookie = ''
let config = {
  onlineMessage: true,
  fansMessage: true,
  welcomeMessage: true,
  welcomeGuardMessage: true,
  commentMessage: true,
  giftMessage: true,
  guardBuyMessage: true,
  newFansMessage: true,
  blockMessage: true,
  showUserLevel: true,
  showUserTitle: true,
  showUserBadge: true,
  showUserVIP: true,
  showUserGuard: true,
  useGiftEnd: true,
  hideToolbar: false,
  showOnlineAndFans: true,
  danmakuFontSize: 14,
  danmakuDisplayTime: 10,
  danmakuBackgroundOpacity: 80,
  lockWindowHeight: false,
  danmakuMaxHeight: 600,
  useWebsocket: true,
  useHttps: false,
  useNotification: false,
  useTTS: false
}

let ttsConfig = {
  voice: 0,
  pitch: 10,
  rate: 10,
  volume: 100
}

let danmakuConfig = {
  mode: 'scroll',
  color: 'white'
}

let musicConfig = {
  start: false,
  mode: 0,
  limitType: 0,
  limitCount: 1,
  userCD: 60,
  musicCD: 1800
}

let blockList = []

if (userConfig) {
  roomId = userConfig.roomId || ''
  cookie = userConfig.cookie || ''
  blockList = userConfig.blockList || []
  if (userConfig.config) {
    Object.keys(config).forEach((key) => {
      if (userConfig.config.hasOwnProperty(key)) {
        config[key] = userConfig.config[key]
      }
    })
  }
  if (userConfig.ttsConfig) {
    Object.keys(ttsConfig).forEach((key) => {
      if (userConfig.ttsConfig.hasOwnProperty(key)) {
        ttsConfig[key] = userConfig.ttsConfig[key]
      }
    })
  }
  if (userConfig.danmakuConfig) {
    Object.keys(danmakuConfig).forEach((key) => {
      if (userConfig.danmakuConfig.hasOwnProperty(key)) {
        danmakuConfig[key] = userConfig.danmakuConfig[key]
      }
    })
  }
  if (userConfig.musicConfig) {
    Object.keys(musicConfig).forEach((key) => {
      if (userConfig.musicConfig.hasOwnProperty(key)) {
        musicConfig[key] = userConfig.musicConfig[key]
      }
    })
  }
}

export default new Vuex.Store({
  state: {
    version: '1.0.0',
    needUpdate: false,
    latestVersion: false,
    roomId,
    cookie,
    config,
    ttsConfig,
    danmakuConfig,
    userService: null,
    danmakuService: null,
    danmakuServiceStatus: 'close',
    lastDanmakuServiceRoomID: '',
    onlineNumber: '--',
    fansNumber: '--',
    danmakuPool: [],
    commentPool: [],
    giftPool: [],
    onlinePool: [],
    fansPool: [],
    musicConfig,
    blockList,
    musicList: [],
    finishMusicList: [],
    musicLog: [],
    musicCDMap: new Map(),
    userCDMap: new Map()
  },
  getters: {
    localData (state) {
      return {
        roomId: state.roomId,
        cookie: state.cookie,
        config: state.config,
        ttsConfig: state.ttsConfig,
        danmakuConfig: state.danmakuConfig,
        musicConfig: state.musicConfig,
        blockList: state.blockList
      }
    }
  },
  mutations: {
    'CHECK_UPDATE' (state, payload) {
      state.needUpdate = payload.needUpdate
      state.latestVersion = payload.latestVersion
    },
    'SET_ROOM_ID' (state, payload) {
      state.roomId = payload.roomId
    },
    'UPDATE_LAST_ROOM_ID' (state, payload) {
      state.lastDanmakuServiceRoomID = state.roomId
    },
    'SET_USER_SERVICE' (state, payload) {
      state.userService = payload.userService
      if (state.userService) {
        state.userService.setDanmakuConfig({
          danmakuMode: state.danmakuConfig.mode,
          danmakuColor: state.danmakuConfig.color
        })
        if (state.danmakuService) {
          state.userService.setCurrentRoom(state.danmakuService.getInfo().id)
        }
      }
    },
    'SET_DANMAKU_SERVICE' (state, payload) {
      state.danmakuService = payload.danmakuService
    },
    'SET_USER_COOKIE' (state, payload) {
      state.cookie = payload.cookie
    },
    'SET_CONFIG' (state, payload) {
      state.config = Object.assign({}, payload.config)
    },
    'SET_TTS_CONFIG' (state, payload) {
      state.ttsConfig = Object.assign({}, payload.ttsConfig)
    },
    'SET_DANMAKU_MODE' (state, payload) {
      state.danmakuConfig.mode = payload.mode
      if (state.userService) {
        state.userService.setDanmakuConfig({
          danmakuMode: state.danmakuConfig.mode,
          danmakuColor: state.danmakuConfig.color
        })
      }
    },
    'SET_DANMAKU_COLOR' (state, payload) {
      state.danmakuConfig.color = payload.color
      if (state.userService) {
        state.userService.setDanmakuConfig({
          danmakuMode: state.danmakuConfig.mode,
          danmakuColor: state.danmakuConfig.color
        })
      }
    },
    'SET_MUSIC_CONFIG' (state, payload) {
      state.musicConfig = Object.assign({}, payload.musicConfig)
    },
    'SET_DANMAKU_SERVICE_STATUS' (state, payload) {
      state.danmakuServiceStatus = payload.status
    },
    'SET_ONLINE_NUMBER' (state, payload) {
      state.onlineNumber = payload.number
    },
    'SET_FANS_NUMBER' (state, payload) {
      state.fansNumber = payload.number
    },
    'CLEAR_ALL_POOL' (state, payload) {
      state.danmakuPool = []
      state.commentPool = []
      state.giftPool = []
      state.onlinePool = []
      state.fansPool = []
    },
    'PUSH_DANMAKU_POOL' (state, payload) {
      state.danmakuPool.push(payload.danmaku)
    },
    'PUSH_COMMENT_POOL' (state, payload) {
      state.commentPool.push(payload.danmaku)
    },
    'PUSH_GIFT_POOL' (state, payload) {
      state.giftPool.push(payload.danmaku)
    },
    'PUSH_ONLINE_POOL' (state, payload) {
      state.onlinePool.push(payload.danmaku)
    },
    'PUSH_FANS_POOL' (state, payload) {
      state.fansPool.push(payload.danmaku)
    },
    'ADD_MUSIC_BLOCK' (state, payload) {
      state.blockList.push(payload.block.toLowerCase())
    },
    'DELETE_MUSIC_BLOCK' (state, payload) {
      state.blockList.splice(payload.index, 1)
    },
    'ADD_MUSIC_LIST' (state, payload) {
      state.musicList.push(payload.music)
    },
    'FINISH_MUSIC_LIST' (state, payload) {
      let music = state.musicList.splice(payload.index, 1)
      if (!music.length) return
      state.finishMusicList.push(music[0])
    },
    'DELETE_MUSIC_LIST' (state, payload) {
      state.musicList.splice(payload.index, 1)
    },
    'TOP_MUSIC' (state, payload) {
      let music = state.musicList.splice(payload.index, 1)
      if (state.musicConfig.mode === 1) {
        state.musicList.splice(1,0, music[0])
      } else {
        state.musicList.splice(0,0, music[0])
      }
    },
    'ADD_MUSIC_LOG' (state, payload) {
      state.musicLog.push(payload.log)
    },
    'SET_USERCD' (state, payload) {
      state.userCDMap.set(payload.user.id, payload.user.ts)
    },
    'SET_MUSICCD' (state, payload) {
      state.musicCDMap.set(payload.music.name, payload.music.ts)
    }
  },
  actions: {
    'UPDATE_ROOMID' ({ commit, getters }, roomId) {
      commit('SET_ROOM_ID', roomId)
      userConfigStore.set(getters.localData)
    },
    'UPDATE_COOKIE' ({ commit, getters }, cookie) {
      commit('SET_USER_COOKIE', cookie)
      userConfigStore.set(getters.localData)
    },
    'UPDATE_CONFIG' ({ commit, getters }, config) {
      commit('SET_CONFIG', config)
      userConfigStore.set(getters.localData)
    },
    'UPDATE_TTS_CONFIG' ({ commit, getters }, config) {
      commit('SET_TTS_CONFIG', config)
      userConfigStore.set(getters.localData)
    },
    'UPDATE_DANMAKU_MODE' ({ commit, getters }, mode) {
      commit('SET_DANMAKU_MODE', mode)
      userConfigStore.set(getters.localData)
    },
    'UPDATE_DANMAKU_COLOR' ({ commit, getters }, color) {
      commit('SET_DANMAKU_COLOR', color)
      userConfigStore.set(getters.localData)
    },
    'UPDATE_MUSIC_CONFIG' ({ commit, getters }, config) {
      commit('SET_MUSIC_CONFIG', config)
      userConfigStore.set(getters.localData)
    },
    'ADD_MUSIC_BLOCK' ({ commit, getters }, block) {
      commit('ADD_MUSIC_BLOCK', block)
      userConfigStore.set(getters.localData)
    },
    'DELETE_MUSIC_BLOCK' ({ commit, getters }, index) {
      commit('DELETE_MUSIC_BLOCK', index)
      userConfigStore.set(getters.localData)
    },
    'START_DANMAKU_SERVICE' ({ state, commit, dispatch }) {
      clearTimeout(restartService)
      commit('SET_DANMAKU_SERVICE_STATUS', {
        status: 'connect'
      })
      Live.initRoom({
        roomId: state.roomId,
        useWebsocket: state.config.useWebsocket,
        useWSS: state.config.useHttps
      }).then(room => {
        if (state.danmakuService) {
          state.danmakuService.disconnect()
          state.danmakuService.removeAllListeners()
          if (state.lastDanmakuServiceRoomID != state.roomId) {
            commit('SET_ONLINE_NUMBER', {
              number: '--'
            })
            commit('SET_FANS_NUMBER', {
              number: '--'
            })
            commit('CLEAR_ALL_POOL')
          }
        }
        commit('UPDATE_LAST_ROOM_ID')
        room.on('connect', () => {
          commit('SET_DANMAKU_SERVICE_STATUS', {
            status: 'open'
          })
          console.log('open')
        }).on('close', () => {
          commit('SET_DANMAKU_SERVICE_STATUS', {
            status: 'error'
          })
          console.log('close')
          restartService = setTimeout(() => {
            dispatch('START_DANMAKU_SERVICE')
          }, RECONNECT_DELAY)
        }).on('error', (err) => {
          commit('SET_DANMAKU_SERVICE_STATUS', {
            status: 'error'
          })
          console.log('error')
          restartService = setTimeout(() => {
            dispatch('START_DANMAKU_SERVICE')
          }, RECONNECT_DELAY)
        }).on('data', (msg) => {
          if (msg.type == 'gift') {
            if (!state.config.useGiftEnd) {
              commit('PUSH_DANMAKU_POOL', {
                danmaku: msg
              })
              commit('PUSH_GIFT_POOL', {
                danmaku: msg
              })
            }
          } else if (msg.type == 'online') {
            commit('PUSH_ONLINE_POOL', {
              danmaku: msg
            })
            commit('SET_ONLINE_NUMBER', {
              number: msg.number
            })
          } else if (msg.type == 'fans') {
            commit('PUSH_FANS_POOL', {
              danmaku: msg
            })
            commit('SET_FANS_NUMBER', {
              number: msg.total
            })
            msg.newFans.map((fan, idx) => {
              commit('PUSH_DANMAKU_POOL', {
                danmaku: {
                  type: 'newFans',
                  user: fan,
                  ts: new Date().getTime() + idx
                }
              })
            })
          } else if (msg.type == 'comment') {
            commit('PUSH_DANMAKU_POOL', {
              danmaku: msg
            })
            commit('PUSH_COMMENT_POOL', {
              danmaku: msg
            })
          } else if (msg.type == 'welcome' || msg.type == 'welcomeGuard' || msg.type == 'guardBuy' || msg.type == 'block') {
            commit('PUSH_DANMAKU_POOL', {
              danmaku: msg
            })
          }
        }).on('giftBundle', (msg) => {
          if (state.config.useGiftEnd) {
            msg.type = 'gift'
            commit('PUSH_DANMAKU_POOL', {
              danmaku: msg
            })
            commit('PUSH_GIFT_POOL', {
              danmaku: msg
            })
          }
        })
        if (state.userService) {
          state.userService.setCurrentRoom(room.getInfo().id)
        }
        commit('SET_DANMAKU_SERVICE', {
          danmakuService: room
        })
      })
    }
  }
})
