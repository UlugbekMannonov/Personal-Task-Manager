import "./TodoFilter.css";

export type FilterStatus = "all" | "active" | "completed";

interface TodoFilterProps {
  currentFilter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  todoCount: {
    all: number;
    active: number;
    completed: number;
  };
}

export function TodoFilter({
  currentFilter,
  onFilterChange,
  todoCount,
}: TodoFilterProps) {
  const filters: { value: FilterStatus; label: string }[] = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
  ];

  return (
    <div className="todo-filter">
      <div className="filter-buttons">
        {filters.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onFilterChange(value)}
            className={`filter-button ${
              currentFilter === value ? "active" : ""
            }`}
            aria-pressed={currentFilter === value}
          >
            {label}
            <span className="todo-count">{todoCount[value]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
