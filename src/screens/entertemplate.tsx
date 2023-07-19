import { Button, FlatList, Text, TextInput, View } from 'react-native'

import { helloWorld } from '@minimalist_tools/library'
import { useContext, useState } from 'react'
import { StorageContext } from '../storage/context'
import { ds } from '../ux/design'
import { icons } from '../ux/icons'
import { IconButton } from '../views/iconbutton'
import { ChecklistTemplate, Task } from '../storage/interfaces'

function EnterTemplate() {
  const [templateName, setTemplateName] = useState('')
  const [taskLabel, setTaskLabel] = useState('')
  const { templates, saveTemplates } = useContext(StorageContext)

  const [tasks, setTasks] = useState<Task[]>([])

  const handleAddCheckbox = () => {
    if (taskLabel !== '') {
      const newTask: Task = {
        id: String(Date.now()),
        label: taskLabel,
      }
      // saveEntries([...entries, newTask])
      setTasks([...tasks, newTask])
      setTaskLabel('')
    }
  }

  const handleRemoveTask = (id: string) => {
    console.log('Removing ID', id)
    const updatedCheckboxes = tasks.filter(checkbox => checkbox.id !== id)
    setTasks(updatedCheckboxes)
  }

  const handleSubmitList = () => {
    const updatingTemplates = [...templates]
    const template = makeDummyTemplate(templateName)

    updatingTemplates.push(template)
    saveTemplates(updatingTemplates)

    reset()
  }

  function reset() {
    setTaskLabel('')
    setTemplateName('')
    setTasks([])
  }

  return (
    <View>
      <TextInput
        placeholder="Name"
        value={templateName}
        onChangeText={text => setTemplateName(text)}></TextInput>
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
        data={tasks}
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

function makeDummyTemplate(templateName: string): ChecklistTemplate {
  return {
    // FIXME: ID function
    id: `template-${String(Date.now())}`,
    label: templateName,
    // FIXME: Include the tasks
    stacks: [
      {
        id: `stack-${String(Date.now())}`,
        label: 'Default',
        tasks: [
          {
            id: `task-${String(Date.now())}-1`,
            label: 'Dummy task 1',
          },
          {
            id: `task-${String(Date.now())}-2`,
            label: 'Dummy task 2',
          },
        ],
      },
    ],
  }
}

export default EnterTemplate
