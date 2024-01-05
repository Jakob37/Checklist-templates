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

function makeLeavingHomeExampleTemplate(): ChecklistTemplate {
  const id = generateId('template')
  const templateName = "Leaving home (example)"
  const isFavorite = false
  const taskLabels = ["Keys", "Wallet", "Phone", "Laptop", "Gloves"]
  return buildTemplateObject(id, templateName, isFavorite, taskLabels)
}

function makeBeforeSleepExampleTemplate() {
  const id = generateId('template')
  const templateName = "Before sleep (example)"
  const isFavorite = false
  const taskLabels = ["Dim lights", "Brush teeth", "Pack tomorrow's things", "Put aside the phone"]
  return buildTemplateObject(id, templateName, isFavorite, taskLabels)
}

function makeBeforeSocialExampleTemplate() {
  const id = generateId('template')
  const templateName = "Before social (example)"
  const isFavorite = false
  const taskLabels = [
    "Be mindful for a moment",
    "Relax tensions",
    "Think about the person(s)",
    "Picture them",
    "Find three touching points",
    "Be present"
  ]
  return buildTemplateObject(id, templateName, isFavorite, taskLabels)
}

function buildTemplateObject(
  templateId: string,
  templateName: string,
  isFavorite: boolean,
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

  // const additionalStacks: TaskStack[] = additionalStacksData.map(
  //   (stackData, i) => {
  //     return {
  //       id: generateId(`Stack-${i}`),
  //       label: stackData.label,
  //       tasks: stackData.tasks.map((task, i) => {
  //         return {
  //           id: generateId(`task-${i}`),
  //           label: task,
  //         }
  //       }),
  //     }
  //   },
  // )

  const stacks: TaskStack[] = [stack]
  // const stacks: TaskStack[] = [stack, ...additionalStacks]

  return {
    id: templateId,
    label: templateName,
    stacks,
    favorite: isFavorite,
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

export { buildTemplateObject, instantiateTemplate, makeLeavingHomeExampleTemplate, makeBeforeSocialExampleTemplate, makeBeforeSleepExampleTemplate }
