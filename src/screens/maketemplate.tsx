import { FlatList, ScrollView, Text, TextInput, View } from 'react-native'

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

type Section = {
  label: string
  tasks: Task[]
}

function EnterTemplate({ route }) {
  const navigate = useNavigation()

  const [templateName, setTemplateName] = useState('')
  const [taskLabel, setTaskLabel] = useState('')
  const [templateId, setTemplateId] = useState(generateId('template'))
  const { saveTemplate, getTemplateById } = useContext(StorageContext)

  const [defaultTasks, setDefaultTasks] = useState<Task[]>([])
  const [sections, setSections] = useState<Section[]>([])
  const [enterSectionLabel, setEnterSectionLabel] = useState('')

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
    setDefaultTasks(
      template != null ? template.stacks.flatMap((stack) => stack.tasks) : [],
    )
  }, [isFocused])

  const handleAddDefaultCheckbox = () => {
    if (taskLabel !== '') {
      const newTask: Task = {
        id: String(Date.now()),
        label: taskLabel,
      }
      setDefaultTasks([...defaultTasks, newTask])
      setTaskLabel('')
    }
  }

  const handleRemoveTask = (id: string) => {
    const updatedCheckboxes = defaultTasks.filter(
      (checkbox) => checkbox.id !== id,
    )
    setDefaultTasks(updatedCheckboxes)
  }

  const handleSubmitList = async () => {
    const template = buildTemplateObject(
      templateId,
      templateName,
      defaultTasks.map((task) => task.label),
    )
    saveTemplate(template)
    reset()
    navigate.navigate('Templates')
  }

  function reset() {
    setTaskLabel('')
    setTemplateName('')
    setDefaultTasks([])
    setTemplateId(generateId('template'))
  }

  function addSection() {}

  return (
    <ScrollView>
      <View style={styles.bluePanel}>
        <TextInput
          placeholder="Enter template name"
          value={templateName}
          onChangeText={(text) => setTemplateName(text)}></TextInput>
      </View>

      <ChecklistSection
        taskLabel={taskLabel}
        onChangeText={(text) => setTaskLabel(text)}
        onAddCheckbox={handleAddDefaultCheckbox}
        tasks={defaultTasks}
        onRemoveTask={handleRemoveTask}></ChecklistSection>
      <View style={styles.bluePanel}>
        <TextInput placeholder="Enter section label"></TextInput>
        <IconButton
          onPress={addSection}
          icon={icons.plus}
          size={ds.icons.medium}
          label={'Add section'}
          color={ds.colors.primary}></IconButton>
      </View>
      {templateName !== '' && defaultTasks.length > 0 ? (
        <SaveTemplate onSubmit={handleSubmitList}></SaveTemplate>
      ) : (
        ''
      )}
    </ScrollView>
  )
}

type ChecklistSectionProps = {
  taskLabel: string
  onChangeText: (text: string) => void
  onAddCheckbox: () => void
  tasks: Task[]
  onRemoveTask: (id: string) => void
}
function ChecklistSection(props: ChecklistSectionProps) {
  return (
    <View style={styles.bluePanel}>
      <Text>Default section</Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingLeft: ds.padding.s,
        }}>
        <View style={{ paddingRight: ds.padding.s }}>
          <IconButton
            onPress={props.onAddCheckbox}
            icon={icons.plus}
            size={ds.icons.medium}
            color={ds.colors.primary}></IconButton>
        </View>

        <TextInput
          placeholder="Enter task..."
          value={props.taskLabel}
          onSubmitEditing={props.onAddCheckbox}
          editable={true}
          onChangeText={(text) => props.onChangeText(text)}></TextInput>
      </View>
      <FlatList
        data={props.tasks}
        renderItem={({ item }) => (
          <ChecklistTask
            handleRemoveTask={props.onRemoveTask}
            id={item.id}
            label={item.label}></ChecklistTask>
        )}></FlatList>
    </View>
  )
}

type ChecklistTaskProps = {
  handleRemoveTask: (id: string) => void
  label: string
  id: string
}
function ChecklistTask(props: ChecklistTaskProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingBottom: ds.padding.s,
        justifyContent: 'space-between',
        paddingLeft: ds.padding.s,
      }}>
      <View>
        <Text style={{ fontSize: ds.font.sizes.major }}>{props.label}</Text>
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
            props.handleRemoveTask(props.id)
          }}
          icon={icons.trash}
          size={ds.icons.medium}
          color="white"
          iconStyle={{ paddingHorizontal: PADDING_TEMP }}></IconButton>
      </View>
    </View>
  )
}

type SaveTemplateProps = {
  onSubmit: () => void
}
function SaveTemplate(props: SaveTemplateProps) {
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
