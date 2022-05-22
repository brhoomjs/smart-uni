
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const step3 = document.getElementById('step3');
const ipc = require('electron').ipcRenderer;
var unstep = true;
function reset() {
  step1.style.display = "block"
  step2.style.display = "none"
  step3.style.display = "none"
  unstep = false;
  step();
}

function goToStep2() {
  step1.style.display = "none"
  step2.style.display = "block"
  unstep = true;
}
function goToStep3() {
  step1.style.display = "none"
  step2.style.display = "none"
  step3.style.display = "block"
  setTimeout(reset, 10000)
}

function step() {
  ipc.send('invokeAction');
}