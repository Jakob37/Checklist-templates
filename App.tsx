import { useEffect, useState } from 'react'
import { helloWorld, helloWorld2 } from '@minimalist_tools/library'
import AsyncStorage from '@react-native-async-storage/async-storage'
import React from 'react'
import Main from './src/screens/main'
import { STORAGE_KEY } from './src/storage/storage'
import { StorageContext } from './src/storage/context'

interface DataProviderProps {
  storage_key: string
  children: React.ReactNode
}

const StorageProviderLocal: React.FC<DataProviderProps> = props => {
  const [entries, setEntries] = useState<Object[]>([])

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
    helloWorld2()
    fetchData()
  }, [])

  const saveEntries = async (updatedData: Object[]) => {
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

function App(): JSX.Element {
  return (
    <StorageProviderLocal storage_key={STORAGE_KEY}>
      <Main></Main>
    </StorageProviderLocal>
  )
}

export default App
