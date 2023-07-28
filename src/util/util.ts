import { ChecklistTemplate } from '../storage/interfaces'

function generateId(type: string): string {
  return `${type}-${String(Date.now())}`
}

function makeDummyTemplate(templateName: string): ChecklistTemplate {
  return {
    // FIXME: ID function
    id: `template-${String(Date.now())}`,
    label: templateName,
    // FIXME: Include the tasks
    stacks: [
      {
        id: `stack-${String(Date.now())}`,
        label: 'Default',
        tasks: [
          {
            id: `task-${String(Date.now())}-1`,
            label: 'Dummy task 1',
          },
          {
            id: `task-${String(Date.now())}-2`,
            label: 'Dummy task 2',
          },
        ],
      },
    ],
  }
}

function assert(logic: boolean, message: string): void {
  if (!logic) {
    console.error(message)
  }
}

function removeAtIndex<T>(arr: T[], index: number): T[] {
  return arr.filter((_element, i) => i !== index)
}

function removeOne<T>(
  arr: T[],
  toRemove: (val: T) => boolean,
  warnIfMissing: boolean = false,
): T[] {
  const indicesToRemove = []
  for (let i = 0; i < arr.length; i++) {
    if (toRemove(arr[i])) {
      indicesToRemove.push(i)
    }
  }
  if (warnIfMissing) {
    assert(
      indicesToRemove.length === 1,
      `Expected to find only one element to remove, found indices ${
        indicesToRemove.length > 0 ? indicesToRemove : 'none'
      }`,
    )
  }
  return removeAtIndex(arr, indicesToRemove[0])
}

function printObject(obj: {}): void {
  console.log(JSON.stringify(obj, null, 2))
}

export {
  generateId,
  makeDummyTemplate,
  assert,
  removeAtIndex,
  removeOne,
  printObject,
}
