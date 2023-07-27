import { createContext } from 'react'
import { Checklist, ChecklistTemplate } from './interfaces'

const PLACEHOLDER_ERROR = 'This placeholder should not be called'

// FIXME: Better understand this
const StorageContext = createContext<{
  templates: ChecklistTemplate[]
  saveTemplates: (templates: ChecklistTemplate[]) => void
  checklists: Checklist[]
  saveChecklists: (checklists: Checklist[]) => void
  removeTemplate: (id: string) => void
  removeChecklist: (id: string) => void
  createChecklist: (checklist: Checklist) => void
  toggleCheck: (checklistId: string, checkboxId: string) => void
  createTemplate: (template: ChecklistTemplate) => void
}>({
  templates: [],
  saveTemplates: (_templates) => {
    console.error(PLACEHOLDER_ERROR)
  },
  checklists: [],
  saveChecklists: (_checklists) => {
    console.error(PLACEHOLDER_ERROR)
  },
  removeTemplate: (_id) => {
    console.error(PLACEHOLDER_ERROR)
  },
  removeChecklist: (_id) => {
    console.error(PLACEHOLDER_ERROR)
  },
  createChecklist: (_checklist) => {},
  toggleCheck: (_checklistId, _checkboxId) => {
    console.error(PLACEHOLDER_ERROR)
  },
  createTemplate: (_template) => {
    console.error(PLACEHOLDER_ERROR)
  },
})

export { StorageContext }
