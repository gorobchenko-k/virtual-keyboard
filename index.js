import lang from './src/scripts/language.js';
import loadContentToDom from './src/scripts/loadContentToDom.js';

window.onload = function onload() {
  lang.getLangFromLocalStorage();
  loadContentToDom();
};

window.addEventListener('beforeunload', () => { lang.setLangToLocalStorage(); });
