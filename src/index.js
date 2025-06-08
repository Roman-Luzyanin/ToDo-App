import "./styles.css";
import { createCategory, categories, categoryList, createOption } from "./newCategory";
import {  todoArray, finishedTodo, todoList, createTodo } from "./newItem";
import { createFinisheedTodo } from "./finishedTodo";

const activeTab = document.querySelector('.active_tab');
const finishedTab = document.querySelector('.finished_tab');

addCategory.addEventListener('click', ()=> {
    if (!inputCategory.value) return;
    const input = inputCategory.value.toLowerCase();

    let isExist = false;
    categories.forEach(cat => cat === input ? isExist = true : '');
    if (isExist) {
        inputCategory.value = '';
        inputCategory.classList.add('red');
        inputCategory.placeholder = 'Such category already exist!';
        setTimeout(()=> {
            inputCategory.placeholder = '';
            inputCategory.classList.remove('red');
            inputCategory.placeholder = 'Input your category...';
        }, 5000);
        return;
    };

    createCategory(input);

    categories.push(input);
    localStorage.setItem('categories', JSON.stringify(categories));
    inputCategory.value = '';
})

categoryUp.addEventListener('click', ()=> {
    const checked = [...categoryList.querySelectorAll('input')].find(i =>i.checked === true).id;
    const index = categories.indexOf(checked);
    if (index === 0 || index === 1) return;
    
    [categories[index - 1], categories[index]] = [categories[index], categories[index - 1]];
    localStorage.setItem('categories', JSON.stringify(categories));

    categoryList.textContent = '';
    categories.forEach(cat => createCategory(cat));
    categoryList.querySelector(`input[id=${checked}]`).checked = true;

    category.textContent = '';
    categories.forEach(cat => createOption(cat));
})

categoryDown.addEventListener('click', ()=> {
    const checked = [...categoryList.querySelectorAll('input')].find(i =>i.checked === true).id;
    const index = categories.indexOf(checked);
    if (index === 0 || index === categories.length - 1) return;

    [categories[index], categories[index + 1]] = [categories[index + 1], categories[index]];
    localStorage.setItem('categories', JSON.stringify(categories));

    categoryList.textContent = '';
    categories.forEach(cat => createCategory(cat));
    categoryList.querySelector(`input[id=${checked}]`).checked = true;

    category.textContent = '';
    categories.forEach(cat => createOption(cat));
})

searchTodo.addEventListener('input', ()=> {
    if (finishedTab.classList.contains('active')) return;
    todoList.textContent = '';
    const regex = new RegExp(`^${searchTodo.value}`, 'i');
    const checked = [...categoryList.querySelectorAll('input')].find(i =>i.checked === true).id;
    todoArray.filter(todo => todo.category === checked)
             .filter(todo => todo.title.match(regex))
             .forEach(todo => todoList.appendChild(createTodo(todo)));
})

addTodo.addEventListener('click', ()=> {
    title.value = '';
    date.value = '';
    description.value = '';
    priority.value = 'normal'; 
    category.value = 'incoming';
    apply.disabled = true;
    changeApply.style.display = 'none';
    newItem.showModal();
    newItem.style.display = 'flex';
});

activeTab.addEventListener('click', ()=> {
    todoList.textContent = '';
    const checked = document.querySelectorAll('[name="category"]');
    const el = Array.from(checked).find(node => node.checked);
    todoArray.filter(i => i.category === el.id)
             .forEach(todo => todoList.appendChild(createTodo(todo)));

    activeTab.classList.add('active');
    finishedTab.classList.remove('active');
})

finishedTab.addEventListener('click', ()=> {
    todoList.textContent = '';
    finishedTodo.forEach(todo => createFinisheedTodo(todo));
    activeTab.classList.remove('active');
    finishedTab.classList.add('active');
})

window.addEventListener('keydown', (e)=> {
    if (e.key === 'Escape') {
        newItem.style.display = 'none';
        categorySettings.style.display = 'none';
    }
})

export { finishedTab };
