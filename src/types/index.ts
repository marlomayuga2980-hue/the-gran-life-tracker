export interface Task {
  id: string;
  title: string;
  description: string;
  phase: string;
  tag: string;
  status: string;
  steps: string; // JSON string of string[]
  notes: string | null;
  updatedAt: string;
  createdAt: string;
  timeEntries?: TimeEntry[];
}

export interface TimeEntry {
  id: string;
  taskId: string;
  hours: number;
  date: string;
  weekStart: string;
  notes: string | null;
  createdAt: string;
  task?: Pick<Task, "id" | "title" | "tag">;
}

export interface TaskFormData {
  title: string;
  description: string;
  phase: string;
  tag: string;
  status: string;
  steps: string[]; // array in form, serialized to JSON on save
  notes: string;
}
