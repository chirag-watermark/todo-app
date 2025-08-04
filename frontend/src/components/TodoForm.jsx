import { Plus, Calendar, Save, X } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const TodoForm = ({ editingTask, onEditComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
    status: "Pending",
    priority: "Medium",
    dueDate: "",
  });

  // Update form when editingTask changes
  useEffect(() => {
    if (editingTask) {
      setNewTodo({
        title: editingTask.title || "",
        description: editingTask.description || "",
        status: editingTask.status || "Pending",
        priority: editingTask.priority || "Medium",
        dueDate: editingTask.dueDate || "",
      });
    } else {
      setNewTodo({
        title: "",
        description: "",
        status: "Pending",
        priority: "Medium",
        dueDate: "",
      });
    }
  }, [editingTask]);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.title.trim() || !newTodo.dueDate) return;
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newTodo),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add todo");
      }

      toast.success(`Task "${newTodo.title}" has been added successfully!`);
      setNewTodo({
        title: "",
        description: "",
        status: "Pending",
        priority: "Medium",
        dueDate: "",
      });

      // Trigger parent to refresh tasks
      onEditComplete();

    } catch (error) {
      console.error("Error adding todo:", error);
      toast.error(error.message || "Failed to add task. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.title.trim() || !newTodo.dueDate) return;
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/todos/${editingTask._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newTodo),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update todo");
      }

      toast.success(`Task "${newTodo.title}" has been updated successfully!`);
      onEditComplete();
      setNewTodo({
        title: "",
        description: "",
        status: "Pending",
        priority: "Medium",
        dueDate: "",
      });

    } catch (error) {
      console.error("Error updating todo:", error);
      toast.error(error.message || "Failed to update task. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    onEditComplete();
    setNewTodo({
      title: "",
      description: "",
      status: "Pending",
      priority: "Medium",
      dueDate: "",
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto shadow-sm border border-gray-200 rounded-lg bg-white mb-4">
      <div className="p-4">
        <h2 className="text-xl font-semibold text-blue-600 dark:text-white mb-4">
          {editingTask ? "✏️ Edit Todo" : "＋ Create New Todo"}
        </h2>
        <form onSubmit={editingTask ? handleUpdateTodo : handleAddTodo} className="space-y-3">
          {/* Main Content Row */}
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Left Side - Title and Description */}
            <div className="lg:w-3/4 space-y-2 flex flex-col justify-between h-32">
              <input
                type="text"
                placeholder="What needs to be done?"
                value={newTodo.title}
                onChange={(e) =>
                  setNewTodo({ ...newTodo, title: e.target.value })
                }
                required
                className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <textarea
                placeholder="Add description (optional)..."
                value={newTodo.description}
                onChange={(e) =>
                  setNewTodo({ ...newTodo, description: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm flex-1"
              />
            </div>

            {/* Right Side - Status, Priority, Due Date, Add Button */}
            <div className="lg:w-1/4 space-y-3 flex flex-col justify-between h-32">
              {/* First Row - Status and Priority parallel */}
              <div className="flex gap-2">
                <select
                  value={newTodo.status}
                  aria-label="Status"
                  title="Status"
                  onChange={(e) =>
                    setNewTodo({ ...newTodo, status: e.target.value })
                  }
                  className="flex-1 h-9 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="Pending">Pending</option>
                  <option value="Started">Started</option>
                  <option value="Completed">Completed</option>
                </select>

                <select
                  value={newTodo.priority}
                  aria-label="Priority"
                  title="Priority"
                  onChange={(e) =>
                    setNewTodo({ ...newTodo, priority: e.target.value })
                  }
                  className="flex-1 h-9 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className="relative">
                <input
                  type="date"
                  value={newTodo.dueDate}
                  aria-label="Due date"
                  title="Due date"
                  onChange={(e) =>
                    setNewTodo({ ...newTodo, dueDate: e.target.value })
                  }
                  min={today}
                  required
                  className="w-full h-9 px-3 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {editingTask ? (
                  <>
                    <button
                      type="submit"
                      disabled={
                        !newTodo.title.trim() || !newTodo.dueDate || isLoading
                      }
                      className="flex-1 h-9 bg-green-600 hover:bg-green-700 text-white rounded-md disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
                    >
                      <Save className="h-4 w-4" />
                      <span>{isLoading ? "Saving..." : "Save"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="h-9 px-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center justify-center transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <button
                    type="submit"
                    disabled={
                      !newTodo.title.trim() || !newTodo.dueDate || isLoading
                    }
                    className="w-full h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{isLoading ? "Adding..." : "Add Todo"}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TodoForm;
