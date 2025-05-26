import React, { useState, useRef, useEffect } from "react";
import { type Todo as TodoType, type Priority, type Tag } from "../types/Todo";
import { TagManager } from "./TagManager";
import "./Todo.css";

interface TodoProps {
  todo: TodoType;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newTitle: string) => void;
  onPriorityChange: (id: string, newPriority: Priority) => void;
  onTagsChange: (id: string, newTags: Tag[]) => void;
  onDueDateChange: (id: string, newDueDate: string | null) => void;
  availableTags: Tag[];
  onCreateTag?: (name: string) => void;
}

const priorityOptions: Priority[] = ["high", "medium", "low"];

// Helper function to format dates as dd/mm/yyyy
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Helper function to parse dd/mm/yyyy to ISO string
const parseDate = (dateString: string): string => {
  const [day, month, year] = dateString.split("/");
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  // Set time to noon to avoid timezone issues
  date.setHours(12, 0, 0, 0);
  return date.toISOString();
};

export function Todo({
  todo,
  onToggle,
  onDelete,
  onEdit,
  onPriorityChange,
  onTagsChange,
  onDueDateChange,
  availableTags,
  onCreateTag,
}: TodoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.title);
  const [isManagingTags, setIsManagingTags] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const tagsPopupRef = useRef<HTMLDivElement>(null);

  const formattedCreatedDate = formatDate(todo.createdAt);
  const formattedDueDate = todo.dueDate ? formatDate(todo.dueDate) : null;

  const isDueDatePassed = todo.dueDate
    ? new Date(todo.dueDate) < new Date()
    : false;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isManagingTags &&
        tagsPopupRef.current &&
        !tagsPopupRef.current.contains(event.target as Node)
      ) {
        setIsManagingTags(false);
      }
    };

    if (isManagingTags) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isManagingTags]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedValue = editValue.trim();
    if (trimmedValue && trimmedValue !== todo.title) {
      onEdit(todo.id, trimmedValue);
    } else {
      setEditValue(todo.title);
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

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) {
      onDueDateChange(todo.id, null);
      return;
    }

    // Convert yyyy-mm-dd to dd/mm/yyyy then to ISO
    const [year, month, day] = e.target.value.split("-");
    const formattedDate = `${day}/${month}/${year}`;
    const isoString = parseDate(formattedDate);
    onDueDateChange(todo.id, isoString);
  };

  // Convert stored ISO date to yyyy-mm-dd for input
  const getInputDateValue = () => {
    if (!todo.dueDate) return "";
    const date = new Date(todo.dueDate);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  return (
    <div
      className={`todo ${todo.completed ? "completed" : ""} priority-${
        todo.priority
      } ${isDueDatePassed ? "overdue" : ""}`}
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
              <div className="todo-header">
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
                <button
                  className="manage-tags-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsManagingTags(!isManagingTags);
                  }}
                  aria-label="Manage tags"
                  aria-expanded={isManagingTags}
                >
                  #
                </button>
              </div>
              <div className="todo-meta">
                <span className="todo-date">
                  Created: {formattedCreatedDate}
                </span>
                <div className="todo-due-date">
                  <input
                    type="date"
                    value={getInputDateValue()}
                    onChange={handleDueDateChange}
                    className={`due-date-input ${
                      isDueDatePassed ? "overdue" : ""
                    }`}
                    aria-label="Set due date"
                  />
                  {formattedDueDate && (
                    <span
                      className={`due-date-display ${
                        isDueDatePassed ? "overdue" : ""
                      }`}
                    >
                      Due: {formattedDueDate}
                    </span>
                  )}
                </div>
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
              {todo.tags.length > 0 && (
                <div className="todo-tags">
                  {todo.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="todo-tag"
                      style={
                        { "--tag-color": tag.color } as React.CSSProperties
                      }
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
            </>
          )}
          {isManagingTags && (
            <>
              <div
                className="tags-popup-backdrop"
                onClick={() => setIsManagingTags(false)}
              />
              <div className="tags-popup" ref={tagsPopupRef}>
                <TagManager
                  availableTags={availableTags}
                  selectedTags={todo.tags}
                  onTagsChange={(tags) => onTagsChange(todo.id, tags)}
                  onCreateTag={onCreateTag}
                />
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
