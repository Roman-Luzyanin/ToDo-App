//storage.js

import Todo from "./todo.js";
import Category from "./category.js";
import app from "./app.js";

const saveTodos = (category) => {
	localStorage.setItem(
		category.title,
		JSON.stringify(category.getTodos())
	);
}; 

const removeTodosFromStorage = (category) => localStorage.removeItem(category.title);

const saveCategories = () => {
	localStorage.setItem(
		'categories',
		 JSON.stringify(app.getCategories())
	);
}; 

const loadData = () => {
	const categories = JSON.parse(localStorage.getItem('categories')) ||
															[{title: 'INBOX'}, {title: 'COMPLETED'}];
	
	categories.forEach(item => {
		const category = Category(item.title, item.id);
		JSON.parse(localStorage.getItem(item.title))?.forEach(item => {
			const todo = Todo(item.title, item.description, item.dueDate, item.priority,
																											item.id, item.createdAt, item.addedTo);
																
			category.addTodo(todo);
		});
		app.addCategory(category);
	});	
	app.setCurrentCategory(app.getCategories()[0].id);
};

export { saveTodos, removeTodosFromStorage, saveCategories, loadData }
