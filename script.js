document.addEventListener("DOMContentLoaded", function () {
  const newTaskInput = document.getElementById("new-task");
  const addTaskButton = document.getElementById("add-task");
  const selectUnselectAllCheckbox = document.getElementById(
    "select-unselect-all"
  );
  const deleteSelectedButton = document.getElementById("delete-selected");
  const deleteAllButton = document.getElementById("delete-all");
  const showAllButton = document.getElementById("show-all");
  const showCompletedButton = document.getElementById("show-completed");
  const showUncompletedButton = document.getElementById("show-uncompleted");
  const taskCountElement = document.getElementById("task-count");
  const clearCompletedButton = document.getElementById("clear-completed");
  const taskList = document.getElementById("task-list");

  let taskCount = 0;
  let uncompletedCount = 0;
  let currentFilter = "all";

  addTaskButton.addEventListener("click", function () {
    addTask();
  });

  newTaskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      addTask();
    }
  });

  selectUnselectAllCheckbox.addEventListener("change", function () {
    if (this.checked) {
      selectAll();
    } else {
      unselectAll();
    }
  });

  deleteSelectedButton.addEventListener("click", function () {
    deleteSelected();
  });

  deleteAllButton.addEventListener("click", function () {
    deleteAll();
  });

  showAllButton.addEventListener("click", function () {
    currentFilter = "all";
    filterTasks();
    setActiveButton(this);
  });

  showCompletedButton.addEventListener("click", function () {
    currentFilter = "completed";
    filterTasks();
    setActiveButton(this);
  });

  showUncompletedButton.addEventListener("click", function () {
    currentFilter = "uncompleted";
    filterTasks();
    setActiveButton(this);
  });

  clearCompletedButton.addEventListener("click", function () {
    clearCompletedTasks();
  });

  function addTask() {
    const taskText = newTaskInput.value.trim();
    if (taskText) {
      taskCount++;
      uncompletedCount++;
      const li = document.createElement("li");
      li.innerHTML = `
        <div class="task">
          <button class="done-button">&#10003;</button>
          &#187;
          <span class="task-text"> ${taskText}</span>
          <div class="task-buttons">
            <button class="delete-button">X</button>
            <button class="edit-button">Edit</button>
            <input type="checkbox" id="select-unselect-all">
          </div>
        </div>
      `;
      taskList.appendChild(li);
      newTaskInput.value = "";
      updateTaskCount();
      attachTaskButtonListeners(li);
    }
  }

  function clearCompletedTasks() {
    const completedTasks = taskList.querySelectorAll(".task-text.completed");
    completedTasks.forEach((task) => {
      task.parentElement.parentElement.remove();
      taskCount--;
    });
    updateTaskCount();
    filterTasks();
  }

  function updateTaskCount() {
    taskCountElement.textContent = `Total tasks: ${taskCount} (Uncompleted: ${uncompletedCount})`;
  }

  function selectAll() {
    const checkboxes = taskList.querySelectorAll('li input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      checkbox.checked = true;
    });
    filterTasks();
  }

  function unselectAll() {
    const checkboxes = taskList.querySelectorAll('li input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
    filterTasks();
  }

  function deleteSelected() {
    const selectedTasks = taskList.querySelectorAll(
      'li input[type="checkbox"]:checked'
    );
    selectedTasks.forEach((task) => {
      task.parentElement.parentElement.remove();
      taskCount--;
      uncompletedCount--;
      updateTaskCount();
      filterTasks();
    });
  }

  function deleteAll() {
    taskList.innerHTML = "";
    taskCount = 0;
    uncompletedCount = 0;
    updateTaskCount();
    filterTasks();
  }

  function attachTaskButtonListeners(taskElement) {
    const doneButton = taskElement.querySelector(".done-button");
    const deleteButton = taskElement.querySelector(".delete-button");
    const editButton = taskElement.querySelector(".edit-button");
    const taskTextElement = taskElement.querySelector(".task-text");

    doneButton.addEventListener("click", function () {
      taskTextElement.classList.toggle("completed");
      // deleteButton.disabled = true;
      editButton.disabled = true;

      if (taskTextElement.classList.contains("completed")) {
        taskElement.style.color = "#28a745";
        taskElement.style.boxShadow = "none";
        doneButton.style.background =
          " linear-gradient(to right, #DCE35B, #45B649)";
        editButton.style.background = "#ccc";
        editButton.style.pointerEvents = "none";
        uncompletedCount--;
        updateTaskCount();
      } else {
        taskElement.style.backgroundColor = "white";
        taskElement.style.color = "black";
        doneButton.style.background = "#ccc";
        editButton.style.background =
          "linear-gradient(to right, #f7971e, #ffd200)";
        editButton.style.pointerEvents = "auto";
        deleteButton.disabled = false;
        editButton.disabled = false;
        uncompletedCount++;
        updateTaskCount();
      }
      filterTasks();
    });

    deleteButton.addEventListener("click", function () {
      taskElement.remove();
      taskCount--;
      updateTaskCount();
      filterTasks();
    });

    editButton.addEventListener("click", function () {
      if (taskTextElement.isContentEditable) {
        taskTextElement.contentEditable = false;
        editButton.textContent = "Edit";
        editButton.style.background =
          "linear-gradient(to right, #f7971e, #ffd200)";
      } else {
        taskTextElement.contentEditable = true;
        taskTextElement.focus();
        editButton.textContent = "Save";
        editButton.style.background =
          " linear-gradient(to right, #DCE35B, #45B649)";
      }
    });
  }

  function filterTasks() {
    const tasks = taskList.querySelectorAll("li");
    tasks.forEach((task) => {
      const taskTextElement = task.querySelector(".task-text");
      if (currentFilter === "all") {
        task.style.display = "list-item";
      } else if (currentFilter === "completed") {
        if (taskTextElement.classList.contains("completed")) {
          task.style.display = "list-item";
        } else {
          task.style.display = "none";
        }
      } else if (currentFilter === "uncompleted") {
        if (!taskTextElement.classList.contains("completed")) {
          task.style.display = "list-item";
        } else {
          task.style.display = "none";
        }
      }
    });
  }
  filterTasks();

  showAllButton.addEventListener("click", function () {
    currentFilter = "all";
    filterTasks();
    setActiveButton(this);
  });

  showCompletedButton.addEventListener("click", function () {
    currentFilter = "completed";
    filterTasks();
    setActiveButton(this);
  });

  showUncompletedButton.addEventListener("click", function () {
    currentFilter = "uncompleted";
    filterTasks();
    setActiveButton(this);
  });

  function setActiveButton(clickedButton) {
    const filterButtons = document.querySelectorAll(".filter-div button");
    filterButtons.forEach((button) => {
      button.classList.remove("selected");
    });
    clickedButton.classList.add("selected");
  }
});
