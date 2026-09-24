'use client';
import React from 'react';

import { useState, useEffect, useCallback } from 'react';

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  dueDate?: string;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  const API_URL = process.env.NEXT_API_URL || 'http://localhost:5000/api/tasks';

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (data.success) {
        setTasks(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    }
  }, [API_URL]);

  // Fetch tasks on load
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, status, dueDate: dueDate || null })
      });

      const data = await res.json();

      if (data.success) {
        setTitle('');
        setDescription('');
        setStatus('todo');
        setDueDate('');
        fetchTasks();
      } else {
        setError(data.error);
      }
    } catch {
      setError('Something went wrong');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchTasks();
      }
    } catch (err) {
      console.error('Failed to delete task', err);
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold text-white mb-6">Taskit</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-black p-6 rounded-lg shadow-md mb-8 border">
        <h2 className="text-xl font-semibold mb-4 ">Add New Task</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        
        <input
          type="text"
          placeholder="Task Title (required)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded mb-3"
          required
        />
        
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        >
          <option value="todo">Todo</option>
          <option value="in-progress">In-Progress</option>
          <option value="done">Done</option>
        </select>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded font-semibold hover:bg-blue-700">
          Add Task
        </button>
      </form>

      {/* Task List */}
      <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <p className="text-gray-500">No tasks found.</p>
        ) : (
          tasks.map((task) => (
            <div key={task._id} className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500 flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg text-gray-800">{task.title}</h3>
                <p className="text-gray-600 text-sm">{task.description}</p>
                <p className="text-xs text-gray-400 mt-2">
                  Status: <span className="font-semibold uppercase">{task.status}</span> | Due: {task.dueDate ? task.dueDate.split('T')[0] : 'None'}
                </p>
              </div>
              <button
                onClick={() => handleDelete(task._id)}
                className="bg-red-500 text-white text-xs px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </main>
  );
}