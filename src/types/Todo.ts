export type Priority = "high" | "medium" | "low";

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  dueDate: string | null;
  priority: Priority;
  tags: Tag[];
}
