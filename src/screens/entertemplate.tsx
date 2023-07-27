import { FlatList, Text, TextInput, View } from 'react-native'

import { useContext, useState } from 'react'
import { StorageContext } from '../storage/context'
import { ds } from '../ux/design'
import { icons } from '../ux/icons'
import { IconButton } from '../views/iconbutton'
import { ChecklistTemplate, Task, TaskStack } from '../storage/interfaces'
import { generateId } from '../util/util'
import { buildTemplateObject } from '../storage/util'

const PADDING_TEMP = 10

function EnterTemplate() {
  const [templateName, setTemplateName] = useState('')
  const [taskLabel, setTaskLabel] = useState('')
  const { saveTemplate: createTemplate } = useContext(StorageContext)

  const [tasks, setTasks] = useState<Task[]>([])

  const handleAddCheckbox = () => {
    if (taskLabel !== '') {
      const newTask: Task = {
        id: String(Date.now()),
        label: taskLabel,
      }
      setTasks([...tasks, newTask])
      setTaskLabel('')
    }
  }

  const handleRemoveTask = (id: string) => {
    const updatedCheckboxes = tasks.filter((checkbox) => checkbox.id !== id)
    setTasks(updatedCheckboxes)
  }

  const handleSubmitList = () => {
    const template = buildTemplateObject(
      templateName,
      tasks.map((task) => task.label),
    )
    createTemplate(template)
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
        onChangeText={(text) => setTemplateName(text)}></TextInput>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <IconButton
          style={{ paddingHorizontal: PADDING_TEMP }}
          onPress={handleAddCheckbox}
          icon={icons.plus}
          size={ds.icons.size}
          color={ds.colors.primary}></IconButton>

        <TextInput
          placeholder="Enter..."
          value={taskLabel}
          onChangeText={(text) => setTaskLabel(text)}></TextInput>
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
              style={{ paddingHorizontal: PADDING_TEMP }}></IconButton>
            <Text style={{ fontSize: ds.font.sizes.major }}>{item.label}</Text>
          </View>
        )}></FlatList>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingTop: PADDING_TEMP,
        }}>
        <IconButton
          style={{ paddingHorizontal: PADDING_TEMP }}
          onPress={handleSubmitList}
          icon={icons.save}
          size={ds.icons.size}
          color={ds.colors.primary}
          label="Save template"></IconButton>
      </View>
    </View>
  )
}

export default EnterTemplate
