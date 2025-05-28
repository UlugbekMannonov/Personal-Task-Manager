import React from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
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
  onReorderTodos: (startIndex: number, endIndex: number) => void;
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
  onReorderTodos,
  availableTags,
  onCreateTag,
}: TodoListProps) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    onReorderTodos(sourceIndex, destinationIndex);
  };

  if (todos.length === 0) {
    return (
      <div className="todo-list-empty">
        <p>No tasks yet. Add one to get started!</p>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="todo-list">
        {(provided) => (
          <div
            className="todo-list"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {todos.map((todo, index) => (
              <Draggable key={todo.id} draggableId={todo.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`todo-draggable ${
                      snapshot.isDragging ? "dragging" : ""
                    }`}
                  >
                    <Todo
                      todo={todo}
                      onToggle={onToggleTodo}
                      onDelete={onDeleteTodo}
                      onEdit={onEditTodo}
                      onPriorityChange={onPriorityChange}
                      onTagsChange={onTagsChange}
                      availableTags={availableTags}
                      onCreateTag={onCreateTag}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
