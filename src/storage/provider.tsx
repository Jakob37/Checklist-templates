import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { helloWorld } from '@minimalist_tools/library'
import { StorageContext } from './context'
import { Checklist, ChecklistTemplate } from './interfaces'

interface DataProviderProps {
  templates_storage_key: string
  checklists_storage_key: string
  children: React.ReactNode
}

const StorageProvider: React.FC<DataProviderProps> = props => {
  const [templates, setTemplates] = useState<ChecklistTemplate[]>([])
  const [checklists, setChecklists] = useState<Checklist[]>([])

  // Load data from async storage
  const fetchData = async () => {
    try {
      const storedData = await AsyncStorage.getItem(props.templates_storage_key)
      if (storedData) {
        setTemplates(JSON.parse(storedData))
      }
    } catch (error) {
      console.log('Error retrieving data from async storage:', error)
    }
  }

  useEffect(() => {
    console.log('Local storage function')
    helloWorld()
    fetchData()
  }, [])

  const saveTemplates = async (updatedTemplates: ChecklistTemplate[]) => {
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

  const saveChecklists = async (updatedChecklists: Checklist[]) => {
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

  return (
    <StorageContext.Provider
      value={{
        templates: templates,
        saveTemplates: saveTemplates,
        checklists: checklists,
        saveChecklists: saveChecklists,
      }}>
      {props.children}
    </StorageContext.Provider>
  )
}

export { StorageProvider }
