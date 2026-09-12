//render.js

import app from "../logic/app.js";
import { formatDistanceToNow, endOfDay, isPast, isBefore } from "date-fns";

const renderTodos = (searchQuery, sortBy) => {
	const todoList = document.querySelector('.todoList');
	
	todoList.replaceChildren();

	app.getCurrentCategory().getTodos(searchQuery, sortBy).forEach(item => {
		const todo = document.createElement('div');
		const todoUp = document.createElement('div');
		const todoDown = document.createElement('div');

		const title = document.createElement('p');
		const dueDate = document.createElement('p');
		const description = document.createElement('p');
		const priority = document.createElement('p');
		const completedStatus = document.createElement('p');
		
		todoUp.classList.add('todoUp');
		todoDown.classList.add('todoDown');
		todo.classList.add('todo');
		
		if (item.dueDate) {
			isPast(item.dueDate) ? dueDate.classList.add('red') :
														 dueDate.classList.add('green');
		}
		
		todo.dataset.id = item.id;
		title.textContent = item.title;
		dueDate.textContent = item.dueDate ? 
						formatDistanceToNow(endOfDay(new Date(item.dueDate)), {addSuffix: true}) : 
																																			'No time limit';
		description.textContent = item.description ? item.description : 'No description';
		priority.textContent = item.priority;
		priority.classList.add('priorityElement');
		
		if (item.priority === 'high priority') {
			todo.classList.add('highPriority');
			priority.classList.add('high');
			
		} else if (item.priority === 'very high priority') {
			todo.classList.add('veryHighPriority');
			priority.classList.add('veryHigh');
		}
		
		todoUp.append(title);
		
		if (app.getCurrentCategory().title === 'COMPLETED') {
			todo.classList.add('complete');
			todoUp.append(completedStatus)
			!item.dueDate || isBefore(item.addedTo, item.dueDate) ?
										completedStatus.classList.add('onTime') :
										completedStatus.classList.add('overDue');
		} else todoUp.append(dueDate);
		
		todo.append(todoUp);
		
		if (app.getCurrentCategory().getCurrentTodo()?.id === item.id) {
			todo.classList.add('activeTodo');
			
			if (app.getCurrentCategory().title !== 'COMPLETED') {
				const doneTodoBtn = document.createElement('button');
				doneTodoBtn.classList.add('doneTodoBtn');
				doneTodoBtn.title = 'Todo is done';
				doneTodoBtn.dataset.id = item.id;
				
				const editTodoBtn = document.createElement('button');
				editTodoBtn.classList.add('editTodoBtn');
				editTodoBtn.title = 'Settings';
				editTodoBtn.dataset.id = item.id;
				
				const removeTodoBtn = document.createElement('button');
				removeTodoBtn.classList.add('removeTodoBtn');
				removeTodoBtn.title = 'Remove Todo';
				removeTodoBtn.dataset.id = item.id;
				
				const todoButtons = document.createElement('div');
				todoButtons.append(doneTodoBtn, editTodoBtn, removeTodoBtn);
				
				todoDown.append(description, priority, todoButtons);
				todo.append(todoDown);
				
			} else {
				const restoreTodoBtn = document.createElement('button');
				restoreTodoBtn.classList.add('restoreTodoBtn');
				restoreTodoBtn.title = 'Restore Todo'
				restoreTodoBtn.dataset.id = item.id;
				
				const infoBtn = document.createElement('button');
				infoBtn.classList.add('infoBtn');
				infoBtn.title = 'Information'
				infoBtn.dataset.id = item.id;
				
				const removeTodoBtn = document.createElement('button');
				removeTodoBtn.classList.add('removeTodoBtn');
				removeTodoBtn.title = 'Remove Todo';
				removeTodoBtn.dataset.id = item.id;
				
				const todoButtons = document.createElement('div');
				todoButtons.append(restoreTodoBtn, infoBtn, removeTodoBtn);
				
				todoDown.append(description, todoButtons);
				todo.append(todoDown);
			}
		}
		
		todoList.append(todo);
	});
};

const renderCategories = (savedPosition) => {
	const categoryList = document.querySelector('.categoryList');
	const completedTodos = document.querySelector('.completedTodos');
	
	categoryList.replaceChildren();
	completedTodos.replaceChildren();
	
	const mainBlock = document.createElement('div');
	mainBlock.classList.add('mainBlock');

	app.getCategories().forEach(item => {
		const category = document.createElement('div');
		category.classList.add('category');
		category.dataset.id = item.id;
		category.textContent = item.title;
		if (item.title === 'INBOX') category.classList.add('inbox');
		if (item.title === 'COMPLETED') category.classList.add('completed');
		
		if (app.getCurrentCategory().id === item.id) {
			category.classList.add('activeCategory');

			const editCategoryBtn = document.createElement('button');
			editCategoryBtn.classList.add('editCategoryBtn');
			editCategoryBtn.dataset.id = item.id;

			category.append(editCategoryBtn);
		}
		
		if (item.title === 'INBOX') categoryList.append(category);
		else if (item.title === 'COMPLETED') completedTodos.append(category);
		else mainBlock.append(category);
	});
	
	categoryList.append(mainBlock);
	mainBlock.scrollTop = savedPosition;
};

const renderPrioritySelect = (action) => {
	const priority = document.querySelector('.priority');
	const categorySelect = document.querySelector('.categorySelect');

	for (let i = categorySelect.options.length - 1; i >= 2; i--) {
		categorySelect.remove(i);
	}
		
	if (action === 'edit') {
		app.getCategories().forEach(item => {
			if (item.title !== 'COMPLETED') {
				const option = document.createElement('option');
				option.value = item.id;
				option.textContent = item.title;
				categorySelect.append(option);
			}
		});
	} else if (action === 'add') {
		const option = document.createElement('option');
		option.value = app.getCurrentCategory().id;
		option.textContent = app.getCurrentCategory().title;
		categorySelect.append(option);
		categorySelect.value = app.getCurrentCategory().id;
		priority.value = 'normal priority';
	}
};

export { renderTodos, renderCategories, renderPrioritySelect };
