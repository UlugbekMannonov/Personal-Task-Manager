import React from "react";
import { type Todo as TodoType } from "../types/Todo";
import "./Todo.css";

interface TodoProps {
  todo: TodoType;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function Todo({ todo, onToggle, onDelete }: TodoProps) {
  const formattedDate = new Date(todo.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className={`todo ${todo.completed ? "completed" : ""}`}>
      <div className="todo-content">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="todo-checkbox"
          aria-label={`Mark ${todo.title} as ${
            todo.completed ? "incomplete" : "complete"
          }`}
        />
        <div className="todo-details">
          <h3 className="todo-title">{todo.title}</h3>
          <span className="todo-date">Created: {formattedDate}</span>
        </div>
      </div>
      <button
        onClick={() => onDelete(todo.id)}
        className="todo-delete"
        aria-label={`Delete ${todo.title}`}
      >
        ×
      </button>
    </div>
  );
}
