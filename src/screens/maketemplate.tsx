import { useContext, useEffect, useState } from 'react'
import {
  Button,
  ScrollView,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native'

import { useIsFocused, useNavigation } from '@react-navigation/native'
import { StorageContext } from '../storage/context'
import { Task } from '../storage/interfaces'
import { buildTemplateObject } from '../storage/util'
import { generateId } from '../util/util'
import { ds, styles } from '../ux/design'
import { icons } from '../ux/icons'
import { HoverButton, IconButton } from '../views/iconbutton'
import { BlueWell } from '../views/wells'
import DraggableFlatList from 'react-native-draggable-flatlist'

type SectionState = {
  sectionLabel: string
  enterTaskLabel: string
  tasks: Task[]
}

function getDefaultTask(): Task {
  return { id: generateId('task'), label: '' }
}

// @ts-ignore
function EnterTemplate({ route }) {
  const navigate = useNavigation()

  const [templateName, setTemplateName] = useState('')
  const [taskLabel, setTaskLabel] = useState('')
  const [templateId, setTemplateId] = useState(generateId('template'))
  const { saveTemplate, getTemplateById } = useContext(StorageContext)

  const [tasks, setTasks] = useState<Task[]>([getDefaultTask()])
  const [sections, setSections] = useState<SectionState[]>([])
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
      template != null
        ? template.stacks.flatMap((stack) => stack.tasks)
        : [getDefaultTask()],
    )
  }, [isFocused])

  const onAddTask = () => {
    const newTask: Task = {
      id: generateId('task'),
      label: '',
    }
    setTasks([...tasks, newTask])
  }

  const handleRemoveTask = (id: string) => {
    const updatedTasks = tasks.filter((checkbox) => checkbox.id !== id)
    setTasks(updatedTasks)
  }

  const handleSubmitList = async () => {
    const template = buildTemplateObject(
      templateId,
      templateName,
      tasks.map((task) => task.label),
      sections.map((section) => {
        return {
          label: section.sectionLabel,
          tasks: section.tasks.map((task) => task.label),
        }
      }),
    )
    saveTemplate(template)
    reset()
    navigate.goBack()
  }

  function reset() {
    setTaskLabel('')
    setTemplateName('')
    setTasks([getDefaultTask()])
    setTemplateId(generateId('template'))
  }

  // const [dragDataTemp, setDragDataTemp] = useState([
  //   { d: 1, k: 'A' },
  //   { d: 2, k: 'B' },
  // ])

  return (
    <View style={{ flex: 1 }}>
      {/* <ScrollView keyboardShouldPersistTaps="handled"> */}
      <BlueWell style={{ marginTop: ds.sizes.s }}>
        <TextInput
          autoFocus={true}
          placeholder="Enter template name"
          value={templateName}
          onChangeText={(text) => setTemplateName(text)}></TextInput>
      </BlueWell>

      <BlueWell
        style={{
          marginTop: ds.sizes.s,
          // FIXME: How to do this elegantly?
          height: Dimensions.get('window').height - 300,
        }}>
        <ChecklistSection
          sectionLabel=""
          enterTaskLabel={taskLabel}
          onChangeTaskLabel={(text) => setTaskLabel(text)}
          onRenameTask={(id, text) => {
            const taskIndex = tasks.findIndex((task) => task.id === id)
            const tasksCopy = [...tasks]
            tasksCopy[taskIndex].label = text
            setTasks(tasksCopy)
          }}
          tasks={tasks}
          onRemoveTask={handleRemoveTask}
          onRemoveSection={() => {
            console.error('Cannot remove default section')
          }}
          onRearrangeTasks={(newOrderTasks) => {
            const copy = [...newOrderTasks]
            setTasks(copy)
          }}></ChecklistSection>
      </BlueWell>

      {templateName !== '' &&
      tasks.filter((task) => task.label !== '').length > 0 ? (
        <SaveTemplate onSubmit={handleSubmitList}></SaveTemplate>
      ) : (
        ''
      )}
      {/* </ScrollView> */}
      <HoverButton onPress={onAddTask}></HoverButton>
      <View style={{ height: ds.sizes.l }}></View>
    </View>
  )
}

type ChecklistSectionProps = {
  sectionLabel: string
  enterTaskLabel: string
  onChangeTaskLabel: (text: string) => void
  onRenameTask: (id: string, taskLabel: string) => void
  tasks: Task[]
  onRemoveTask: (id: string) => void
  onRemoveSection: () => void
  onRearrangeTasks: (newOrder: Task[]) => void
}
function ChecklistSection(props: ChecklistSectionProps) {
  const [dragDataTemp, setDragDataTemp] = useState([
    { d: 1, k: 'A' },
    { d: 2, k: 'B' },
  ])

  return (
    <View>
      {props.sectionLabel !== '' ? (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text>{props.sectionLabel}</Text>
          <IconButton
            onPress={props.onRemoveSection}
            icon={icons.trash}></IconButton>
        </View>
      ) : (
        ''
      )}

      <DraggableFlatList
        data={props.tasks}
        renderItem={({ item, drag, isActive }) => (
          <View key={item.id}>
            <ChecklistTask
              onRemoveTask={props.onRemoveTask}
              onRenameTask={props.onRenameTask}
              onDrag={drag}
              id={item.id}
              label={item.label}
              autoFocus={true}></ChecklistTask>
          </View>
        )}
        keyExtractor={(item) => item.id}
        onDragEnd={({ data }) => {
          props.onRearrangeTasks(data)
        }}></DraggableFlatList>
    </View>
  )
}

type ChecklistTaskProps = {
  id: string
  label: string
  onRemoveTask: (id: string) => void
  onRenameTask: (id: string, text: string) => void
  onDrag: () => void
  autoFocus: boolean
}
function ChecklistTask(props: ChecklistTaskProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <IconButton
          icon={icons.bars}
          onPress={() => {}}
          onLongPress={props.onDrag}
          containerStyle={{ paddingRight: ds.sizes.s }}></IconButton>
        <TextInput
          autoFocus={props.autoFocus}
          placeholder="Enter your task..."
          onChangeText={(text) => {
            props.onRenameTask(props.id, text)
          }}>
          {props.label}
        </TextInput>
      </View>
      <IconButton
        icon={icons.trash}
        containerStyle={{ paddingRight: ds.sizes.s }}
        onPress={() => props.onRemoveTask(props.id)}></IconButton>
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
          paddingVertical: ds.sizes.m,
        },
      ]}>
      <IconButton
        iconStyle={{ paddingHorizontal: ds.sizes.s }}
        onPress={props.onSubmit}
        icon={icons.save}
        size={ds.icons.medium}
        labelStyle={{ fontSize: ds.font.sizes.major }}
        label="Save template"></IconButton>
    </View>
  )
}

export default EnterTemplate
