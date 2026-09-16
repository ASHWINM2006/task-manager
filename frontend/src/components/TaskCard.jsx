const STATUSES = ['Planned', 'In Progress', 'Complete'];

const STATUS_STYLES = {
  Planned: {
    badge: 'bg-slate-700/60 text-slate-300 border border-slate-600/50',
    dot: 'bg-slate-400',
    bar: 'bg-slate-500',
  },
  'In Progress': {
    badge: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
    dot: 'bg-yellow-400',
    bar: 'bg-yellow-400',
  },
  Complete: {
    badge: 'bg-green-500/20 text-green-300 border border-green-500/30',
    dot: 'bg-green-400',
    bar: 'bg-green-400',
  },
};

const TaskCard = ({ task, onStatusChange, onDelete, updating }) => {
  const styles = STATUS_STYLES[task.status] || STATUS_STYLES['Planned'];

  const handleStatusChange = (e) => {
    onStatusChange(task._id, e.target.value);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className={`group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl p-4 transition-all duration-200 ${updating ? 'opacity-50 scale-98' : ''}`}>

      {/* Top row: title + badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-sm leading-snug break-words ${task.status === 'Complete' ? 'text-white/40 line-through' : 'text-white'}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className="text-xs text-white/40 mt-1.5 break-words leading-relaxed">
              {task.description}
            </p>
          )}
        </div>

        {/* Status badge */}
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${styles.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
          {task.status}
        </span>
      </div>

      {/* Bottom row: date + controls */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
        <span className="text-xs text-white/30 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formatDate(task.createdAt)}
        </span>

        <div className="flex items-center gap-2">
          {/* Status dropdown */}
          <select
            value={task.status}
            onChange={handleStatusChange}
            disabled={updating}
            aria-label={`Change status for ${task.title}`}
            className="text-xs bg-white/10 border border-white/20 text-white rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s} className="bg-slate-800 text-white">{s}</option>
            ))}
          </select>

          {/* Delete button */}
          <button
            onClick={() => onDelete(task._id)}
            disabled={updating}
            aria-label={`Delete task: ${task.title}`}
            className="p-1.5 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-transparent hover:border-red-500/20"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
