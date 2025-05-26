import React, { useState, useRef, useEffect } from "react";
import { type Todo as TodoType, type Priority } from "../types/Todo";
import "./Todo.css";

interface TodoProps {
  todo: TodoType;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newTitle: string) => void;
  onPriorityChange: (id: string, newPriority: Priority) => void;
}

const priorityOptions: Priority[] = ["high", "medium", "low"];

export function Todo({
  todo,
  onToggle,
  onDelete,
  onEdit,
  onPriorityChange,
}: TodoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const formattedDate = new Date(todo.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedValue = editValue.trim();
    if (trimmedValue && trimmedValue !== todo.title) {
      onEdit(todo.id, trimmedValue);
    } else {
      setEditValue(todo.title); // Reset to original if empty or unchanged
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setEditValue(todo.title);
      setIsEditing(false);
    }
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onPriorityChange(todo.id, e.target.value as Priority);
  };

  return (
    <div
      className={`todo ${todo.completed ? "completed" : ""} priority-${
        todo.priority
      }`}
    >
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
          {isEditing ? (
            <form onSubmit={handleSubmit} className="todo-edit-form">
              <input
                ref={inputRef}
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleSubmit}
                className="todo-edit-input"
                aria-label="Edit todo title"
              />
            </form>
          ) : (
            <>
              <h3
                className="todo-title"
                onClick={() => setIsEditing(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setIsEditing(true);
                  }
                }}
                aria-label={`Edit ${todo.title}`}
              >
                {todo.title}
              </h3>
              <div className="todo-meta">
                <span className="todo-date">Created: {formattedDate}</span>
                <select
                  value={todo.priority}
                  onChange={handlePriorityChange}
                  className={`todo-priority priority-${todo.priority}`}
                  aria-label="Task priority"
                >
                  {priorityOptions.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
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
