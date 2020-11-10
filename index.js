var addButton = document.getElementById('add');
var filterAllButton = document.getElementById('filter_all');
var filterTodayButton = document.getElementById('filter_today');
var filterWeekButton = document.getElementById('filter_week');
var inputTask = document.getElementById('new-task');
var unfinishedTasks = document.getElementById('unfinished-tasks');
var finishedTasks = document.getElementById('finished-tasks');

function createNewElement(task, deadline, finished) {
    var listItem = document.createElement('li');
    var checkbox = document.createElement('button');

    if (finished) {
        checkbox.className = "material-icons checkbox";
        checkbox.innerHTML = "<i class='material-icons'>check_box</i>";
    } else {
        checkbox.className = "material-icons checkbox";
        checkbox.innerHTML = "<i class='material-icons'>check_box_outline_blank</i>";
    }

    var label = document.createElement('label');
    label.innerText = task;

    var labelDeadline = document.createElement('labelDeadline');
    labelDeadline.innerText = deadline;


    var deleteButton = document.createElement('button');
    deleteButton.className = "material-icons delete";
    deleteButton.innerHTML = "<i class='material-icons'>delete</i>";

    listItem.appendChild(checkbox);
    listItem.appendChild(label);
    listItem.appendChild(labelDeadline);
    listItem.appendChild(deleteButton);


    return listItem;
}

function addNewTask() {
    var inputDeadline = 0;
    if (inputTask.value) {
        var radios = document.getElementsByName('deadline');

        for (var i = 0; i < radios.length; i++) {
            if (radios[i].checked) {

                inputDeadline = radios[i].value;
                break;
            }
        }
        addTask(inputTask.value, inputDeadline, false, finishTask);
        inputTask.value = "";

    }
    save();
}
addButton.onclick = addNewTask;

function addTask(task, deadline, finished, checkboxEvent) {
    var listItem = createNewElement(task, deadline, finished);
    if (finished) {
        finishedTasks.appendChild(listItem);
    } else {
        unfinishedTasks.appendChild(listItem);
    }
    bindTaskEvents(listItem, checkboxEvent);
}

function deleteTask() {
    var listItem = this.parentNode;
    var ul = listItem.parentNode;
    ul.removeChild(listItem);
    save();
}

function finishTask() {
    var listItem = this.parentNode;
    var checkbox = listItem.querySelector('button.checkbox');
    checkbox.className = "material-icons checkbox";
    checkbox.innerHTML = "<i class='material-icons'>check_box</i>";
    finishedTasks.appendChild(listItem);
    bindTaskEvents(listItem, unfinishTask);
    save();
}

function unfinishTask() {
    var listItem = this.parentNode;
    var checkbox = listItem.querySelector('button.checkbox');
    checkbox.className = "material-icons checkbox";
    checkbox.innerHTML = "<i class='material-icons'>check_box_outline_blank</i>";
    unfinishedTasks.appendChild(listItem);
    bindTaskEvents(listItem, finishTask);
    save();
}

function bindTaskEvents(listItem, checkboxEvent) {
    var checkbox = listItem.querySelector('button.checkbox');
    var deleteButton = listItem.querySelector('button.delete');
    checkbox.onclick = checkboxEvent;
    deleteButton.onclick = deleteTask;
}

function save() {
    var unfinishedTasksArr = [];
    var n = unfinishedTasks.children.length;
    for (var i = 0; i < n; i++) {
        var taskObject = { task: 0, deadline: 0 };
        taskObject.task = unfinishedTasks.children[i].getElementsByTagName('label')[0].innerText;
        taskObject.deadline = unfinishedTasks.children[i].getElementsByTagName('labelDeadline')[0].innerText;
        unfinishedTasksArr.push(taskObject);
    }

    n = finishedTasks.children.length;
    var finishedTasksArr = [];
    for (var i = 0; i < n; i++) {
        var taskObject = { task: 0, deadline: 0 };
        taskObject.task = finishedTasks.children[i].getElementsByTagName('label')[0].innerText;
        taskObject.deadline = finishedTasks.children[i].getElementsByTagName('labelDeadline')[0].innerText;
        finishedTasksArr.push(taskObject);
    }

    localStorage.removeItem('todo');
    localStorage.setItem('todo', JSON.stringify({
        unfinishedTasks: unfinishedTasksArr,
        finishedTasks: finishedTasksArr
    }));

}

function load() {
    return JSON.parse(localStorage.getItem('todo'));
}

var data = load();
for (var i = 0; i < data.unfinishedTasks.length; i++) {
    var listItem = createNewElement(data.unfinishedTasks[i].task, data.unfinishedTasks[i].deadline, false);
    unfinishedTasks.appendChild(listItem);
    bindTaskEvents(listItem, finishTask);
}

for (var i = 0; i < data.finishedTasks.length; i++) {
    var listItem = createNewElement(data.finishedTasks[i].task, data.finishedTasks[i].deadline, true);
    finishedTasks.appendChild(listItem);
    bindTaskEvents(listItem, unfinishTask);
}

function filterAll() {
    filter("All");
}
filterAllButton.onclick = filterAll;

function filterToday() {
    filter("Today");
}
filterTodayButton.onclick = filterToday;

function filterWeek() {
    filter("Week")
}
filterWeekButton.onclick = filterWeek;

function filter(string) {
    document.getElementById('unfinished-tasks').innerHTML = "";
    document.getElementById('finished-tasks').innerHTML = "";
    var data = load();
    for (var i = 0; i < data.unfinishedTasks.length; i++) {
        if (data.unfinishedTasks[i].deadline == string || string == "All") {
            addTask(data.unfinishedTasks[i].task, data.unfinishedTasks[i].deadline, false, finishTask);
        }
    }

    for (var i = 0; i < data.finishedTasks.length; i++) {
        if (data.finishedTasks[i].deadline == string || string == "All") {
            addTask(data.finishedTasks[i].task, data.finishedTasks[i].deadline, true, unfinishTask);
        }
    }
}