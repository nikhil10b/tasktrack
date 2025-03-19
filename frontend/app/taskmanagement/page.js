"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

const TaskManager = () => {
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const router = useRouter();

  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {
        const res = await axios.get("http://localhost:8081/taskmanagement", {
          withCredentials: true,
        });

        if (res.data.Status === "Success") {
          setAuth(true);
          setName(res.data.name);
          fetchTasks();  // Fetch tasks when authenticated
        } else {
          setAuth(false);
          setMessage("Authentication failed, redirecting to login...");
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        }
      } catch (err) {
        setAuth(false);
        setMessage("Error fetching authentication status. Please try again.");
        console.error("Registration error:", err);
      }
    };

    fetchAuthStatus();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:8081/tasks", {
        withCredentials: true,
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const createTask = async () => {
    try {
      await axios.post("http://localhost:8081/tasks", newTask, {
        withCredentials: true,
      });
      setNewTask({ title: "", description: "" });
      fetchTasks(); // Refresh task list
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };

  const updateTask = async (id, status) => {
    try {
      await axios.put(`http://localhost:8081/tasks/${id}`, { status }, {
        withCredentials: true,
      });
      fetchTasks();
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/tasks/${id}`, {
        withCredentials: true,
      });
      fetchTasks();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const handleLogout = () => {
    setAuth(false);
    setMessage("You have logged out successfully.");
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-center">
        {auth ? (
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              Welcome, {name}!
            </h3>
            <button
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
              onClick={handleLogout}
            >
              Logout
            </button>

            {/* Task Input */}
            <div className="mt-6">
              <input
                type="text"
                placeholder="Task Title"
                className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
              <input
                type="text"
                placeholder="Task Description"
                className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
              <button
                onClick={createTask}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Add Task
              </button>
            </div>

            {/* Task List */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Tasks:</h3>
              <ul className="space-y-4">
                {tasks.map((task) => (
                  <li key={task.id} className="flex justify-between items-center p-4 bg-gray-50 border rounded-lg shadow-sm">
                    <div className="flex flex-col">
                      <h4 className="font-medium text-lg text-gray-700">{task.title}</h4>
                      <p className="text-sm text-gray-600">{task.description}</p>
                      <p className={`text-xs font-semibold ${task.status === "Completed" ? "text-green-500" : "text-red-500"}`}>
                        {task.status}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      {task.status !== "Completed" && (
                        <button
                          onClick={() => updateTask(task.id, "Completed")}
                          className="bg-green-600 text-white py-1 px-3 rounded-lg hover:bg-green-700 transition"
                        >
                          Complete
                        </button>
                      )}
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="bg-red-600 text-white py-1 px-3 rounded-lg hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div>
            {message && (
              <h3 className="text-red-500 text-sm font-medium mb-4">{message}</h3>
            )}
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Please log in</h3>
            <Link href="/login">
              <span className="mt-4 inline-block w-full text-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
                Login
              </span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManager;
