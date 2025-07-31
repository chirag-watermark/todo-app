import TaskCard from "./TaskCard";

const TaskContainer = ({ tasks, onEdit, onDelete, onToggle, onShowDetail }) => {

  return (
    <div className="w-full">
        <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Your Tasks ({tasks.length})</h2>
        </div>
        {tasks.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-500">Create a new task to get started.</p>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-6 p-4">
              {tasks.map((task) => (  
                  <TaskCard 
                    key={task._id} 
                    task={task} 
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggle={onToggle}
                    onShowDetail={onShowDetail}
                  />
              ))}
          </div>
        )}
    </div>
  )
}

export default TaskContainer       