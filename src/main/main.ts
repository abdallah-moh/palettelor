import path from 'path';
import { BrowserWindow, app } from 'electron';
import ElectronStore from 'electron-store';

ElectronStore.initRenderer();

import * as ModulesManager from './modules-manager';

let window: Electron.BrowserWindow;
__dirname = app.getAppPath();

app.on('ready', () => {
  window = new BrowserWindow({
    icon:
      process.platform === 'win32'
        ? path.join(__dirname, 'icons', 'icon.ico')
        : path.join(__dirname, 'icons', 'png', '128x128.png'),
    title: 'Palettelor',
    minWidth: 800,
    minHeight: 400,
    webPreferences: {
      webSecurity: true,
      contextIsolation: false,
      nodeIntegration: true,
    },
  });

  window.loadURL(
    `file://${path.join(__dirname, 'dist', 'renderer', 'index.html')}`
  );
  // window.setMenu(null);

  ModulesManager.init().catch((error: Error) => {
    if (error) throw error;
  });
});
