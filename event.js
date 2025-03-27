let lastDeletedTask = null
document.addEventListener("DOMContentLoaded" , () => {

   
    const tasks = JSON.parse(localStorage.getItem('tasks'))|| []
    tasks.forEach(task => handleToDo (task.text , task.completed))

    let form = document.querySelector(".form")
    form.addEventListener('submit', (e) => {
        e.preventDefault()

        console.log(e.target.newToDo.value)

        const newToDo = e.target.newToDo.value
        if(newToDo){
            handleToDo(newToDo)
            e.target.newToDo.value = ""
            // form.reset()

        }
        else{
            Toastify({
                text: `Please enter task!`,
                duration: 3000,
                gravity: "top",
                position: "center",
                style: {
                  background: "var(--button-bg)",
                  color: "var(--button-text)"
                },
              }).showToast();
              
        }
    })

    const todoList = document.querySelector('.todo-list')
    let draggedItem = null;

    todoList.addEventListener("dragstart", (e) => {
        if(e.target.tagName === 'LI'){
            draggedItem = e.target;
            setTimeout(() => e.target.style.opacity = '0.4', 0)
        }
    })

    todoList.addEventListener('dragover', (e) => {
        e.preventDefault()
        const afterElement = getDragAfterElement(todoList, e.clientY)
        if(afterElement == null){
            todoList.appendChild(draggedItem)
        } else{
            todoList.insertBefore(draggedItem, afterElement)
        }
    })

    function getDragAfterElement (container, y) {
        const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];
        return draggableElements.reduce((closest , child) => {
            const box = child.getBoundingClientRect()
            const offset = y -box.top - box.height / 2

            if(offset < 0 && offset > closest.offset){
                return { offset: offset , element: child}
            } else{
                return closest;
            }
        }, {offset: Number.NEGATIVE_INFINITY}
)}
} ,

document.addEventListener('keydown', (e) =>{
    if(e.key === '/' && document.activeElement !== document.querySelector('form input')){
        e.preventDefault()
        document.querySelector('.form input').focus()
    }
})

)

function handleToDo (toDo, completed = false){
    let todoList = document.querySelector(".todo-list")
    let list = document.createElement("li")
    let deleteBtn = document.createElement("button")
    deleteBtn.addEventListener("click", handleDelete)

    deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>Delete'
    list.innerHTML = `${toDo}`

    // list.appendChild(deleteBtn)
    todoList.appendChild(list)

    list.addEventListener("dblclick", () => {
        const currentText = this.firstChild.textContent;
        const input = document.createElement('input');

        input.type = 'text'
        input.value = currentText
        input.classList.add('edit-input')

        this.innerHTML = ''
        this.appendChild(input)
        this.appendChild(deleteBtn)
        input.focus()

        input.addEventListener('blur', () => {
            const newText = this.value.trim()
            if(newText) {
                list.innerHTML = newText
                list.appendChild(deleteBtn)
            }
        })
        input.addEventListener("keypress", (e) => {
            if(e.key === 'Enter'){
                this.blur()
            }
        })
    })

    list.addEventListener('click' , (e) => {
        if(e.target === this || e.target === this.firstChild){
            this.classList.toogle("completed")
        }
    })
    if(completed){
        saveTasks()
    }
}

function saveTasks(){
    const tasks = [];
    document.querySelectorAll('.todo-list li').forEach(item => {
        tasks.push({
            text: item.firstChild.textContent,
            completed: item.classList.contains('completed')
        })
    })
    localStorage.setItem('tasks' , JSON.stringify(tasks))
}

function handleDelete (e){
    lastDeletedTask = {
        text: e.taget.closest('li').firstChild.textContent, 
        element: e.target.closest('li')
    }
    e.target.closest('li').remove()
    saveTasks()

    const toast = Toastify({
        text: "Task deleted",
        duration: 5000,
        gravity: "top",
        position: "center",
        backgroundColor: "var(--delete-color)",
        onClick: function() {
            if (lastDeletedTask) {
                document.querySelector('.todo-list').appendChild(lastDeletedTask.element);
                lastDeletedTask = null;
                saveTasks();
                toast.hideToast();
            }
        }
    }).showToast();
}