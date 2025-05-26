import React from "react";
import { type Todo as TodoType } from "../types/Todo";
import { Todo } from "./Todo";
import "./TodoList.css";

interface TodoListProps {
  todos: TodoType[];
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
}

export function TodoList({ todos, onToggleTodo, onDeleteTodo }: TodoListProps) {
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
        />
      ))}
    </div>
  );
}
