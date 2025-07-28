const legend = document.querySelector('.legend');

let offsetX, offsetY, isDragging = false;

legend.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - legend.offsetLeft;
    offsetY = e.clientY - legend.offsetTop;
    legend.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        legend.style.left = (e.clientX - offsetX) + 'px';
        legend.style.top = (e.clientY - offsetY) + 'px';
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    legend.style.cursor = 'grab';
});
