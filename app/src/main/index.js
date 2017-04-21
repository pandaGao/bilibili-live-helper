'use strict'

import electron from 'electron'

const { app, BrowserWindow, dialog, ipcMain } = electron

let mainWindow,toolbarWindow

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:${require('../../../config').port}`
  : `file://${__dirname}/index.html`

const toolbarURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:${require('../../../config').port}/toolbar.html`
  : `file://${__dirname}/toolbar.html`

function createWindow () {
  /**
   * Initial window options
   */
   const workArea = electron.screen.getPrimaryDisplay().workArea

   toolbarWindow = new BrowserWindow({
     height: 27,
     width: 320,
     x: workArea.x + workArea.width - 320,
     y: workArea.y + workArea.height - 27,
     transparent: true,
     frame: false,
     alwaysOnTop: true,
     resizable: false,
     hasShadow: false
   })

   toolbarWindow.loadURL(toolbarURL)

   toolbarWindow.on('closed', () => {
     toolbarWindow = null
   })

   toolbarWindow.on('move', () => {
     let bound = toolbarWindow.getBounds()
     mainWindow.webContents.send('move', bound.x, bound.y)
   })

   mainWindow = new BrowserWindow({
     parent: toolbarWindow,
     height: workArea.height - 27,
     width: 320,
     x: workArea.x + workArea.width - 320,
     y: workArea.y,
     transparent: true,
     frame: false,
     alwaysOnTop: true,
     resizable: false,
     movable: false,
     hasShadow: false
   })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  ipcMain.on('changePage', (evt, page) => {
    mainWindow.webContents.send('changePage', page)
  })

  ipcMain.on('quitApp', (evt, page) => {
    dialog.showMessageBox({
      type: 'warning',
      message: '真的要退出Bilibili弹幕姬吗？',
      buttons: ['是','否'],
      defaultId: 0,
      cancelId: 1
    }, (res) => {
      if (res === 0) {
        app.quit()
      }
    })
  })

  // eslint-disable-next-line no-console
  console.log('mainWindow opened')
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
