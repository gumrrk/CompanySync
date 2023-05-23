const baseUrl = 'http://localhost:3333'

const form = document.querySelector('.div_main');
const nameInput = form.querySelector('input[name="nome"]');
const emailInput = form.querySelector('input[name="email"]');
const passwordInput = form.querySelector('input[name="senha"]');
const registerButton = form.querySelector('.button-register-required');


function registerEmployee(nome, email, senha) {
  const data = { name: nome, email: email, password: senha };

  fetch(`${baseUrl}/employees/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

    .then(response => {
      if (response.ok) {
        setToastDiv("../pages/login.html", "successDiv", "Cadastro realizado com sucesso")
      } else {
        setToastDiv("", "errorDiv", "Email já cadastrado")
      }
    })

    .catch(error => {
      setToastDiv("", "errorDiv", "Erro na requisição")
    });
}


registerButton.addEventListener('click', event => {
  event.preventDefault();
  const nome = nameInput.value;
  const email = emailInput.value;
  const senha = passwordInput.value;

  
  if (nome === '' || email === '' || senha === '') {
    setToastDiv("", "errorDiv", 'Por favor, preencha todos os campos');
  } else if (!validarEmail(email)) {
    setToastDiv("", "errorDiv", 'Por favor, insira um email válido');
  } else if (senha.length < 5) {
    setToastDiv("", "errorDiv", 'A senha deve ter pelo menos 5 caracteres');
  } else {
    
    localStorage.setItem('goLogin', 'y')
    registerEmployee(nome, email, senha);
  }
});

function goLoginAfterRegister() {
  const goLogin = localStorage.getItem('goLogin');
  if (goLogin === 'y') {
    localStorage.clear(); 
    if (window.location.pathname.includes('/src/pages/')) {
      window.location.href = '../../src/pages/login.html';
    } else {
      window.location.href = './src/pages/login.html';
    }
  }
}
goLoginAfterRegister()


function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

nameInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    registerButton.click();
  }
});

emailInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    registerButton.click();
  }
});

passwordInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    registerButton.click();
  }
});

function setToastDiv(local, className, alert) {
  const div = document.createElement("div");
  div.classList.add(className);
  div.innerHTML = alert;
  document.body.appendChild(div);

  if (className) {
    setTimeout(() => {
      div.style.animation = "slideOut 0.3s forwards";
      setTimeout(() => {
        div.remove();
      }, 300);
    }, 2000);
  }

  if (local !== "") {
    setTimeout(() => {
      window.location.href = local;
    }, 2200);
  }
}