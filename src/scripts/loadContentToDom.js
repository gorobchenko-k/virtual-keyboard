import lang from './language.js';
import keys from './keys.js';
import createKey from './createKey.js';

let isCapsLock = false;
let isShift = false;
let currentProperty = 'en';

const setCurrentProperty = () => {
  if (lang.isEnLang && (!isShift && !isCapsLock)) {
    currentProperty = 'en';
  } else if (!lang.isEnLang && (!isShift && !isCapsLock)) {
    currentProperty = 'ru';
  } else if (lang.isEnLang && isShift) {
    currentProperty = 'shiftEn';
  } else if (!lang.isEnLang && isShift) {
    currentProperty = 'shiftRu';
  } else if ((lang.isEnLang && isCapsLock)) {
    currentProperty = 'capsLockEn';
  } else {
    currentProperty = 'capsLockRu';
  }
};

const showCurrentValueOfKeys = () => {
  setCurrentProperty();
  const valuesOfKeys = document.querySelectorAll('.keyboard__key span');
  const currentValueOfKeys = document.querySelectorAll(`.keyboard__key-${currentProperty}`);
  valuesOfKeys.forEach((key) => key.classList.add('hidden'));
  currentValueOfKeys.forEach((keyValue) => keyValue.classList.remove('hidden'));
};

const setValueInTextarea = (value) => {
  const textarea = document.querySelector('.textarea');
  const indexOfCursor = textarea.selectionStart;
  textarea.value = textarea.value.slice(0, indexOfCursor) + value
    + textarea.value.slice(indexOfCursor);
  textarea.selectionStart = indexOfCursor + 1;
  textarea.selectionEnd = indexOfCursor + 1;
};

const deleteValueInTextarea = (key) => {
  const textarea = document.querySelector('.textarea');
  const indexOfCursor = textarea.selectionStart;
  const indexOfValue = key === 'Delete' ? indexOfCursor : indexOfCursor - 1;
  textarea.value = textarea.value.slice(0, indexOfValue) + textarea.value.slice(indexOfValue + 1);
  textarea.selectionStart = indexOfValue;
  textarea.selectionEnd = indexOfValue;
};

const checkKey = (key) => {
  const keyDom = document.querySelector(`.keyboard__key-${key}`);
  if (key === 'ShiftLeft' || key === 'ShiftRight') {
    isShift = true;
    showCurrentValueOfKeys();
  } else if (key === 'CapsLock') {
    isCapsLock = !isCapsLock;
    if (isCapsLock) {
      keyDom.classList.add('active');
    } else {
      keyDom.classList.remove('active');
    }
    showCurrentValueOfKeys();
  } else if (key === 'Tab') {
    setValueInTextarea('\t');
  } else if (key === 'Enter') {
    setValueInTextarea('\n');
  } else if (key === 'ControlLeft' || key === 'ControlRight' || key === 'AltLeft' || key === 'AltRight' || key === 'MetaLeft') {
    // return;
  } else if (key === 'Delete' || key === 'Backspace') {
    deleteValueInTextarea(key);
  } else {
    const keyValue = keys[key][currentProperty];
    setValueInTextarea(keyValue);
  }
};

const checkChangeLang = (pressedKeys) => {
  if (pressedKeys.has('ShiftLeft') && pressedKeys.has('AltLeft')) {
    lang.isEnLang = !lang.isEnLang;
    showCurrentValueOfKeys();
  }
};

const createElement = (tag, classList, content = '') => {
  const element = document.createElement(tag);
  element.classList = classList;
  element.innerHTML = content;
  return element;
};

const getContent = () => {
  const container = createElement('div', 'container');
  const info = createElement('div', 'info');
  const infoTitle = createElement('h1', 'info__title', 'Virtual Keyboard');
  const infoDescription = createElement('p', 'info__description', 'Клавиатура создана в ОС Windows<br>Для переключения языка комбинация: левыe shift + alt');
  const textarea = createElement('textarea', 'textarea');
  const keyboard = createElement('div', 'keyboard');

  Object.keys(keys).forEach((key) => {
    const keyboardKey = createKey(key, keys[key]);
    keyboard.append(keyboardKey);
  });

  info.append(infoTitle, infoDescription);
  container.append(info, textarea, keyboard);
  return container;
};

const addKeyboardHandler = () => {
  const keyboard = document.querySelector('.keyboard');
  const pressedKeys = new Set();

  document.addEventListener('keydown', (e) => {
    const keyCode = e.code;
    const key = document.querySelector(`.keyboard__key-${keyCode}`);
    key.classList.add('active');
    pressedKeys.add(keyCode);
    checkChangeLang(pressedKeys);
    showCurrentValueOfKeys();
    checkKey(keyCode);
    e.preventDefault();
  });

  document.addEventListener('keyup', (e) => {
    const key = document.querySelector(`.keyboard__key-${e.code}`);
    if (e.code !== 'CapsLock') {
      key.classList.remove('active');
    }
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
      isShift = false;
      showCurrentValueOfKeys();
    }
    pressedKeys.delete(e.code);
  });

  keyboard.addEventListener('click', (e) => {
    const eventTarget = e.target;
    const key = eventTarget.closest('.keyboard__key');
    if (!key) return;
    const keyCode = key.classList[1].split('-')[1];

    checkKey(keyCode);
  });
};

const loadContentToDom = () => {
  const content = getContent();
  document.body.append(content);
  showCurrentValueOfKeys();
  addKeyboardHandler();
};

export default loadContentToDom;
