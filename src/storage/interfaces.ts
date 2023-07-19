export interface ChecklistTemplate {
  id: string
  label: string
  stacks: TaskStack[]
}

export interface TaskStack {
  id: string
  label: string
  tasks: Task[]
}

export interface Task {
  id: string
  label: string
}
