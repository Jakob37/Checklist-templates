import { generateId } from '../util/util'
import { ChecklistTemplate, Task, TaskStack } from './interfaces'

function makeTemplate(
  templateName: string,
  taskLabels: string[],
): ChecklistTemplate {
  const templateId = generateId('template')

  const tasks: Task[] = taskLabels.map((label) => {
    return {
      id: generateId('task'),
      label,
    }
  })

  const stackId = generateId('stack')
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

export { makeTemplate as buildTemplateObject }
