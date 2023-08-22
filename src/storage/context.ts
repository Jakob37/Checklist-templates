import { createContext } from 'react'
import {
  CheckboxId,
  Checklist,
  ChecklistId,
  ChecklistTemplate,
  TemplateId,
} from './interfaces'

const PLACEHOLDER_ERROR = 'This placeholder should not be called'

const StorageContext = createContext<{
  checklists: Checklist[]
  getChecklistById: (id: ChecklistId) => Checklist
  removeChecklist: (id: ChecklistId) => void
  saveChecklist: (checklist: Checklist) => void
  resetChecklist: (checklistId: ChecklistId) => void
  isChecklistDone: (checklistId: ChecklistId) => boolean

  templates: ChecklistTemplate[]
  getTemplateById: (id: TemplateId) => ChecklistTemplate
  removeTemplate: (id: TemplateId) => void
  saveTemplate: (template: ChecklistTemplate) => void

  setCheck: (checklistId: ChecklistId, checkboxId: CheckboxId) => void
}>({
  checklists: [],
  // @ts-ignore
  getChecklistById: (_id) => {
    console.error(PLACEHOLDER_ERROR)
    return null
  },

  templates: [],
  // @ts-ignore
  getTemplateById: (_id) => {
    console.error(PLACEHOLDER_ERROR)
    return null
  },

  removeTemplate: (_id) => {
    console.error(PLACEHOLDER_ERROR)
  },
  removeChecklist: (_id) => {
    console.error(PLACEHOLDER_ERROR)
  },
  saveChecklist: (_checklist) => {},
  setCheck: (_checklistId, _checkboxId) => {
    console.error(PLACEHOLDER_ERROR)
  },
  saveTemplate: async (_template) => {
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
