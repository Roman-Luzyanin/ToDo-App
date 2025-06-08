function priorityChoice(todo, itemUp, prior) {
    prior.classList.add('priority');
    if (todo.priority === 'high') {
        prior.textContent = 'High Priority';
        prior.style.background = 'red';
    } else if (todo.priority === 'medium') {
        prior.textContent = 'Medium Priority';
        prior.style.background = 'gold';
    } else if (todo.priority === 'normal') {
        prior.textContent = 'Normal Priority';
        prior.style.background = 'rgb(208, 208, 215)';
    }
    itemUp.appendChild(prior);
}

export { priorityChoice };