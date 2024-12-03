<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>To-Do List with Polling</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
        }
        .todo-item {
            margin: 10px 0;
        }
        .completed {
            text-decoration: line-through;
            color: gray;
        }
        button {
            padding: 8px 12px;
            font-size: 14px;
            cursor: pointer;
        }
        #new-todo {
            padding: 8px;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <h1>To-Do List</h1>
    
    <ul id="todo-list"></ul> <!-- List where to-do items will be displayed -->

    <input type="text" id="new-todo" placeholder="Add a new to-do" /> <!-- Input for new to-do -->
    <button id="add-todo">Add To-Do</button> <!-- Button to add a new to-do -->

    <script>
        // Function to fetch the to-do list from the backend
        function fetchTodoList() {
            fetch('http://localhost:3001/get-todo')
                .then(response => response.json())
                .then(data => {
                    // Get the to-do list container
                    const todoListElement = document.getElementById('todo-list');
                    todoListElement.innerHTML = ''; // Clear the current list

                    // Loop through each to-do and display it
                    data.forEach(todo => {
                        const li = document.createElement('li');
                        li.className = 'todo-item';
                        if (todo.completed) {
                            li.classList.add('completed'); // Cross out completed tasks
                        }
                        li.textContent = todo.task;
                        todoListElement.appendChild(li);
                    });
                })
                .catch(error => console.error('Error fetching to-do list:', error));
        }

        // Polling the server every 5 seconds to fetch the latest to-do list
        setInterval(fetchTodoList, 5000); // Poll every 5 seconds

        // Function to add a new to-do item
        function addTodo() {
            const newTodoInput = document.getElementById('new-todo');
            const task = newTodoInput.value.trim();
            if (task) {
                fetch('http://localhost:3001/add-todo', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ task })
                })
                .then(response => response.json())
                .then(newTodo => {
                    console.log('New to-do added:', newTodo);
                    fetchTodoList(); // Refresh the list after adding a new item
                    newTodoInput.value = ''; // Clear input field
                })
                .catch(error => console.error('Error adding todo:', error));
            }
        }

        // Event listener for the "Add To-Do" button
        document.getElementById('add-todo').addEventListener('click', addTodo);

        // Initial fetch when the page loads
        fetchTodoList();
    </script>
</body>
</html>
