import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5001/tasks";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data } = await axios.get(API_URL);
    setTasks(data);
  };

  const addTask = async () => {
    if (!title.trim()) return;
    const { data } = await axios.post(API_URL, { title });
    setTasks([...tasks, data]);
    setTitle("");
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    setTasks(tasks.filter((task) => task._id !== id));
  };

  const completeTask = async (id) => {
    const { data } = await axios.patch(`${API_URL}/${id}/complete`);
    setTasks(tasks.map((task) => (task._id === id ? data : task)));
  };

  const startEditing = (task) => {
    setEditingTaskId(task._id);
    setNewTitle(task.title);
  };

  const updateTask = async (id) => {
    if (!newTitle.trim()) return;
    const { data } = await axios.put(`${API_URL}/${id}`, { title: newTitle });
    setTasks(tasks.map((task) => (task._id === id ? data : task)));
    setEditingTaskId(null);
  };

  return (
    <div data-theme="luxury" className="min-h-screen p-8 flex flex-col items-center bg-[#09090b]">
      <div className="card w-96 shadow-xl shadow-gray-600 rouded-xl p-6 bg-[#dca54d]">
        <h1 className="text-2xl font-bold text-center mb-4">Task Manager</h1>
        <div className="flex gap-2 mb-4">
          <input 
            type="text" 
            className="input input-bordered border-2 border-white rounded-2 flex-1" 
            placeholder="Add a task..." 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
          />
          <button className="btn btn-primary" onClick={addTask}>Add</button>
        </div>
        <ul>
          {tasks.map((task) => (
            <li key={task._id} className="flex justify-between items-center p-2 border-b">
              {editingTaskId === task._id ? (
                <input
                  type="text"
                  className="input input-bordered flex-1"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && updateTask(task._id)}
                />
              ) : (
                <span className={task.completed ? "line-through" : ""}>{task.title}</span>
              )}
              <div className="flex gap-2">
                {editingTaskId === task._id ? (
                  <button className="btn btn-info btn-xs" onClick={() => updateTask(task._id)}>Save</button>
                ) : (
                  <>
                    <button className="btn btn-warning btn-xs" onClick={() => startEditing(task)}>✎</button>
                    <button className="btn btn-success btn-xs" onClick={() => completeTask(task._id)}>✓</button>
                    <button className="btn btn-error btn-xs" onClick={() => deleteTask(task._id)}>✗</button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
