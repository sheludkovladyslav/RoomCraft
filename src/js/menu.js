import furnitureList from './furnitures.js';

const menuCards = document.getElementById('menuCards');
const menuFilter = document.getElementById('menuFilter');
const categoryMap = {
  декорації: 'decoration',
  меблі: 'furniture',
  електроніка: 'electronics',
  'ін.': 'all',
};

const renderCards = (category = 'all') => {
  menuCards.innerHTML = furnitureList
    .filter(item => category === 'all' || item.category === category)
    .map(item => {
      return `
            <li class="menu-cards-card">
          <button class="furniture__spawn" data-spawn="${item.key}">
         <div class="menu-cards-card__img"></div>
        <h3 class="menu-cards-card__title">${item.name}</h3>
    <p class="menu-cards-card__category">Категорія: ${item.category}</p>
              </button>
</li>
        `;
    })
    .join('');
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
