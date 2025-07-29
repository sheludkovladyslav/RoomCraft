const showButton = document.querySelector('.show');
const legend = document.querySelector('.legend__info');
const closeButton = document.querySelector('.close-legend');

const legendOpen = () => {
  if (window.innerWidth > 767) {
    legend.style.display = 'flex';
    showButton.style.display = 'none';

    requestAnimationFrame(() => {
      legend.style.opacity = '1';
      legend.style.transform = 'translateY(0)';
    });
    setTimeout(() => {
      closeButton.style.display = 'block';
      requestAnimationFrame(() => {
        closeButton.style.opacity = '1';
      });
    }, 400);
  } else {
    showButton.style.display = 'none'
    closeButton.style.display = 'none'
  }
};

const legendClouse = () => {
  if (window.innerWidth > 767) {
    legend.style.opacity = '0';
    legend.style.transform = 'translateY(-50px)';
    closeButton.style.opacity = '0';

    setTimeout(() => {
      legend.style.display = 'none';
      closeButton.style.display = 'none';
      showButton.style.display = 'flex';
    }, 300);
  }
};

showButton.addEventListener('click', legendOpen);
closeButton.addEventListener('click', legendClouse);
