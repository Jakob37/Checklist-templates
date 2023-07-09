import type { PropsWithChildren } from 'react'
import { useEffect, useState } from 'react'
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { IconButton } from './src/views/iconbutton'
import { ds } from './src/ux/design'
import { icons } from './src/ux/icons'

import {
  helloWorld,
  helloWorld2,
  HelloWorldView,
  loadDataFromStorage,
} from '@minimalist_tools/library'
// import { AsyncStorage } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import React from 'react'

const STORAGE_KEY = '@checklists/storage'

type SectionProps = PropsWithChildren<{
  title: string
}>

interface Task {
  id: string
  title: string
}

const StorageContext = React.createContext<{
  entries: Object[]
  saveEntries: (entries: Object[]) => void
}>({
  entries: [],
  saveEntries: _entries => {
    console.error('This placeholder should not be called')
  },
})

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
  const [task, setTask] = useState('')
  const [tasks, setTasks] = useState<Task[]>([])

  const handleAddTask = () => {
    helloWorld()
    console.log(task)
    if (task !== '') {
      const newTask: Task = {
        id: String(Date.now()),
        title: task,
      }
      setTasks([...tasks, newTask])
      setTask('')
    }
  }

  const handleRemoveTask = (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id)
    setTasks(updatedTasks)
  }

  const handleLoad = () => {
    console.log('Loading')
    loadDataFromStorage(STORAGE_KEY, (entries: any[]) => {
      console.log('Loaded', entries)
    })
  }

  return (
    <StorageProviderLocal storage_key={STORAGE_KEY}>
      <View>
        <Text>Checklist</Text>
        <HelloWorldView />
        <View>
          <TextInput
            placeholder="Enter..."
            value={task}
            onChangeText={text => setTask(text)}></TextInput>
        </View>
        <Button title="Add" onPress={handleAddTask}></Button>
        <Button title="Load" onPress={handleLoad}></Button>
        <FlatList
          data={tasks}
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontSize: ds.font.sizes.topBar }}>
                {item.title}
              </Text>
              <IconButton
                onPress={() => {
                  handleRemoveTask(item.id)
                }}
                icon={icons.trash}
                size={ds.font.sizes.topBar}
                color="white"></IconButton>
            </View>
          )}></FlatList>
      </View>
    </StorageProviderLocal>
  )
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
})

export default App
