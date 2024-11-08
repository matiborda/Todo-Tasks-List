"use strict";
var _a, _b, _c;
// Elementos del DOM
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const clearTasksBtn = document.getElementById("clearTasksBtn");
const sendEmailBtn = document.getElementById("sendEmailBtn");
// Cargar tareas al iniciar
document.addEventListener("DOMContentLoaded", loadTasks);
// Agregar eventos
addTaskBtn.addEventListener("click", addTask);
clearTasksBtn.addEventListener("click", clearTasks);
sendEmailBtn.addEventListener("click", sendTasksByEmail);
// Función para cargar tareas desde el localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    tasks.forEach((task) => renderTask(task));
}
// Función para agregar una nueva tarea
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === "")
        return alert("Escribe una tarea.");
    const newTask = { text: taskText, completed: false };
    renderTask(newTask);
    saveTask(newTask);
    taskInput.value = "";
}
// Renderizar tarea en la interfaz
function renderTask(task) {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.textContent = task.text;
    if (task.completed)
        li.classList.add("completed");
    li.addEventListener("click", () => {
        task.completed = !task.completed;
        li.classList.toggle("completed");
        saveAllTasks();
    });
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-danger btn-sm ms-2";
    deleteBtn.textContent = "Eliminar";
    deleteBtn.addEventListener("click", () => {
        li.remove();
        deleteTask(task);
    });
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}
// Guardar una tarea en el localStorage
function saveTask(task) {
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
// Guardar todas las tareas (por cambios de estado)
function saveAllTasks() {
    const tasks = [];
    for (let i = 0; i < taskList.children.length; i++) {
        const li = taskList.children[i];
        tasks.push({
            text: li.firstChild.nodeValue || "",
            completed: li.classList.contains("completed"),
        });
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
// Eliminar una tarea
function deleteTask(task) {
    let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    tasks = tasks.filter((t) => t.text !== task.text);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
// Limpiar todas las tareas
function clearTasks() {
    taskList.innerHTML = "";
    localStorage.removeItem("tasks");
}
// Enviar tareas por correo
function sendTasksByEmail() {
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    if (tasks.length === 0)
        return alert("No hay tareas para enviar.");
    const taskTexts = tasks.map((task) => `${task.completed ? "[x]" : "[ ]"} ${task.text}`).join("\n");
    const mailtoLink = `mailto:?subject=Lista de Tareas&body=${encodeURIComponent(taskTexts)}`;
    window.location.href = mailtoLink;
}
// Asumiendo que tienes las funciones necesarias para agregar tareas...
(_a = document.getElementById('showAllBtn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
    showTasks('all');
});
(_b = document.getElementById('showPendingBtn')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
    showTasks('pending');
});
(_c = document.getElementById('showCompletedBtn')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => {
    showTasks('completed');
});
function showTasks(filter) {
    var _a;
    const tasks = document.querySelectorAll('.list-group-item');
    tasks.forEach(task => {
        const isCompleted = task.classList.contains('completed');
        task.style.display =
            filter === 'all' ||
                (filter === 'completed' && isCompleted) ||
                (filter === 'pending' && !isCompleted)
                ? 'flex'
                : 'none';
    });
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    (_a = document.getElementById(`show${filter.charAt(0).toUpperCase() + filter.slice(1)}Btn`)) === null || _a === void 0 ? void 0 : _a.classList.add('active');
}
