import { useState, useEffect, useMemo } from "react";
import type { Todo, Priority, Tag } from "./types/Todo";
import { TodoForm } from "./components/TodoForm";
import { TodoList } from "./components/TodoList";
import { TodoFilter, type FilterStatus } from "./components/TodoFilter";
import "./App.css";

const STORAGE_KEY = "personal-task-manager-todos";
const TAGS_STORAGE_KEY = "personal-task-manager-tags";

const DEFAULT_COLORS = [
  "#ef4444", // red
  "#f59e0b", // amber
  "#10b981", // emerald
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ec4899", // pink
];

// Fallback for browsers that don't support crypto.randomUUID()
const generateId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

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
      tags: todo.tags || [], // Ensure tags exist for older todos
    }));
  } catch (error) {
    console.error("Error loading todos from localStorage:", error);
    return [];
  }
};

// Helper function to safely parse stored tags
const loadStoredTags = (): Tag[] => {
  try {
    const storedTags = localStorage.getItem(TAGS_STORAGE_KEY);
    return storedTags ? JSON.parse(storedTags) : [];
  } catch (error) {
    console.error("Error loading tags from localStorage:", error);
    return [];
  }
};

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(loadStoredTodos);
  const [tags, setTags] = useState<Tag[]>(loadStoredTags);
  const [filter, setFilter] = useState<FilterStatus>("all");

  // Save todos to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error("Error saving todos to localStorage:", error);
    }
  }, [todos]);

  // Save tags to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(tags));
    } catch (error) {
      console.error("Error saving tags to localStorage:", error);
    }
  }, [tags]);

  // Calculate filtered todos and counts
  const { filteredTodos, counts } = useMemo(() => {
    const active = todos.filter((todo) => !todo.completed);
    const completed = todos.filter((todo) => todo.completed);

    const counts = {
      all: todos.length,
      active: active.length,
      completed: completed.length,
    };

    const filtered =
      filter === "all" ? todos : filter === "active" ? active : completed;

    return { filteredTodos: filtered, counts };
  }, [todos, filter]);

  const handleAddTodo = (todo: Todo) => {
    const todoWithDefaults = {
      ...todo,
      priority: "medium" as Priority,
      tags: [],
    };
    setTodos((prevTodos) => [...prevTodos, todoWithDefaults]);
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

  const handleTagsChange = (id: string, newTags: Tag[]) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, tags: newTags } : todo
      )
    );
  };

  const handleCreateTag = (name: string) => {
    const newTag: Tag = {
      id: generateId(),
      name,
      color: DEFAULT_COLORS[tags.length % DEFAULT_COLORS.length],
    };
    setTags((prevTags) => [...prevTags, newTag]);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Personal Task Manager</h1>
      </header>
      <main className="app-main">
        <TodoForm onAddTodo={handleAddTodo} />
        <TodoFilter
          currentFilter={filter}
          onFilterChange={setFilter}
          todoCount={counts}
        />
        <TodoList
          todos={filteredTodos}
          onToggleTodo={handleToggleTodo}
          onDeleteTodo={handleDeleteTodo}
          onEditTodo={handleEditTodo}
          onPriorityChange={handlePriorityChange}
          onTagsChange={handleTagsChange}
          availableTags={tags}
          onCreateTag={handleCreateTag}
        />
      </main>
    </div>
  );
}
