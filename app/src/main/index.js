'use strict'

import electron from 'electron'

const { app, BrowserWindow, dialog, ipcMain, Menu } = electron

app.disableHardwareAcceleration()

let mainWindow, toolbarWindow, danmakuWindow

const mainURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:${require('../../../config').port}/app.html`
  : `file://${__dirname}/app.html`

const toolbarURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:${require('../../../config').port}/toolbar.html`
  : `file://${__dirname}/toolbar.html`

const danmakuURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:${require('../../../config').port}/danmaku.html`
  : `file://${__dirname}/danmaku.html`

const MOVE_DELAY = 3e2

const template = [
  {
    label: '编辑',
    submenu: [
      {role: 'undo'},
      {role: 'redo'},
      {type: 'separator'},
      {role: 'cut'},
      {role: 'copy'},
      {role: 'paste'},
      {role: 'pasteandmatchstyle'},
      {role: 'delete'},
      {role: 'selectall'}
    ]
  }
]

function debounce (func, wait, immediate) {
  let timeout
  return function () {
    let context = this
    let args = arguments
    let later = function () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    let callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}

let moveEvent = debounce(() => {
  let bound = toolbarWindow.getBounds()
  danmakuWindow.webContents.send('move', bound.x, bound.y)
}, MOVE_DELAY)

function createMainWindow () {
  const workArea = electron.screen.getPrimaryDisplay().workArea

  mainWindow = new BrowserWindow({
    width: 1024,
    height: 672,
    resizable: false,
    fullscreenable: false,
    frame: false
  })

  mainWindow.loadURL(mainURL)

  mainWindow.on('closed', () => {
    mainWindow = null
    app.quit()
  })

  toolbarWindow = new BrowserWindow({
    height: 56,
    width: 320,
    x: workArea.x + workArea.width - 320,
    y: workArea.y + workArea.height - 56,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    hasShadow: false,
    skipTaskbar: true
  })

  toolbarWindow.loadURL(toolbarURL)

  toolbarWindow.on('closed', () => {
    toolbarWindow = null
  })

  toolbarWindow.on('move', () => {
    moveEvent()
  })

  danmakuWindow = new BrowserWindow({
    parent: toolbarWindow,
    height: workArea.height - 56,
    width: 320,
    x: workArea.x + workArea.width - 320,
    y: workArea.y,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    hasShadow: false,
    movable: false
  })

  danmakuWindow.setIgnoreMouseEvents(true)
  danmakuWindow.loadURL(danmakuURL)
  toolbarWindow.setAlwaysOnTop(true)
  danmakuWindow.setAlwaysOnTop(true)

  danmakuWindow.on('closed', () => {
    danmakuWindow = null
  })

  ipcMain.on('setHideToolbar', (evt, hide) => {
    toolbarWindow.setAlwaysOnTop(!hide)
    danmakuWindow.setAlwaysOnTop(true)
  })

  // mainWindow to danmakuWindow
  ipcMain.on('reloadDanmakuWindow', (evt) => {
    danmakuWindow.reload()
  })

  ipcMain.on('sendConfig', (evt, config) => {
    danmakuWindow.webContents.send('newConfig', config)
  })

  ipcMain.on('clearDanmaku', (evt) => {
    danmakuWindow.webContents.send('clearDanmaku')
  })

  ipcMain.on('sendDanmaku', (evt, danmaku) => {
    danmakuWindow.webContents.send('newDanmaku', danmaku)
  })

  ipcMain.on('setRoomOnline', (evt, number) => {
    danmakuWindow.webContents.send('onlineNumber', number)
  })

  ipcMain.on('setRoomFans', (evt, number) => {
    danmakuWindow.webContents.send('fansNumber', number)
  })

  ipcMain.on('roomGiftConfig', (evt, config) => {
    danmakuWindow.webContents.send('roomGiftConfig', config)
  })

  // danmakuWindow to mainWindow
  ipcMain.on('changePage', (evt, page) => {
    if (mainWindow.isMinimized()) {
      mainWindow.restore()
    }
    mainWindow.focus()
    mainWindow.webContents.send('changePage', page)
  })

  ipcMain.on('sendMessage', (evt, msg) => {
    mainWindow.webContents.send('sendMessage', msg)
  })

  ipcMain.on('getRoomGiftConfig', (evt) => {
    mainWindow.webContents.send('getRoomGiftConfig')
  })

  ipcMain.on('quitApp', (evt) => {
    dialog.showMessageBox({
      type: 'warning',
      message: '真的要退出Bilibili弹幕库吗？',
      buttons: ['是', '否'],
      defaultId: 0,
      cancelId: 1
    }, (res) => {
      if (res === 0) {
        app.quit()
      }
    })
  })
}

app.on('ready', () => {
  createMainWindow()
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
})

app.on('window-all-closed', () => {
  app.quit()
})
