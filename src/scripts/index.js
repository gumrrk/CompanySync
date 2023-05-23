const baseUrl = 'http://localhost:3333';

import { setToastDiv } from './login.js';

const renderizarEmpresas = async () => {
  try {
    const response1 = await fetch(`${baseUrl}/companies/readAll`);
    const response2 = await fetch(`${baseUrl}/categories/readAll`);

    if (response1.ok & response2.ok) {
      const allCompanies = await response1.json();
      const allCategories = await response2.json();
      const ul = document.querySelector('#ul-companies');

      // Popular o select com as categorias únicas
      const selectSetores = document.querySelector('#select-setores');
      const uniqueCategories = allCategories.filter((categoria, index, array) => {
        return array.findIndex(c => c.name === categoria.name) === index;
      });

      uniqueCategories.map(categoria => {
        const option = document.createElement('option');
        option.value = categoria.id;
        option.innerText = categoria.name;
        selectSetores.appendChild(option);
      });

      // Filtrar e exibir as empresas de acordo com a categoria selecionada
      selectSetores.addEventListener('change', (event) => {
        const selectedCategory = event.target.value;
        let filteredCompanies = allCompanies.filter(company => company.category_id === selectedCategory);
        ul.innerHTML = '';
        if (selectedCategory == "Todas") {
          filteredCompanies = allCompanies
        }
        filteredCompanies.map(company => {
          const li = document.createElement('li');
          const h2 = document.createElement('h2');
          const p = document.createElement('p');
          h2.innerText = company.name;
          // Encontre o objeto da categoria cujo id é igual ao id da categoria da empresa atual
          const category = allCategories.find(category => category.id === company.category_id);
          // Use o nome da categoria encontrado para preencher o elemento p
          p.innerText = category ? category.name : '';
          li.appendChild(h2);
          li.appendChild(p);
          ul.appendChild(li);
        });
      });

      // Renderizar todas as empresas na ul
      allCompanies.map(company => {
        const li = document.createElement('li');
        const h2 = document.createElement('h2');
        const p = document.createElement('p');
        h2.innerText = company.name;
        // Encontre o objeto da categoria cujo id é igual ao id da categoria da empresa atual
        const category = allCategories.find(category => category.id === company.category_id);
        // Use o nome da categoria encontrado para preencher o elemento p
        p.innerText = category ? category.name : '';
        li.appendChild(h2);
        li.appendChild(p);
        ul.appendChild(li);
      });

    } else {
      setToastDiv('', 'errorDiv', 'Um erro ocorreu. Tente novamente.');
      throw new Error('URL inválida');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao buscar empresas.');
  }
};

renderizarEmpresas();

function slides() {
  let images = document.querySelectorAll('.first-div_main img');
  let index = 0;

  setInterval(() => {
    images[index].classList.remove('active');
    index = (index + 1) % images.length;
    images[index].classList.add('active');
  }, 3000);
}
slides()
