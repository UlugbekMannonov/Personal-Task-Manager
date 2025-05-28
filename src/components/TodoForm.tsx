import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import type { Todo } from "../types/Todo";
import "./TodoForm.css";

interface TodoFormProps {
  onAddTodo: (todo: Todo) => void;
}

const PLACEHOLDER_EXAMPLES = [
  "Buy groceries for dinner",
  "Call mom at 2 PM",
  "Finish project presentation",
  "Schedule dentist appointment",
  "Pay utility bills",
  "Go for a 30-minute walk",
];

export const TodoForm: React.FC<TodoFormProps> = ({ onAddTodo }) => {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [placeholder, setPlaceholder] = useState(PLACEHOLDER_EXAMPLES[0]);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Rotate through placeholder examples
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholder((currentPlaceholder) => {
        const currentIndex = PLACEHOLDER_EXAMPLES.indexOf(currentPlaceholder);
        const nextIndex = (currentIndex + 1) % PLACEHOLDER_EXAMPLES.length;
        return PLACEHOLDER_EXAMPLES[nextIndex];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError("Please enter a task");
      inputRef.current?.focus();
      return;
    }

    const newTodo: Todo = {
      id: uuidv4(),
      title: trimmedTitle,
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate: null,
      tags: [],
      priority: "medium",
    };

    onAddTodo(newTodo);
    setTitle("");
    setError("");
    inputRef.current?.focus();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (error) setError("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <div
        className={`input-container ${isFocused ? "focused" : ""} ${
          error ? "error" : ""
        }`}
      >
        <svg
          className="plus-icon"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 4.16667V15.8333M4.16667 10H15.8333"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="input-group">
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={`Try: "${placeholder}"`}
            className="todo-input"
            aria-label="New task title"
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? "todo-error" : undefined}
          />
          {error && (
            <span className="error-message" role="alert" id="todo-error">
              {error}
            </span>
          )}
          <span className="input-hint">Press Enter or click + to add task</span>
        </div>
        <button type="submit" className="add-button" aria-label="Add task">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 6L9 17L4 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </form>
  );
};
