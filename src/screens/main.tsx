import { Button, FlatList, Text, TextInput, View } from 'react-native'

import {
  helloWorld,
  helloWorld2,
  HelloWorldView,
  loadDataFromStorage,
} from '@minimalist_tools/library'
import { IconButton } from '../views/iconbutton'
import { icons } from '../ux/icons'
import { ds } from '../ux/design'
import { useState } from 'react'
import { STORAGE_KEY } from '../storage/storage'

interface Task {
  id: string
  title: string
}

function Main() {
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
    loadDataFromStorage(STORAGE_KEY, (entries: any[]) => {
      console.log('Loaded', entries)
    })
  }

  const handleSave = () => {}

  return (
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
      <Button title="Save" onPress={handleSave}></Button>
      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontSize: ds.font.sizes.topBar }}>{item.title}</Text>
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
  )
}

export default Main
