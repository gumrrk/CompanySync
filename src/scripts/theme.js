// Função responsável por alterar o tema da página entre claro e escuro
function changeMode() {
    const body = document.body;
    const mainElement = document.querySelector('.mainElement')
    if (body.classList.contains('dark-mode')) {
        // Modo claro
        document.documentElement.style.setProperty('--color-brand-1', '#0000FF');
        document.documentElement.style.setProperty('--color-brand-1-hover', '#0000ac');
        document.documentElement.style.setProperty('--color-brand-2', '#3532FF');
        document.documentElement.style.setProperty('--color-action-1', '#36B37E');
        document.documentElement.style.setProperty('--color-action-1-hover', '#0a8954');
        document.documentElement.style.setProperty('--color-action-2', '#FF5630');
        document.documentElement.style.setProperty('--color-action-3', '#FFAB00');
        document.documentElement.style.setProperty('--color-action-4', '#f15050');
        document.documentElement.style.setProperty('--color-grey-1', '#212529');
        document.documentElement.style.setProperty('--color-grey-2', '#495057');
        document.documentElement.style.setProperty('--color-grey-3', '#ADB5BD');
        document.documentElement.style.setProperty('--color-grey-4', '#E9ECEF');
        document.documentElement.style.setProperty('--color-grey-5', '#F1F3F5');
        document.documentElement.style.setProperty('--color-mode', '#ffffff');
        document.documentElement.style.setProperty('--color-black', '#000000');
        document.documentElement.style.setProperty('--color-mode-opacity', 'rgba(255, 255, 255, 0.95)');
        document.documentElement.style.setProperty('--color-grey-opacity', 'rgba(0, 0, 0, 0.5)');
        body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', '0');
        if (window.location.pathname.includes('/src/pages/')) {
            document.getElementById("dark-button").src = "../icon/moon.svg"
            if (mainElement) {
                mainElement.style.backgroundImage = 'url("../img/img-bg.png")';
            }
        } else {
            document.getElementById("dark-button").src = "./src/icon/moon.svg"
            if (mainElement) {
                mainElement.style.backgroundImage = 'url("./img/img-bg.png")';
            }
        }
    } else {
        // Modo escuro
        document.documentElement.style.setProperty('--color-brand-1', '#6741d9');
        document.documentElement.style.setProperty('--color-brand-1-hover', '#4c3299');
        document.documentElement.style.setProperty('--color-brand-2', '#000000');
        document.documentElement.style.setProperty('--color-action-1', '#36B37E');
        document.documentElement.style.setProperty('--color-action-1-hover', '#0a8954');
        document.documentElement.style.setProperty('--color-action-2', '#FF5630');
        document.documentElement.style.setProperty('--color-action-3', '#FFAB00');
        document.documentElement.style.setProperty('--color-action-4', '#f15050');
        document.documentElement.style.setProperty('--color-grey-1', '#f1f1f1');
        document.documentElement.style.setProperty('--color-grey-2', '#d1d1d1');
        document.documentElement.style.setProperty('--color-grey-3', '#a6a6a6');
        document.documentElement.style.setProperty('--color-grey-4', '#111111');
        document.documentElement.style.setProperty('--color-grey-5', '#111111');
        document.documentElement.style.setProperty('--color-mode', '#000000');
        document.documentElement.style.setProperty('--color-black', '#ffffff');
        document.documentElement.style.setProperty('--color-mode-opacity', 'rgba(0, 0, 0, 0.95)');
        document.documentElement.style.setProperty('--color-grey-opacity', 'rgba(255, 255, 255, 0.5)');
        body.classList.add('dark-mode');
        localStorage.setItem('darkMode', '1');
        if (window.location.pathname.includes('/src/pages/')) {
            document.getElementById("dark-button").src = "../icon/sun.svg"
            if (mainElement) {
                mainElement.style.backgroundImage = 'url("../img/img-bg-dark.png")';
            }
        } else {
            document.getElementById("dark-button").src = "./src/icon/sun.svg"
            if (mainElement) {
                mainElement.style.backgroundImage = 'url("./img/img-bg-dark.png")';
            }
        }
    }
}

// Função que busca o tema preferido no localStorage
function applyDarkModeFromLocalStorage() {
    const darkMode = localStorage.getItem('darkMode');
    const body = document.body;
    if (darkMode === '1') {
        changeMode()
    } else {
        body.classList.remove('dark-mode');
    }
}
applyDarkModeFromLocalStorage()

// Função que adiciona a função anterior ao botão de mudar tema no HTML
function addDarkButton() {
    const button = document.querySelector('#dark-button');
    button.addEventListener('click', changeMode);
}
addDarkButton();
