import path from 'path'
import fs from 'fs'
import _ from 'lodash'

export default class UserDataStore {
  constructor (config) {
    const userDataPath = config.electron.remote.app.getPath('userData')
    this.filePath = path.join(userDataPath, config.fileName + '.json')
    this.content = this.parseFile()
    this.tempContent = null
    this.debounceWriteToFile = _.debounce(() => {
      this.writeToFile()
    }, 3000)
  }

  get () {
    return this.content
  }

  set (content) {
    this.tempContent = content
    this.debounceWriteToFile()
  }

  parseFile () {
    try {
      return JSON.parse(fs.readFileSync(this.filePath))
    } catch (e) {
      console.log(e)
      return false
    }
  }

  writeToFile () {
    fs.writeFileSync(this.filePath, JSON.stringify(this.tempContent))
    this.content = this.tempContent
  }
}
