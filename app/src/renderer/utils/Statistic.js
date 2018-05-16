const URL = 'http://bilibili.danmaku.live'

function checkUpdate (version, platform) {
  let baseURL = `http://localhost:8888/v1/updates?`
  let params = [['version', version],['platform', platform]]
  baseURL += params.map(item => item.join('=')).join('&')
  return fetch(baseURL).then(res => res.json())
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
