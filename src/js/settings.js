import * as basicLightbox from 'basiclightbox';
import { roomInstance } from './Room';

import 'basiclightbox/dist/basicLightbox.min.css';

const settings = document.querySelector('.settings');

const settingsHandler = event => {
  const instance = basicLightbox.create(`
    <div class="modal">
      <div class="grid">
        <div class="grid__toggler toggler active">
          <div class="toggler__circle"></div>
        </div>
        <p class="grid__label">Показати сітку</p>
      </div>

      
      <div class="select-wrapper">
        <select name="skins-selector" id="skins" class="modal__selector skins">
          <option value="" disabled selected hidden>
            Вибрати вигляд кімнати
          </option>
          <option value="style1">Стиль #1</option>
          <option value="style2">Стиль #2</option>
          <option value="style3">Стиль #3</option>
        </select>
      </div>

      <div class="modal__buttons buttons">
        <div class="buttons__wrapper">
          <button class="button__save">Зберегти кімнату</button>
          <button class="button__load">Завантажити кімнату</button>
        </div>
        <button class="button__delete">Видалити збережену кімнату</button>
      </div>


      <button class="modal__close close">
    X
      </button>
    </div>
  `);

  instance.show();

  const modalElement = instance.element();
  const saveBtn = modalElement.querySelector('.button__save');
  const loadBtn = modalElement.querySelector('.button__load');
  const deleteBtn = modalElement.querySelector('.button__delete');

  const hideGrid = btn => {
    if (btn.classList.contains('active')) {
      localStorage.setItem('grid', 'gridOff');
    } else {
      localStorage.setItem('grid', 'gridOn');
    }
  };

  saveBtn.addEventListener('click', () => {
    roomInstance.saveRoomState();
  });

  loadBtn.addEventListener('click', () => {
    roomInstance.loadRoomState();
  });

  deleteBtn.addEventListener('click', () => {
    roomInstance.deleteRoomState();
  });

  const toggleButton = modalElement.querySelector('.toggler');
  toggleButton.addEventListener('click', () => {
    toggleButton.classList.toggle('active');
    hideGrid(toggleButton);
    roomInstance.gridCheck();
  });

  const closeButton = modalElement.querySelector('.modal__close');
  closeButton.addEventListener('click', () => {
    instance.close();
  });
};

settings.addEventListener('click', settingsHandler);
