import { useState, useEffect } from "react";
import type { Todo, Priority } from "./types/Todo";
import { TodoForm } from "./components/TodoForm";
import { TodoList } from "./components/TodoList";
import "./App.css";

const STORAGE_KEY = "personal-task-manager-todos";

// Helper function to safely parse stored todos
const loadStoredTodos = (): Todo[] => {
  try {
    const storedTodos = localStorage.getItem(STORAGE_KEY);
    if (!storedTodos) return [];

    const parsedTodos = JSON.parse(storedTodos);

    // Validate and transform the data
    return parsedTodos.map((todo: any) => ({
      ...todo,
      createdAt: new Date(todo.createdAt), // Convert ISO string back to Date
      priority: todo.priority || "medium", // Ensure priority exists for older todos
    }));
  } catch (error) {
    console.error("Error loading todos from localStorage:", error);
    return [];
  }
};

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(loadStoredTodos);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error("Error saving todos to localStorage:", error);
    }
  }, [todos]);

  const handleAddTodo = (todo: Todo) => {
    const todoWithPriority = {
      ...todo,
      priority: "medium" as Priority, // Set default priority for new todos
    };
    setTodos((prevTodos) => [...prevTodos, todoWithPriority]);
  };

  const handleToggleTodo = (id: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id: string) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  const handleEditTodo = (id: string, newTitle: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, title: newTitle } : todo
      )
    );
  };

  const handlePriorityChange = (id: string, newPriority: Priority) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, priority: newPriority } : todo
      )
    );
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Personal Task Manager</h1>
      </header>
      <main className="app-main">
        <TodoForm onAddTodo={handleAddTodo} />
        <TodoList
          todos={todos}
          onToggleTodo={handleToggleTodo}
          onDeleteTodo={handleDeleteTodo}
          onEditTodo={handleEditTodo}
          onPriorityChange={handlePriorityChange}
        />
      </main>
    </div>
  );
}
