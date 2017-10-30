import {
  app,
  BrowserWindow,
  dialog,
  ipcMain
} from 'electron';
import fs from 'fs';

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

// 指向窗口对象的一个全局引用，如果没有这个引用，那么当该javascript对象被垃圾回收的时候该窗口将会自动关闭.
let mainWindow = null;
const winURL = process.env.NODE_ENV === 'development' ?
  `http://localhost:9080` :
  `file://${__dirname}/index.html`;

const saveFile = (path, content) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, content, (err) => {
      if (err) throw err;
      resolve();
    });
  })
}

const saveAsFile = (content) => {
  return new Promise((resolve, reject) => {
    dialog.showSaveDialog({
      title: '保存到',
      filters: [{
        name: 'Markdown',
        extensions: ['md', 'mkd', 'markdown']
      }]
    }, (path) => {
      if (path)
        fs.writeFile(path, content, (err) => {
          if (err) throw err;
          resolve(path);
        });
    })
  })
}

const showSaveDialog = (content, path, fn) => {
  if (typeof path == 'function')[path, fn] = [null, path];
  dialog.showMessageBox({
    type: "info",
    buttons: ['是', '否', '取消'],
    title: '询问',
    message: '将修改保存到文件?',
    cancelId: 2
  }, (res) => {
    switch (res) {
      case 0:
        (() => {
          if (path) return saveFile(path, content);
          return saveAsFile(content);
        })().then(() => {
          if (fn) fn(true);
        })
        break;
      case 1:
        if (fn) fn(false);
        break;
    }
  })
}

const createWindow = () => {
  // 创建一个新的浏览器窗口
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 700,
    minWidth: 1000,
    minHeight: 600,
    frame: false,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    backgroundColor: '#00FFFFFF',
    title: 'Titorite',
    icon: `${__dirname}/../../static/cat.png`
  });
  // 并且装载应用的index.html页面
  mainWindow.loadURL(winURL);

  // 打开开发工具页面
  // mainWindow.webContents.openDevTools();

  mainWindow.on('focus', () => {
    mainWindow.webContents.send('focusing');
  });
  mainWindow.on('blur', () => {
    mainWindow.webContents.send('blurred');
  });
  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('maximized');
  });
  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('unmaximized');
  });
  // 当窗口关闭时调用的方法
  mainWindow.on('closed', () => {
    // 解除窗口对象的引用，通常而言如果应用支持多个窗口的话，你会在一个数组里
    // 存放窗口对象，在窗口关闭的时候应当删除相应的元素。
    mainWindow = null;
  });
};

// 当Electron完成初始化并且已经创建了浏览器窗口，则该方法将会被调用。
// 有些API只能在该事件发生后才能被使用。
app.on('ready', createWindow);
// 当所有的窗口被关闭后退出应用
app.on('window-all-closed', () => {
  // 对于OS X系统，应用和相应的菜单栏会一直激活直到用户通过Cmd + Q显式退出
  if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
  // 对于OS X系统，当dock图标被点击后会重新创建一个app窗口，并且不会有其他
  // 窗口打开
  if (mainWindow === null) createWindow();
});
const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});
if (shouldQuit) app.quit();

// 在这个文件后面你可以直接包含你应用特定的由主进程运行的代码。
// 也可以把这些代码放在另一个文件中然后在这里导入。
ipcMain.on('minimize-main-window', () => {
  mainWindow.minimize();
});
ipcMain.on('maximize-main-window', () => {
  mainWindow.maximize();
});
ipcMain.on('restore-main-window', () => {
  mainWindow.restore();
});
ipcMain.on('close-main-window', () => {
  app.quit();
});
ipcMain.on('focus-main-window', () => {
  mainWindow.focus();
});
ipcMain.on('show-ask-dialog-then-close', (event, content, path) => {
  showSaveDialog(content, path, app.quit);
});
ipcMain.on('show-ask-dialog-then-new', (event, content, path) => {
  showSaveDialog(content, path, (status) => {
    if (status) event.sender.send('saved-success');
    event.sender.send('new-file');
  });
});
ipcMain.on('show-ask-dialog-then-read', (event, content, path) => {
  showSaveDialog(content, path, (status) => {
    if (status) event.sender.send('saved-success');
    event.sender.send('read-file');
  });
});
ipcMain.on('confirm-read-file', (event) => {
  dialog.showMessageBox({
    type: "info",
    buttons: ['是', '否', '取消'],
    title: '询问',
    message: '确认载入文件?',
    cancelId: 2
  }, (res) => {
    switch (res) {
      case 0:
        event.sender.send('read-file');
        break;
      case 1:
        event.sender.send('close-menu');
        break;
    }
  })
});
ipcMain.on('save-file', (event, content, path) => {
  saveFile(path, content).then(() => {
    event.sender.send('saved-success');
  });
});
ipcMain.on('show-save-dialog', (event, content) => {
  saveAsFile(content).then((path) => {
    event.sender.send('saved-success', path);
  });
});
ipcMain.on('show-open-dialog', (event) => {
  dialog.showOpenDialog({
    title: '打开',
    filters: [{
      name: 'Markdown',
      extensions: ['md', 'mkd', 'markdown'],
      properties: ['openFile', 'openDirectory', 'createDirectory']
    }]
  }, (path) => {
    if (path)
      fs.readFile(path[0], 'utf-8', (err, data) => {
        if (err) throw err;
        event.sender.send('open-file', path[0], data.toString());
      });
  })
});