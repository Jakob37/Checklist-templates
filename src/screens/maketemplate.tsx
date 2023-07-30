import { FlatList, Text, TextInput, View } from 'react-native'

import { useContext, useEffect, useRef, useState } from 'react'
import { StorageContext } from '../storage/context'
import { ds } from '../ux/design'
import { icons } from '../ux/icons'
import { IconButton } from '../views/iconbutton'
import { ChecklistTemplate, Task, TaskStack } from '../storage/interfaces'
import { generateId, printObject } from '../util/util'
import { buildTemplateObject } from '../storage/util'
import { useIsFocused, useNavigation } from '@react-navigation/native'

const PADDING_TEMP = 10

function EnterTemplate({ route }) {
  const navigate = useNavigation()

  const [templateName, setTemplateName] = useState('')
  const [taskLabel, setTaskLabel] = useState('')
  const [templateId, setTemplateId] = useState(generateId('template'))
  const { saveTemplate, getTemplateById } = useContext(StorageContext)

  const [tasks, setTasks] = useState<Task[]>([])

  const isFocused = useIsFocused()

  useEffect(() => {
    const templateId = route.params.templateId
    const isNew = route.params.isNew

    if (templateId === null) {
      if (isNew) {
        route.params.isNew = false
        reset()
      }
      return
    }

    const template = getTemplateById(templateId)

    if (isNew) {
      setTemplateId(generateId('template'))
    } else {
      setTemplateId(templateId)
    }

    setTemplateName(template != null ? template.label : '')
    setTasks(
      template != null ? template.stacks.flatMap((stack) => stack.tasks) : [],
    )
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

  const handleSubmitList = async () => {
    const template = buildTemplateObject(
      templateId,
      templateName,
      tasks.map((task) => task.label),
    )
    saveTemplate(template)
    reset()
    navigate.navigate('Templates')
  }

  function reset() {
    setTaskLabel('')
    setTemplateName('')
    setTasks([])
    setTemplateId(generateId('template'))
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
          onSubmitEditing={() => {
            handleAddCheckbox()
          }}
          editable={true}
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
