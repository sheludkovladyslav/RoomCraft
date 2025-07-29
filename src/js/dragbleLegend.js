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
        const maxX = window.innerWidth - legendShow.offsetWidth;
        const maxY = window.innerHeight - legendShow.offsetHeight;

        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;

        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));

        legendShow.style.left = newX + 'px';
        legendShow.style.top = newY + 'px';
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    legendShow.style.cursor = 'grab';
});
