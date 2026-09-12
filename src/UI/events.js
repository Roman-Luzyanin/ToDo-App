//events.js

import Todo from "../logic/todo.js";
import Category from "../logic/category.js";
import app from "../logic/app.js";
import { saveTodos, removeTodosFromStorage, saveCategories } from "../logic/storage.js";
import { renderTodos, renderCategories, renderPrioritySelect } from "./render.js";
import { format, isBefore } from "date-fns";

const categoryDialog = document.querySelector('.categoryDialog');
const editCategory = document.querySelector('.editCategory');
const editCategoryTitle = document.querySelector('.editCategory input');
const cancelCategoryBtn = document.querySelector('.cancelCategoryBtn');

const removeAllTodo = document.querySelector('.cleanUpCategory input');
const removeAllTodoLabel = document.querySelector('.cleanUpCategory label');
const removeCategory = document.querySelector('.removeCategory')
const removeCategoryInput = document.querySelector('.removeCategory input');
const removeCategoryLabel = document.querySelector('.removeCategory label');

const todoDialogBtn = document.querySelector('.todoDialogBtn');
const todoDialog = document.querySelector('.todoDialog');
const todoList = document.querySelector('.todoList');

const completedDialog = document.querySelector('.completedDialog');
const completedDialogBtn = document.querySelector('.completedDialog button');
const createdAt = document.querySelector('.createdAt :last-child');
const until = document.querySelector('.until :last-child');
const completedAt = document.querySelector('.completedAt :last-child');
const resultImg = document.querySelector('.result :first-child');
const resultText = document.querySelector('.result :last-child');

const todoForm = document.querySelector('.handleTodo');
const cancelTodoBtn = document.querySelector('.cancelTodoBtn');

const todoTitle = document.querySelector('.todoTitle');
const description = document.querySelector('.description');
const dueDate = document.querySelector('.dueDate');
const dueDateCover = document.querySelector('.dueDateCover');
const priority = document.querySelector('.priority');
const categorySelect = document.querySelector('.categorySelect');

const categoryList = document.querySelector('.categoryList');
const completedTodos = document.querySelector('.completedTodos');
const categoryForm = document.querySelector('.addCategory');
const newCategoryTitle = document.querySelector('.addCategory .title');

const searchTodo = document.querySelector('.searchTodo');
const sorting = document.querySelector('.sorting');
const sortByDefault = document.querySelector('.sortByDefault');
const sortByTitle = document.querySelector('.sortByTitle');
const sortByTimeLeft = document.querySelector('.sortByTimeLeft');

const categoryUp = document.querySelector('.arrows :first-child');
const categoryDown = document.querySelector('.arrows :last-child');

let isEdit = false;
let sortBy = 'default';
categoryUp.disabled = true;
categoryDown.disabled = true;

function movingCheck() {
	categoryUp.disabled = !app.allowCategoryUp();
	categoryDown.disabled = !app.allowCategoryDown();
}

function renderSearchedTodos() {
	const searchQuery = searchTodo.value.trim().toLowerCase();
	renderTodos(searchQuery, sortBy);
};

function setSortDefaultClasses() {
	sortByDefault.className = 'sortByDefault';
	sortByTitle.className = 'sortByTitle';
	sortByTimeLeft.className = 'sortByTimeLeft';
}

function setSortingToDefault() {
	searchTodo.value = '';
	sortBy = 'default';
	setSortDefaultClasses();
	sortByDefault.classList.add('sort');
}

function removeRedClass() {
	removeAllTodoLabel.classList.remove('red');
	removeAllTodoLabel.classList.remove('coral');
	removeCategoryLabel.classList.remove('red');
}

function moveTodo(targetID, restore) {
	const currentCategory = app.getCurrentCategory();
	const currentTodo = currentCategory.removeTodo(currentCategory.getCurrentTodo().id);
	const targetCategory = app.getTargetCategory(targetID);
	
	if (restore) currentTodo.resetTodo();
	else currentTodo.resetAddedTo();
	targetCategory.addTodo(currentTodo);
	
	saveTodos(currentCategory);
	saveTodos(targetCategory);
	renderSearchedTodos();
}
   
function duplicateWarning(element, location) {
	element.value = '';
	element.classList.add('warning');
	element.placeholder = location ? `Name exist in '${location.title}'` : 'Name already exist!';
	element.blur();
}

function resetWarning(element, placeholder) {
	document.querySelector('body').addEventListener('click', () => {
		if (element.classList.contains('warning')) {
			element.classList.remove('warning');
			element.placeholder = placeholder;
		}
	});
}

const savedPosition = () => document.querySelector('.mainBlock').scrollTop;

const noPastDate = () => {
	const today = new Date();
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, '0');
	const day = String(today.getDate()).padStart(2, '0');

  dueDate.min = `${year}-${month}-${day}`;
};

const handleDialog = () => {
	todoDialogBtn.addEventListener('click', () => {
		todoDialog.showModal();
		app.getCurrentCategory().resetCurrentTodo();
		renderSearchedTodos();
		renderPrioritySelect('add'); 
		dueDateCover.textContent = 'Due date';	
		noPastDate();
	});
	
	cancelTodoBtn.addEventListener('click', () => {
		todoForm.reset();	
		todoDialog.close();
		isEdit = false;
	});
	
	todoDialog.addEventListener('cancel', () => {
		todoForm.reset();	
		isEdit = false;
	});
	
	dueDate.addEventListener('change', () => {
		dueDateCover.textContent = dueDate.value ? dueDate.value : 'Due date' ;			
	});
	
	dueDate.addEventListener('click', () => dueDate.showPicker());
	
	//~ ----------------------------Category---------------------------------------
	
	cancelCategoryBtn.addEventListener('click', () => {
		editCategory.reset();	
		categoryDialog.close();
		removeRedClass();
	});
	
	categoryDialog.addEventListener('cancel', () => {
		editCategory.reset();	
		removeRedClass();
	});
	
	//~ ----------------------------------------------------------------------------------------
	
	completedDialogBtn.addEventListener('click', () => {
		completedDialog.close();
	});
};

//~ ======================================Todos=============================================

const initTodoEvents = () => {
	todoList.addEventListener('click', (e) => {   
		if (e.target.classList.contains('todo')) {
			app.getCurrentCategory().setCurrentTodo(e.target.dataset.id);
			renderSearchedTodos();
			
		} else if (e.target.classList.contains('doneTodoBtn')) {  //<---------------doneTodoBtn
			const targetID = app.getCategories()[1].id;
			moveTodo(targetID);
			
		} else if (e.target.classList.contains('editTodoBtn')) {  //<---------------editTodoBtn
			isEdit = true;
			todoDialog.showModal();
			renderPrioritySelect('edit'); 
			noPastDate();
			
			const category = app.getCurrentCategory();
			const todo = category.getCurrentTodo();
			
			todoTitle.value = todo.title;
			description.value = todo.description;
			dueDate.value = todo.dueDate;
			dueDateCover.textContent = todo.dueDate ? todo.dueDate : 'Due date';
			priority.value = todo.priority;
			categorySelect.value = category.id;
			
		} else if (e.target.classList.contains('removeTodoBtn')) {  //<-------------removeTodoBtn
			const currentCategory = app.getCurrentCategory();
			currentCategory.removeTodo(e.target.dataset.id);
			saveTodos(currentCategory);
			renderSearchedTodos();	
			
		} else if (e.target.classList.contains('restoreTodoBtn')) {  //<------------restoreTodoBtn
			const targetID = app.getCategories()[0].id;
			moveTodo(targetID, true);
			
		} else if (e.target.classList.contains('infoBtn')) {   //<-------------------infoBtn
			const activeTodo = document.querySelector('.activeTodo');
			const position = activeTodo.getBoundingClientRect();

			completedDialog.style.left = position.left + position.width / 2 + 'px';
			completedDialog.style.top = position.top + 'px';
			completedDialog.showModal();
			
			const todo = app.getCurrentCategory().getCurrentTodo();
			createdAt.textContent = format(todo.createdAt, 'd MMMM yyyy');
			until.textContent = todo.dueDate ? format(todo.dueDate, 'd MMMM yyyy') :
																															'No time limit';												 				 
			completedAt.textContent = format(todo.addedTo, 'd MMMM yyyy');
			
			if (isBefore(todo.addedTo, todo.dueDate)) {
				resultImg.classList.add('onTime');
				resultImg.classList.remove('overDue');
				resultText.textContent = 'On Time!';
				
			} else {
				resultImg.classList.add('overDue');
				resultImg.classList.remove('onTime');
				resultText.textContent = 'Over Due!';
			}
			
		}
	});			
	
	todoForm.addEventListener('submit', (e) => {
		e.preventDefault();
		
		 if (!todoForm.checkValidity()) {
			todoForm.reportValidity(); 
			return; 
		}
		
		if (!isEdit) {
			const location = app.getCategories().find(item => 
													 item.getTodos().find(item =>
													 item.title.toLowerCase() === todoTitle.value.toLowerCase()));
													 
			if (location) return duplicateWarning(todoTitle, location);

			const currentCategory = app.getCurrentCategory();
			const todo = Todo(
													 todoTitle.value,
													 description.value,
													 dueDate.value,
													 priority.value
												);
			
			app.getCurrentCategory().addTodo(todo);
			saveTodos(currentCategory);			 
			todoForm.reset();	
			todoDialog.close();
			renderSearchedTodos();	

		} else {
			const location = app.getCategories().find(item => 
													 item.getTodos().find(item => 
													 item.title.toLowerCase() === todoTitle.value.toLowerCase() &&
													 item.id !== app.getCurrentCategory().getCurrentTodo().id));
													 
			if (location) return duplicateWarning(todoTitle, location);
								
			const currentCategory = app.getCurrentCategory();
			currentCategory.editCurrentTodo(
																				todoTitle.value,
																			  description.value,
																			  dueDate.value,
																			  priority.value
																			);
	
			if (categorySelect.value !== currentCategory.id) {
				const currentTodo = currentCategory.removeTodo(currentCategory.getCurrentTodo().id);		
				const targetCategory = app.getTargetCategory(categorySelect.value);
				
				currentTodo.resetAddedTo();
				targetCategory.addTodo(currentTodo);
				saveTodos(targetCategory);
			}
	
			saveTodos(currentCategory);  
			todoForm.reset();	
			todoDialog.close();
			renderSearchedTodos();	
			isEdit = false;
		}					
	});
	
	resetWarning(todoTitle, 'Title');
	
	searchTodo.addEventListener('input', ()=> renderSearchedTodos());
	
	sorting.addEventListener('click', (e) => {
		if (e.target.classList.contains('sortByDefault')) {
			app.getCurrentCategory().resetCurrentTodo();
			setSortDefaultClasses();
				if (sortBy !== 'default') {
					sortBy = 'default';
					sortByDefault.classList.add('sort');
				} else {
					sortBy = 'defaultReverse';
					sortByDefault.classList.add('reverse');
				}
			renderSearchedTodos();
			
		} else if (e.target.classList.contains('sortByTitle')) {
			app.getCurrentCategory().resetCurrentTodo();
			setSortDefaultClasses();
				if (sortBy !== 'title') {
					sortBy = 'title';
					sortByTitle.classList.add('sort');
				} else {
					sortBy = 'titleReverse';
					sortByTitle.classList.add('reverse');
				}
			renderSearchedTodos();
			
		} else if (e.target.classList.contains('sortByTimeLeft')) {
			app.getCurrentCategory().resetCurrentTodo();
			setSortDefaultClasses();
				if (sortBy !== 'time') {
					sortBy = 'time';
					sortByTimeLeft.classList.add('sort');
				} else {
					sortBy = 'timeReverse';
					sortByTimeLeft.classList.add('reverse');
				}
			renderSearchedTodos();
		}
	});
};

//~ ===================================Categories======================================

const addCategory = () => {
	categoryForm.addEventListener('submit', (e) => {
		e.preventDefault();
		if (app.getCategories().some(cat => cat.title.toLowerCase() === 
																				newCategoryTitle.value.toLowerCase())) {
			duplicateWarning(newCategoryTitle);
			return;
		} 
		const category = Category(newCategoryTitle.value);
		app.addCategory(category);
		newCategoryTitle.value = '';
		saveCategories();
		
		movingCheck();
		renderCategories();
	});
	
	resetWarning(newCategoryTitle, 'New Category');
};

const initCategoryEvents = () => {
	[categoryList, completedTodos].forEach(item => item.addEventListener('click', (e) => {
		if (e.target.classList.contains('category') &&
				app.getCurrentCategory().id !== e.target.dataset.id) {
			
				
			app.getCurrentCategory().resetCurrentTodo();
			app.setCurrentCategory(e.target.dataset.id);
			todoDialogBtn.disabled = app.getCurrentCategory().title === 'COMPLETED';
			movingCheck();
			setSortingToDefault();

			renderCategories(savedPosition());
			renderSearchedTodos();
			
		} else if (e.target.classList.contains('editCategoryBtn')) {
			const activeCategory = document.querySelector('.activeCategory');
			const position = activeCategory.getBoundingClientRect();
			
			categoryDialog.style.left = position.left + position.width / 2 + 'px';
			categoryDialog.style.top = position.top + 'px';
			categoryDialog.showModal();
			
			const currentCategory = app.getCurrentCategory();
			if (currentCategory.title === 'INBOX' || currentCategory.title === 'COMPLETED') {
				editCategoryTitle.classList.remove('visible');
				removeCategory.classList.remove('visible');
			} else {
				editCategoryTitle.classList.add('visible');
				removeCategory.classList.add('visible');
			}
			
			editCategoryTitle.value = currentCategory.title;
			removeAllTodo.disabled = app.getCurrentCategory().getTodos().length === 0 ? true : false;
		} 
	}));
	
	editCategory.addEventListener('submit' , (e) => {
		e.preventDefault();

		if (!editCategory.checkValidity()) {
			editCategory.reportValidity(); 
			return; 
		}
		
		if (app.getCategories().some(item => 
							item.title.toLowerCase() === editCategoryTitle.value.toLowerCase() &&
							item.id !== app.getCurrentCategory().id)) {
								
				duplicateWarning(editCategoryTitle);
				return;
			}
			
		const currentCategory = app.getCurrentCategory();
		
		if (removeAllTodo.checked) {
			currentCategory.removeAllTodo();
			saveTodos(currentCategory);
			setSortingToDefault();
			renderSearchedTodos();
		};	
		
		if (removeCategoryInput.checked) {
			removeTodosFromStorage(currentCategory);
			app.removeCategory(currentCategory.id);
			saveCategories();
			
			app.setCurrentCategory(app.getCategories()[0].id);
			movingCheck();
			setSortingToDefault();
			
			renderCategories();
			renderSearchedTodos();
		
		} else if (editCategoryTitle.value !== currentCategory.title) {
			removeTodosFromStorage(currentCategory);
			app.editCurrentCategory(editCategoryTitle.value);
			saveCategories();
			saveTodos(currentCategory);
			renderCategories(savedPosition());
		}
	
		editCategory.reset();	
		categoryDialog.close();
		removeRedClass();
	});
	
	removeCategoryInput.addEventListener('change', () => {
		if (removeCategoryInput.checked) {
			removeCategoryLabel.classList.add('red');
			if (app.getCurrentCategory().getTodos().length !== 0) {
				removeAllTodo.checked = true;
				removeAllTodo.disabled = true;
				removeAllTodoLabel.classList.add('coral');
			}
			
		} else {
			removeCategoryLabel.classList.remove('red');
			if (app.getCurrentCategory().getTodos().length !== 0) {
				removeAllTodo.checked = false;
				removeAllTodo.disabled = false;
				removeAllTodoLabel.classList.remove('coral');
			}
		}
	});
	
	removeAllTodo.addEventListener('change', () => {
		if (removeAllTodo.checked) {
			removeAllTodoLabel.classList.add('red');
			
		} else removeAllTodoLabel.classList.remove('red');
	});
	
	categoryUp.addEventListener('click', () => {
		app.categoryUp();
		saveCategories();
		movingCheck();
		renderCategories(savedPosition());
	});
	
	categoryDown.addEventListener('click', () => {
		app.categoryDown();
		saveCategories();
		movingCheck();
		renderCategories(savedPosition());
	});
	
	resetWarning(editCategoryTitle, 'Title');
};

export { initTodoEvents, addCategory, initCategoryEvents, handleDialog };
