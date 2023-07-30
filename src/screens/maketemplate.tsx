import { FlatList, Text, TextInput, View } from 'react-native'

import { useContext, useEffect, useState } from 'react'
import { StorageContext } from '../storage/context'
import { ds } from '../ux/design'
import { icons } from '../ux/icons'
import { IconButton } from '../views/iconbutton'
import { ChecklistTemplate, Task, TaskStack } from '../storage/interfaces'
import { generateId, printObject } from '../util/util'
import { buildTemplateObject } from '../storage/util'
import { useIsFocused } from '@react-navigation/native'

const PADDING_TEMP = 10

function EnterTemplate({ route }) {
  const [templateName, setTemplateName] = useState('')
  const [taskLabel, setTaskLabel] = useState('')
  const { saveTemplate, getTemplateById } = useContext(StorageContext)

  const [tasks, setTasks] = useState<Task[]>([])

  const isFocused = useIsFocused()

  useEffect(() => {
    // console.log(`Obtaining route ${JSON.stringify(route, null, 2)}`)
    const templateId = route.params.templateId
    console.log('templateId', templateId)
    const template = getTemplateById(templateId)
    printObject(template)

    setTemplateName(template.label)
    setTasks(template.stacks.flatMap((stack) => stack.tasks))
  }, [isFocused])

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
    saveTemplate(template)
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
          iconStyle={{ paddingHorizontal: PADDING_TEMP }}
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
          <View
            style={{
              flexDirection: 'row',
              paddingBottom: ds.padding.s,
              justifyContent: 'space-between',
              paddingLeft: ds.padding.s,
            }}>
            <View>
              <Text style={{ fontSize: ds.font.sizes.major }}>
                {item.label}
              </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <IconButton
                onPress={() => {
                  // handleRemoveTask(item.id)
                  console.log('FIXME: Implement edit')
                }}
                icon={icons.pen}
                size={ds.icons.size}
                color="white"
                iconStyle={{ paddingHorizontal: PADDING_TEMP }}></IconButton>
              <IconButton
                onPress={() => {
                  handleRemoveTask(item.id)
                }}
                icon={icons.trash}
                size={ds.icons.size}
                color="white"
                iconStyle={{ paddingHorizontal: PADDING_TEMP }}></IconButton>
            </View>
          </View>
        )}></FlatList>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingTop: PADDING_TEMP,
        }}>
        <IconButton
          iconStyle={{ paddingHorizontal: PADDING_TEMP }}
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
