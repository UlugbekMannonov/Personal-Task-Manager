import { Task } from "../types/Task";
import "./TaskList.css";

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export function TaskList({ tasks, onToggleTask, onDeleteTask }: TaskListProps) {
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li
          key={task.id}
          className={`task-item ${task.completed ? "completed" : ""}`}
        >
          <label className="task-label">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleTask(task.id)}
              className="task-checkbox"
            />
            <span className="task-title">{task.title}</span>
          </label>
          <button
            onClick={() => onDeleteTask(task.id)}
            className="delete-button"
            aria-label="Delete task"
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  );
}
