function handleToDo (toDo, completed = false){
    let todoList = document.querySelector(".todo-list")
    let list = document.createElement("li")
    let deleteBtn = document.createElement("button")
    // deleteBtn.addEventListener("click", handleDelete)

    deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>Delete'

    list.innerHTML = `${toDo}`
    list.appendChild(deleteBtn)
    list.draggable = true

    if(completed)list.classList.add("completd")
        return {list , deleteBtn}
    

    // setUpTasksEvents(list, deleteBtn)
    // todoList.appendChild(list)
    // saveTasks() 
}

function setUpTasksEvents(list, deleteBtn){

        
    list.addEventListener("dblclick", function() {
        const currentText = this.firstChild.textContent;
        const input = document.createElement('input');
        input.type = 'text'
        input.value = currentText
        input.classList.add('edit-input')

        this.innerHTML = ''
        this.appendChild(input)
        this.appendChild(deleteBtn)
        input.focus()

        const saveEdit = () => {
            const newText = input.value.trim()
            if(newText){
            this.innerHTML = newText
            this.appendChild(deleteBtn)    
            saveTasks()   
            }
        }
        input.addEventListener('blur', saveEdit);
        input.addEventListener("keypress", (e) => e.key === 'Enter' && saveEdit());
    });

    list.addEventListener('click', function(e) {
        if (e.target === this || e.target === this.firstChild) {
            this.classList.toggle("completed");
            saveTasks();
        }
    });

    deleteBtn.addEventListener("click", (e) => handleDelete(e))

} 

//DELETE

function handleDelete (e){
    const listItem = e.target.closest('li')

   let lastDeletedTask = {
        text: listItem.closest('li').firstChild.textContent, 
        element: listItem
    }

    listItem.remove()
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

//SAVE APPENDED TASKS

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
//DRAG ELEMENTS

function getDragAfterElement (container, y) {
    const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];
    return draggableElements.reduce((closest , child) => {
        const box = child.getBoundingClientRect()
        const offset = y - box.top - box.height / 2

        if(offset < 0 && offset > closest.offset){
            return { offset: offset , element: child}
        } else{
            return closest;
        }
    }, {offset: Number.NEGATIVE_INFINITY}
)}

//INITIALIZATION

document.addEventListener("DOMContentLoaded" , () => {
   //LOAD SAVED TASKS
    const tasks = JSON.parse(localStorage.getItem('tasks'))|| []

    tasks.forEach(task => {
        const {list , deleteBtn } = handleToDo(task.text , task.completed)
        setUpTasksEvents(list , deleteBtn)
        document.querySelector('.todo-list').appendChild(list)

    })

  

    let form = document.querySelector(".form")
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        const newToDo = e.target.newToDo.value

        if(newToDo){
            const {list , deleteBtn} = handleToDo(newToDo)
           setUpTasksEvents(list, deleteBtn)
           document.querySelector('.todo-list').appendChild(list)
           e.target.newToDo.value =''
           saveTasks()
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
              }).showToast()   
        }
    })

    const todoList = document.querySelector('.todo-list');
    let draggedItem = null;

    todoList.addEventListener("dragstart", (e) => {
        if (e.target.tagName === 'LI') {
            draggedItem = e.target;
            setTimeout(() => e.target.style.opacity = '0.4', 0);
        }
    });

    todoList.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(todoList, e.clientY);
        if(afterElement.element){
            todoList.insertBefore(draggedItem, afterElement.element)       
        }else{
            todoList.appendChild(draggedItem)
        }
    });

    todoList.addEventListener("dragend", (e) => {
        if (e.target.tagName === 'LI') {
            e.target.style.opacity = '1';
            saveTasks();
        }
    });
}); 
//global keyboard shortcut
document.addEventListener('keydown', (e) =>{
    if(e.key === '/' && document.activeElement !== document.querySelector('form input')){
        e.preventDefault()
        document.querySelector('.form input').focus()
    }
})












