chrome.runtime.onInstalled.addListener((details) => {
  console.log('[background.js] onInstalled');
});

const defaultCharsMap = {
  'Alt + 1': 8594,
  'Alt + 2': 8658,
  'Alt + 3': 8660,
  'Alt + 4': 8712,
  'Alt + 5': 8704,
  'Alt + 6': 8707,
  'Alt + 7': 8713,
  'Alt + 8': 8743,
  'Alt + 9': 8744,
  'Alt + 0': 8765,
  'Alt + q': 8838,
  'Alt + w': 8834,
  'Ctrl + q': 8866,
  'Alt + r': 172
}

const defaultKeyBindingMap = {
  'Alt + 1': {
    ctrlKey: false,
    altKey: true,
    shiftKey: false,
    code: 'Digit1',
    key: '1'
  },
  'Alt + 2': {
    ctrlKey: false,
    altKey: true,
    shiftKey: false,
    code: 'Digit2',
    key: '2'
  },
  'Alt + 3': {
    ctrlKey: false,
    altKey: true,
    shiftKey: false,
    code: 'Digit3',
    key: '3'
  },
  'Alt + 4': {
    ctrlKey: false,
    altKey: true,
    shiftKey: false,
    code: 'Digit4',
    key: '4'
  },
  'Alt + 5': {
    ctrlKey: false,
    altKey: true,
    shiftKey: false,
    code: 'Digit5',
    key: '5'
  },
  'Alt + 6': {
    ctrlKey: false,
    altKey: true,
    shiftKey: false,
    code: 'Digit6',
    key: '6'
  },
  'Alt + 7': {
    ctrlKey: false,
    altKey: true,
    shiftKey: false,
    code: 'Digit7',
    key: '7'
  },
  'Alt + 8': {
    ctrlKey: false,
    altKey: true,
    shiftKey: false,
    code: 'Digit8',
    key: '8'
  },
  'Alt + 9': {
    ctrlKey: false,
    altKey: true,
    shiftKey: false,
    code: 'Digit9',
    key: '9'
  },
  'Alt + 0': {
    ctrlKey: false,
    altKey: true,
    shiftKey: false,
    code: 'Digit0',
    key: '0'
  },
  'Alt + q': {
    ctrlKey: false,
    altKey: true,
    shiftKey: false,
    code: 'KeyQ',
    key: 'q'
  },
  'Alt + w': {
    ctrlKey: false,
    altKey: true,
    shiftKey: false,
    code: 'KeyW',
    key: 'w'
  },
  'Ctrl + q': {
    ctrlKey: true,
    altKey: false,
    shiftKey: false,
    code: 'KeyQ',
    key: 'q'
  },
  'Alt + r': {
    ctrlKey: false,
    altKey: true,
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
