import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import type { Todo } from "../types/Todo";
import "./TodoForm.css";

interface TodoFormProps {
  onAddTodo: (todo: Todo) => void;
}

export const TodoForm: React.FC<TodoFormProps> = ({ onAddTodo }) => {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError("Please enter a task");
      return;
    }

    const newTodo: Todo = {
      id: uuidv4(),
      title: trimmedTitle,
      completed: false,
      createdAt: new Date(),
      priority: "medium"
    };

    onAddTodo(newTodo);
    setTitle("");
    setError("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (error) setError("");
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <div className="input-group">
        <input
          type="text"
          value={title}
          onChange={handleChange}
          placeholder="Add a new task..."
          className={`todo-input ${error ? "error" : ""}`}
          aria-label="New task title"
          aria-invalid={error ? "true" : "false"}
        />
        {error && (
          <span className="error-message" role="alert">
            {error}
          </span>
        )}
      </div>
      <button type="submit" className="add-button" aria-label="Add task">
        Add Task
      </button>
    </form>
  );
};
