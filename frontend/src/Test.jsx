import Navbar from "./components/Navbar";
import TodoForm from "./components/TodoForm";
import TaskContainer from "./components/TaskContainer";
import { useState, useEffect } from "react";

const Test = () => {

  const user = JSON.parse(localStorage.getItem("user"));
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/todos`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await response.json();
      console.log(data);
      setTasks(data.data);
    }
    fetchTasks(); 
}, []);

  return (
    <div className="bg-gray-50 min-h-screen">

      <Navbar user={user} />

      <div className="m-8 max-w-6xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Welcome back, {user?.name || user?.username || "User"}!
        </h1>
        <p className="text-gray-600">
          Organize your tasks and boost your productivity
        </p>
      </div>

      <TodoForm />
      <TaskContainer tasks={tasks} />

    </div>
  );
};

export default Test;
