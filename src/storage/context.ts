import { createContext } from 'react'
import { Checklist, ChecklistTemplate } from './interfaces'

const PLACEHOLDER_ERROR = 'This placeholder should not be called'

// FIXME: Better understand this
const StorageContext = createContext<{
  templates: ChecklistTemplate[]
  checklists: Checklist[]
  removeTemplate: (id: string) => void
  removeChecklist: (id: string) => void
  saveChecklist: (checklist: Checklist) => void
  toggleCheck: (checklistId: string, checkboxId: string) => void
  saveTemplate: (template: ChecklistTemplate) => void
}>({
  templates: [],
  checklists: [],
  removeTemplate: (_id) => {
    console.error(PLACEHOLDER_ERROR)
  },
  removeChecklist: (_id) => {
    console.error(PLACEHOLDER_ERROR)
  },
  saveChecklist: (_checklist) => {},
  toggleCheck: (_checklistId, _checkboxId) => {
    console.error(PLACEHOLDER_ERROR)
  },
  saveTemplate: (_template) => {
    console.error(PLACEHOLDER_ERROR)
  },
})

export { StorageContext }
