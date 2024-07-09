document.getElementById('task-form').addEventListener('submit', addTask);

let taskCount = 0;
let completedTaskCount = 0;
let failedTaskCount = 0;

function addTask(e) {
    e.preventDefault();

    const taskInput = document.getElementById('task-input');
    const deadlineInput = document.getElementById('deadline-input');
    const taskList = document.getElementById('task-list');

    const taskText = taskInput.value;
    const deadlineText = deadlineInput.value;

    if (!taskText || !deadlineText) {
        alert('Please enter a task and deadline');
        return;
    }

    taskCount++;

    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${taskCount}</td>
        <td>${taskText}</td>
        <td>${new Date(deadlineText).toLocaleString()}</td>
        <td class="countdown" data-deadline="${deadlineText}"></td>
        <td class="buttons">
            <button class="complete"><i class="fas fa-check fa-icon"></i>Complete</button>
            <button class="edit"><i class="fas fa-edit fa-icon"></i>Edit</button>
            <button class="delete"><i class="fas fa-trash fa-icon"></i>Delete</button>
        </td>
    `;

    taskList.appendChild(tr);

    taskInput.value = '';
    deadlineInput.value = '';

    const completeButton = tr.querySelector('.complete');
    const editButton = tr.querySelector('.edit');
    const deleteButton = tr.querySelector('.delete');

    deleteButton.addEventListener('click', () => {
        taskList.removeChild(tr);
        taskCount--;
        updateSerialNumbers(taskList);
    });

    editButton.addEventListener('click', () => {
        taskInput.value = taskText;
        deadlineInput.value = deadlineText;
        taskList.removeChild(tr);
        taskCount--;
        updateSerialNumbers(taskList);
    });

    completeButton.addEventListener('click', () => {
        const completedTaskList = document.getElementById('completed-task-list');
        completedTaskCount++;
        const completedTr = document.createElement('tr');
        completedTr.innerHTML = `
            <td>${completedTaskCount}</td>
            <td>${taskText}</td>
            <td>${new Date(deadlineText).toLocaleString()}</td>
            <td>${new Date().toLocaleString()}</td>
        `;
        completedTaskList.appendChild(completedTr);
        taskList.removeChild(tr);
        taskCount--;
        updateSerialNumbers(taskList);
    });

    checkDeadline(tr, new Date(deadlineText));
    startCountdown(tr.querySelector('.countdown'), taskText, tr);
}

function checkDeadline(taskItem, deadline) {
    const now = new Date();
    const timeDiff = deadline - now;
    const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;
    const oneDayInMs = 24 * 60 * 60 * 1000;

    if (timeDiff <= 0) {
        moveToFailedTasks(taskItem);
        return;
    } else if (timeDiff <= threeDaysInMs) {
        alert(`Task "${taskItem.children[1].textContent}" is due in less than 3 days!`);
        taskItem.classList.add('alert');
    }

    if (timeDiff <= oneDayInMs) {
        setTimeout(() => {
            alert(`Task "${taskItem.children[1].textContent}" is due in 24 hours!`);
            taskItem.classList.add('alert');
        }, timeDiff - oneDayInMs);
    } else {
        setTimeout(() => {
            alert(`Task "${taskItem.children[1].textContent}" is due in less than 3 days!`);
            taskItem.classList.add('alert');
        }, timeDiff - threeDaysInMs);
    }
}

function startCountdown(countdownElement, taskText, taskItem) {
    const deadline = new Date(countdownElement.getAttribute('data-deadline'));

    const updateCountdown = () => {
        const now = new Date();
        const timeDiff = deadline - now;

        if (timeDiff <= 0) {
            countdownElement.textContent = "Time's up!";
            moveToFailedTasks(taskItem);
            return;
        }

        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

        countdownElement.textContent = `${days} days ${hours} hours ${minutes} min ${seconds} sec`;

        setTimeout(updateCountdown, 1000);
    };

    updateCountdown();
}

function moveToFailedTasks(taskItem) {
    const failedTaskList = document.getElementById('failed-task-list');
    failedTaskCount++;
    const failedTr = document.createElement('tr');
    failedTr.innerHTML = `
        <td>${failedTaskCount}</td>
        <td>${taskItem.children[1].textContent}</td>
        <td>${taskItem.children[2].textContent}</td>
        <td>${new Date().toLocaleString()}</td>
    `;
    failedTaskList.appendChild(failedTr);
    taskItem.parentNode.removeChild(taskItem);
    taskCount--;
    updateSerialNumbers(document.getElementById('task-list'));
}

function updateSerialNumbers(listElement) {
    const rows = listElement.querySelectorAll('tr');
    rows.forEach((row, index) => {
        row.firstElementChild.textContent = index + 1;
    });
}
