import { FlatList, Text, TextInput, View } from 'react-native'

import { useContext, useEffect, useRef, useState } from 'react'
import { StorageContext } from '../storage/context'
import { ds, styles } from '../ux/design'
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
      <View style={styles.bluePanel}>
        <TextInput
          placeholder="Enter template name"
          value={templateName}
          onChangeText={(text) => setTemplateName(text)}></TextInput>
      </View>

      <View style={styles.bluePanel}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: ds.padding.s,
          }}>
          <View style={{ paddingRight: ds.padding.s }}>
            <IconButton
              onPress={handleAddCheckbox}
              icon={icons.plus}
              size={ds.icons.medium}
              color={ds.colors.primary}></IconButton>
          </View>

          <TextInput
            placeholder="Enter task..."
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
                  size={ds.icons.medium}
                  color="white"
                  iconStyle={{ paddingHorizontal: PADDING_TEMP }}></IconButton>
                <IconButton
                  onPress={() => {
                    handleRemoveTask(item.id)
                  }}
                  icon={icons.trash}
                  size={ds.icons.medium}
                  color="white"
                  iconStyle={{ paddingHorizontal: PADDING_TEMP }}></IconButton>
              </View>
            </View>
          )}></FlatList>
      </View>
      {templateName !== '' && tasks.length > 0 ? (
        <SaveTemplate onSubmit={handleSubmitList}></SaveTemplate>
      ) : (
        ''
      )}
    </View>
  )
}

function SaveTemplate(props) {
  return (
    <View
      style={[
        styles.orangePanel,
        {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: ds.padding.m,
        },
      ]}>
      <IconButton
        iconStyle={{ paddingHorizontal: PADDING_TEMP }}
        onPress={props.onSubmit}
        icon={icons.save}
        size={ds.icons.medium}
        color={ds.colors.primary}
        labelStyle={{ fontSize: ds.font.sizes.major }}
        label="Save template"></IconButton>
    </View>
  )
}

export default EnterTemplate
