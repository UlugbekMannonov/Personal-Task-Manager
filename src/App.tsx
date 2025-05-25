import { useState } from "react";
import type { Todo } from "./types/Todo";
import { TodoForm } from "./components/TodoForm";
import { TodoList } from "./components/TodoList";
import "./App.css";

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const handleAddTodo = (todo: Todo) => {
    setTodos((prevTodos) => [...prevTodos, todo]);
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
        />
      </main>
    </div>
  );
}
