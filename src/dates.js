import { format } from "date-fns";
import { formatDistanceToNow } from "date-fns";
import { isPast } from "date-fns";

const today = document.querySelector('.today');
const index = format(new Date(), "PPPP").lastIndexOf(',');
today.innerHTML = `Today is a<br> ${format(new Date(), "PPPP").slice(0, index)}`;

const info = document.querySelector('.info');
function showDistance(todo){
    const check = isPast(new Date(todo.date));
    if (check) {
        info.innerHTML = '<span style="color: red">This todo is out of date!!!</span>'
    } else if (!todo.date) {
        info.innerHTML = 'You have enough time :)'
    } else {
        info.innerHTML = `You have <span style='font-weight: 700'>
                            ${formatDistanceToNow(new Date(todo.date))}</span> 
                            to accomplish this todo.`;
    }
}

export { today, showDistance };