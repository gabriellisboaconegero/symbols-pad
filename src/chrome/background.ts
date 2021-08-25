export {}

chrome.runtime.onInstalled.addListener((details) => {
  console.log('[background.js] onInstalled');
  alert('[background.js] onInstalled');
});

function main(){
  console.log('Iniciando extensão');
}

main();