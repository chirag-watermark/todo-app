import { useState, useEffect } from "react";
import { 
  Edit, 
  Save, 
  Trash2, 
  CheckSquare, 
  AlertTriangle,
  Eye,
  EyeOff,
  Target,
  Zap,
  Calendar,
  Clock,
  CheckCircle,
  Circle,
  ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useAuth } from "../contexts/AuthContext.jsx";
import { toast } from "react-toastify";

export function Profile() {

  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [userTasks, setUserTasks] = useState([]); 
  
  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || "",
    username: user?.username || "",
    confirmUsername: user?.username || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Fetch user tasks
  useEffect(() => {
    const fetchUserTasks = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/todos`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });
        const data = await response.json();
        setUserTasks(data.data || []);
      } catch (error) {
        console.error("Error fetching user tasks:", error);
      }
    };

    if (user) {
      fetchUserTasks();
    }
  }, [user]);

  const totalTasks = userTasks.length || 0;
  const completedTasks = userTasks.filter(task => task.status === "Completed").length || 0;
  const pendingTasks = userTasks.filter(task => task.status === "Pending").length || 0;
  const inProgressTasks = userTasks.filter(task => task.status === "In Progress").length || 0;
  
  // Calculate overdue tasks based on due date
  const overdueTasks = userTasks.filter(task => {
    if (!task.dueDate || task.status === "Completed") return false;
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
  }).length || 0;
  
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  // Calculate tasks due today
  const tasksDueToday = userTasks.filter(task => {
    if (!task.dueDate) return false;
    const today = new Date().toISOString().split('T')[0];
    return task.dueDate === today;
  }).length || 0;
  
  // Generate weekly progress data (last 7 days)
  const generateWeeklyProgress = () => {
    const progress = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayTasks = userTasks.filter(task => task.dueDate === dateStr) || [];
      const completedDayTasks = dayTasks.filter(task => task.status === "Completed").length;
      const totalDayTasks = dayTasks.length;
      const dayProgress = totalDayTasks > 0 ? (completedDayTasks / totalDayTasks) * 100 : 0;
      progress.push(Math.round(dayProgress));
    }
    return progress;
  };

  const weeklyProgress = generateWeeklyProgress();
  
  // Calculate priority breakdown from actual tasks
  const calculatePriorityBreakdown = () => {
    return {
      high: userTasks.filter(task => task.priority === "High").length,
      medium: userTasks.filter(task => task.priority === "Medium").length,
      low: userTasks.filter(task => task.priority === "Low").length
    };
  };

  const priorityBreakdown = calculatePriorityBreakdown();

  // Calculate task status breakdown
  const calculateStatusBreakdown = () => {
    return {
      completed: completedTasks,
      pending: pendingTasks,
      inProgress: inProgressTasks,
      overdue: overdueTasks
    };
  };

  const statusBreakdown = calculateStatusBreakdown();

  // Generate recent task activity for timeline
  const generateRecentActivity = () => {
    const recentTasks = userTasks
      .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
      .slice(0, 5);
    
    return recentTasks.map(task => ({
      id: task._id || task.id,
      title: task.title,
      status: task.status,
      priority: task.priority,
      date: new Date(task.updatedAt || task.createdAt),
      type: task.status === "Completed" ? "completed" : "updated"
    }));
  };

  const recentActivity = generateRecentActivity();

  // Analytics data - computed from userTasks
  const analytics = {
    totalTasks: totalTasks,
    completedTasks: completedTasks,
    pendingTasks: pendingTasks,
    completionRate: completionRate,
    tasksDueToday: tasksDueToday,
    weeklyProgress: weeklyProgress,
    priorityBreakdown: priorityBreakdown,
    statusBreakdown: statusBreakdown,
    recentActivity: recentActivity
  };

  useEffect(() => {
    setFormData({
      name: user?.name || "",
      username: user?.username || "",
      confirmUsername: user?.username || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    

    
    try {
      // Validate username confirmation
      if (formData.username !== formData.confirmUsername) {
        toast.error("Usernames don't match!");
        return;
      }
      
      // Validate passwords if changing
      if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
        toast.error("New passwords don't match!");
        return;
      }
      
      // Validate that if user wants to change password, both current and new passwords are provided
      if ((formData.currentPassword && !formData.newPassword) || (!formData.currentPassword && formData.newPassword)) {
        toast.error("Please provide both current and new passwords to change your password.");
        return;
      }
      
      // Prepare update data - include all fields that are being changed
      const updateData = {};
      
      // Always include name and username if they're different from current values
      if (formData.name !== user?.name) {
        updateData.name = formData.name;
      }
      if (formData.username !== user?.username) {
        updateData.username = formData.username;
      }
      
      // Include password field if user wants to change password
      if (formData.currentPassword && formData.newPassword) {
        updateData.password = formData.newPassword; // New password to set
        // Note: Server should validate current password from the request body
        // but we'll send it as a separate field that the server can use for validation
        updateData.current_password = formData.currentPassword; // For validation
      }
      
      // Check if there are any changes to update
      if (Object.keys(updateData).length === 0) {
        toast.info("No changes detected. Please make changes before saving.");
        return;
      }
      

      
      console.log("Sending update data:", updateData); // Debug log
      
      // If we're changing password, we need to send current password separately
      let requestBody = updateData;
      let currentPasswordForValidation = null;
      
      if (formData.currentPassword && formData.newPassword) {
        // Remove current_password from the main update data
        currentPasswordForValidation = updateData.current_password;
        delete updateData.current_password;
        requestBody = updateData;
      }
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${user.id || user._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          ...(currentPasswordForValidation && { "X-Current-Password": currentPasswordForValidation })
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      


      // Check for any error in the response, regardless of HTTP status
      if (data.error || data.success === false || !data.success || data.message?.includes("error") || data.status === "error") {
        throw new Error(data.error || data.message || "Profile update failed");
      }

      // Only logout and show success message if the update was actually successful
      toast.success("Profile updated successfully! Please log in again to see your changes.");
      
      // Logout user to ensure changes are reflected
      logout();
      navigate("/");
    
    } catch (error) {
      console.error("Error updating profile:", error);
      
      // Provide more specific error messages based on the error
      if (error.message.includes("current password") || error.message.includes("Current password")) {
        toast.error("Current password is incorrect. Please check and try again.");
      } else if (error.message.includes("username") && error.message.includes("already")) {
        toast.error("Username is already taken. Please choose a different username.");
      } else if (error.message.includes("validation")) {
        toast.error("Please check your input and try again.");
      } else {
        toast.error(error.message || "Failed to update profile. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${user.id || user._id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete account");
      }
      
      toast.success("Account deleted successfully!");

      // Clear user tasks and state
      setUserTasks([]);
      // Logout and redirect
      logout();
      navigate("/");

    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error(error.message || "Failed to delete account");
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return '?';
    return name.trim().charAt(0).toUpperCase();
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar user={user} />
      
      <div className="w-full max-w-7xl mx-auto pt-4">
        {/* Back Button */}
        <div className="p-4 pb-2">
          <button
            onClick={() => navigate("/homepage")}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Homepage</span>
          </button>
        </div>
        
        <div className="p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Dashboard Analytics</h2>
        </div>
        
        {/* Analytics Cards */}
        <div className="flex flex-col lg:flex-row gap-6 p-2 mb-8">
          {/* Left Column - Key Metrics */}
          <div className="lg:w-1/2 space-y-4">
            {/* Main Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Total Tasks Card */}
              <div className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CheckSquare className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{analytics.totalTasks}</p>
                    <p className="text-sm text-gray-500">Total Tasks</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>

              {/* Completed Tasks Card */}
              <div className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Target className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{analytics.completedTasks}</p>
                    <p className="text-sm text-gray-500">Completed</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: `${(analytics.completedTasks / analytics.totalTasks) * 100}%` }}></div>
                </div>
              </div>

              {/* Deadline Card */}
              <div className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Zap className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{analytics.statusBreakdown.overdue}</p>
                    <p className="text-sm text-gray-500">Backlog</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-600 h-2 rounded-full" style={{ width: `${analytics.totalTasks > 0 ? (analytics.statusBreakdown.overdue / analytics.totalTasks) * 100 : 0}%` }}></div>
                </div>
              </div>
            </div>

            {/* Task Status Distribution */}
            <div className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Status Distribution</h3>
              
              {/* Pie Chart */}
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                    {/* Background circle */}
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="2"
                    />
                    
                    {/* Completed slice */}
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                      strokeDasharray={`${(analytics.statusBreakdown.completed / analytics.totalTasks) * 100}, 100`}
                      strokeLinecap="round"
                    />
                    
                    {/* Pending slice */}
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2"
                      strokeDasharray={`${(analytics.statusBreakdown.pending / analytics.totalTasks) * 100}, 100`}
                      strokeDashoffset={`-${(analytics.statusBreakdown.completed / analytics.totalTasks) * 100}`}
                      strokeLinecap="round"
                    />
                    
                    {/* In Progress slice */}
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      strokeDasharray={`${(analytics.statusBreakdown.inProgress / analytics.totalTasks) * 100}, 100`}
                      strokeDashoffset={`-${((analytics.statusBreakdown.completed + analytics.statusBreakdown.pending) / analytics.totalTasks) * 100}`}
                      strokeLinecap="round"
                    />
                    
                    {/* Overdue slice */}
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="2"
                      strokeDasharray={`${(analytics.statusBreakdown.overdue / analytics.totalTasks) * 100}, 100`}
                      strokeDashoffset={`-${((analytics.statusBreakdown.completed + analytics.statusBreakdown.pending + analytics.statusBreakdown.inProgress) / analytics.totalTasks) * 100}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-900">{analytics.totalTasks}</span>
                  </div>
                </div>
              </div>
              
              {/* Legend */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Completed ({analytics.statusBreakdown.completed})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Pending ({analytics.statusBreakdown.pending})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">In Progress ({analytics.statusBreakdown.inProgress})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Overdue ({analytics.statusBreakdown.overdue})</span>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <span className="text-sm text-gray-600">Task status breakdown</span>
              </div>
            </div>
          </div>

          {/* Right Column - Visual Charts */}
          <div className="lg:w-1/2 space-y-4">
            {/* Completion Rate Donut Chart */}
            <div className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Completion Rate</h3>
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="2"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      strokeDasharray={`${analytics.completionRate}, 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900">{analytics.completionRate.toFixed(2)}%</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">Overall task completion rate</p>
              </div>
            </div>

            {/* Priority Breakdown */}
            <div className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Breakdown</h3>
              <div className="space-y-4">
                {/* High Priority */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">High Priority</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${(analytics.priorityBreakdown.high / analytics.totalTasks) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{analytics.priorityBreakdown.high}</span>
                  </div>
                </div>

                {/* Medium Priority */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">Medium Priority</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full" 
                        style={{ width: `${(analytics.priorityBreakdown.medium / analytics.totalTasks) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{analytics.priorityBreakdown.medium}</span>
                  </div>
                </div>

                {/* Low Priority */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">Low Priority</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${(analytics.priorityBreakdown.low / analytics.totalTasks) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{analytics.priorityBreakdown.low}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="w-full max-w-5xl mx-auto shadow-sm rounded-lg bg-white mb-4">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-blue-600 mb-4">Profile Details</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                <span>{isEditing ? 'Save' : 'Edit'}</span>
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Avatar */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {getInitials(formData.name || user?.name || 'U')}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{formData.name || user?.name || 'User'}</h3>
                  <p className="text-sm text-gray-500">{formData.username || user?.username || 'username'}</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Left Side - Name and Username */}
                <div className="lg:w-1/2 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-50"
                    />
                  </div>
                </div>

                {/* Right Side - Password Fields */}
                <div className="lg:w-1/2 space-y-4">

                  {isEditing && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Username
                      </label>
                      <input
                        type="text"
                        name="confirmUsername"
                        value={formData.confirmUsername}
                        onChange={handleInputChange}
                        placeholder="Confirm your username"
                        className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                  )}

                  {isEditing && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          placeholder="Enter current password"
                          className="w-full h-12 px-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Password Change Fields */}
              {isEditing && (
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="lg:w-1/2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        placeholder="Enter new password"
                        className="w-full h-12 px-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="lg:w-1/2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm new password"
                      className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Save Button */}
              {isEditing && (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
                >
                  <Save className="h-4 w-4" />
                  <span>{isLoading ? "Saving..." : "Save Changes"}</span>
                </button>
              )}
            </form>

            {/* Delete Account Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Danger Zone</h3>
              <div className="bg-red-50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-red-900">Delete Account</h4>
                    <p className="text-sm text-red-700 mt-1">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      disabled={isLoading}
                      className="mt-3 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                    >
                      <Trash2 className="h-4 w-4 inline mr-2" />
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-medium text-gray-900">Delete Account</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 