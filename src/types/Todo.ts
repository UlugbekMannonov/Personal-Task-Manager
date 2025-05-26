export type Priority = "high" | "medium" | "low";

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  priority: Priority;
}
