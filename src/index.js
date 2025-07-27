import Room, { roomInitHtml } from './js/Room.js';

roomInitHtml();

const playground = new Room({
  canvas: document.getElementById('canvas'),
  button: document.querySelector('[data-list]'),
});

playground.init();
