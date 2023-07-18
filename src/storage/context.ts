import { createContext } from 'react'

interface Template {
  id: string
  label: string
  stacks: TaskStack[]
}

interface TaskStack {
  id: string
  label: string
  tasks: Task[]
}

interface Task {
  id: string
  label: string
}

const StorageContext = createContext<{
  templates: Template[]
  saveTemplates: (templates: Template[]) => void
}>({
  templates: [],
  saveTemplates: _templates => {
    console.error('This placeholder should not be called')
  },
})

export { StorageContext }
