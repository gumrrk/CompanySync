import { fetchDepartments, createDepartment, editDepartment, deleteDepartment, editUser, deleteUser, openModal } from './modals.js';

const baseUrl = 'http://localhost:3333';
const authToken = localStorage.getItem('authToken');

const renderCompaniesAdm = async () => {
    try {
        const selectCompanies = document.querySelector('#select-companies');
        const selectedCompany = localStorage.getItem('selectedCompany');

        const response = await fetch(`${baseUrl}/companies/readAll`, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
            },
        });

        if (response.ok) {
            const allCompanies = await response.json();
            const uniqueCompanies = allCompanies.filter((company, index, array) => {
                return array.findIndex(c => c.id === company.id) === index;
            });

            selectCompanies.innerHTML = '<option value="" selected disabled hidden>Selecionar empresa</option>';

            uniqueCompanies.forEach(company => {
                const option = document.createElement('option');
                option.value = company.id;
                option.innerText = company.name;
                selectCompanies.appendChild(option);
            });

            if (selectedCompany) {
                selectCompanies.value = selectedCompany;
                await renderCompanyDetails(selectedCompany);
            }
        } else {
            throw new Error('URL inválida');
        }

        selectCompanies.addEventListener('change', async (event) => {
            const option = selectCompanies.options[selectCompanies.selectedIndex];
            localStorage.setItem('selectedCompany', option.value);
            await renderCompanyDetails(option.value);
        });
    } catch (error) {
        console.error(error);
        throw new Error('Erro ao buscar empresas.');
    }
};

const renderCompanyDetails = async (companyId) => {
    try {
        const response = await fetch(`${baseUrl}/companies/readById/${companyId}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
            },
        });

        if (response.ok) {
            const allDepartmentsInfo = await response.json();
            localStorage.setItem('referencialCompany', allDepartmentsInfo.id);
            const allDepartments = allDepartmentsInfo.departments;
            const employees = allDepartmentsInfo.employees;
            const ul1 = document.querySelector('#ul1');
            const ul2 = document.querySelector('#ul2');

            if (allDepartments.length === 0) {
                ul1.innerHTML = '<div class="divEmptyDepartments"><h1>Não há departamentos cadastrados nesta empresa</h1></div>';
            } else {
                ul1.innerHTML = '';
                allDepartments.forEach(department => {
                    const li = document.createElement('li');
                    const div1 = document.createElement('div');
                    div1.classList.add('section_main_section_div1');
                    const h3 = document.createElement('h3');
                    h3.innerText = department.name;
                    const p1 = document.createElement('p');
                    p1.innerText = allDepartmentsInfo.name;
                    const p2 = document.createElement('p');
                    p2.innerText = department.description;
                    const div2 = document.createElement('div');
                    div2.classList.add('section_main_section_div2');
                    const icon1 = document.createElement('img');
                    icon1.setAttribute('src', '../icon/vector-eye.svg');
                    icon1.setAttribute('class', 'openModal openModal-infoDepartment');
                    icon1.addEventListener('click', () => {
                        localStorage.setItem('referencialDepartment', department.id);
                        localStorage.setItem('referencialCompany', department.company_id);
                        fetchDepartments();
                    });
                    const icon2 = document.createElement('img');
                    icon2.setAttribute('src', '../icon/vector-pencil.svg');
                    icon2.setAttribute('class', 'openModal openModal-editDepartment');
                    icon2.addEventListener('click', () => {
                        localStorage.setItem('referencialDepartment', department.id);
                        localStorage.setItem('referencialCompany', department.company_id);
                        editDepartment();
                    });

                    const icon3 = document.createElement('img');
                    icon3.setAttribute('src', '../icon/vector-bin.svg');
                    icon3.setAttribute('class', 'openModal openModal-deleteDepartment');
                    icon3.addEventListener('click', () => {
                        localStorage.setItem('referencialDepartment', department.id);
                        localStorage.setItem('referencialCompany', department.company_id);
                        deleteDepartment();
                    });

                    ul1.appendChild(li);
                    li.append(div1, div2);
                    div1.append(h3, p1, p2);
                    div2.append(icon1, icon2, icon3);
                });
            }

            if (employees.length === 0) {
                ul2.innerHTML = '<div class="divEmptyDepartments"><h1>Não há usuários contratados nesta empresa</h1></div>';
            } else {
                ul2.innerHTML = '';
                employees.forEach(employee => {
                    const li = document.createElement('li');
                    const div1 = document.createElement('div');
                    div1.classList.add('section_main_section_div1');
                    const h3 = document.createElement('h3');
                    h3.innerText = employee.name;
                    const p1 = document.createElement('p');
                    p1.innerText = allDepartmentsInfo.name;
                    const p2 = document.createElement('p');
                    p2.innerText = employee.email;
                    const div2 = document.createElement('div');
                    div2.classList.add('section_main_section_div2');
                    const icon1 = document.createElement('img');
                    icon1.setAttribute('src', '../icon/vector-pencil.svg');
                    icon1.setAttribute('class', 'openModal openModal-editUser');
                    icon1.addEventListener('click', () => {
                        localStorage.setItem('referencialEmployee', employee.id);
                        editUser();
                    });

                    const icon2 = document.createElement('img');
                    icon2.setAttribute('src', '../icon/vector-bin.svg');
                    icon2.setAttribute('class', 'openModal openModal-deleteUser');
                    icon2.addEventListener('click', () => {
                        localStorage.setItem('referencialEmployee', employee.id);
                        deleteUser();
                    });

                    ul2.appendChild(li);
                    li.append(div1, div2);
                    div1.append(h3, p2, p1);
                    div2.append(icon1, icon2);
                });
            }
        } else {
            throw new Error('URL inválida');
        }
        openModal();
    } catch (error) {
        console.error(error);
        throw new Error('Erro ao buscar empresas.');
    }
};

createDepartment();
renderCompaniesAdm();
openModal();
