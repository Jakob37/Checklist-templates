import { generateId } from '../util/util'
import {
  CheckboxStatus,
  Checklist,
  ChecklistTemplate,
  Task,
  TaskStack,
} from './interfaces'

type TaskData = {
  label: string
  tasks: string[]
}

function buildTemplateObject(
  templateId: string,
  templateName: string,
  taskLabels: string[],
  additionalStacksData: TaskData[],
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

  const additionalStacks: TaskStack[] = additionalStacksData.map(
    (stackData, i) => {
      return {
        id: generateId(`Stack-${i}`),
        label: stackData.label,
        tasks: stackData.tasks.map((task, i) => {
          return {
            id: generateId(`task-${i}`),
            label: task,
          }
        }),
      }
    },
  )

  const stacks: TaskStack[] = [stack, ...additionalStacks]

  return {
    id: templateId,
    label: templateName,
    stacks,
    favorite: false,
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
    timecreated: Date.now(),
  }
  return newChecklist
}

export { buildTemplateObject, instantiateTemplate }
