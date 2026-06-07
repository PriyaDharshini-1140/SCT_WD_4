/* ==========================================
   JS : script.js
   Professional To-Do Web App
========================================== */

/* =========================
   GLOBAL VARIABLES
========================= */

let tasks =
    JSON.parse(
        localStorage.getItem("tasks")
    ) || [];

let currentFilter = "all";

let editIndex = null;

let sortAscending = true;

/* =========================
   DOM ELEMENTS
========================= */

const taskInput =
    document.getElementById(
        "taskInput"
    );

const taskDate =
    document.getElementById(
        "taskDate"
    );

const taskCategory =
    document.getElementById(
        "taskCategory"
    );

const taskPriority =
    document.getElementById(
        "taskPriority"
    );

const taskList =
    document.getElementById(
        "taskList"
    );

const searchTask =
    document.getElementById(
        "searchTask"
    );

const addTaskBtn =
    document.getElementById(
        "addTaskBtn"
    );

const themeBtn =
    document.getElementById(
        "themeBtn"
    );

const exportBtn =
    document.getElementById(
        "exportBtn"
    );

const sortBtn =
    document.getElementById(
        "sortBtn"
    );

const editModal =
    document.getElementById(
        "editModal"
    );

const closeModal =
    document.getElementById(
        "closeModal"
    );

const saveEditBtn =
    document.getElementById(
        "saveEditBtn"
    );

const toast =
    document.getElementById(
        "toast"
    );

/* =========================
   INITIAL LOAD
========================= */

initializeTheme();

renderTasks();

/* =========================
   SAVE TASKS
========================= */

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}

/* =========================
   TOAST NOTIFICATION
========================= */

function showToast(message) {

    toast.textContent =
        message;

    toast.classList.add(
        "show"
    );

    setTimeout(() => {

        toast.classList.remove(
            "show"
        );

    }, 2500);

}

/* =========================
   ADD TASK
========================= */

function addTask() {

    const text =
        taskInput.value.trim();

    if (text === "") {

        showToast(
            "Please enter a task."
        );

        return;
    }

    tasks.push({

        text,

        date:
            taskDate.value,

        category:
            taskCategory.value,

        priority:
            taskPriority.value,

        completed:
            false,

        createdAt:
            Date.now()

    });

    saveTasks();

    renderTasks();

    taskInput.value = "";

    taskDate.value = "";

    taskCategory.value =
        "Work";

    taskPriority.value =
        "High";

    showToast(
        "Task Added Successfully"
    );

}

/* =========================
   RENDER TASKS
========================= */

function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks =
        [...tasks];

    const searchText =
        searchTask.value
        .toLowerCase();

    filteredTasks =
        filteredTasks.filter(
            task =>
                task.text
                .toLowerCase()
                .includes(
                    searchText
                )
        );

    if (
        currentFilter ===
        "active"
    ) {

        filteredTasks =
            filteredTasks.filter(
                task =>
                    !task.completed
            );
    }

    if (
        currentFilter ===
        "completed"
    ) {

        filteredTasks =
            filteredTasks.filter(
                task =>
                    task.completed
            );
    }

    if (
        filteredTasks.length === 0
    ) {

        const template =
            document
            .getElementById(
                "emptyTemplate"
            );

        taskList.appendChild(
            template.content.cloneNode(
                true
            )
        );

        updateDashboard();

        return;
    }

    filteredTasks.forEach(
        task => {

            const index =
                tasks.indexOf(
                    task
                );

            const li =
                createTaskElement(
                    task,
                    index
                );

            taskList.appendChild(
                li
            );

        }
    );

    updateDashboard();

}

/* =========================
   CREATE TASK CARD
========================= */

function createTaskElement(
    task,
    index
) {

    const li =
        document.createElement(
            "li"
        );

    li.className =
        "task-item";

    li.draggable =
        true;

    li.dataset.index =
        index;

    if (
        isOverdue(task)
        &&
        !task.completed
    ) {

        li.classList.add(
            "overdue"
        );

    }

    li.innerHTML = `

    <div class="task-left">

        <div class="
            task-title
            ${
                task.completed
                ? "completed"
                : ""
            }
        ">
            ${task.text}
        </div>

        <div class="task-meta">

            <span class="task-date">
                📅 ${
                    task.date
                    ? formatDate(
                        task.date
                      )
                    : "No Due Date"
                }
            </span>

            <span class="
                category
                ${task.category.toLowerCase()}
            ">
                ${task.category}
            </span>

            <span class="
                priority
                ${task.priority.toLowerCase()}
            ">
                ${task.priority}
            </span>

        </div>

    </div>

    <div class="task-actions">

        <button
            class="complete-btn"
            onclick="toggleTask(${index})">

            ${
                task.completed
                ? "↺"
                : "✓"
            }

        </button>

        <button
            class="edit-btn"
            onclick="openEditModal(${index})">

            ✏️

        </button>

        <button
            class="delete-btn"
            onclick="deleteTask(${index})">

            🗑️

        </button>

    </div>

    `;

    addDragEvents(li);

    return li;

}

/* =========================
   COMPLETE TASK
========================= */

function toggleTask(index) {

    tasks[index].completed =
        !tasks[index]
        .completed;

    saveTasks();

    renderTasks();

    showToast(
        "Task Updated"
    );

}

/* =========================
   DELETE TASK
========================= */

function deleteTask(index) {

    const confirmed =
        confirm(
            "Delete this task?"
        );

    if (!confirmed)
        return;

    tasks.splice(
        index,
        1
    );

    saveTasks();

    renderTasks();

    showToast(
        "Task Deleted"
    );

}

/* =========================
   EDIT MODAL
========================= */

function openEditModal(
    index
) {

    editIndex = index;

    document.getElementById(
        "editTaskText"
    ).value =
        tasks[index].text;

    document.getElementById(
        "editTaskDate"
    ).value =
        tasks[index].date;

    document.getElementById(
        "editTaskCategory"
    ).value =
        tasks[index].category;

    document.getElementById(
        "editTaskPriority"
    ).value =
        tasks[index].priority;

    editModal.classList.add(
        "active"
    );

}

saveEditBtn.addEventListener(
    "click",
    () => {

        const text =
            document
            .getElementById(
                "editTaskText"
            )
            .value
            .trim();

        if (
            text === ""
        ) {

            showToast(
                "Task cannot be empty."
            );

            return;
        }

        tasks[
            editIndex
        ].text =
            text;

        tasks[
            editIndex
        ].date =
            document
            .getElementById(
                "editTaskDate"
            )
            .value;

        tasks[
            editIndex
        ].category =
            document
            .getElementById(
                "editTaskCategory"
            )
            .value;

        tasks[
            editIndex
        ].priority =
            document
            .getElementById(
                "editTaskPriority"
            )
            .value;

        saveTasks();

        renderTasks();

        editModal.classList.remove(
            "active"
        );

        showToast(
            "Task Updated"
        );

    }
);

closeModal.addEventListener(
    "click",
    () => {

        editModal.classList.remove(
            "active"
        );

    }
);

/* =========================
   FILTERS
========================= */

document
.querySelectorAll(
    ".filter-btn"
)
.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            document
            .querySelectorAll(
                ".filter-btn"
            )
            .forEach(btn =>
                btn.classList.remove(
                    "active-filter"
                )
            );

            button.classList.add(
                "active-filter"
            );

            currentFilter =
                button.dataset.filter;

            renderTasks();

        }
    );

});

/* =========================
   SEARCH
========================= */

searchTask.addEventListener(
    "keyup",
    renderTasks
);

/* =========================
   DASHBOARD
========================= */

function updateDashboard() {

    const total =
        tasks.length;

    const completed =
        tasks.filter(
            task =>
                task.completed
        ).length;

    const pending =
        total -
        completed;

    document.getElementById(
        "totalTasks"
    ).textContent =
        total;

    document.getElementById(
        "completedTasks"
    ).textContent =
        completed;

    document.getElementById(
        "pendingTasks"
    ).textContent =
        pending;

    updateProgressBar(
        total,
        completed
    );

}

/* =========================
   PROGRESS BAR
========================= */

function updateProgressBar(
    total,
    completed
) {

    const percent =
        total === 0
        ? 0
        : Math.round(
            (
                completed /
                total
            ) * 100
        );

    document.getElementById(
        "progressBar"
    ).style.width =
        percent + "%";

    document.getElementById(
        "progressText"
    ).textContent =
        percent + "%";

}

/* =========================
   SORT TASKS
========================= */

sortBtn.addEventListener(
    "click",
    () => {

        tasks.sort(
            (a, b) => {

                const dateA =
                    a.date
                    ? new Date(
                        a.date
                      )
                    : 0;

                const dateB =
                    b.date
                    ? new Date(
                        b.date
                      )
                    : 0;

                return sortAscending
                    ? dateA - dateB
                    : dateB - dateA;

            }
        );

        sortAscending =
            !sortAscending;

        saveTasks();

        renderTasks();

        showToast(
            "Tasks Sorted"
        );

    }
);

/* =========================
   EXPORT CSV
========================= */

exportBtn.addEventListener(
    "click",
    exportCSV
);

function exportCSV() {

    let csv =

`Task,Date,Category,Priority,Completed
`;

    tasks.forEach(task => {

        csv +=
`${task.text},
${task.date},
${task.category},
${task.priority},
${task.completed}
`;

    });

    const blob =
        new Blob(
            [csv],
            {
                type:
                "text/csv"
            }
        );

    const url =
        URL.createObjectURL(
            blob
        );

    const a =
        document.createElement(
            "a"
        );

    a.href = url;

    a.download =
        "tasks.csv";

    a.click();

    URL.revokeObjectURL(
        url
    );

    showToast(
        "CSV Exported"
    );

}

/* =========================
   DARK MODE
========================= */

function initializeTheme() {

    if (
        localStorage.getItem(
            "theme"
        ) === "dark"
    ) {

        document.body
        .classList.add(
            "dark-mode"
        );

        themeBtn.textContent =
            "☀️ Light Mode";

    }

}

themeBtn.addEventListener(
    "click",
    () => {

        document.body
        .classList.toggle(
            "dark-mode"
        );

        const isDark =
            document.body
            .classList.contains(
                "dark-mode"
            );

        localStorage.setItem(
            "theme",
            isDark
            ? "dark"
            : "light"
        );

        themeBtn.textContent =
            isDark
            ? "☀️ Light Mode"
            : "🌙 Dark Mode";

    }
);

/* =========================
   DATE FORMATTER
========================= */

function formatDate(
    dateString
) {

    return new Date(
        dateString
    ).toLocaleString(
        "en-IN",
        {

            day: "2-digit",

            month: "short",

            year: "numeric",

            hour: "2-digit",

            minute: "2-digit"

        }
    );

}

/* =========================
   OVERDUE CHECK
========================= */

function isOverdue(
    task
) {

    if (!task.date)
        return false;

    return (
        new Date(
            task.date
        ) < new Date()
    );

}

/* =========================
   DRAG & DROP
========================= */

let draggedIndex =
    null;

function addDragEvents(
    element
) {

    element.addEventListener(
        "dragstart",
        () => {

            draggedIndex =
                Number(
                    element.dataset
                    .index
                );

            element.classList.add(
                "dragging"
            );

        }
    );

    element.addEventListener(
        "dragend",
        () => {

            element.classList.remove(
                "dragging"
            );

        }
    );

    element.addEventListener(
        "dragover",
        e => {

            e.preventDefault();

        }
    );

    element.addEventListener(
        "drop",
        () => {

            const targetIndex =
                Number(
                    element.dataset
                    .index
                );

            const draggedTask =
                tasks[
                    draggedIndex
                ];

            tasks.splice(
                draggedIndex,
                1
            );

            tasks.splice(
                targetIndex,
                0,
                draggedTask
            );

            saveTasks();

            renderTasks();

            showToast(
                "Task Reordered"
            );

        }
    );

}

/* =========================
   EVENT LISTENERS
========================= */

addTaskBtn.addEventListener(
    "click",
    addTask
);

taskInput.addEventListener(
    "keypress",
    event => {

        if (
            event.key ===
            "Enter"
        ) {

            addTask();

        }

    }
);