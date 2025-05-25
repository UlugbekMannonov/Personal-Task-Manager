import React from "react";
import { Todo as TodoType } from "../types/Todo";
import "./Todo.css";

interface TodoProps {
  todo: TodoType;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const Todo: React.FC<TodoProps> = ({ todo, onToggle, onDelete }) => {
  const handleToggle = () => {
    onToggle(todo.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(todo.id);
  };

  return (
    <div className={`todo-item ${todo.completed ? "completed" : ""}`}>
      <label className="todo-label">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          className="todo-checkbox"
        />
        <span className="todo-title">{todo.title}</span>
      </label>
      <button
        onClick={handleDelete}
        className="delete-button"
        aria-label="Delete todo"
      >
        ×
      </button>
    </div>
  );
};
