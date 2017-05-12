const URL = 'http://bilibili.danmaku.live'

function checkUpdate (version, platform) {
  let baseURL = URL + '/api/checkUpdate?'
  let params = [['version', version],['platform', platform]]
  baseURL += params.map(item => item.join('=')).join('&')
  return fetch(baseURL)
}

function userLogin (version, platform, uid, room) {
  let baseURL = URL + '/api/userLogin?'
  let params = [['version', version],['platform', platform],['uid', uid],['room', room]]
  baseURL += params.map(item => item.join('=')).join('&')
  return fetch(baseURL)
}

export default {
  checkUpdate,
  userLogin
}
