const showButton = document.querySelector('.show');
const legend = document.querySelector('.legend');

const legendOpen = () => {
  legend.style.display = 'block';
  requestAnimationFrame(() => {
    legend.style.opacity = '1';
    legend.style.transform = 'translateY(0)';
  });
  showButton.style.display = 'none';
};

const legendClouse = () => {
  if (window.innerWidth > 767) {
    legend.style.opacity = '0';
    legend.style.transform = 'translateY(-50px)';
    setTimeout(() => {
      legend.style.display = 'none';
      showButton.style.display = 'flex';
    }, 300);
  }
};

showButton.addEventListener('click', legendOpen);
legend.addEventListener('click', legendClouse);
