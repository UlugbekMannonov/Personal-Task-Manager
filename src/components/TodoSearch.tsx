import React from "react";
import "./TodoSearch.css";

interface TodoSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function TodoSearch({ searchQuery, onSearchChange }: TodoSearchProps) {
  return (
    <div className="todo-search">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search tasks..."
        className="search-input"
        aria-label="Search tasks"
      />
      {searchQuery && (
        <button
          className="clear-search"
          onClick={() => onSearchChange("")}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
}
