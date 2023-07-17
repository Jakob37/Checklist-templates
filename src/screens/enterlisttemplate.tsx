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
    console.log('Removing ID', id)
    const updatedCheckboxes = checkboxes.filter(checkbox => checkbox.id !== id)
    setCheckboxes(updatedCheckboxes)
  }

  const handleSubmitList = () => {
    setNewCheckboxLabel('')
    setCheckboxes([])
  }

  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <IconButton
          style={{ paddingHorizontal: 10 }}
          onPress={handleAddCheckbox}
          icon={icons.plus}
          size={ds.icons.size}
          color={ds.colors.primary}></IconButton>

        <TextInput
          placeholder="Enter..."
          value={newCheckboxLabel}
          onChangeText={text => setNewCheckboxLabel(text)}></TextInput>
      </View>

      <FlatList
        data={checkboxes}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row' }}>
            <IconButton
              onPress={() => {
                handleRemoveTask(item.id)
              }}
              icon={icons.trash}
              size={ds.icons.size}
              color="white"
              style={{ paddingHorizontal: 10 }}></IconButton>
            <Text style={{ fontSize: ds.font.sizes.major }}>{item.label}</Text>
          </View>
        )}></FlatList>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingTop: 10,
        }}>
        <IconButton
          style={{ paddingHorizontal: 10 }}
          onPress={handleSubmitList}
          icon={icons.save}
          size={ds.icons.size}
          color={ds.colors.primary}></IconButton>
        <Text>Save template</Text>
      </View>
    </View>
  )
}

export default EnterListTemplate
