// Interfaz para representar una tarea
interface Task {
  text: string;
  completed: boolean;
}

// Elementos del DOM
const taskInput = document.getElementById("taskInput") as HTMLInputElement;
const addTaskBtn = document.getElementById("addTaskBtn") as HTMLButtonElement;
const taskList = document.getElementById("taskList") as HTMLUListElement;
const clearTasksBtn = document.getElementById("clearTasksBtn") as HTMLButtonElement;
const sendEmailBtn = document.getElementById("sendEmailBtn") as HTMLButtonElement;

// Cargar tareas al iniciar
document.addEventListener("DOMContentLoaded", loadTasks);

// Agregar eventos
addTaskBtn.addEventListener("click", addTask);
clearTasksBtn.addEventListener("click", clearTasks);
sendEmailBtn.addEventListener("click", sendTasksByEmail);

// Función para cargar tareas desde el localStorage
function loadTasks() {
  const tasks: Task[] = JSON.parse(localStorage.getItem("tasks") || "[]");
  tasks.forEach((task) => renderTask(task));
}

// Función para agregar una nueva tarea
function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") return alert("Escribe una tarea.");

  const newTask: Task = { text: taskText, completed: false };
  renderTask(newTask);
  saveTask(newTask);
  taskInput.value = "";
}

// Renderizar tarea en la interfaz
function renderTask(task: Task) {
  const li = document.createElement("li");
  li.className = "list-group-item";
  li.textContent = task.text;
  if (task.completed) li.classList.add("completed");

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
function saveTask(task: Task) {
  const tasks: Task[] = JSON.parse(localStorage.getItem("tasks") || "[]");
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Guardar todas las tareas (por cambios de estado)
function saveAllTasks() {
  const tasks: Task[] = [];
  for (let i = 0; i < taskList.children.length; i++) {
    const li = taskList.children[i] as HTMLElement;
    tasks.push({
      text: (li.firstChild as Text).nodeValue || "",
      completed: li.classList.contains("completed"),
    });
  }
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Eliminar una tarea
function deleteTask(task: Task) {
  let tasks: Task[] = JSON.parse(localStorage.getItem("tasks") || "[]");
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
  const tasks: Task[] = JSON.parse(localStorage.getItem("tasks") || "[]");
  if (tasks.length === 0) return alert("No hay tareas para enviar.");

  const taskTexts = tasks.map((task) => `${task.completed ? "[x]" : "[ ]"} ${task.text}`).join("\n");
  const mailtoLink = `mailto:?subject=Lista de Tareas&body=${encodeURIComponent(taskTexts)}`;
  window.location.href = mailtoLink;
}

// Asumiendo que tienes las funciones necesarias para agregar tareas...

document.getElementById('showAllBtn')?.addEventListener('click', () => {
  showTasks('all');
});

document.getElementById('showPendingBtn')?.addEventListener('click', () => {
  showTasks('pending');
});

document.getElementById('showCompletedBtn')?.addEventListener('click', () => {
  showTasks('completed');
});

function showTasks(filter: 'all' | 'pending' | 'completed') {
  const tasks = document.querySelectorAll('.list-group-item') as NodeListOf<HTMLLIElement>;
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
  document.getElementById(`show${filter.charAt(0).toUpperCase() + filter.slice(1)}Btn`)?.classList.add('active');
}
