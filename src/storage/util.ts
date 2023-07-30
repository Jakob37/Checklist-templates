import { generateId } from '../util/util'
import {
  CheckboxStatus,
  Checklist,
  ChecklistTemplate,
  Task,
  TaskStack,
} from './interfaces'

function buildTemplateObject(
  templateId: string,
  templateName: string,
  taskLabels: string[],
): ChecklistTemplate {
  const tasks: Task[] = taskLabels.map((label, i) => {
    return {
      id: generateId(`task-${i}`),
      label,
    }
  })

  const stackId = generateId(`stack-1`)
  const stack: TaskStack = {
    id: stackId,
    label: 'default',
    tasks,
  }
  const stacks: TaskStack[] = [stack]

  return {
    id: templateId,
    label: templateName,
    stacks,
  }
}

function instantiateTemplate(template: ChecklistTemplate): Checklist {
  const checkboxes = template.stacks.flatMap((stack) => {
    return stack.tasks.map((task, i) => {
      return {
        id: generateId(`checkbox-${i}`),
        label: task.label,
        checked: CheckboxStatus.unchecked,
      }
    })
  })

  const newChecklist: Checklist = {
    id: generateId('checklist'),
    template: template,
    checkboxes,
  }
  return newChecklist
}

export { buildTemplateObject, instantiateTemplate }