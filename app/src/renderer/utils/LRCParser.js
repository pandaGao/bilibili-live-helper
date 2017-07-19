class LRC {
  constructor (lrc) {
    this.lrc = lrc.trim()
    this.lines = []
  }

  parse () {
    this.lines = this.lrc.split(/\n/).map(l => {
      let matched = l.match(/\[?(\d*):?(\d{2})\.?(\d*)\](.*)/)
      if (!matched) return false
      let [origin, m, s, ms, text] = matched
      ms = ms.length < 3 ? ms+'0' : ms
      return {
        ms: m*60*1000+s*1000+ms*1,
        text: text
      }
    }).filter(l => !!l)
    return this
  }

  findIndex (ms) {
    let idx = this.lines.findIndex(l => l.ms > ms)
    return idx < 0 ? this.lines.length - 1 : idx - 1
  }
}

export default LRC
