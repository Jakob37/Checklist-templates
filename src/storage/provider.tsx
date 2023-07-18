import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { helloWorld } from '@minimalist_tools/library'
import { StorageContext } from './context'

// FIXME: Shared location for the interfaces
interface ChecklistTemplate {
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

interface DataProviderProps {
  storage_key: string
  children: React.ReactNode
}

const StorageProvider: React.FC<DataProviderProps> = props => {
  const [templates, setTemplates] = useState<ChecklistTemplate[]>([])

  // Load data from async storage
  const fetchData = async () => {
    try {
      const storedData = await AsyncStorage.getItem(props.storage_key)
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
        props.storage_key,
        JSON.stringify(updatedTemplates),
      )
      setTemplates(updatedTemplates)
    } catch (error) {
      console.log('Error saving data to async storage', error)
    }
  }

  return (
    <StorageContext.Provider
      value={{
        templates: templates,
        saveTemplates: saveTemplates,
      }}>
      {props.children}
    </StorageContext.Provider>
  )
}

export { StorageProvider }
