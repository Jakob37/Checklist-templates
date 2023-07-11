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

interface Checkbox {
  id: string
  label: string
}

function EnterListTemplate() {
  const [newCheckboxLabel, setNewCheckboxLabel] = useState('')
  const { entries, saveEntries } = useContext(StorageContext)

  const [checkboxes, setCheckboxes] = useState<Checkbox[]>([])

  const handleAddCheckbox = () => {
    if (newCheckboxLabel !== '') {
      const newCheckbox: Checkbox = {
        id: String(Date.now()),
        label: newCheckboxLabel,
      }
      // saveEntries([...entries, newTask])
      setCheckboxes([...checkboxes, newCheckbox])
      setNewCheckboxLabel('')
    }
  }

  const handleRemoveTask = (id: string) => {
    const updatedTasks = entries.filter(task => task.id !== id)
    saveEntries(updatedTasks)
  }

  const handleSubmitList = () => {
    console.log('Submit list')
    setNewCheckboxLabel('')
  }

  return (
    <View>
      <View>
        <TextInput
          placeholder="Enter..."
          value={newCheckboxLabel}
          onChangeText={text => setNewCheckboxLabel(text)}></TextInput>
      </View>
      <Button title="Add checkbox" onPress={handleAddCheckbox}></Button>
      <Text>Checkboxes</Text>
      <FlatList
        data={checkboxes}
        renderItem={({ item }) => <Text>{item.label}</Text>}></FlatList>
      {/* <FlatList
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
        )}></FlatList> */}
      <Button title="Submit list" onPress={handleSubmitList}></Button>
    </View>
  )
}

export default EnterListTemplate
