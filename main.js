const path = require("path");
const { app, BrowserWindow } = require("electron");
const iconPath = path.join(__dirname, 'assets/icons/icon.png');

function createWindow() {
  const win = new BrowserWindow({
    titleBarStyle: 'hidden',
    width: 280,
    height: 768,
    minHeight: 500,
    minWidth: 240,
    backgroundColor: '#303030',
    webPreferences: {
      nodeIntegration: true,
    },
    icon: iconPath
  });

  win.setOverlayIcon(iconPath, 'Description for overlay')

  win.loadFile("assets/view.html");

  // enable dev tools by default
  //win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
