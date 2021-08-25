const mainInput = document.getElementById('mainInput');

const findCharCodeInput = document.getElementById('findCharCodeInput');

const tableKeyBind = document.getElementById('tableKeyBind');

const addKeyBindInput = document.getElementById('addKeyBindInput');

const keyBindName = document.getElementById('keyBindName');

const defaultButton = document.getElementById('defaultButton');

let keyBindModifiersMap;

let keyCharsMap;

let lastKeyModifiers;

let bidingKey;

const keyPressEventListener = (e) => {
  const eventKeyModifiers = {
    altKey: e.altKey,
    code: e.code,
    ctrlKey: e.ctrlKey,
    key: e.key,
    shiftKey: e.shiftKey
  }
  for (let [keyBindName, keyBindModifiers] of Object.entries(keyBindModifiersMap)){
    if (Object.entries(keyBindModifiers).every(([modifierName, modifierValue]) => modifierValue === eventKeyModifiers[modifierName])){
      mainInput.focus();
      mainInput.value += String.fromCharCode(keyCharsMap[keyBindName]);
    }
  }
  console.log(eventKeyModifiers);

  lastKeyModifiers = {
      ctrlKey: e.ctrlKey,
      altKey: e.altKey,
      shiftKey: e.shiftKey,
      code: e.code,
      key: e.key
  }

  makeTableOfKeys();
  handleIsKeyBiding()
}

const makeTableOfKeys = () => {
  let template = [];
  for (let [modifierName, keyCode] of Object.entries(keyCharsMap)){
    template.push(`
      <li><strong>${modifierName}</strong> : ${String.fromCharCode(keyCode)}</li>
    `);
  }
  tableKeyBind.innerHTML = template.reduce((prev, next) => prev + next);
} 

const handleMessage = (message, sender, sendResponse) => {
  if(message.from === 'background' && message.canGetData){
    console.log('chegou');
    chrome.storage.sync.get(['keyBidingsMapStorage', 'keyCharsMapStorage'], ({keyBidingsMapStorage, keyCharsMapStorage}) => {
      console.log(keyBidingsMapStorage, keyCharsMapStorage)
      keyBindModifiersMap = keyBidingsMapStorage;
      keyCharsMap = keyCharsMapStorage;

      makeTableOfKeys();
    });
    
  }
}

const handleIsKeyBiding = () => {
  if (bidingKey){
    keyBindName.innerHTML = `
      <p><strong>${getLastKeyBindName()}</strong></p>
    `
  }
}

const getLastKeyBindName = () => {
  let name = '';
  for (let [modifierKey, modifierValue] of Object.entries(lastKeyModifiers)){
    if(modifierKey === 'ctrlKey' && modifierValue){
      name += 'Ctrl + ';
    }else if(modifierKey === 'altKey' && modifierValue){
      name += 'Alt + ';
    }else if(modifierKey === 'shiftKey' && modifierValue){
      name += 'Shift + ';
    }else if(modifierKey === 'key'){
      name += modifierValue;
    }
  }
  return name;
}

const addKeyBind = (evento) => {
  const keyBindName = getLastKeyBindName();
  keyBindModifiersMap = {
    ...keyBindModifiersMap,
    [keyBindName]: lastKeyModifiers
  }
  keyCharsMap = {
    ...keyCharsMap,
    [keyBindName]: addKeyBindInput.value.charCodeAt(0)
  }

  chrome.storage.sync.set({keyBidingsMapStorage: keyBindModifiersMap, keyCharsMapStorage: keyCharsMap});
  bidingKey = false;
}

const defaultSettings = () => {
  chrome.storage.sync.clear();
}

const requestData = () => {
  chrome.runtime.sendMessage({from: 'popup', canGetData: true});
}

const findCharCode = (evento) => {
  const template = [];
  for (let i = 0; i < evento.target.value.length; i++){
    let char = evento.target.value[i];
    template.push(`
      <p>${char} : <strong>${char.charCodeAt(0)}</strong></p>
    `);
  }
  findedCodesBox.innerHTML = template.reduce((prev, next) => prev + next);
} 

document.addEventListener('keydown', keyPressEventListener);
chrome.runtime.onMessage.addListener(handleMessage);
defaultButton.onclick = defaultSettings;
findCharCodeInput.oninput = findCharCode;
document.forms[0].onsubmit = addKeyBind;
addKeyBindInput.onfocus = (e) => bidingKey = true;
addKeyBindInput.onblur = (e) => bidingKey = false;

requestData();