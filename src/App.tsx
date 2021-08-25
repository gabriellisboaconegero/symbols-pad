import React, {useEffect, useState} from 'react';
import './popup.css';

type ModifierNames = 'ctrlKey' | 'altKey' | 'shiftKey' | 'code' | 'key';

type KeyModifiers = {
    ctrlKey: boolean,
    altKey: boolean,
    shiftKey: boolean,
    code: string,
    key: string
}

export type KeyBindModifiersMap = {
  [key: string]: KeyModifiers
};

export type KeyCodeMap = {
  [key: string]: number;
}

export type StorageMaps = {
  keyCharsMapStorage: KeyCodeMap;
  keyBidingModifiersMapStorage: KeyBindModifiersMap;
}


function App() {

  const [mainChars, setMainChars] = useState('');
  const [charsToFindCode, setCharsToFindCode] = useState('');
  const [keyCode, setKeyCode] = useState<KeyModifiers>({} as KeyModifiers);
  const [charsMap, setCharsMap] = useState<KeyCodeMap>({});
  const [keyBidingModifiersMap, setKeyBidingModifiersMap] = useState<KeyBindModifiersMap>({});

  useEffect(() => {
    console.log('evento add');
    document.addEventListener('keydown', keyPressEventListener);
    return () => {
      console.log('Evento removido');
      document.removeEventListener('keydown', keyPressEventListener);
    }
  }, [charsMap, keyBidingModifiersMap]);

  useEffect(() => {
    console.log('Evento de messagem e on changed criado');
    chrome.storage.onChanged.addListener(handleStoragedChanged);
    chrome.runtime.onMessage.addListener(handleMessage);
    return () => {
      chrome.storage.onChanged.removeListener(handleStoragedChanged);
      chrome.runtime.onMessage.removeListener(handleMessage);
    }
  }, []);

  // useEffect(() => {
  //   console.log('useEffect', keyBidingModifiersMap, charsMap);
  // });

  const handleMessage = (
    message: {storageData: StorageMaps, from: string}, 
    sender: chrome.runtime.MessageSender, 
    sendResponse: (response?: any) => void
  ) => {
    if(message.from === 'background'){
      setCharsMap(message.storageData.keyCharsMapStorage);
      setKeyBidingModifiersMap(message.storageData.keyBidingModifiersMapStorage);
      sendResponse('Recebi os dados (:');
    }
  }

  const handleStoragedChanged = (changes: {
    [key: string]: chrome.storage.StorageChange;
  }, areaName: "sync" | "local" | "managed") => {
    if (areaName === 'sync'){
      console.log(changes);
      if (changes.keyCharsMapStorage.newValue){
        setCharsMap(changes.keyCharsMapStorage.newValue as KeyCodeMap);
      }else{
        console.log('tava sendo apagado');
      }
      if (changes.keyBidingModifiersMapStorage.newValue){
        setKeyBidingModifiersMap(changes.keyBidingModifiersMapStorage.newValue as KeyBindModifiersMap);
      }else{
        console.log('tava sendo apagado tambem');
      }
    }
  }

  const keyPressEventListener = (e:KeyboardEvent ) => {
    const eventKeyModifiers: KeyModifiers = {
      altKey: e.altKey,
      code: e.code,
      ctrlKey: e.ctrlKey,
      key: e.key,
      shiftKey: e.shiftKey
    }
    
    for (let [keyBindName, keyBindModifiers] of Object.entries(keyBidingModifiersMap)){
      if (Object.entries(keyBindModifiers).every(([modifierName, modifierValue]) => modifierValue === eventKeyModifiers[modifierName as ModifierNames])){
        
        console.log(eventKeyModifiers);
        setMainChars(prev => prev + String.fromCharCode(charsMap[keyBindName]))
      }
    }
    setKeyCode(prev => {return {
      ctrlKey: e.ctrlKey,
      altKey: e.altKey,
      shiftKey: e.shiftKey,
      code: e.code,
      key: e.key
    }})
  }

  const clearStorage = async () => {
    await chrome.storage.sync.clear();
    console.log('limpo');
    alert('Storage foi limpo');
  }

  return (
    <div className="extension">
      <header>
        <input
          type='text'
          value={mainChars}
          onChange={e => setMainChars(e.target.value)}
        />
        <br />
        <label htmlFor="findCodeInput">Achar código dos caracteres: </label>
        <input 
          type="text"
          value={charsToFindCode}
          id="findCodeInput"
          onChange={e => setCharsToFindCode(e.target.value)}
        />
        <br />
        {charsToFindCode.split('').map(char => {
          return (
            <p>{char} : {char.charCodeAt(0)}</p>
          )
        })}
        <br />
        <p>Tabela de keybidings:</p>
        {Object.entries(charsMap).map(([keyBindName, charCode]) => {
          return (
            <p><strong>{keyBindName}</strong> : {String.fromCharCode(charCode)}</p>
          )
        })}
        <br />
        <div>
          <p>KeyModifiers da última key:</p>
          <p>Ctrl: <strong>{`${keyCode.ctrlKey}`}</strong></p>
          <p>Alt: <strong>{`${keyCode.altKey}`}</strong></p>
          <p>Shift: <strong>{`${keyCode.shiftKey}`}</strong></p>
          <p>Code: <strong>{`${keyCode.code}`}</strong></p>
          <p>Key: <strong>{`${keyCode.key}`}</strong></p>
          <br />
        </div>
        <button onClick={e => clearStorage()}>Limpar storage</button>
      </header>
    </div>
  );
}

export default App;
