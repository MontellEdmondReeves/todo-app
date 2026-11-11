const input = document.getElementById('add-task');
const addBtn = document.getElementById('add-btn');
const todoScreen = document.getElementById('todo-list');
const filterList = document.querySelectorAll('.filter');
const hidden = document.querySelector('.hidden');
const itemsLeft = document.getElementById('items-left');
let todo = [];
let currentFilter = 'all';
let id = 0;
addBtn.addEventListener('click', addTodo);
input.addEventListener('keydown', (e) => {
    if(e.key === "Enter"){
        addTodo();
    }
});

function addTodo(){
    if(input.value.trim() === '') return;
    currentFilter = 'all';
    filterList.forEach(filter => filter.classList.remove('active'));
    filterList.item(0).classList.add('active');
    const item = input.value.trim();
    const todoItem = {
        id:id++,
        item: item,
        completed: false
    };
    todo.push(todoItem);
    saveTodos();
    renderTodo();
    input.value = '';
}
function saveTodos(){
    localStorage.setItem("todos", JSON.stringify(todo));
    updateItemsCount();
}
function updateItemsCount(){
    const pendingList = todo.filter(item => item.completed === false);
    itemsLeft.textContent = `${pendingList.length} item${pendingList.length !== 1 ? "s" : ""} left`;
}
function loadTodos(){
    const storedTodos = localStorage.getItem("todos");
    if(storedTodos) todo = JSON.parse(storedTodos);
    renderTodo();
}
function renderTodo(){
    todoScreen.innerHTML = '';
    const tempList = filterTodos();
    tempList.forEach(todo => {
        const element = document.createElement('li');
        const checkbox = document.createElement('input');
        const div = document.createElement('div');
        checkbox.type = "checkbox";
        checkbox.addEventListener('change', () => { 
        toggleTodo(todo.id);
        });
        const span = document.createElement('span');
        span.innerHTML = `${todo.item}`;
        div.append(checkbox);
        div.append(span);
        const div2 = document.createElement('div');
        const button = document.createElement('button');
        button.classList.add('delete');
        button.textContent = 'X';
        button.addEventListener('click', () => {deleteTodo(todo.id)});
        div2.append(button);
        if(todo.completed){
            span.classList.add("completed");
            checkbox.checked = true
        }
        element.append(div);
        element.append(div2);
        todoScreen.append(element);
    });
}
function filterTodos(){
    switch (currentFilter) {
        case 'completed':
            return todo.filter(todo => {return todo.completed === true});
            break;
        case 'pending':
            return todo.filter(todo => {return todo.completed === false});
            break;
        default:
            return todo;
            break;
    }
}
function toggleTodo(id){
    todo = todo.map(todo => {
        if(todo.id === id) todo.completed = !todo.completed;
        return todo;
    });
    saveTodos();
    renderTodo();
}
function deleteTodo(id){
    todo = todo.filter(todo => todo.id !== id);
    saveTodos();
    renderTodo();
}
filterList.forEach(filter => {
    filter.addEventListener('click', () => {
        filterList.forEach(filter => filter.classList.remove('active'));
        filter.classList.add('active');
        currentFilter = filter.dataset.filter;
        filterTodos();
        renderTodo();
    });
});
window.addEventListener("DOMContentLoaded", ()=>{
    loadTodos();
    updateItemsCount();
});