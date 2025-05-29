import { useMemo } from "react";
import type { Todo } from "../types/Todo";
import "./Statistics.css";

interface StatisticsProps {
  todos: Todo[];
}

export function Statistics({ todos }: StatisticsProps) {
  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((todo) => todo.completed).length;
    const active = total - completed;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    const priorities = {
      high: todos.filter((todo) => todo.priority === "high").length,
      medium: todos.filter((todo) => todo.priority === "medium").length,
      low: todos.filter((todo) => todo.priority === "low").length,
    };

    const now = new Date();
    const dueSoon = todos.filter((todo) => {
      if (!todo.dueDate || todo.completed) return false;
      const dueDate = new Date(todo.dueDate);
      const daysUntilDue = Math.ceil(
        (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysUntilDue >= 0 && daysUntilDue <= 3;
    }).length;

    const overdue = todos.filter((todo) => {
      if (!todo.dueDate || todo.completed) return false;
      const dueDate = new Date(todo.dueDate);
      return dueDate < now;
    }).length;

    return {
      total,
      completed,
      active,
      completionRate,
      priorities,
      dueSoon,
      overdue,
    };
  }, [todos]);

  return (
    <div className="statistics">
      <h2 className="statistics-title">Task Statistics</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <h3>Progress</h3>
            <span className="stat-percentage">
              {Math.round(stats.completionRate)}%
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${stats.completionRate}%` }}
            />
          </div>
          <div className="stat-details">
            <span>{stats.completed} completed</span>
            <span>{stats.active} active</span>
          </div>
        </div>

        <div className="stat-card">
          <h3>By Priority</h3>
          <div className="priority-bars">
            <div className="priority-bar">
              <span className="priority-label">High</span>
              <div className="bar-container">
                <div
                  className="bar high"
                  style={{
                    width: `${
                      (stats.priorities.high / stats.total) * 100 || 0
                    }%`,
                  }}
                />
              </div>
              <span className="priority-count">{stats.priorities.high}</span>
            </div>
            <div className="priority-bar">
              <span className="priority-label">Medium</span>
              <div className="bar-container">
                <div
                  className="bar medium"
                  style={{
                    width: `${
                      (stats.priorities.medium / stats.total) * 100 || 0
                    }%`,
                  }}
                />
              </div>
              <span className="priority-count">{stats.priorities.medium}</span>
            </div>
            <div className="priority-bar">
              <span className="priority-label">Low</span>
              <div className="bar-container">
                <div
                  className="bar low"
                  style={{
                    width: `${
                      (stats.priorities.low / stats.total) * 100 || 0
                    }%`,
                  }}
                />
              </div>
              <span className="priority-count">{stats.priorities.low}</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <h3>Due Dates</h3>
          <div className="due-dates">
            <div className="due-stat">
              <span className="due-label">Due Soon</span>
              <span className="due-count due-soon">{stats.dueSoon}</span>
            </div>
            <div className="due-stat">
              <span className="due-label">Overdue</span>
              <span className="due-count overdue">{stats.overdue}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
