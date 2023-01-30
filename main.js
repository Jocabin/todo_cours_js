let tasksList = document.querySelector('ul.list-group')
let tasks = []
let form = document.querySelector('form')

function displayTasks(tasks) {
    tasksList.innerHTML = ''
    for (let task of tasks) {
        createTaskItem(task)
    }
}

function createTaskItem(task) {
    let li = document.createElement('li')
    let checkbox = document.createElement('input')
    let textLabel = document.createElement('label')
    let trashLabel = document.createElement('label')
    let trashIcon = document.createElement('i')

    li.classList.add('todo', 'list-group-item', 'd-flex', 'align-items-center')
    checkbox.classList.add('form-check-input')
    textLabel.classList.add('ms-2', 'form-check-label')
    trashLabel.classList.add('ms-auto', 'btn', 'btn-danger', 'btn-sm')
    trashIcon.classList.add('bi-trash')

    trashIcon.addEventListener('click', () => {
        removeTaskItem(task.id)
    })

    checkbox.addEventListener('click', () => {
        checkTask(task.id)
    })

    checkbox.setAttribute('type', 'checkbox')
    if (task.completed) {
        checkbox.setAttribute('checked', 'checked')
    }
    checkbox.setAttribute('id', `todo-${task.id}`)
    li.setAttribute('id', `li-${task.id}`)
    textLabel.setAttribute('for', `todo-${task.id}`)
    textLabel.innerText = task.title

    trashLabel.appendChild(trashIcon)
    li.appendChild(checkbox)
    li.appendChild(textLabel)
    li.appendChild(trashLabel)

    tasksList.appendChild(li)
}

function removeTaskItem(task_id) {
    let tasktoRemove = document.getElementById('li-' + task_id)
    tasktoRemove.remove()
}

function checkTask(task_id) {
    
}

async function fetchTasks() {
    // je demande de la donnée à l'API
    const res = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5')
    const data = await res.json()

    // si l'API me renvoie une erreur, j'affiche un message d'erreur
    if (!res.ok) {
        throw Error('Erreur dans le fetch des tâches')
    }

    // dans le cas ou l'API me renvoie des données, je renvoie les données à ma fonction qui affiche les éléments HTML
    tasks = data
    return data
}

async function filterTasks(filter) {
    let original = [...tasks]

    switch (filter) {
        case 'todo':
            tasks = original.filter(el => el.completed !== true)
            break
        case 'done':
            tasks = original.filter(el => el.completed !== false)
            break
        default:
            tasks = original
            break
    }

    displayTasks(tasks)
    original = await fetchTasks()
}

function submitForm() {
    let newTask = document.getElementsByName('title')[0]

    tasks = [{completed: false, id: tasks.length, title: newTask.value}, ...tasks]

    newTask.value = ''

    displayTasks(tasks)
}

let all_filter = document.querySelector('[data-filter="all"]')
let todo_filter = document.querySelector('[data-filter="todo"]')
let done_filter = document.querySelector('[data-filter="done"]')
let filters = [all_filter, todo_filter, done_filter]

filters.forEach(el => {
    el.addEventListener('click', () => {
        filterTasks(el.getAttribute('data-filter'))

        filters.forEach(sel => {
            sel.classList.remove('active')
        })

        el.classList.toggle('active')
    })
})

fetchTasks().then(r => {
    displayTasks(r)
    console.log(r)
})

form.addEventListener('submit', (e) => {
    e.preventDefault()
    submitForm()
})