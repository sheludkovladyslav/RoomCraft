const toggleTheme = document.querySelector('.theme-toggle')
const theme = localStorage.getItem('RoomCraftTheme') || 'light'

if (theme === 'dark') {
    document.body.classList.add('dark')
    toggleTheme.classList.add('dark')
}

toggleTheme.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark')
    toggleTheme.classList.toggle('dark')

    const newTheme = isDark ? 'dark' : 'light'
    localStorage.setItem('RoomCraftTheme', newTheme)
})