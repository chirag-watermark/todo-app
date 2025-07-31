import { X, Calendar, Clock, AlertCircle, CheckCircle, Edit, Trash2 } from "lucide-react";

const TodoDetail = ({ todo, onClose, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const priorityColors = {
    low: "bg-green-100 text-green-800 border-green-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    high: "bg-orange-100 text-orange-800 border-orange-200",
    urgent: "bg-red-100 text-red-800 border-red-200",
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    completed: "bg-green-100 text-green-800 border-green-200",
  };

  const isOverdue = new Date(todo.dueDate) < new Date() && todo.status !== 'Completed';
  const isToday = new Date(todo.dueDate).toDateString() === new Date().toDateString();

  const handleEdit = () => {
    onEdit(todo);
    onClose();
  };

  const handleDelete = () => {
    onDelete(todo._id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Task Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title */}
          <div>
            <h3 className={`text-lg font-semibold text-gray-900 ${
              todo.status === 'Completed' ? 'line-through text-gray-500' : ''
            }`}>
              {todo.title}
            </h3>
          </div>

          {/* Description */}
          {todo.description && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
              <p className={`text-gray-600 ${
                todo.status === 'Completed' ? 'line-through text-gray-400' : ''
              }`}>
                {todo.description}
              </p>
            </div>
          )}

          {/* Status and Priority */}
          <div className="flex flex-wrap gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border capitalize ${
              statusColors[todo.status?.toLowerCase()] || statusColors.pending
            }`}>
              {todo.status || 'Pending'}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border capitalize ${
              priorityColors[todo.priority?.toLowerCase()] || priorityColors.medium
            }`}>
              {todo.priority || 'Medium'} Priority
            </span>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Due Date</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${
                isOverdue
                  ? "text-red-600 font-medium"
                  : isToday
                    ? "text-blue-600 font-medium"
                    : "text-gray-600"
              }`}>
                {formatDate(todo.dueDate)}
              </span>
              {todo.dueDate && (
                <span className="text-xs text-gray-500">
                  at {formatTime(todo.dueDate)}
                </span>
              )}
            </div>
            {isOverdue && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>Overdue</span>
              </div>
            )}
            {todo.status === 'Completed' && (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <CheckCircle className="h-4 w-4" />
                <span>Completed</span>
              </div>
            )}
          </div>

          {/* Created/Updated Info */}
          <div className="text-xs text-gray-500 space-y-1">
            <div>Created: {new Date(todo.created_at || todo.createdAt).toLocaleDateString()}</div>
            {(todo.updated_at || todo.updatedAt) && (todo.updated_at || todo.updatedAt) !== (todo.created_at || todo.createdAt) && (
              <div>Updated: {new Date(todo.updated_at || todo.updatedAt).toLocaleDateString()}</div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoDetail; 