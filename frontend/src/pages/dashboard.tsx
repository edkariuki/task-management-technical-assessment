import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../hooks/useAuthContext';
import type { Task } from '../types/task';
import api from '../lib/api';
import { toast } from 'react-toastify';

const emptyTask = {
  title: '',
  description: '',
  status: '',
  priority: '',
};

const Dashboard = () => {
  const { user, token, logout } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState(emptyTask);

  const fetchTasks = useCallback(async () => {
    if (!token) return;

    try {
      const res = await api.get('/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data as Task[]);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  }, [token]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const headers = {
        headers: { Authorization: `Bearer ${token}` },
      };
      if (editingId) {
        await api.put(`/tasks/${editingId}`, formData, headers);
        toast.success('Task updated successfully');
      } else {
        await api.post('/tasks', formData, headers);
        toast.success('Task created successfully');
      }
      setFormData(emptyTask);
      setShowForm(false);
      setEditingId(null);
      await fetchTasks();
    } catch (err) {
      console.error('Save failed:', err);
      toast.error('Failed');
    }
  };

  const handleDelete = async (id: number) => {
    const headers = {
      headers: { Authorization: `Bearer ${token}` },
    };
    if (!confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`, headers);
      toast.success('Task deleted successfully ');
      await fetchTasks();
    } catch (err) {
      toast.error('Failed to delete task ');
      console.error('Delete failed:', err);
    }
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
    });
    setShowForm(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex-col">
          <p className=" text-2xl font-semibold mb-10">Welcome, {user?.name}</p>
          <p className=" text-3xl font-bold ">My Tasks</p>
        </div>

        <div className="space-x-2">
          <button
            onClick={() => {
              setEditingId(null);
              setFormData(emptyTask);
              setShowForm(!showForm);
            }}
            className="bg-gray-400 text-white p-1.5 rounded-md"
          >
            {showForm ? 'Cancel' : 'Add Task'}
          </button>
          <button onClick={logout} className="bg-gray-400 text-white p-1.5 rounded-md">
            Logout
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/80">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md space-y-4 bg-white p-6 rounded shadow-lg"
          >
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Title"
              required
              className="w-full border p-2 rounded"
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full border p-2 rounded"
            />
            <div className="flex gap-2">
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="flex-1 border p-2 rounded"
              >
                <option value="" disabled>
                  Select status
                </option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="flex-1 border p-2 rounded"
              >
                <option value="" disabled>
                  Select priority
                </option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border rounded text-gray-700"
              >
                Cancel
              </button>
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                {editingId ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      )}

      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="border rounded-[10px] p-[10px] shadow bg-white flex justify-between"
            >
              <div>
                <span className="text-2xl font-semibold">{task.title}</span>
                <p>{task.description}</p>
                <div className="text-sm text-gray-500 mt-2">
                  <span>Status: {task.status || 'none'}</span> |{' '}
                  <span>Priority: {task.priority || 'none'}</span>
                </div>
              </div>

              <div className="flex h-9 space-x-2">
                <button
                  onClick={() => startEdit(task)}
                  className="bg-gray-400 text-white p-1.5 rounded-md"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="bg-red-400 text-white p-1.5 rounded-md"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
