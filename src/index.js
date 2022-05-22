const { app, BrowserWindow } = require('electron');
const ipc = require('electron').ipcMain;
const path = require('path');
app.allowRendererProcessReuse = false

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  app.allowRendererProcessReuse = false;
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreen: true,
    backgroundColor: "#ccc",
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

const onoff = require("onoff");
const gpio = onoff.Gpio;

// //use GPIO pin numbers
var stepPins = [17,27,22,23];
// const in1 = new gpio(stepPins[0], 'out');
// const in2 = new gpio(stepPins[1], 'out');
// const in3 = new gpio(stepPins[2], 'out');
// const in4 = new gpio(stepPins[3], 'out');
// const sleep = (time) => new Promise(r => setTimeout(r, time)); 
// async function load() {
//   let x = 0
//   let y = x === 0 ? 1 : 0;
//   for await (let xx of Array.from({length: 200})) {
//     y = x === 0 ? 1 : 0;
//     in1.writeSync(x);
//     in2.writeSync(x);
//     await sleep(100);
//     in3.writeSync(y);
//     in4.writeSync(y);
//     x = x === 0 ? 1 : 0;
//   }
  
  
// }
// load();

var pinNumber = stepPins.length;
var pins = [];
var stepCounter = 0;
var timeout = 0.01;
var stepCount = 8;

Seq = [];
Seq[0] = [1,0,0,0];
Seq[1] = [1,1,0,0];
Seq[2] = [0,1,0,0];
Seq[3] = [0,1,1,0];
Seq[4] = [0,0,1,0];
Seq[5] = [0,0,1,1];
Seq[6] = [0,0,0,1];
Seq[7] = [1,0,0,1];

for(var i=0; i<pinNumber; i++){
  pins[i] = new gpio(stepPins[i], 'out');
}
let unstep = false
var step = function(){
  if (unstep)
    return;
  for(var pin = 0; pin<4; pin++){
    if(Seq[stepCounter][pin] != 0){
      pins[pin].writeSync(1);
    }else{
      pins[pin].writeSync(0);
    }
  }
  stepCounter += 1
  if (stepCounter==stepCount){
    stepCounter = 0;
  }
  if (stepCounter<0){
    stepCounter = stepCount;
  }
  setTimeout( function(){step()}, timeout );
}
ipc.on('invokeAction', (event, data) => {
  unstep = false
  step();
  setTimeout(() => {
    unstep = true;
  }, 10_000);
  var result = "test result!";
  event.sender.send('actionReply', result);
})