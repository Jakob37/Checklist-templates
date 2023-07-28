import { createContext } from 'react'
import {
  CheckboxId,
  Checklist,
  ChecklistId,
  ChecklistTemplate,
  TemplateId,
} from './interfaces'

const PLACEHOLDER_ERROR = 'This placeholder should not be called'

// FIXME: Better understand this
const StorageContext = createContext<{
  templates: ChecklistTemplate[]
  checklists: Checklist[]
  removeTemplate: (id: TemplateId) => void
  removeChecklist: (id: ChecklistId) => void
  saveChecklist: (checklist: Checklist) => void
  toggleCheck: (checklistId: ChecklistId, checkboxId: CheckboxId) => void
  saveTemplate: (template: ChecklistTemplate) => void
  resetChecklist: (checklistId: ChecklistId) => void
  isChecklistDone: (checklistId: ChecklistId) => boolean
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
  resetChecklist: (_checklist) => {
    console.error(PLACEHOLDER_ERROR)
  },
  isChecklistDone: (_checklistId) => {
    console.error(PLACEHOLDER_ERROR)
    return false
  },
})

export { StorageContext }
