import Room, { roomInitHtml, setRoomInstance } from './js/Room.js';

roomInitHtml();

const playground = new Room({
  canvas: document.querySelector('.playground'),
  button: document.querySelector('[data-list]'),
  container: document.querySelector('.room__playground'),
});

playground.init();
setRoomInstance(playground);
