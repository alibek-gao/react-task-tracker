import {useState,useEffect} from 'react';
import Header from "./components/Header";
import Tasks from "./components/Tasks";
import AddTask from "./components/AddTask";

function App() {
  const [showAddTask,setShowAddTask] = useState(false);
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks');
    return await res.json();
  }

  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`);
    return await res.json();
  }

  useEffect(() => {
    fetchTasks().then(tasks => {
      setTasks(tasks);
    });
  },[])

  const deleteTask = (id) => {
    fetch(`http://localhost:5000/tasks/${id}`,{method:'DELETE'})
      .then(() => setTasks(tasks.filter(task => task.id !== id)));
  }

  const toggleReminder = (id) => {
    fetchTask(id)
      .then(task => fetch(`http://localhost:5000/tasks/${id}`,{
        method:'PUT',
        body: JSON.stringify({...task,reminder: !task.reminder}),
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        }
      }))
      .then(res => res.json())
      .then(updatedTask => setTasks(tasks.map((task =>
          task.id === updatedTask.id ? updatedTask : task
      ))));

  }

  const addTask = (task) => {
    fetch(`http://localhost:5000/tasks/`,{
      method:'POST',
      body: JSON.stringify(task),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
      .then(res => res.json())
      .then(task => setTasks([...tasks,task]));
  }

  return (
    <div className="container">
      <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask}/>
      {showAddTask && <AddTask onAdd={addTask}/>}
      {tasks.length > 0 ? (
        <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder}/>
      ) : 'No tasks to show'}
    </div>
  );
}

export default App;
