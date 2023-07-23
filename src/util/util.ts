function generateId(type: string) {
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

export { generateId, makeDummyTemplate }
