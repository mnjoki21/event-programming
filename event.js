document.addEventListener("DOMContentLoaded" , () => {
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
                // style: {
                //   background: "var(--button-bg)",
                //   color: "var(--button-text)"
                // },
                // avatar: "https://pub-c6a134c8e1fd4881a475bf80bc0717ba.r2.dev/assets/checkmark.png"
              }).showToast();
              
        }
    })
})

function handleToDo (toDo){

    let todoList = document.querySelector(".todo-list")
    let list = document.createElement("li")
    let deleteBtn = document.createElement("button")
    deleteBtn.addEventListener("click", handleDelete)

    deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>Delete'
    list.innerHTML = `${toDo}`

    list.appendChild(deleteBtn)
    todoList.appendChild(list)
    
}

function handleDelete (e){
    e.target.parentNode.remove()
}