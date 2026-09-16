import TaskCard from './TaskCard';

const TaskList = ({ tasks, onStatusChange, onDelete, updatingId, filter }) => {
  const filtered = filter === 'All' ? tasks : tasks.filter((t) => t.status === filter);

  if (filtered.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-white/30 text-sm">
          {filter === 'All' ? 'No tasks yet. Add your first task above.' : `No "${filter}" tasks.`}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filtered.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
          updating={updatingId === task._id}
        />
      ))}
    </div>
  );
};

export default TaskList;
