import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { StorageContext } from './context'
import {
  CheckboxStatus,
  Checklist,
  ChecklistId,
  ChecklistTemplate,
} from './interfaces'
import { assert, removeOne } from '../util/util'

interface DataProviderProps {
  templates_storage_key: string
  checklists_storage_key: string
  children: React.ReactNode
}

const StorageProvider: React.FC<DataProviderProps> = (props) => {
  const [allTemplates, setTemplates] = useState<ChecklistTemplate[]>([])
  const [checklists, setChecklists] = useState<Checklist[]>([])

  function getChecklistById(checklistId: ChecklistId): Checklist {
    const checklist = checklists.filter(
      (checklist) => checklist.id === checklistId,
    )
    assert(
      checklist.length === 1,
      `Expected one match, found: ${JSON.stringify(checklist, null, 2)}`,
    )
    return checklist[0]
  }

  function getTemplateById(templateId: string): ChecklistTemplate {
    const template = allTemplates.filter(
      (template) => template.id === templateId,
    )
    assert(
      template.length === 1,
      `Expected one match, found: ${JSON.stringify(template, null, 2)}`,
    )
    return template[0]
  }

  function getTemplateExists(templateId: string): boolean {
    const template = allTemplates.filter(
      (template) => template.id === templateId,
    )
    assert(
      template.length < 2,
      `Expected zero or one match, found: ${JSON.stringify(template, null, 2)}`,
    )
    return template.length === 1
  }

  // Load data from async storage
  async function fetchData() {
    try {
      const storedTemplates = await AsyncStorage.getItem(
        props.templates_storage_key,
      )
      if (storedTemplates) {
        const parsedJSON = JSON.parse(storedTemplates)
        setTemplates(parsedJSON)
      }
    } catch (error) {
      console.error('Error retrieving data from async storage:', error)
    }

    try {
      const storedChecklists = await AsyncStorage.getItem(
        props.checklists_storage_key,
      )
      if (storedChecklists) {
        const parsedJSON = JSON.parse(storedChecklists)
        setChecklists(parsedJSON)
      }
    } catch (error) {
      console.error('Error retrieving data from async storage:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  async function saveTemplates(updatedTemplates: ChecklistTemplate[]) {
    try {
      AsyncStorage.setItem(
        props.templates_storage_key,
        JSON.stringify(updatedTemplates),
      )
      setTemplates(updatedTemplates)
    } catch (error) {
      console.error('Error saving data to async storage', error)
    }
  }

  async function removeTemplate(id: string): Promise<ChecklistTemplate[]> {
    const retainedTemplates = removeOne(
      allTemplates,
      (template) => template.id === id,
    )
    await saveTemplates(retainedTemplates)
    return retainedTemplates
  }

  async function removeChecklist(id: string) {
    const retainedChecklists = await removeOne(
      checklists,
      (checklist) => checklist.id === id,
    )
    saveChecklists(retainedChecklists)
  }

  async function saveChecklist(newChecklist: Checklist) {
    const withoutNew = checklists.filter((c) => c.id !== newChecklist.id)
    saveChecklists([...withoutNew, newChecklist])
  }

  async function saveChecklists(updatedChecklists: Checklist[]) {
    try {
      AsyncStorage.setItem(
        props.checklists_storage_key,
        JSON.stringify(updatedChecklists),
      )
      setChecklists(updatedChecklists)
    } catch (error) {
      console.error('Error saving data to async storage', error)
    }
  }

  async function toggleCheck(checklistId: string, checkboxId: string) {
    const targetChecklist = getChecklistById(checklistId)
    const updatedChecklist = { ...targetChecklist }
    updatedChecklist.checkboxes = targetChecklist.checkboxes.map((checkbox) => {
      if (checkbox.id === checkboxId) {
        const newChecked =
          checkbox.checked === CheckboxStatus.checked
            ? CheckboxStatus.unchecked
            : CheckboxStatus.checked
        const newCheckbox = { ...checkbox }
        newCheckbox.checked = newChecked
        return newCheckbox
      } else {
        return checkbox
      }
    })

    saveChecklists([
      ...checklists.filter((checklist) => checklist.id !== checklistId),
      updatedChecklist,
    ])
  }

  async function saveTemplate(template: ChecklistTemplate) {
    saveNewTemplates([template])
  }

  async function saveNewTemplates(newTemplates: ChecklistTemplate[]) {
    const newTemplateIds = new Set(newTemplates.map((template) => template.id))
    const templatesWithoutCurrent = allTemplates.filter(
      (t) => !newTemplateIds.has(t.id),
    )
    templatesWithoutCurrent.push(...newTemplates)
    await saveTemplates(templatesWithoutCurrent)
  }

  async function resetChecklist(checklistId: ChecklistId) {
    const checklist = getChecklistById(checklistId)
    const updatedChecklist = { ...checklist }
    updatedChecklist.checkboxes = updatedChecklist.checkboxes.map(
      (checkbox) => {
        return {
          id: checkbox.id,
          label: checkbox.label,
          checked: CheckboxStatus.unchecked,
        }
      },
    )
    saveChecklists([
      ...checklists.filter((checklist) => checklist.id !== checklistId),
      updatedChecklist,
    ])
    // saveChecklist(updatedChecklist)
  }

  function isChecklistDone(checklistId: ChecklistId): boolean {
    const checklist = getChecklistById(checklistId)
    return !checklist.checkboxes.some(
      (checkbox) => checkbox.checked === CheckboxStatus.unchecked,
    )
  }

  return (
    <StorageContext.Provider
      value={{
        getTemplateById,
        getTemplateExists,
        templates: allTemplates,
        saveTemplate,
        saveNewTemplates,
        removeTemplate,

        getChecklistById,
        checklists,
        saveChecklist,
        removeChecklist,

        toggleCheck,
        resetChecklist,
        isChecklistDone,
      }}>
      {props.children}
    </StorageContext.Provider>
  )
}

export { StorageProvider }
