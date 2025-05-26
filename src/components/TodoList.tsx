import React from "react";
import { type Todo as TodoType, type Priority, type Tag } from "../types/Todo";
import { Todo } from "./Todo";
import "./TodoList.css";

interface TodoListProps {
  todos: TodoType[];
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onEditTodo: (id: string, newTitle: string) => void;
  onPriorityChange: (id: string, newPriority: Priority) => void;
  onTagsChange: (id: string, newTags: Tag[]) => void;
  availableTags: Tag[];
  onCreateTag?: (name: string) => void;
}

export function TodoList({
  todos,
  onToggleTodo,
  onDeleteTodo,
  onEditTodo,
  onPriorityChange,
  onTagsChange,
  availableTags,
  onCreateTag,
}: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="todo-list-empty">
        <p>No tasks yet. Add one to get started!</p>
      </div>
    );
  }

  return (
    <div className="todo-list">
      {todos.map((todo) => (
        <Todo
          key={todo.id}
          todo={todo}
          onToggle={onToggleTodo}
          onDelete={onDeleteTodo}
          onEdit={onEditTodo}
          onPriorityChange={onPriorityChange}
          onTagsChange={onTagsChange}
          availableTags={availableTags}
          onCreateTag={onCreateTag}
        />
      ))}
    </div>
  );
}
