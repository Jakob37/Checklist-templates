import type { PropsWithChildren } from 'react'
import React, { useState } from 'react'
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

import { StorageProvider } from '@minimalist_tools/library'

type SectionProps = PropsWithChildren<{
  title: string
}>

interface Task {
  id: string
  title: string
}

function App(): JSX.Element {
  const [task, setTask] = useState('')
  const [tasks, setTasks] = useState<Task[]>([])

  const handleAddTask = () => {
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

  return (
    <StorageProvider>
      <View>
        <Text>Checklist</Text>
        <View>
          <TextInput
            placeholder="Enter..."
            value={task}
            onChangeText={text => setTask(text)}></TextInput>
        </View>
        <Button title="Add" onPress={handleAddTask}></Button>
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
    </StorageProvider>
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
