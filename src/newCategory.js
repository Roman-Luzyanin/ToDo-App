import {  createTodo, todoArray, todoList } from  "./newItem";
import { finishedTab } from "./index";

const categoryList = document.querySelector('.category_list');
const categories = JSON.parse(localStorage.getItem('categories')) || ['incoming'];

function createOption(input) {
    const option = document.createElement('option');
    option.value = input;
    option.textContent = input.slice(0,1).toUpperCase() + input.slice(1);
    category.appendChild(option);
    return option;
}

function createCategory(input) {
    const option = createOption(input);

    const categoryItem = document.createElement('div');
    categoryItem.classList.add('categoryItem');

    const radioBtn = document.createElement('input');
    if (input === 'incoming') radioBtn.setAttribute('checked', '');
    Object.assign(radioBtn, {
        'type': 'radio',
        'name': 'category',
        'id': `${input}`,
        'value': `${input}`
    });

    radioBtn.addEventListener('change', ()=> {
        if (finishedTab.classList.contains('active')) return;
        todoList.textContent = '';
        todoArray.filter(i => i.category === input).forEach(todo => {
            todoList.appendChild(createTodo(todo));
        })
    })

    const radioLabel = document.createElement('label');
    radioLabel.setAttribute('for', `${input}`);
    radioLabel.textContent = input.slice(0,1).toUpperCase() + input.slice(1);

    const settings = document.createElement('button');
    settings.addEventListener('click', ()=> {
        categorySettings.showModal();
        categorySettings.style.display = 'flex';

        dialogList.textContent = '';
        todoArray.forEach(todo => {
            const h3 = document.createElement('h3');
            h3.textContent = todo.title;
            h3.classList.add('category_select');
            if (todo.category === input) h3.classList.add('selected');
            dialogList.appendChild(h3);

            h3.addEventListener('click', ()=> {
                h3.classList.contains('selected') ?
                h3.classList.remove('selected') :
                h3.classList.add('selected');
            })

            categoryApply.addEventListener('click', ()=> {
                if (h3.classList.contains('selected')) {
                    todo.category = input;
                    localStorage.setItem('todoArray', JSON.stringify(todoArray));

                } else if (todo.category === input) {
                    todo.category = 'incoming';
                    localStorage.setItem('todoArray', JSON.stringify(todoArray));
                }

                if (!finishedTab.classList.contains('active')) {
                    todoList.textContent = '';
                    todoArray.filter(i => i.category === input).forEach(todo => {
                        todoList.appendChild(createTodo(todo));
                    })
                }
                categorySettings.style.display = 'none';
                categorySettings.close();
            })

            categoryCancel.addEventListener('click', ()=> {
                categorySettings.style.display = 'none';
                categorySettings.close();
            });
        })
    })

    const remove = document.createElement('button');
    remove.addEventListener('click', ()=> {
        const result = confirm('Are you sure?');
        if (result) {
        const index = categories.indexOf(input);
        categories.splice(index, 1);
        localStorage.setItem('categories', JSON.stringify(categories));

        todoArray.filter(i => i.category === input).forEach(todo => todo.category = 'incoming');
        localStorage.setItem('todoArray', JSON.stringify(todoArray));
        
        if (!finishedTab.classList.contains('active')) {
            todoList.textContent = '';
            todoArray.filter(i => i.category === 'incoming')
            .forEach(todo => todoList.appendChild(createTodo(todo)));
        }
        
        categoryList.querySelector('input').checked = true;
        category.removeChild(option);
        categoryList.removeChild(categoryItem);
        }
    })
    
    categoryItem.appendChild(radioBtn);
    categoryItem.appendChild(radioLabel);
    if (input !== 'incoming') categoryItem.appendChild(settings);
    if (input !== 'incoming') categoryItem.appendChild(remove);
    categoryList.appendChild(categoryItem);
}

window.addEventListener('load', ()=> categories.forEach(cat => createCategory(cat)))

export { createCategory, categories, categoryList, createOption };