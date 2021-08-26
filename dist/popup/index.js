const mainInput = document.getElementById('mainInput');

const findCharCodeInput = document.getElementById('findCharCodeInput');

const tableKeyBind = document.getElementById('tableKeyBind');

const addKeyBindInput = document.getElementById('addKeyBindInput');

const keyBindName = document.getElementById('keyBindName');

const defaultButton = document.getElementById('defaultButton');

const addKeyBindButton = document.getElementById('addKeyBindButton');

const copyButton = document.getElementById('copyButton');

let keyBindModifiersMap;

let keyCharsMap;

let lastKeyModifiers;

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
      handleInputOnMain();
      insertCharAtCaretPos(String.fromCharCode(keyCharsMap[keyBindName]), true);
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
      handleIsKeyBiding();
    });
    
  }
}

const handleIsKeyBiding = () => {
  if (addKeyBindInput.value !== ''){
    addKeyBindButton.disabled = false;
    keyBindName.innerHTML = `
      <p class="font-medium">New keyBind</p>
      <p><strong>${getLastKeyBindName()}</strong> : ${addKeyBindInput.value}</p>
    `
  }else{
    addKeyBindButton.disabled = true;
    keyBindName.innerHTML = '';
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
  evento.preventDefault();
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
  addKeyBindInput.value = '';
  lastKeyModifiers = null;
  handleIsKeyBiding();
}

const defaultSettings = () => {
  chrome.storage.sync.clear();
}

const requestData = () => {
  chrome.runtime.sendMessage({from: 'popup', canGetData: true});
}

const findCharCode = (evento) => {
  if (evento.target.value === ''){
    findedCodesBox.innerHTML = '';
    return;
  }
  const template = [];
  for (let i = 0; i < evento.target.value.length; i++){
    let char = evento.target.value[i];
    template.push(`
      <p>${char} : <strong>${char.charCodeAt(0)}</strong></p>
    `);
  }
  findedCodesBox.innerHTML = template.reduce((prev, next) => prev + next);
} 

const handleInputOnMain = (evento) => {
  if (!evento) return;
  if (evento.data === '('){
    insertCharAtCaretPos(')', false);
  }
}

const insertCharAtCaretPos = (char, moveCaret) => {
  let caretPos = mainInput.selectionStart;
  let firstHalf = mainInput.value.substring(0, caretPos);
  let lastHalf = mainInput.value.substring(caretPos);
  mainInput.value = firstHalf + char + lastHalf;
  let newCaretPos = moveCaret? caretPos + 1: caretPos;
  mainInput.setSelectionRange(newCaretPos, newCaretPos);
}

const copyExpression = (e) => {
  if (mainInput.value !== ''){
    mainInput.select();
    document.execCommand("copy");
    alert('Copiado');
  }
}

document.addEventListener('keydown', keyPressEventListener);
chrome.runtime.onMessage.addListener(handleMessage);
defaultButton.onclick = defaultSettings;
findCharCodeInput.oninput = findCharCode;
addKeyBindButton.onclick = addKeyBind;
mainInput.oninput = handleInputOnMain;
copyButton.onclick = copyExpression;

addKeyBindInput.oninput = (e) => handleIsKeyBiding();

requestData();