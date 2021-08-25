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

type KeyBindModifiersMap = {
  [key: string]: KeyModifiers
};

type KeyCodeMap = {
  [key: string]: number;
}


function App() {

  const [mainChars, setMainChars] = useState('');
  const [charsToFindCode, setCharsToFindCode] = useState('');
  const [keyCode, setKeyCode] = useState<KeyModifiers>({} as KeyModifiers);
  const [defaultCharsMap, setDefaultCharsMap] = useState<KeyCodeMap>({
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
  });
  const [defaultKeyBidingsMap, setDefaultKeyBidingsMap] = useState<KeyBindModifiersMap>({
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
  });

  useEffect(() => {
    document.addEventListener('keydown', keyPressEventListener);

    return () => {
      console.log('Evento removido');
      document.removeEventListener('keydown', keyPressEventListener);
    }
  }, []);

  const getDataFromStorage = async () => {
    chrome.storage.sync.get([''])
  }

  const keyPressEventListener = (e:KeyboardEvent ) => {
    const eventKeyModifiers: KeyModifiers = {
      altKey: e.altKey,
      code: e.code,
      ctrlKey: e.ctrlKey,
      key: e.key,
      shiftKey: e.shiftKey
    }
    for (let [keyBindName, keyBindModifiers] of Object.entries(defaultKeyBidingsMap)){
      if (Object.entries(keyBindModifiers).every(([modifierName, modifierValue]) => modifierValue === eventKeyModifiers[modifierName as ModifierNames])){
        console.log(eventKeyModifiers);
        setMainChars(prev => prev + String.fromCharCode(defaultCharsMap[keyBindName]))
      }
    }
    setKeyCode(prev => {return {
      ctrlKey: e.ctrlKey,
      altKey: e.altKey,
      shiftKey: e.shiftKey,
      code: e.code,
      key: e.key
    }})
    console.log({
        ctrlKey: e.ctrlKey,
        altKey: e.altKey,
        shiftKey: e.shiftKey,
        code: e.code,
        key: e.key
    })
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
        {Object.entries(defaultCharsMap).map(([keyBindName, charCode]) => {
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
      </header>
    </div>
  );
}

export default App;
