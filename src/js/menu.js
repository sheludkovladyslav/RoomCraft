import furnitureList from './furnitures.js';
import Swiper from 'swiper';
import { Mousewheel, Scrollbar } from 'swiper/modules';

Swiper.use([Mousewheel, Scrollbar]);

Swiper.use([Scrollbar, Mousewheel]);

const menuCards = document.getElementById('menuCards');
const menuFilter = document.getElementById('menuFilter');

const categoryMap = {
  декорації: 'Декорації',
  меблі: 'Меблі',
  електроніка: 'Електроніка',
  'ін.': 'all',
};

let menuSwiper = null;

function initSwiper() {
  if (menuSwiper) menuSwiper.destroy(true, true);

  menuSwiper = new Swiper('.swiper', {
    direction: 'vertical',
    slidesPerView: 'auto',
    spaceBetween: 20,
    scrollbar: {
      el: '.swiper-scrollbar',
      draggable: true,
    },
    mousewheel: {
      sensitivity: 5,
      forceToAxis: true,
    },
  });
}

const renderCards = (category = 'all') => {
  const wrapper = document.getElementById('cardsWrapper');
  const filteredItems = furnitureList.filter(
    item => category === 'all' || item.category === category
  );

  let slidesHTML = '';

  for (let i = 0; i < filteredItems.length; i += 2) {
    const item1 = filteredItems[i];
    const item2 = filteredItems[i + 1];

    slidesHTML += `
      <ul class="swiper-slide">
        <li class="menu-cards-card" data-spawn="${item1.key}">
          <button class="furniture__spawn" >
            <div class="menu-cards-card__img">
             <img src="${item1.image}" alt="${item1.name}" />
            </div>
            <div class="furniture__text">
            <h3 class="menu-cards-card__title">${item1.name}</h3>
            <p class="menu-cards-card__category">Категорія: ${
              item1.category
            }</p>
            </div>
          </button>
        </li>

        ${
          item2
            ? `
        <li class="menu-cards-card" data-spawn="${item2.key}">
          <button class="furniture__spawn" >
            <div class="menu-cards-card__img">
              <img src="${item2.image}" alt="${item2.name}" />
            <h3 class="menu-cards-card__title">${item2.name}</h3>
            <p class="menu-cards-card__category">Категорія: ${item2.category}</p>
          </button>
        </li>`
            : ''
        }
      </ul>
    `;
  }

  wrapper.innerHTML = slidesHTML;
  initSwiper();
};

menuFilter.addEventListener('click', e => {
  const li = e.target.closest('.menu-filter__list');

  document
    .querySelectorAll('.menu-filter__list')
    .forEach(el => el.classList.remove('active'));

  li.classList.add('active');

  const category = categoryMap[li.textContent.trim().toLowerCase()] || 'all';
  renderCards(category);
});

renderCards();

menuCards.addEventListener('click', e => {
  const card = e.target.closest('.menu-cards-card');
  if (!card) return;

  document
    .querySelectorAll('.menu-cards-card')
    .forEach(c => c.classList.remove('active'));

  card.classList.add('active');
});
