const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function manualFollow() {
    const url = 'http://localhost:9001/';
    const request = electron.net.request({ url, redirect: 'manual'})

    console.log('will create a request now')
    request.once('response', (response) => {
	response.on('data', (data) => {
	    console.log(`Body: ${data}`)
	})

	response.on('end', () => {
	    console.log('Manual follow request done')
	})
    })

    request.on('error', (err) => {
	console.log(err)
    })

    request.on('redirect', (statusCode, method, redirectUrl, responseHeaders) => {
	console.log('will follow the redirect')
	electron.session.defaultSession.cookies.get({url}, (error, cookies) => {
	    const cstring = cookies.map(c => `${c.name}=${c.value}`).join(';')
	    //request.setHeader('Cookie', cstring) This should work.
	    request.followRedirect()
	})
    })

    request.end()
}

function runTests() {
    createWindow()
    manualFollow()
}

function createWindow () {
    
    
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', runTests)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.



