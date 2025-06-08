import { priorityChoice } from "./priority.js";
import { showDistance } from "./dates.js";

const todoList = document.querySelector('.todo_list');
const info = document.querySelector('.info');
const todoArray = JSON.parse(localStorage.getItem('todoArray')) || [];
const finishedTodo = JSON.parse(localStorage.getItem('finishedTodo')) || [];
let check;

function Todo(title, date, description, priority, category) {
    this.title = title;
    this.date = date;
    this.description = description;
    this.priority = priority;
    this.category = category;
}

function createTodo(todo) {
    const item = document.createElement('div');
    item.classList.add('todo');
    const itemUp = document.createElement('div');
    itemUp.classList.add('todoUp');
    const itemDown = document.createElement('div');
    itemDown.classList.add('todoDown');

    const h3 = document.createElement('h3');
    const prior = document.createElement('span');
    const dueDate = document.createElement('span');
    const note = document.createElement('p');
    const settings = document.createElement('button');
    const remove = document.createElement('button');
    const done = document.createElement('button');

    h3.textContent = todo.title;
    dueDate.textContent = todo.date;
    note.textContent = todo.description;
    priorityChoice(todo, itemUp, prior);

    const controls = document.createElement('div');
    controls.classList.add('controls');
    controls.appendChild(done);
    controls.appendChild(remove);
    controls.appendChild(settings);

    itemUp.appendChild(h3);
    itemUp.appendChild(dueDate);
    item.appendChild(itemUp);

    itemDown.appendChild(note);
    itemDown.appendChild(controls);
    item.addEventListener('click', ()=> {
        !item.contains(itemDown) ? item.appendChild(itemDown) : item.removeChild(itemDown);
    })

    settings.addEventListener('click', (e)=> {
        e.stopPropagation();
        newItem.showModal();
        newItem.style.display = 'flex';

        apply.style.display = 'none';
        changeApply.style.display = 'block';
        check = todo;
        
        title.value = todo.title;
        date.value = todo.date;
        description.value = todo.description; 
        priority.value = todo.priority; 
        category.value = todo.category;

        changeApply.addEventListener('click', ()=> {      
            if (todo !== check) return;

            todo.title = title.value;
            todo.date = date.value;
            todo.description = description.value; 
            todo.priority = priority.value;
            todo.category = category.value;

            h3.textContent = title.value;
            dueDate.textContent = date.value;
            note.textContent = description.value;
            priorityChoice(todo, itemUp, prior);

            localStorage.setItem('todoArray', JSON.stringify(todoArray));

            const checked = document.querySelectorAll('[name="category"]');
            const el = Array.from(checked).find(node => node.checked);
            if (el.id !== category.value) item.remove();
               
            apply.style.display = 'block';
            changeApply.style.display = 'none';
            newItem.style.display = 'none';
            newItem.close();
        }) 
    })

    remove.addEventListener('click', ()=> {
        const result = confirm('Are you sure?');
        if (result) {
            const index = todoArray.indexOf(todo);
            todoArray.splice(index, 1);
            localStorage.setItem('todoArray', JSON.stringify(todoArray));
            todoList.removeChild(item);
        }
    })

    done.addEventListener('click', ()=> {
        const index = todoArray.indexOf(todo);
        const done = todoArray.splice(index, 1);
        localStorage.setItem('todoArray', JSON.stringify(todoArray));
        
        todoList.removeChild(item);
        finishedTodo.push(done[0]);
        localStorage.setItem('finishedTodo', JSON.stringify(finishedTodo));
    })

    item.addEventListener('mouseenter', ()=> showDistance(todo));

    item.addEventListener('mouseleave', ()=> info.textContent = '')

    return item;
}

title.addEventListener('input', ()=> {
    if (title.value) {
        apply.disabled = false;
        changeApply.disabled = false;
    } else {
        apply.disabled = true;
        changeApply.disabled = true;
        title.placeholder = '';
    }
});

cancel.addEventListener('click', ()=> {
    apply.style.display = 'block';
    changeApply.style.display = 'none';
    newItem.style.display = 'none';
    newItem.close();
    
});

apply.addEventListener('click', ()=> {
    let isExist = false;
    todoArray.forEach(todo => title.value === todo.title ? isExist = true : '');

    if (isExist) {
        title.value = '';
        title.placeholder = 'Such ToDo already exist!';
        setTimeout(()=> title.placeholder = '', 5000);
        apply.disabled = true;
        return;
    };

    const todo = new Todo(title.value, date.value, description.value, priority.value, category.value);
    todoArray.push(todo);
    localStorage.setItem('todoArray', JSON.stringify(todoArray));

    const checked = document.querySelectorAll('[name="category"]');
    const el = Array.from(checked).find(node => node.checked);
    if (el.id === category.value) todoList.appendChild(createTodo(todo));

    newItem.style.display = 'none';
    newItem.close();
})

window.addEventListener('load', ()=> {
    todoArray.filter(i => i.category === 'incoming')
    .forEach(todo => todoList.appendChild(createTodo(todo)));
})

export { todoArray, finishedTodo, todoList, createTodo };