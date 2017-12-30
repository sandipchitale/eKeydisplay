const { app, BrowserWindow, Menu, MenuItem } = require("electron");
const path = require("path");
const url = require("url");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 400
  });

  // and load the index.html of the app.
  win.loadURL(
    url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file:",
      slashes: true
    })
  );

  // Open the DevTools.
  // win.webContents.openDevTools()
  const keydisplayScript = `
  (function(){
    var keyDisplayDiv = document.querySelector('#__keydisplay__');
    if (keyDisplayDiv) {
      keyDisplayDiv.parentNode.removeChild(keyDisplayDiv);
      document.removeEventListener('keyup', document.__keydisplay__, false);
      return;
    }
    keyDisplayDiv = document.createElement('div');
    keyDisplayDiv.id = '__keydisplay__';
    keyDisplayDiv.style = 'position: fixed;'
    + 'height: 50px;'
    + 'left: 0;'
    + 'bottom: 0;'
    + 'right: 0;'
    + 'z-index: 10000;'
    + 'background-color: rgba(0,0,0,0.8);'
    + 'color: white;'
    + 'font-size: 36px;'
    + 'font-family: monospace;'
    + 'text-align: center;'
    + 'overflow: hidden;'
    + 'margin: auto auto;'
    + 'padding-top: 7px;'
    + 'user-select: none;';
    document.body.appendChild(keyDisplayDiv);
    document.__keydisplay__ = function(event) {
      if (event.key !== 'Control' && event.key !== 'Shift' && event.key !== 'Alt' && event.key !== 'Meta') {
        let keyString = '';
        if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey || (event.key && event.key.length > 1)) {
          if (event.ctrlKey) keyString += 'Ctrl+';
          if (event.altKey) keyString += 'Alt+';
          if (event.shiftKey) keyString += 'Shift+';
          if (event.metaKey) keyString += 'Meta+';
          keyString += event.key.replace(/([A-Z])/g, ' $1').replace(/^ /, '');
        }
        keyDisplayDiv.innerText = keyString;
        
      }
    };
    document.addEventListener('keyup', document.__keydisplay__, false);
  })();
  `;

  const menu = new Menu();

  menu.append(
    new MenuItem({
      label: "Toggle Keydisplay",
      accelerator: "CmdOrCtrl+Shift+Alt+k",
      click: () => {
        win.webContents.executeJavaScript(keydisplayScript);
      }
    })
  );

  win.setMenu(menu);

  // Emitted when the window is closed.
  win.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});
