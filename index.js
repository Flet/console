'use strict';

var log = document.getElementById('consoleinput');
log.addEventListener('keypress', evalConsoleInput);

window.messages = [];
window.currentMessage = undefined;
window.currentLine = undefined;
window.commandHistory = [];
window.currentCommand = 0;

var appendConsole = function (message, type) {
  var messages = window.messages;
  var newmsgs = message !== undefined ? message.toString().split('\n') : ['undefined'];
  newmsgs.forEach(msg => messages.push({type: type, msg: msg}));
};

function typeMessage () {
  var cl = document.getElementById('consolelog');

  if (window.currentMessage === undefined && window.messages.length > 0) {
    var blah = window.messages.shift();
    window.currentMessage = blah.msg.split('');
    window.currentLine = document.createElement('div');
    window.currentLine.className = blah.type;
    cl.appendChild(window.currentLine);
  }

  if (window.currentMessage === undefined) return;

  var nextLetter = window.currentMessage.shift();
  if (nextLetter !== undefined) {
    window.currentLine.innerHTML += nextLetter;
  } else {
    window.currentLine.innerHTML += '<br/>';
    window.currentMessage = undefined;
    window.scrollTo(0, document.body.scrollHeight);
    document.getElementById('consoleinput').focus();
  }
}

window.setInterval(typeMessage, 20);

var originalConsole = null;

if (window.console != null) {
  originalConsole = window.console;
}

window.console = {
  log: function (message, x) {
    appendConsole(message, 'info');
    originalConsole.log(message);
  },
  info: function (message) {
    appendConsole(message, 'info');
    originalConsole.info(message);
  },
  debug: function (message) {
    appendConsole(message, 'debug');
    originalConsole.debug(message);
  },
  error: function (message) {
    appendConsole(message, 'error');
    originalConsole.error(message);
  }
};

function evalConsoleInput (e, message) {
  if (e.code === 'Enter') {
    var inputField = document.getElementById('consoleinput');
    var evalString = inputField.value;
    window.commandHistory.push(evalString);
    window.currentCommand = window.commandHistory.length - 1;
    console.log('>' + evalString);

    try {
      var returnValue = eval(evalString);
      console.log(returnValue);
    } catch (e) {
      console.error(e.message);
    } finally {
      inputField.value = '';
    }
  }
}

document.onkeydown = function (e) {
  if (e.code === 'ArrowUp') {
    if (window.currentCommand === 0) return;
    window.currentCommand--;
    document.getElementById('consoleinput').value = window.commandHistory[window.currentCommand];
  }

  if (e.code === 'ArrowDown') {
    window.currentCommand = Math.min(window.currentCommand + 1, window.commandHistory.length - 1);
    document.getElementById('consoleinput').value = window.commandHistory[window.currentCommand];
  }
};

// get some text up at startup.
console.info(navigator.userAgent);
console.info('Welcome to JavaScript!');
console.debug('Use the up and down arrows for command history.\n\n');
