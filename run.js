'use strict';

const electron = require('electron');
const app = electron.app, // 控制应用生命周期的模块.
  BrowserWindow = electron.BrowserWindow, // 创建本地浏览器窗口的模块.
  ipcMain = electron.ipcMain; // 控制着由渲染进程(web page)发送过来的异步或同步消息的模块.

// 指向窗口对象的一个全局引用，如果没有这个引用，那么当该javascript对象被垃圾回收的时候该窗口将会自动关闭.
let mainWindow = null;
let Settings = {};

// 当Electron完成初始化并且已经创建了浏览器窗口，则该方法将会被调用。
// 有些API只能在该事件发生后才能被使用。
app.on('ready', createWindow);
// 当所有的窗口被关闭后退出应用
app.on('window-all-closed', () => {
  // 对于OS X系统，应用和相应的菜单栏会一直激活直到用户通过Cmd + Q显式退出
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', () => {
  // 对于OS X系统，当dock图标被点击后会重新创建一个app窗口，并且不会有其他
  // 窗口打开
  if (mainWindow === null) {
    createWindow();
  }
});

// 在这个文件后面你可以直接包含你应用特定的由主进程运行的代码。
// 也可以把这些代码放在另一个文件中然后在这里导入。
ipcMain.on('minimize-main-window', function () {
  mainWindow.minimize();
});
ipcMain.on('maximize-main-window', function () {
  mainWindow.maximize();
});
ipcMain.on('restore-main-window', function () {
  mainWindow.restore();
});
ipcMain.on('close-main-window', function () {
  app.quit();
});

function createWindow() {
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
    icon: __dirname + '/static/cat.png'
  });
  // 并且装载应用的index.html页面
  // mainWindow.loadURL(`file://${__dirname}/app/index.html`);
  mainWindow.loadURL(`http://localhost:8080/`);

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
    Settings = {};
  });
};
