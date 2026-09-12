//app.js

const app = (() => {
	const categories = [];
	
	let current;
	
	const addCategory = (category) => categories.push(category);
	
	const removeCategory = (id) => {
		const idx = categories.findIndex(cat => cat.id === id);
		if (idx !== -1) categories.splice(idx, 1);
	};
	
	const getCategories = () => [...categories];
	
	const setCurrentCategory = (id) => {
		const idx = categories.findIndex(cat => cat.id === id);
		if (idx !== -1) current = categories[idx];
	};
	
	const getCurrentCategory = () => current;
	
	const getTargetCategory = (id) => categories.find(item => item.id === id);
	
	const editCurrentCategory = (title) => current.title = title;
	
	const allowCategoryUp = () => categories.indexOf(current) > 2;
	
	const allowCategoryDown = () => categories.indexOf(current) > 1 &&
																	categories.indexOf(current) < categories.length - 1;
																	
	const categoryUp = () => {
		const idx = categories.indexOf(current);
		[categories[idx - 1], categories[idx]] = [categories[idx], categories[idx - 1]];
	};
	
	const categoryDown = () => {
		const idx = categories.indexOf(current);
		[categories[idx + 1], categories[idx]] = [categories[idx], categories[idx + 1]];
	};
	
	return { addCategory, removeCategory, getCategories, 
						setCurrentCategory, getCurrentCategory, getTargetCategory,
							editCurrentCategory, allowCategoryUp, allowCategoryDown, categoryUp, categoryDown };
		
})();

export default app;
