import { todoList, finishedTodo } from "./newItem";

function createFinisheedTodo(todo) {
    const item = document.createElement('div');
    item.classList.add('todo');
    const itemUp = document.createElement('div');
    itemUp.classList.add('todoUp');
    const itemDown = document.createElement('div');
    itemDown.classList.add('todoDown');

    const h3 = document.createElement('h3');
    const dueDate = document.createElement('span');
    const note = document.createElement('p');
    const remove = document.createElement('button');

    h3.textContent = todo.title;
    dueDate.textContent = todo.date;
    note.textContent = todo.description;
        const done = document.createElement('span');
        done.textContent = 'Сompleted';
        done.classList.add('priority');
        done.style.background = 'green';
        done.style.color = 'white';
        itemUp.appendChild(done);

    itemUp.appendChild(h3);
    itemUp.appendChild(dueDate);
    item.appendChild(itemUp);

    itemDown.appendChild(note);
    itemDown.appendChild(remove);
    item.addEventListener('click', ()=> {
        !item.contains(itemDown) ? item.appendChild(itemDown) : item.removeChild(itemDown);
    })

    remove.addEventListener('click', ()=> {
        const index = finishedTodo.indexOf(todo);
        finishedTodo.splice(index, 1);
        localStorage.setItem('finishedTodo', JSON.stringify(finishedTodo));
        todoList.removeChild(item);
    })

    todoList.appendChild(item);
}

export { createFinisheedTodo };