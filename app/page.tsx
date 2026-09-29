'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  dueDate?: string;
}

export default function Home() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  
  const fetchTasks = useCallback(async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setTasks(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    }
  }, [API_URL]);

  // Check auth and fetch tasks on load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login'); // Redirect if not logged in
      return;
    }
    fetchTasks(token);
  }, [fetchTasks, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');

    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, description, status, dueDate: dueDate || null })
      });

      const data = await res.json();

      if (data.success) {
        setTitle('');
        setDescription('');
        setStatus('todo');
        setDueDate('');
        fetchTasks(token);
      } else {
        setError(data.error);
      }
    } catch {
      setError('Something went wrong');
    }
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');

    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, { 
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        fetchTasks(token);
      }
    } catch (err) {
      console.error('Failed to delete task', err);
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-6 font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Taskit</h1>
        <button
          onClick={() => { localStorage.removeItem('token'); router.push('/login'); }}
          className="bg-red-600 text-white text-sm px-3 py-1.5 rounded hover:bg-red-700 font-semibold"
        >
          Logout
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-black p-6 rounded-lg shadow-md mb-8 border border-gray-800">
        <h2 className="text-xl font-semibold mb-4 text-white">Add New Task</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        
        <input
          type="text"
          placeholder="Task Title (required)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded mb-3 bg-gray-900 text-white border-gray-700"
          required
        />
        
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded mb-3 bg-gray-900 text-white border-gray-700"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border rounded mb-3 bg-gray-900 text-white border-gray-700"
        >
          <option value="todo">Todo</option>
          <option value="in-progress">In-Progress</option>
          <option value="done">Done</option>
        </select>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full p-2 border rounded mb-4 bg-gray-900 text-white border-gray-700"
        />

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded font-semibold hover:bg-blue-700">
          Add Task
        </button>
      </form>

      {/* Task List */}
      <h2 className="text-xl font-semibold mb-4 text-white">Your Tasks</h2>
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <p className="text-gray-400">No tasks found.</p>
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