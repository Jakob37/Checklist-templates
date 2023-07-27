import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { StorageContext } from './context'
import { CheckboxStatus, Checklist, ChecklistTemplate } from './interfaces'
import { assert } from '../util/util'

interface DataProviderProps {
  templates_storage_key: string
  checklists_storage_key: string
  children: React.ReactNode
}

const StorageProvider: React.FC<DataProviderProps> = (props) => {
  const [templates, setTemplates] = useState<ChecklistTemplate[]>([])
  const [checklists, setChecklists] = useState<Checklist[]>([])

  // Load data from async storage
  const fetchData = async () => {
    try {
      const storedTemplates = await AsyncStorage.getItem(
        props.templates_storage_key,
      )
      if (storedTemplates) {
        const parsedJSON = JSON.parse(storedTemplates)
        setTemplates(parsedJSON)
        console.log(`Loaded templates: ${JSON.stringify(parsedJSON, null, 2)}`)
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
        console.log(`Loaded checklists: ${JSON.stringify(parsedJSON, null, 2)}`)
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

  async function removeTemplate(id: string) {
    const retainedTemplates = templates.filter((template) => template.id !== id)
    saveTemplates(retainedTemplates)
  }

  async function removeChecklist(id: string) {
    const retainedChecklists = checklists.filter(
      (checklist) => checklist.id !== id,
    )
    saveTemplates(retainedChecklists)
  }

  async function createChecklist(newChecklist: Checklist) {
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
    const targetChecklist = checklists.filter(
      (checklist) => checklist.id === checklistId,
    )
    assert(targetChecklist.length === 1, 'One checklist expected')

    const updatedChecklist = { ...targetChecklist[0] }
    updatedChecklist.checkboxes = targetChecklist[0].checkboxes.map(
      (checkbox) => {
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
      },
    )

    saveChecklists([
      ...checklists.filter((checklist) => checklist.id !== checklistId),
      updatedChecklist,
    ])
  }

  async function createTemplate(template: ChecklistTemplate) {
    const updatingTemplates = [...templates]
    updatingTemplates.push(template)
    saveTemplates(updatingTemplates)
  }

  return (
    <StorageContext.Provider
      value={{
        templates,
        saveTemplates,
        checklists,
        saveChecklists,
        removeTemplate,
        createChecklist,
        toggleCheck,
        removeChecklist,
        createTemplate,
      }}>
      {props.children}
    </StorageContext.Provider>
  )
}

export { StorageProvider }
