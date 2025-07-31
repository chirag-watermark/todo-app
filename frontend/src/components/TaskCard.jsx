import { Calendar, Edit, Trash2, GripVertical } from "lucide-react";

const TaskCard = ({ task, onEdit, onDelete, onToggle, onShowDetail }) => {
  const handleToggle = () => {
    onToggle(task._id, task);
  };

  const handleDelete = () => {
    onDelete(task._id);
  };

  const handleEdit = () => {
    onEdit(task);
  };

  const handleCardClick = () => {
    onShowDetail(task);
  };
    
  const priorityColors = {
    low: "bg-green-100 text-green-800 border-green-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    high: "bg-orange-100 text-orange-800 border-orange-200",
    urgent: "bg-red-100 text-red-800 border-red-200",
  };

  const priorityDots = {
    low: "bg-green-500",
    medium: "bg-yellow-500",
    high: "bg-orange-500",
    urgent: "bg-red-500",
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
  };

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Completed';
  const isToday = new Date(task.dueDate).toDateString() === new Date().toDateString();

  return (
    <div 
      onClick={handleCardClick}
      className={`group cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-[1.01] min-h-[160px] flex flex-col max-w-xs w-full bg-white rounded-lg shadow-sm border border-gray-200 ${task.status === 'Completed' ? 'opacity-75' : ''}`}
    >
      <div className="p-3 space-y-2 flex-1 flex flex-col">
        {/* Header with drag handle and priority */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <GripVertical className="h-4 w-4 text-blue-400 opacity-100 cursor-grab active:cursor-grabbing" />
            <div className={`w-3 h-3 rounded-full ${priorityDots[task.priority?.toLowerCase()] || priorityDots.medium} flex-shrink-0`} />
            <span className={`px-2 py-1 rounded-full text-xs font-semibold border capitalize ${priorityColors[task.priority?.toLowerCase()] || priorityColors.medium}`}>
              {task.priority}
            </span>
          </div>
        </div>
        {/* Task content */}
        <div className="space-y-1 flex-1">
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={task.status === 'Completed'}
              onChange={handleToggle}
              onClick={(e) => e.stopPropagation()}
              className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold text-sm leading-tight ${
                task.status === 'Completed' ? 'line-through text-gray-500' : 'text-gray-900'
              }`}>
                {task.title}
              </h3>
              {task.description && (
                <p className={`text-xs mt-0.5 line-clamp-2 ${
                  task.status === 'Completed' ? 'text-gray-400' : 'text-gray-700'
                }`}>
                  {task.description}
                </p>
              )}
            </div>
          </div>
        </div>
        {/* Footer with due date and actions */}
        <div className="flex items-center justify-between pt-1 border-t border-gray-100 mt-auto">
          <div className="flex items-center gap-1 text-xs">
            <Calendar className="h-3 w-3 text-gray-500" />
            <span className={`${
              isOverdue
                ? "text-gray-600 font-medium"
                : isToday
                  ? "text-blue-600 font-medium"
                  : "text-gray-500"
            }`}>
              {formatDate(task.dueDate)}
            </span>
          </div>
          <div className="hidden items-center gap-1 opacity-100 transition-opacity group-hover:flex">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEdit();
              }}
              className="h-7 w-7 p-0 text-blue-600 hover:bg-blue-50 rounded transition-colors flex items-center justify-center"
              title="Edit task"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors flex items-center justify-center"
              title="Delete task"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard; 