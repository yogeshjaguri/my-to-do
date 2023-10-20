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

  // Load tasks from localStorage when the page loads
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach((taskText) => {
    addTaskFromStorage(taskText);
  });

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

  let alertTimeout;

  function addTask() {
    const taskText = newTaskInput.value.trim();
    if (taskText) {
      addTaskFromStorage(taskText);
      newTaskInput.value = "";
      updateTaskCount();

      // Clear any existing alert timeout
      if (alertTimeout) {
        clearTimeout(alertTimeout);
      }

      // Check if a previous alert exists and remove it
      const previousAlert = document.getElementById("custom-alert");
      if (previousAlert) {
        document.body.removeChild(previousAlert);
      }

      // Create and append the custom alert elements
      const customAlert = document.createElement("div");
      customAlert.id = "custom-alert";

      const okButton = document.createElement("button");
      okButton.id = "custom-alert-ok";
      okButton.textContent = "OK";

      customAlert.textContent = "Task added";
      customAlert.appendChild(okButton);

      // Append the custom alert to the body
      document.body.appendChild(customAlert);

      // Show the custom alert
      customAlert.style.display = "block";
      okButton.addEventListener("click", hideAlert);

      // Automatically hide the alert after 3 seconds
      alertTimeout = setTimeout(() => {
        hideAlert();
      }, 1500); // 3000 milliseconds (3 seconds)
    }
  }

  // Hide the custom alert
  function hideAlert() {
    const customAlert = document.getElementById("custom-alert");
    customAlert.style.display = "none";
    alertTimeout = null; // Reset the timeout reference
  }

  // Hide the custom alert
  function hideAlert() {
    const customAlert = document.getElementById("custom-alert");
    customAlert.style.display = "none";
  }

  function addTaskFromStorage(taskText) {
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
    updateTaskCount();
    attachTaskButtonListeners(li);

    // Save the updated tasks to localStorage
    saveTasksToStorage();
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

    // Save the updated tasks to localStorage
    saveTasksToStorage();
  }

  function deleteAll() {
    taskList.innerHTML = "";
    taskCount = 0;
    uncompletedCount = 0;
    updateTaskCount();
    filterTasks();

    // Save the updated tasks to localStorage
    saveTasksToStorage();
  }

  function attachTaskButtonListeners(taskElement) {
    // ... Your existing code for attaching listeners
    const doneButton = taskElement.querySelector(".done-button");
    const deleteButton = taskElement.querySelector(".delete-button");
    const editButton = taskElement.querySelector(".edit-button");
    const taskTextElement = taskElement.querySelector(".task-text");

    doneButton.addEventListener("click", function () {
      taskTextElement.classList.toggle("completed");
      deleteButton.disabled = false;
      editButton.disabled = true;

      if (taskTextElement.classList.contains("completed")) {
        taskElement.style.color = "#28a745";

        taskElement.style.boxShadow = "none";
        doneButton.style.background =
          " linear-gradient(to right, #DCE35B, #45B649)";
        editButton.style.background = "#ccc";
        editButton.style.pointerEvents = "none";
        // editButton.style.textDecoration = "line-through";
        uncompletedCount--;
        updateTaskCount();
      } else {
        taskElement.style.backgroundColor = "white";
        // taskElement.style.boxShadow = "0 0 10px red";
        taskElement.style.color = "black";
        doneButton.style.background = "#ccc";
        // editButton.style.textDecoration = "none";
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
    // ... Your existing code for filtering tasks
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
    // ... Your existing code for setting active button
    const filterButtons = document.querySelectorAll(".filter-div button");
    filterButtons.forEach((button) => {
      button.classList.remove("selected");
    });
    clickedButton.classList.add("selected");
  }

  // Function to save tasks to localStorage
  function saveTasksToStorage() {
    const tasks = Array.from(taskList.querySelectorAll(".task-text")).map(
      (taskTextElement) => taskTextElement.textContent.trim()
    );
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Initial call to load tasks and update the task count
  updateTaskCount();
});
