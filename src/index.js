//index.js

import "./styles/main.css";
import "./styles/dialog.css";
import "./styles/categories.css";
import "./styles/todos.css";

import { loadData } from "./logic/storage.js";
import { renderCategories, renderTodos } from "./UI/render.js";
import { initCategoryEvents, initTodoEvents, addCategory, handleDialog } from "./UI/events.js";

loadData();

renderCategories();

renderTodos();

initCategoryEvents();

initTodoEvents();

addCategory();

handleDialog();
