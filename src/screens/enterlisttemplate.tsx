import { Button, FlatList, Text, TextInput, View } from 'react-native'

import { helloWorld } from '@minimalist_tools/library'
import { useContext, useState } from 'react'
import { StorageContext } from '../storage/context'
import { ds } from '../ux/design'
import { icons } from '../ux/icons'
import { IconButton } from '../views/iconbutton'

interface Task {
  id: string
  title: string
}

function EnterListTemplate() {
  const [task, setTask] = useState('')
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
      <Text>Make checklist template</Text>
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

export default EnterListTemplate
