import furnitureList from './furnitures.js';
import Swiper from 'swiper';




const menuCards = document.getElementById('menuCards')
const menuFilter = document.getElementById('menuFilter');

const categoryMap = {
  'декорації': 'decoration',
  'меблі': 'furniture',
  'електроніка': 'electronics',
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
  });
}

const renderCards = (category = 'all') => {
  const wrapper = document.getElementById('cardsWrapper');
  const filteredItems = furnitureList.filter(item => category === 'all' || item.category === category);

  let slidesHTML = '';

  for (let i = 0; i < filteredItems.length; i += 2) {
    const item1 = filteredItems[i];
    const item2 = filteredItems[i + 1];

    slidesHTML += `
      <div class="swiper-slide">
        <article class="menu-cards-card">
          <button class="furniture__spawn" data-spawn="${item1.key}">
            <div class="menu-cards-card__img"></div>
            <h3 class="menu-cards-card__title">Name: ${item1.name}</h3>
            <span class="menu-cards-card__category">Категорія: ${item1.category}</span>
          </button>
        </article>

        ${item2 ? `
        <article class="menu-cards-card">
          <button class="furniture__spawn" data-spawn="${item2.key}">
            <div class="menu-cards-card__img"></div>
            <h3 class="menu-cards-card__title">Name: ${item2.name}</h3>
            <span class="menu-cards-card__category">Категорія: ${item2.category}</span>
          </button>
        </article>` : ''}
      </div>
    `;
  }

  wrapper.innerHTML = slidesHTML;
  initSwiper();
};



menuFilter.addEventListener('click', (e) => {
    const li = e.target.closest('.menu-filter__list')

     document.querySelectorAll('.menu-filter__list').forEach((el) => el.classList.remove('active'))

    li.classList.add('active')

    const category = categoryMap[li.textContent.trim().toLowerCase()] || 'all'
    renderCards(category)
})

renderCards()
