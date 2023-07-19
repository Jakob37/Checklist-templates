import { createContext } from 'react'
import { Checklist, ChecklistTemplate } from './interfaces'

// FIXME: Better understand this
const StorageContext = createContext<{
  templates: ChecklistTemplate[]
  saveTemplates: (templates: ChecklistTemplate[]) => void
  checklists: Checklist[]
  saveChecklists: (checklists: Checklist[]) => void
}>({
  templates: [],
  saveTemplates: _templates => {
    console.error('This placeholder should not be called')
  },
  checklists: [],
  saveChecklists: _checklists => {
    console.error('This placeholder should not be called')
  },
})

export { StorageContext }
