//todo.js

const Todo = (title,
							description, 
							dueDate, 
							priority,
							id = crypto.randomUUID(),
							createdAt = Date.now(),
							addedTo = Date.now()
							
) => {
			return {
				id,
				title,
				description,
				dueDate,
				priority,
				createdAt,
				addedTo,
				
				resetAddedTo() {
					this.addedTo = Date.now();
				},
				
				resetTodo() {
					this.dueDate = '';
					this.priority = 'normal priority';
					this.createdAt = Date.now();
					this.addedTo = Date.now();
				}
			};
};

export default Todo;
