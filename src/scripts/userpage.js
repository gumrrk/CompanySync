const authToken = localStorage.getItem('authToken');
const baseUrl = 'http://localhost:3333'

try {
  const response1 = await fetch(`${baseUrl}/employees/profile`, {
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
  });

  const data1 = await response1.json();

  const department_id = data1.department_id;

  const response2 = await fetch(`${baseUrl}/departments/readById/${department_id}`, {
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
  });

  const data2 = await response2.json();
  if (response1.ok) {
    const usernameElement = document.querySelector('.section-username h1');
    const emailElement = document.querySelector('.section-username p');
    const companyElement = document.querySelector('.section-info-title span:first-of-type');
    const departmentElement = document.querySelector('.section-info-title span:last-of-type');
    const listEmployees = document.querySelector('.ul-info-list');

    usernameElement.textContent = data1.name;
    emailElement.textContent = data1.email;

    if (response2.ok) {
      companyElement.textContent = data2.company.name;
      departmentElement.textContent = data2.description;
      const employees = data2.employees;
      for (const employee of employees) {
        const div = document.createElement('div')
        const li = document.createElement('li');
        const h2 = document.createElement('h2');
        h2.textContent = employee.name;
        div.appendChild(h2);
        li.appendChild(div);
        listEmployees.appendChild(li);
      }
    }

    if (!data1.company_id && !data1.department_id) {
      const sectionInfo = document.querySelector('.section-info');
      sectionInfo.style.display = 'none';
      const sectionNotFound = document.querySelector('.section-notFound');
      sectionNotFound.style.display = 'flex';
    }
  } else {
    console.error('Não foi possível obter as informações do usuário.');
  }
} catch (error) {
  console.error(error);
  alert('Erro ao obter informações do usuário.');
}
