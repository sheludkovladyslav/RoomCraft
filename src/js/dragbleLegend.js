const legendShow = document.querySelector('.legend');

let offsetX, offsetY, isDragging = false;

function startDrag(x, y) {
    isDragging = true;
    offsetX = x - legendShow.offsetLeft;
    offsetY = y - legendShow.offsetTop;
    legendShow.style.cursor = 'grabbing';
}

function moveDrag(x, y) {
    if (!isDragging) return;
    if (window.innerWidth < 768) return;

    const maxX = window.innerWidth - legendShow.offsetWidth;
    const maxY = window.innerHeight - legendShow.offsetHeight;

    let newX = x - offsetX;
    let newY = y - offsetY;

    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));

    legendShow.style.left = newX + 'px';
    legendShow.style.top = newY + 'px';
}

legendShow.addEventListener('mousedown', (e) => {
    startDrag(e.clientX, e.clientY);
});

document.addEventListener('mousemove', (e) => {
    moveDrag(e.clientX, e.clientY);
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    legendShow.style.cursor = 'grab';
});



legendShow.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY);
});

document.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    moveDrag(touch.clientX, touch.clientY);
});

document.addEventListener('touchend', () => {
    isDragging = false;
    legendShow.style.cursor = 'grab';
});