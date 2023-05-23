const baseUrl = 'http://localhost:3333';

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

function loginUser() {
    const form = document.querySelector('.div_main');
    const emailInput = form.querySelector('input[type="email"]');
    const passwordInput = form.querySelector('input[type="password"]');
    const loginButton = form.querySelector('.button-login-required');

    if (!form || !emailInput || !passwordInput || !loginButton) {
        return;
    }

    // Adicionar listener para tecla pressionada no input de senha
    passwordInput.addEventListener('keypress', async (event) => {
        if (event.key === 'Enter') { // Verificar se a tecla pressionada é Enter
            event.preventDefault();
            loginButton.click(); // Chamar o evento do botão de login manualmente
        }
    });

    loginButton.addEventListener('click', async (event) => {
        event.preventDefault();
        const email = emailInput.value;
        const password = passwordInput.value;
        try {
            const response = await fetch(`${baseUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                const authToken = data.authToken;
                localStorage.setItem('authToken', authToken);

                try {
                    const profileResponse = await fetch(`${baseUrl}/employees/profile`, {
                        headers: {
                            'Authorization': `Bearer ${authToken}`,
                        },
                    });

                    const profileData = await profileResponse.json();

                    if (profileResponse.ok) {
                        const userId = profileData.id;
                        localStorage.setItem('userId', userId);
                    } else {
                        setToastDiv('', 'errorDiv', 'Não foi possível obter o ID do usuário.');
                    }
                } catch (error) {
                    console.error(error);
                    setToastDiv('', 'errorDiv', 'Erro ao obter o ID do usuário.');
                }

                if (data.isAdm) {
                    setToastDiv('../../src/pages/adminpage.html', 'successDiv', 'Bem-vindo, Administrador!');
                    localStorage.setItem('isAdm', 'y');
                } else {
                    setToastDiv('../../src/pages/userpage.html', 'successDiv', 'Login bem-sucedido');
                    localStorage.setItem('isAdm', 'n');
                }
            } else {
                setToastDiv('', 'errorDiv', 'Falha ao fazer login.');
            }
        } catch (error) {
            console.error(error);
            setToastDiv('', 'errorDiv', 'Erro ao enviar solicitação.');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loginUser();
});

export { setToastDiv };
