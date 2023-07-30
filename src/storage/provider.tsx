import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { StorageContext } from './context'
import {
  CheckboxStatus,
  Checklist,
  ChecklistId,
  ChecklistTemplate,
  TemplateId,
} from './interfaces'
import { assert, printObject, removeAtIndex, removeOne } from '../util/util'

interface DataProviderProps {
  templates_storage_key: string
  checklists_storage_key: string
  children: React.ReactNode
}

const StorageProvider: React.FC<DataProviderProps> = (props) => {
  const [templates, setTemplates] = useState<ChecklistTemplate[]>([])
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
    const template = templates.filter((template) => template.id === templateId)
    assert(
      template.length === 1,
      `Expected one match, found: ${JSON.stringify(template, null, 2)}`,
    )
    return template[0]
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
        // console.log(`Loaded templates: ${JSON.stringify(parsedJSON, null, 2)}`)
      }
    } catch (error) {
      console.log('Error retrieving data from async storage:', error)
    }

    try {
      const storedChecklists = await AsyncStorage.getItem(
        props.checklists_storage_key,
      )
      if (storedChecklists) {
        const parsedJSON = JSON.parse(storedChecklists)
        setChecklists(parsedJSON)
        // setChecklists(JSON.parse(storedChecklists))
        // console.log(`Loaded checklists: ${JSON.stringify(parsedJSON, null, 2)}`)
      }
    } catch (error) {
      console.log('Error retrieving data from async storage:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  async function saveTemplates(updatedTemplates: ChecklistTemplate[]) {
    try {
      await AsyncStorage.setItem(
        props.templates_storage_key,
        JSON.stringify(updatedTemplates),
      )
      setTemplates(updatedTemplates)
    } catch (error) {
      console.log('Error saving data to async storage', error)
    }
  }

  async function removeTemplate(id: string): Promise<ChecklistTemplate[]> {
    console.log('Attempting to remove template with ID', id)
    console.log('Length before', templates.length)
    const retainedTemplates = removeOne(
      templates,
      (template) => template.id === id,
    )
    console.log('Length after', retainedTemplates.length)
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
    removeChecklist(newChecklist.id)
    saveChecklists([...checklists, newChecklist])
  }

  async function saveChecklists(updatedChecklists: Checklist[]) {
    try {
      await AsyncStorage.setItem(
        props.checklists_storage_key,
        JSON.stringify(updatedChecklists),
      )
      setChecklists(updatedChecklists)
    } catch (error) {
      console.log('Error saving data to async storage', error)
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
    const templateAfterRemove = await removeTemplate(template.id)
    // const updatingTemplates = [...templates]
    templateAfterRemove.push(template)
    printObject(templateAfterRemove)
    await saveTemplates(templateAfterRemove)
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
        templates,
        saveTemplate,
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
