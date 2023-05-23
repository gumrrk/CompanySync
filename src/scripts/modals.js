import { setToastDiv } from './login.js';
const authToken = localStorage.getItem('authToken');
const baseUrl = 'http://localhost:3333';

let overlay = document.querySelector('.overlay');
if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'overlay';
}

function openModal() {
    const openModalButtons = document.querySelectorAll('.openModal');
    openModalButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const modalId = button.classList[1].split('-')[1];
            const modal = document.querySelector(`#modal-${modalId}`);
            modal.style.display = 'flex';
            document.body.appendChild(overlay);
            document.body.style.overflow = 'hidden';
        });
    });

    const exitButtons = document.querySelectorAll('.exitButton');

    const closeDialog = () => {
        const modals = document.querySelectorAll('.modal');
        modals.forEach((modal) => {
            modal.style.display = 'none';
        });
        localStorage.removeItem('idReferencial');
        if (overlay) {
            document.body.removeChild(overlay);
        }
        document.body.style.overflow = 'auto';
    };

    exitButtons.forEach((button) => {
        button.addEventListener('click', closeDialog);
    });
    overlay.addEventListener('click', closeDialog);
    const closeDialogOnEscape = (event) => {
        if (event.keyCode === 27) {
            closeDialog();
        }
    };
    document.addEventListener('keydown', closeDialogOnEscape);
}

async function fetchDepartments() {
    const idReferencial = localStorage.getItem('referencialDepartment');
    const response = await fetch(`${baseUrl}/departments/readAll`, {
        headers: {
            'Authorization': `Bearer ${authToken}`,
        },
    });
    const departments = await response.json();

    for (const department of departments) {
        if (department.id === idReferencial) {
            department.name = department.name;
            department.description = department.description;

            const companyResponse = await fetch(`${baseUrl}/companies/readById/${department.company_id}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            });
            const company = await companyResponse.json();

            const departmentName = company.departments.find((dept) => dept.id === idReferencial)?.name;
            const departmentDescription = company.departments.find((dept) => dept.id === idReferencial)?.description;

            const h1Company = document.querySelector('.dialog_div-infoDepartment h1');
            h1Company.textContent = departmentName;

            const h3Company = document.querySelector('.dialog_div-infoDepartment h3');
            h3Company.textContent = departmentDescription;

            const pCompany = document.querySelector('.dialog_div-infoDepartment p');
            pCompany.textContent = company.name;

            const selectElement = document.querySelector('.dialog_div-infoDepartment_select');

            const employeesResponse = await fetch(`${baseUrl}/employees/outOfWork`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            });
            const employees = await employeesResponse.json();
            selectElement.innerHTML = '<option value="" selected disabled hidden>Selecionar usuário</option>';
            for (const employee of employees) {
                const option = document.createElement('option');
                option.value = employee.id;
                option.textContent = employee.name;
                selectElement.appendChild(option);
            }

            const ulElement = document.querySelector('.dialog_div-infoDepartment_div2 ul');
            ulElement.innerHTML = '';
            const companyEmployees = company.employees || [];

            const departmentCompanyEmployees = companyEmployees.filter((employee) => employee.department_id === idReferencial);
            const buttonHire = document.getElementById('buttonHire');
            buttonHire.addEventListener('click', hireEmployee);

            if (departmentCompanyEmployees.length === 0) {
                const h2Element = document.createElement('h2');
                h2Element.textContent = 'Não há contratados';
                h2Element.classList.add('h2Element')
                ulElement.appendChild(h2Element);
            } else {
                for (const employee of departmentCompanyEmployees) {
                    const liElement = document.createElement('li');
                    const divElement = document.createElement('div');
                    const h2Element = document.createElement('h2');
                    const pElement = document.createElement('p');
                    const buttonElement = document.createElement('button');

                    h2Element.textContent = employee.name;
                    pElement.textContent = company.name;
                    buttonElement.textContent = 'Desligar';
                    buttonElement.classList.add('dismissButton')
                    buttonElement.setAttribute('id', employee.id)
                    buttonElement.addEventListener('click', dismissEmployee);

                    divElement.appendChild(h2Element);
                    divElement.appendChild(pElement);
                    divElement.appendChild(buttonElement);
                    liElement.appendChild(divElement);
                    ulElement.appendChild(liElement);
                }
            }
            break;
        }
    }
}

async function hireEmployee() {
    const selectElement = document.querySelector('.dialog_div-infoDepartment_select');
    const selectedUserId = selectElement.value;
    const response = await fetch(`${baseUrl}/employees/hireEmployee/${selectedUserId}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ department_id: localStorage.getItem('referencialDepartment') }),
    });

    if (response.ok) {
        const selectedOption = selectElement.querySelector(`option[value="${selectedUserId}"]`);

        selectElement.removeChild(selectedOption);

        const departmentId = localStorage.getItem('referencialDepartment');
        await fetch(`${baseUrl}/departments/readById/${departmentId}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
            },
        });
        setToastDiv('', 'successDiv', 'Usuário contratado.');
    } else {
        setToastDiv('', 'errorDiv', 'Falha ao contratar o usuário.');
    }
}

async function dismissEmployee(event) {
    const buttonElement = event.target;
    const employeeId = buttonElement.getAttribute('id');

    try {
        const response = await fetch(`${baseUrl}/employees/dismissEmployee/${employeeId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ department_id: localStorage.getItem('referencialDepartment') }),
        });

        if (response.ok) {
            const liElement = buttonElement.closest('li');
            liElement.remove();
            setToastDiv('', 'successDiv', 'Usuário demitido com sucesso.');
        } else {
            setToastDiv('', 'errorDiv', 'Falha ao demitir o usuário. Tente novamente.');
        }
    } catch (error) {
        console.error(error);
        setToastDiv('', 'errorDiv', 'Ocorreu um erro ao demitir o usuário.');
    }
}

function createDepartment() {
    const selectEmpresa = document.querySelector('.dialog_div-createDepartment_select');
    const nameInput = document.getElementById('nameCreate');
    const descriptionInput = document.getElementById('descriptionCreate');
    const buttonCreate = document.getElementById('buttonCreate');

    function sendDataDepartment() {
        const selectedCompanyId = selectEmpresa.value;
        const name = nameInput.value;
        const description = descriptionInput.value;

        const data = {
            name: name,
            description: description,
            company_id: selectedCompanyId
        };

        fetch(`${baseUrl}/departments/create`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(result => {
                console.log('Departamento criado com sucesso:', result);
                setToastDiv('', 'sucessDiv', 'Departamento criado com sucesso.');
            })
            .catch(error => {
                console.error('Ocorreu um erro ao criar o departamento:', error);
                setToastDiv('', 'errorDiv', 'Ocorreu um erro ao criar o departamento.');
            });
    }

    fetch(`${baseUrl}/companies/readAll`)
        .then(response => response.json())
        .then(data => {
            data.forEach(empresa => {
                const option = document.createElement('option');
                option.value = empresa.id;
                option.textContent = empresa.name;
                selectEmpresa.appendChild(option);
            });
        })
        .catch(error => {
            setToastDiv('', 'errorDiv', 'Ocorreu um erro ao obter as empresas.');
        });

    buttonCreate.addEventListener('click', sendDataDepartment);

    document.addEventListener('keydown', event => {
        if (event.key === 'Enter' && (event.target === nameInput || event.target === descriptionInput)) {
            event.preventDefault();
            sendDataDepartment();
        }
    });
}

async function editDepartment() {
    const idReferencial = localStorage.getItem('referencialDepartment');
    const input = document.querySelector('#editInput');
    const saveButton = document.getElementById('saveButton');

    async function sendUpdatedDescription() {
        const description = input.value;

        const data = {
            "description": description,
        };

        try {
            const response = await fetch(`${baseUrl}/departments/update/${idReferencial}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            setToastDiv('', 'successDiv', 'Descrição atualizada com sucesso.');
            console.log('Descrição atualizada com sucesso:', response);

            await updatePlaceholder();
        } catch (error) {
            console.error('Ocorreu um erro ao atualizar a descrição:', error);
            setToastDiv('', 'errorDiv', 'Ocorreu um erro ao atualizar a descrição.');
        }
    }

    async function updatePlaceholder() {
        try {
            const idCompanyReferencial = localStorage.getItem('referencialCompany')
            const response = await fetch(`${baseUrl}/companies/readById/${idCompanyReferencial}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            const { departments } = await response.json();
            const department = departments.find(dept => dept.id === idReferencial);
            if (department) {
                input.placeholder = department.description;
            }
        } catch (error) {
            console.error('Ocorreu um erro ao buscar a descrição antiga:', error);
        }
    }

    saveButton.addEventListener('click', sendUpdatedDescription);

    input.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendUpdatedDescription();
        }
    });

    updatePlaceholder();
}

async function deleteDepartment() {
    const idReferencial = localStorage.getItem('referencialDepartment');
    const idCompanyReferencial = localStorage.getItem('referencialCompany');
    try {
        const response1 = await fetch(`${baseUrl}/departments/readByCompany/${idCompanyReferencial}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
            },
        });
        const departments = await response1.json();
        const name = document.querySelector('#nameDepartment');
        departments.forEach(department => {
            if (department.id === idReferencial) {
                let nameDepartment = department.name;
                name.textContent = nameDepartment;
            }
        });
    } catch (error) {
        console.error('Ocorreu um erro ao capturar o nome do Departamento:', error);
    }

    const deleteButton = document.getElementById('deleteDepartmentButton');
    deleteButton.addEventListener('click', async (event) => {
        event.preventDefault();
        try {
            const response1 = await fetch(`${baseUrl}/departments/readById/${idReferencial}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            });
            const { employees } = await response1.json();

            const dismissalPromises = employees.map(async (employee) => {
                try {
                    const response2 = await fetch(`${baseUrl}/employees/dismissEmployee/${employee.id}`, {
                        method: 'PATCH',
                        headers: {
                            'Authorization': `Bearer ${authToken}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ department_id: null }),
                    });
                    console.log(`Funcionário ${employee.id} demitido.`);
                    return response2;
                } catch (error) {
                    console.error(`Erro ao demitir o funcionário ${employee.id}:`, error);
                    throw error;
                }
            });

            await Promise.all(dismissalPromises);

            try {
                const response3 = await fetch(`${baseUrl}/departments/delete/${idReferencial}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                    },
                });
                await response3.json();
                setToastDiv('', 'successDiv', 'Departamento deletado com sucesso.');
                console.log('Departamento deletado.');
            } catch (error) {
                console.error('Ocorreu um erro ao deletar o departamento:', error);
                setToastDiv('', 'errorDiv', 'Ocorreu um erro ao deletar o departamento.');
            }
        } catch (error) {
            console.error('Ocorreu um erro ao buscar os funcionários do departamento:', error);
        }
    });
}

async function editUser() {
    const idReferencialEmployee = localStorage.getItem('referencialEmployee');
    console.log(idReferencialEmployee)
    const saveButton = document.getElementById('saveButtonUser');
    saveButton.addEventListener('click', async (event) => {
        event.preventDefault();
        const nameInput = document.querySelector('#modal-editUser input[type="text"]');
        const emailInput = document.querySelector('#modal-editUser input[type="email"]');
        let userData = {
            name: nameInput.value,
            email: emailInput.value
        };
        if (nameInput.value === "") {
            setToastDiv('', 'errorDiv', 'Preencha todos os dados.');
        } else if (emailInput.value !== "" && !validateEmail(emailInput.value)) {
            setToastDiv('', 'errorDiv', 'Digite um email válido.');
        } else {
            if (emailInput.value === "") {
                try {
                    const response1 = await fetch(`${baseUrl}/employees/readAll`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${authToken}`,
                        },
                    });
                    const employees = await response1.json();
                    for (const employee of employees) {
                        if (idReferencialEmployee === employee.id) {
                            console.log(employee.email)
                            userData = {
                                name: nameInput.value,
                                email: employee.email
                            };
                        }
                    }
                    
                } catch (error) {
                    alert('Ocorreu um erro ao capturar os dados do usuário:');
                }
            }
            try {
                console.log(userData)
                const response2 = await fetch(`${baseUrl}/employees/updateEmployee/${idReferencialEmployee}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`,
                    },
                    body: JSON.stringify(userData),
                });

                if (response2.ok) {
                    setToastDiv('', 'successDiv', 'Dados do usuário atualizados com sucesso.');
                } else {
                    alert('Este email já está cadastrado.');
                }
            } catch (error) {
                alert('Ocorreu um erro ao atualizar os dados do usuário.');
            }
        }
    });
}

function validateEmail(email) {
    
    const emailRegex = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

async function deleteUser() {
    const idReferencialEmployee = localStorage.getItem('referencialEmployee');
    try {
        const response1 = await fetch(`${baseUrl}/employees/readAll`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
            },
        });
        const users = await response1.json();
        const name = document.querySelector('#nameEmployee');

        users.forEach(user => {
            if (user.id === idReferencialEmployee) {
                let nameUser = user.name;
                name.textContent = nameUser;
            }
        });

    } catch (error) {
        console.error('Ocorreu um erro ao capturar o nome do funcionário:', error);
    }

    const deleteButton = document.getElementById('deleteEmployeeButton');
    deleteButton.addEventListener('click', async (event) => {
        event.preventDefault();
        try {
            const response2 = await fetch(`${baseUrl}/employees/deleteEmployee/${idReferencialEmployee}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            });
            setToastDiv('', 'successDiv', 'Funcionário demitido com sucesso.');
            return response2;
        } catch (error) {
            console.error('Ocorreu um erro ao deletar o departamento:', error);
            setToastDiv('', 'errorDiv', 'Ocorreu um erro ao demitir o funcionário.');
        }
    });
}

export { createDepartment, fetchDepartments, editDepartment, deleteDepartment, hireEmployee, editUser, deleteUser, openModal }