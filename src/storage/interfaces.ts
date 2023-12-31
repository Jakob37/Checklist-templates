export interface ChecklistTemplate {
  id: string
  label: string
  stacks: TaskStack[]
  favorite: boolean
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

export interface Checklist {
  id: string
  template: ChecklistTemplate
  checkboxes: Checkbox[]
  timecreated: number
}

export interface Checkbox {
  id: string
  label: string
  checked: CheckboxStatus
}

export enum CheckboxStatus {
  'checked',
  'unchecked',
  'removed',
}

export type ChecklistId = string
export type TemplateId = string
export type CheckboxId = string
