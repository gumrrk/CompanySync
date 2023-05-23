const isAdm = localStorage.getItem('isAdm');
const statusImg = document.querySelector('.first-div_header img')

if (isAdm) {
  if (window.location.pathname.includes('index.html')) {
    const login = document.querySelector('#btn_header-login')
    const register = document.querySelector('#btn_header-register')
    login.innerText = 'Retornar'
    register.style.display = 'none'
  }
  if (isAdm === 'y') {
    if (window.location.pathname.includes('/src/pages/')) {
      statusImg.src = '../icon/crown.svg'
    } else {
      statusImg.src = './src/icon/crown.svg'
    }
  } else {
    if (window.location.pathname.includes('/src/pages/')) {
      statusImg.src = '../icon/Ellipse.svg'
    } else {
      statusImg.src = './src/icon/Ellipse.svg'
    }
  }
} else {
  if (window.location.pathname.includes('/src/pages/')) {
    statusImg.src = '../icon/Ellipse.svg'
  } else {
    statusImg.src = './src/icon/Ellipse.svg'
  }
}

function addButtonListeners() {
  const loginButtons = document.querySelectorAll('.button-login');
  Array.from(loginButtons).forEach((button) => {
    button.removeEventListener('click', goToLoginPage);
    button.addEventListener('click', goToLoginPage);
  });

  const logoutButtons = document.querySelectorAll('.button-logout');
  Array.from(logoutButtons).forEach((button) => {
    button.removeEventListener('click', goToLoginPageClean);
    button.addEventListener('click', goToLoginPageClean);
  });

  const registerButtons = document.querySelectorAll('.button-register');
  Array.from(registerButtons).forEach((button) => {
    button.removeEventListener('click', goToRegisterPage);
    button.addEventListener('click', goToRegisterPage);
  });

  const homeButtons = document.querySelectorAll('.button-home');
  Array.from(homeButtons).forEach((button) => {
    button.removeEventListener('click', goToHomePage);
    button.addEventListener('click', goToHomePage);
  });

  const returnButtons = document.querySelectorAll('.button-return');
  Array.from(returnButtons).forEach((button) => {
    button.removeEventListener('click', goBack);
    button.addEventListener('click', goBack);
  })
}

function goToLoginPage() {
  if (isAdm === 'y') {
    if (window.location.pathname.includes('/src/pages/')) {
      window.location.href = '../../src/pages/adminpage.html';
    } else {
      window.location.href = './src/pages/adminpage.html';
    }
  } else if (isAdm === 'n') {
    if (window.location.pathname.includes('/src/pages/')) {
      window.location.href = '../../src/pages/userpage.html';
    } else {
      window.location.href = './src/pages/userpage.html';
    }
  } else {
    if (window.location.pathname.includes('/src/pages/')) {
      window.location.href = '../../src/pages/login.html';
    } else {
      window.location.href = './src/pages/login.html';
    }
  }
}

function goToLoginPageClean() {
  localStorage.removeItem('isAdm'); // limpa o localStorage
  if (window.location.pathname.includes('/src/pages/')) {
    window.location.href = '../../src/pages/login.html';
  } else {
    window.location.href = './src/pages/login.html';
  }
}

function goToRegisterPage() {
  if (isAdm === 'y') {
    if (window.location.pathname.includes('/src/pages/')) {
      window.location.href = '../../src/pages/adminpage.html';
    } else {
      window.location.href = './src/pages/adminpage.html';
    }
  } else if (isAdm === 'n') {
    if (window.location.pathname.includes('/src/pages/')) {
      window.location.href = '../../src/pages/userpage.html';
    } else {
      window.location.href = './src/pages/userpage.html';
    }
  } else {
    if (window.location.pathname.includes('/src/pages/')) {
      window.location.href = '../../src/pages/register.html';
    } else {
      window.location.href = './src/pages/register.html';
    }
  }
}

function goToHomePage() {
  window.location.href = '../../index.html';
}

function goBack() {
  if (document.referrer) {
    window.history.back();
  } else {
    window.location.href = '../../index.html';
  }
}

addButtonListeners();
