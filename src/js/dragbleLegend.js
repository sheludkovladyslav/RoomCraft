const legendShow = document.querySelector('.legend');

let offsetX, offsetY, isDragging = false;

legendShow.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - legendShow.offsetLeft;
    offsetY = e.clientY - legendShow.offsetTop;
    legendShow.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        legendShow.style.left = (e.clientX - offsetX) + 'px';
        legendShow.style.top = (e.clientY - offsetY) + 'px';
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    legendShow.style.cursor = 'grab';
});
