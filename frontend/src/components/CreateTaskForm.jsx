import { useState } from 'react';

const CreateTaskForm = ({ onSubmit, loading }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setError('');
    const success = await onSubmit({ title: title.trim(), description: description.trim() });
    if (success) {
      setTitle('');
      setDescription('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-5">
      <h2 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2">
        <span className="w-5 h-5 bg-blue-600 rounded-md flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
          </svg>
        </span>
        Add New Task
      </h2>

      {error && (
        <p className="mb-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div className="mb-3">
        <label className="block text-xs font-medium text-white/50 mb-1.5" htmlFor="task-title">
          Title <span className="text-red-400">*</span>
        </label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          maxLength={200}
          className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          disabled={loading}
        />
      </div>

      <div className="mb-4">
        <label className="block text-xs font-medium text-white/50 mb-1.5" htmlFor="task-desc">
          Description <span className="text-white/30 font-normal">(optional)</span>
        </label>
        <textarea
          id="task-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add more details..."
          maxLength={1000}
          rows={2}
          className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors"
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        disabled={loading || !title.trim()}
        className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/30 text-white disabled:text-white/40 font-semibold py-2.5 px-4 rounded-xl transition-all duration-150 text-sm shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Adding...
          </span>
        ) : '+ Add Task'}
      </button>
    </form>
  );
};

export default CreateTaskForm;
