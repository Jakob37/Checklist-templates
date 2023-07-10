import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Task } from 'react-native'
import { helloWorld } from '@minimalist_tools/library'
import { StorageContext } from './context'

interface DataProviderProps {
  storage_key: string
  children: React.ReactNode
}

const StorageProvider: React.FC<DataProviderProps> = props => {
  const [entries, setEntries] = useState<Task[]>([])

  // Load data from async storage
  const fetchData = async () => {
    try {
      const storedData = await AsyncStorage.getItem(props.storage_key)
      if (storedData) {
        setEntries(JSON.parse(storedData))
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

  const saveEntries = async (updatedData: Task[]) => {
    try {
      await AsyncStorage.setItem(props.storage_key, JSON.stringify(updatedData))
      setEntries(updatedData)
    } catch (error) {
      console.log('Error saving data to async storage', error)
    }
  }

  return (
    <StorageContext.Provider value={{ entries, saveEntries }}>
      {props.children}
    </StorageContext.Provider>
  )
}

export { StorageProvider }
