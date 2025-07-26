const showButton = document.querySelector('.show');
const legend = document.querySelector('.legend');

const legendOpen = () => {
  legend.style.display = 'block';
  showButton.style.display = 'none';
};

const legendClouse = () => {
  if (window.innerWidth > 767) {
    legend.style.display = 'none';
    showButton.style.display = 'flex';
  }
};

showButton.addEventListener('click', legendOpen);
legend.addEventListener('click', legendClouse);
