import { useState, useEffect, useMemo } from "react";
import type { Todo, Priority, Tag } from "./types/Todo";
import { TodoForm } from "./components/TodoForm";
import { TodoList } from "./components/TodoList";
import { TodoFilter, type FilterStatus } from "./components/TodoFilter";
import { TodoSearch } from "./components/TodoSearch";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ThemeToggle } from "./components/ThemeToggle";
import { Statistics } from "./components/Statistics";
import "./App.css";

const STORAGE_KEY = "personal-task-manager-todos";
const TAGS_STORAGE_KEY = "personal-task-manager-tags";
const ORDER_STORAGE_KEY = "personal-task-manager-order";

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
      createdAt: todo.createdAt, // Keep as ISO string
      priority: todo.priority || "medium",
      tags: todo.tags || [],
    }));
  } catch (error) {
    console.error("Error loading todos from localStorage:", error);
    return [];
  }
};

// Helper function to safely parse stored order
const loadStoredOrder = (): string[] => {
  try {
    const storedOrder = localStorage.getItem(ORDER_STORAGE_KEY);
    return storedOrder ? JSON.parse(storedOrder) : [];
  } catch (error) {
    console.error("Error loading order from localStorage:", error);
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
  const [searchQuery, setSearchQuery] = useState("");
  const [order, setOrder] = useState<string[]>(loadStoredOrder);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error("Error saving todos to localStorage:", error);
    }
  }, [todos]);

  // Save order to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(order));
    } catch (error) {
      console.error("Error saving order to localStorage:", error);
    }
  }, [order]);

  // Save tags to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(tags));
    } catch (error) {
      console.error("Error saving tags to localStorage:", error);
    }
  }, [tags]);

  // Calculate filtered and ordered todos
  const { filteredTodos, counts } = useMemo(() => {
    // First, filter by search query
    const searchFiltered = searchQuery
      ? todos.filter((todo) =>
          todo.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : todos;

    // Then, filter by status
    const active = searchFiltered.filter((todo) => !todo.completed);
    const completed = searchFiltered.filter((todo) => todo.completed);

    const counts = {
      all: searchFiltered.length,
      active: active.length,
      completed: completed.length,
    };

    let filtered =
      filter === "all"
        ? searchFiltered
        : filter === "active"
        ? active
        : completed;

    // Apply ordering
    filtered = filtered.sort((a, b) => {
      const aIndex = order.indexOf(a.id);
      const bIndex = order.indexOf(b.id);

      // If both items are in order array, use their order
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }

      // If only one item is in order array, it comes first
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;

      // If neither item is in order array, use creation date
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return { filteredTodos: filtered, counts };
  }, [todos, filter, searchQuery, order]);

  const handleAddTodo = (todo: Todo) => {
    const todoWithDefaults = {
      ...todo,
      priority: "medium" as Priority,
      tags: [],
    };
    setTodos((prevTodos) => [...prevTodos, todoWithDefaults]);
    setOrder((prevOrder) => [todoWithDefaults.id, ...prevOrder]);
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

  const handleReorderTodos = (startIndex: number, endIndex: number) => {
    const reorderedTodos = Array.from(filteredTodos);
    const [removed] = reorderedTodos.splice(startIndex, 1);
    reorderedTodos.splice(endIndex, 0, removed);

    // Update the order array based on the new positions
    const newOrder = reorderedTodos.map((todo) => todo.id);
    setOrder(newOrder);
  };

  return (
    <ThemeProvider>
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <h1>Personal Task Manager</h1>
            <ThemeToggle />
          </div>
        </header>
        <main className="app-main">
          <Statistics todos={todos} />
          <TodoForm onAddTodo={handleAddTodo} />
          <TodoSearch
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
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
            onReorderTodos={handleReorderTodos}
            availableTags={tags}
            onCreateTag={handleCreateTag}
          />
        </main>
      </div>
    </ThemeProvider>
  );
}
