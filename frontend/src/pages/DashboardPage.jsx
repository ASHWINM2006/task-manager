import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import CreateTaskForm from '../components/CreateTaskForm';
import TaskList from '../components/TaskList';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const FILTERS = ['All', 'Planned', 'In Progress', 'Complete'];

const FILTER_STYLES = {
  All:           { active: 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20',        inactive: 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white' },
  Planned:       { active: 'bg-slate-500 border-slate-400 text-white shadow-lg shadow-slate-500/20',     inactive: 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white' },
  'In Progress': { active: 'bg-yellow-600 border-yellow-500 text-white shadow-lg shadow-yellow-500/20', inactive: 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white' },
  Complete:      { active: 'bg-green-600 border-green-500 text-white shadow-lg shadow-green-500/20',     inactive: 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white' },
};

const DashboardPage = () => {
  const { user, fetchUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [filter, setFilter] = useState('All');
  const [error, setError] = useState('');

  // AuthCallback already stores token in localStorage before navigating here
  // No need to read token from URL on dashboard

  const loadTasks = useCallback(async () => {
    try {
      setLoadingTasks(true);
      const { data } = await api.get('/tasks');
      setTasks(data);
    } catch {
      setError('Failed to load tasks. Please refresh.');
    } finally {
      setLoadingTasks(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleCreate = async ({ title, description }) => {
    try {
      setCreating(true);
      setError('');
      const { data } = await api.post('/tasks', { title, description });
      setTasks((prev) => [data, ...prev]);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task.');
      return false;
    } finally {
      setCreating(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    setUpdatingId(taskId);
    setError('');
    try {
      const { data } = await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
      setTasks((prev) => prev.map((t) => (t._id === taskId ? data : t)));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    setUpdatingId(taskId);
    setError('');
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task.');
    } finally {
      setUpdatingId(null);
    }
  };

  const counts = {
    All: tasks.length,
    Planned: tasks.filter((t) => t.status === 'Planned').length,
    'In Progress': tasks.filter((t) => t.status === 'In Progress').length,
    Complete: tasks.filter((t) => t.status === 'Complete').length,
  };

  const completionPct = tasks.length > 0
    ? Math.round((counts.Complete / tasks.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600 rounded-full opacity-5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600 rounded-full opacity-5 blur-3xl" />
      </div>

      <Navbar />

      <main className="relative max-w-2xl mx-auto px-4 py-6">

        {/* Greeting */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Hello, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-white/40 text-sm mt-1">
              {tasks.length === 0
                ? 'Add your first task below'
                : `${counts.Complete} of ${tasks.length} tasks completed`}
            </p>
          </div>

          {tasks.length > 0 && (
            <div className="shrink-0 flex flex-col items-center">
              <div className="relative w-14 h-14">
                <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="white" strokeOpacity="0.08" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15" fill="none" stroke="#22c55e" strokeWidth="3"
                    strokeDasharray={`${completionPct * 0.942} 100`} strokeLinecap="round" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                  {completionPct}%
                </span>
              </div>
              <span className="text-white/30 text-xs mt-1">Done</span>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError('')} className="ml-2 text-red-400/50 hover:text-red-400 text-lg leading-none">✕</button>
          </div>
        )}

        {/* Create task */}
        <div className="mb-6">
          <CreateTaskForm onSubmit={handleCreate} loading={creating} />
        </div>

        {/* Filter tabs */}
        <div className="grid grid-cols-4 gap-2 mb-5">
          {FILTERS.map((f) => {
            const s = FILTER_STYLES[f];
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-center py-3 px-1 rounded-xl border text-xs font-semibold transition-all duration-150 ${filter === f ? s.active : s.inactive}`}
              >
                <span className="block text-xl font-bold leading-tight">{counts[f]}</span>
                <span className="leading-tight opacity-80">{f}</span>
              </button>
            );
          })}
        </div>

        {/* Tasks */}
        {loadingTasks ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400" />
            <p className="text-white/30 text-sm">Loading tasks...</p>
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            filter={filter}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
            updatingId={updatingId}
          />
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
