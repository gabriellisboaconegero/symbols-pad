chrome.runtime.onInstalled.addListener((details) => {
  console.log('[background.js] onInstalled');
});

const defaultCharsMap = {
  'Ctrl + 1': 8594,
  'Ctrl + 2': 8658,
  'Ctrl + 3': 8660,
  'Ctrl + 4': 8712,
  'Ctrl + 5': 8704,
  'Ctrl + 6': 8707,
  'Ctrl + 7': 8713,
  'Ctrl + 8': 8743,
  'Ctrl + 9': 8744,
  'Ctrl + 0': 8765,
  'Ctrl + q': 8838,
  'Ctrl + w': 8834,
  'Ctrl + e': 8866,
  'Ctrl + r': 172
}

const defaultKeyBindingMap = {
  'Ctrl + 1': {
    ctrlKey: true,
    altKey: false,
    shiftKey: false,
    code: 'Digit1',
    key: '1'
  },
  'Ctrl + 2': {
    ctrlKey: true,
    altKey: false,
    shiftKey: false,
    code: 'Digit2',
    key: '2'
  },
  'Ctrl + 3': {
    ctrlKey: true,
    altKey: false,
    shiftKey: false,
    code: 'Digit3',
    key: '3'
  },
  'Ctrl + 4': {
    ctrlKey: true,
    altKey: false,
    shiftKey: false,
    code: 'Digit4',
    key: '4'
  },
  'Ctrl + 5': {
    ctrlKey: true,
    altKey: false,
    shiftKey: false,
    code: 'Digit5',
    key: '5'
  },
  'Ctrl + 6': {
    ctrlKey: true,
    altKey: false,
    shiftKey: false,
    code: 'Digit6',
    key: '6'
  },
  'Ctrl + 7': {
    ctrlKey: true,
    altKey: false,
    shiftKey: false,
    code: 'Digit7',
    key: '7'
  },
  'Ctrl + 8': {
    ctrlKey: true,
    altKey: false,
    shiftKey: false,
    code: 'Digit8',
    key: '8'
  },
  'Ctrl + 9': {
    ctrlKey: true,
    altKey: false,
    shiftKey: false,
    code: 'Digit9',
    key: '9'
  },
  'Ctrl + 0': {
    ctrlKey: true,
    altKey: false,
    shiftKey: false,
    code: 'Digit0',
    key: '0'
  },
  'Ctrl + q': {
    ctrlKey: true,
    altKey: false,
    shiftKey: false,
    code: 'KeyQ',
    key: 'q'
  },
  'Ctrl + w': {
    ctrlKey: true,
    altKey: false,
    shiftKey: false,
    code: 'KeyW',
    key: 'w'
  },
  'Ctrl + e': {
    ctrlKey: true,
    altKey: false,
    shiftKey: false,
    code: 'KeyE',
    key: 'e'
  },
  'Ctrl + r': {
    ctrlKey: true,
    altKey: false,
    shiftKey: false,
    code: 'KeyR',
    key: 'r'
  }
}

const handleMessage = (message, sender, sendResponse) => {
  if (message.from === 'popup' && message.canGetData){
    console.log('chegou');
    handleStorageMenagenment();
  }
}

const handleStorageMenagenment = () => {
  chrome.storage.sync.get(['keyBidingsMapStorage', 'keyCharsMapStorage'],async (data) => {
    if (Object.keys(data).length <= 0){
      await chrome.storage.sync.set({
        keyBidingsMapStorage: defaultKeyBindingMap,
        keyCharsMapStorage: defaultCharsMap
      });
    }
    sendCanGetData();
  })
}

const handleStorageChanges = (changes, areaName) => {
  if (areaName === 'sync'){
    handleStorageMenagenment();
  }
}

const sendCanGetData = () => {
  chrome.runtime.sendMessage({from: 'background', canGetData: true});
}

const main = () => {
  console.log('Iniciando extensão');
  chrome.runtime.onMessage.addListener(handleMessage);
  chrome.storage.onChanged.addListener(handleStorageChanges);
}

main();
