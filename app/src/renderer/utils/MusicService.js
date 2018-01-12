const URL = 'http://api.danmaku.live/v1/music'

let serviceHost = URL
let platform = 'kugou'

export function setPlatform (p) {
  platform = p
}

export function setHost (h) {
  serviceHost = h
}

export function platforms () {
  return fetch(`${URL}/platforms`).then(res => res.json())
}

export function search (keyword) {
  return fetch(`${serviceHost}/${platform}/songs?keyword=${keyword}`).then(res => res.json())
}

export function lyric (id) {
  return fetch(`${serviceHost}/${platform}/songs/${id}/lyric`).then(res => res.json())
}

export function url (id) {
  return fetch(`${serviceHost}/${platform}/songs/${id}/url`).then(res => res.json())
}