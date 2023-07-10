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
import { useContext, useState } from 'react'
import { STORAGE_KEY } from '../storage/storage'
import { StorageContext } from '../storage/context'

interface Task {
  id: string
  title: string
}

function Main() {
  const [task, setTask] = useState('')
  //   const [tasks, setTasks] = useState<Task[]>([])

  const { entries, saveEntries } = useContext(StorageContext)

  const handleAddTask = () => {
    helloWorld()
    console.log(task)
    if (task !== '') {
      const newTask: Task = {
        id: String(Date.now()),
        title: task,
      }
      saveEntries([...entries, newTask])
      setTask('')
    }
  }

  const handleRemoveTask = (id: string) => {
    const updatedTasks = entries.filter(task => task.id !== id)
    saveEntries(updatedTasks)
  }

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
      <FlatList
        data={entries}
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
