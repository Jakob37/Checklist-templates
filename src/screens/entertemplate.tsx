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

function EnterTemplate() {
  const [templateName, setTemplateName] = useState('')
  const [taskLabel, setTaskLabel] = useState('')
  const { templates, saveTemplates } = useContext(StorageContext)

  const [checkboxes, setCheckboxes] = useState<Checkbox[]>([])

  const handleAddCheckbox = () => {
    if (taskLabel !== '') {
      const newCheckbox: Checkbox = {
        id: String(Date.now()),
        label: taskLabel,
      }
      // saveEntries([...entries, newTask])
      setCheckboxes([...checkboxes, newCheckbox])
      setTaskLabel('')
    }
  }

  const handleRemoveTask = (id: string) => {
    console.log('Removing ID', id)
    const updatedCheckboxes = checkboxes.filter(checkbox => checkbox.id !== id)
    setCheckboxes(updatedCheckboxes)
  }

  const handleSubmitList = () => {
    setTaskLabel('')
    setCheckboxes([])

    const prevTemplates = [...templates]

    const template = {
      // FIXME: ID function
      id: String(Date.now()),
      label: 
    }

    const newTemplates = templates.push()
  }

  return (
    <View>
      <TextInput
        placeholder="Name"
        value={templateName}
        onChangeText={text => setTemplateName(templateName)}
      ></TextInput>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <IconButton
          style={{ paddingHorizontal: 10 }}
          onPress={handleAddCheckbox}
          icon={icons.plus}
          size={ds.icons.size}
          color={ds.colors.primary}></IconButton>

        <TextInput
          placeholder="Enter..."
          value={taskLabel}
          onChangeText={text => setTaskLabel(text)}></TextInput>
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

export default EnterTemplate
