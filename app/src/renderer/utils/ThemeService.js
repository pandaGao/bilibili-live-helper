const URL = 'http://api.danmaku.live/v1/themes'

export function list () {
  return fetch(`${URL}`).then(res => res.json())
}