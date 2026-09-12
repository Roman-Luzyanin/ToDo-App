//category.js

const Category = (title, id = crypto.randomUUID()) => {
	const todos = [];
	
	let current;
	
	const addTodo = (todo) => todos.push(todo);
	
	const removeTodo = (id) => {
		const idx = todos.findIndex(todo => todo.id === id);
		if (idx !== -1) {
			if (current?.id === id) current = null;
			return todos.splice(idx, 1)[0];
		} 
	};
	
	const removeAllTodo = () => todos.length = 0;
	
	const getTodos = (searchQuery, sortBy) => {
		let currentView;
		if (!searchQuery) currentView = [...todos];	
		else currentView = todos.filter(todo => todo.title.toLowerCase().includes(searchQuery));

		if (sortBy === 'default') {
			currentView = currentView.toSorted((a,b) => a.addedTo - b.addedTo);
			
		} else if (sortBy === 'defaultReverse') {
			currentView = currentView.toSorted((a,b) => b.addedTo - a.addedTo);

		} else if (sortBy === 'title') {
			currentView = currentView.toSorted((a,b) => a.title.localeCompare(b.title));
			
		} else if (sortBy === 'titleReverse') {
			currentView = currentView.toSorted((a,b) => b.title.localeCompare(a.title));
			
		} else if (sortBy === 'time') {
			currentView = currentView.toSorted((a,b) => timeLeft(a.dueDate) - timeLeft(b.dueDate));
			
		} else if (sortBy === 'timeReverse') {
			currentView = currentView.toSorted((a,b) => timeLeft(b.dueDate) - timeLeft(a.dueDate));
		}
		
		return currentView;
	}; 
	
	const timeLeft = (dueDate) => {
		if (!dueDate) return Infinity;
		return Date.parse(dueDate) - Date.now();
	}
	
	const setCurrentTodo = (id) => {
		if (current?.id === id) return current = null;
		
		const idx = todos.findIndex(todo => todo.id === id);
		if (idx !== -1) current = todos[idx];
	};
	
	const getCurrentTodo = () => current;
	
	const editCurrentTodo = (title, description, dueDate, priority) => {
			current.title = title;
			current.description = description;
			current.dueDate = dueDate;
			current.priority = priority;
	};
	
	const resetCurrentTodo = () => current = null;
	
	return { id, title, 
						addTodo, removeTodo, removeAllTodo, getTodos,
							setCurrentTodo, getCurrentTodo, editCurrentTodo, resetCurrentTodo };
};

export default Category;
