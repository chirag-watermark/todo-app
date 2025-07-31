import { useState, useEffect } from "react";
import {  
  CheckSquare, 
  Clock, 
  Target, 
  Calendar
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import TodoForm from "./TodoForm";
import TaskContainer from "./TaskContainer";
import TodoDetail from "./TodoDetail";
// import SearchBar from "./SearchBar"; // Search functionality commented out

export function Homepage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  // const [searchFilters, setSearchFilters] = useState({ searchTerm: "", statusFilter: "all" }); // Search functionality commented out

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    fetchTasks();
  }, [user, navigate]);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/todos`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await response.json();
      const fetchedTasks = data.data || [];
      setTasks(fetchedTasks);
      setFilteredTasks(fetchedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load your tasks. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  };

  // Centralized API operations
  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  const handleEditComplete = () => {
    setEditingTask(null);
    fetchTasks(); // Refresh tasks after edit
  };

  const handleShowDetail = (task) => {
    setSelectedTask(task);
  };

  const handleCloseDetail = () => {
    setSelectedTask(null);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/todos/${taskId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete task");
      }

      // Optimistic update - remove from state immediately
      setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
      setFilteredTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
      toast.success("Task has been deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error(error.message || "Failed to delete task. Please try again.");
      // Refresh tasks to ensure UI is in sync
      fetchTasks();
    }
  };

  const handleToggleTask = async (taskId, currentTask) => {
    try {
      const updatedTask = {
        ...currentTask,
        status: currentTask.status === 'Completed' ? 'Pending' : 'Completed'
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/todos/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedTask),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update task status");
      }

      // Optimistic update - update state immediately
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task._id === taskId ? updatedTask : task
        )
      );
      
      // Update filtered tasks as well
      setFilteredTasks(prevTasks => 
        prevTasks.map(task => 
          task._id === taskId ? updatedTask : task
        )
      );
      
      toast.success(`Task "${currentTask.title}" marked as ${updatedTask.status.toLowerCase()}`);
    } catch (error) {
      console.error("Error toggling task:", error);
      toast.error(error.message || "Failed to update task status. Please try again.");
      // Refresh tasks to ensure UI is in sync
      fetchTasks();
    }
  };

  // Search functionality commented out
  /*
  const handleSearch = ({ searchTerm, statusFilter }) => {
    setSearchFilters({ searchTerm, statusFilter });
    
    let filtered = tasks;

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(term) ||
        (task.description && task.description.toLowerCase().includes(term))
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    setFilteredTasks(filtered);
  };

  const handleClearSearch = () => {
    setSearchFilters({ searchTerm: "", statusFilter: "all" });
    setFilteredTasks(tasks);
  };
  */

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar user={user} />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name || user?.username || "User"}!
          </h1>
          <p className="text-gray-600">
            Organize your tasks and boost your productivity
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* TodoForm */}
          <div className="w-full">
            <TodoForm 
              editingTask={editingTask}
              onEditComplete={handleEditComplete}
            />
          </div>

          {/* SearchBar commented out */}
          {/* <div className="py-2 w-full">
            <SearchBar 
              onSearch={handleSearch}
              onClear={handleClearSearch}
            />
          </div> */}
          
          {/* Tasks Overview */}
          <div className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Tasks Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Tasks Card */}
              <button className="bg-blue-50 rounded-lg p-4 hover:bg-blue-100 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CheckSquare className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">{filteredTasks.length}</p>
                    <p className="text-sm text-gray-500">
                      Total Tasks
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </button>

              {/* Completed Tasks Card */}
              <button className="bg-green-50 rounded-lg p-4 hover:bg-green-100 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Target className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">
                      {filteredTasks.filter(task => task.status === "Completed").length}
                    </p>
                    <p className="text-sm text-gray-500">Completed</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ 
                      width: `${filteredTasks.length > 0 ? (filteredTasks.filter(task => task.status === "Completed").length / filteredTasks.length) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
              </button>

              {/* Pending Tasks Card */}
              <button className="bg-orange-50 rounded-lg p-4 hover:bg-orange-100 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">
                      {filteredTasks.filter(task => task.status !== "Completed").length}
                    </p>
                    <p className="text-sm text-gray-500">Pending</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-600 h-2 rounded-full" 
                    style={{ 
                      width: `${filteredTasks.length > 0 ? (filteredTasks.filter(task => task.status !== "Completed").length / filteredTasks.length) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
              </button>

              {/* Today's Tasks Card */}
              <button className="bg-purple-50 rounded-lg p-4 hover:bg-purple-100 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">
                      {filteredTasks.filter(task => {
                        const today = new Date().toISOString().split('T')[0];
                        return task.dueDate === today;
                      }).length}
                    </p>
                    <p className="text-sm text-gray-500">Due Today</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ 
                      width: `${filteredTasks.length > 0 ? (filteredTasks.filter(task => {
                        const today = new Date().toISOString().split('T')[0];
                        return task.dueDate === today;
                      }).length / filteredTasks.length) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
              </button>
            </div>
          </div>
          
          {/* TaskContainer */}
          <div className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow">
            <TaskContainer 
              tasks={filteredTasks} 
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onToggle={handleToggleTask}
              onShowDetail={handleShowDetail}
            />
          </div>
        </div>
      </div>

      {/* Todo Detail Modal */}
      {selectedTask && (
        <TodoDetail
          todo={selectedTask}
          onClose={handleCloseDetail}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
        />
      )}
    </div>
  );
} 