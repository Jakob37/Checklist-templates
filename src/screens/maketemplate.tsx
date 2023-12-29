import { useContext, useEffect, useRef, useState } from 'react'
import { SectionList, Text, TextInput, View } from 'react-native'

import { useIsFocused, useNavigation } from '@react-navigation/native'
import DraggableFlatList from 'react-native-draggable-flatlist'
import { StorageContext } from '../storage/context'
import { Task } from '../storage/interfaces'
import { buildTemplateObject } from '../storage/util'
import { generateId } from '../util/util'
import { ds, styles } from '../ux/design'
import { icons } from '../ux/icons'
import { IconButton } from '../views/iconbutton'
import { BlueWell } from '../views/wells'

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

  const templateNameRef = useRef()
  const [templateName, setTemplateName] = useState('')
  const [taskLabel, setTaskLabel] = useState('')
  const [templateId, setTemplateId] = useState(generateId('template'))
  const { saveTemplate, getTemplateById } = useContext(StorageContext)

  const [tasks, setTasks] = useState<Task[]>([getDefaultTask()])
  const [sections, _setSections] = useState<SectionState[]>([])
  const isFocused = useIsFocused()
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    console.log('Main useEffect triggered')

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
      setIsFavorite(false)
    } else {
      setTemplateId(templateId)
      setIsFavorite(template.favorite)
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
      isFavorite,
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

  return (
    <View style={{ flex: 1 }}>
      <BlueWell style={{ marginTop: ds.sizes.s }}>
        <TextInput
          ref={templateNameRef}
          style={{
            color: ds.colors.light,
          }}
          placeholderTextColor={ds.colors.faint}
          // autoFocus={true}
          placeholder="Enter template name"
          value={templateName}
          onChangeText={(text) => setTemplateName(text)}></TextInput>
      </BlueWell>

      <BlueWell
        style={{
          flexDirection: 'column',
          // flexGrow: 1,
          flex: 1,
          paddingBottom: ds.sizes.s,
          marginTop: ds.sizes.s,
          marginBottom: ds.sizes.s,
        }}>
        <ChecklistSection
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

      <View>
        <BlueWell>
          <IconButton
            icon={icons.plus}
            labelStyle={{ color: ds.colors.light }}
            onPress={onAddTask}
            label="Add task"></IconButton>
        </BlueWell>

        <SaveTemplate
          getIsActive={() => getSaveIsActive(templateName, tasks)}
          onSubmit={handleSubmitList}></SaveTemplate>

        <View style={{ height: ds.sizes.s }}></View>
      </View>
    </View>
  )
}

function getSaveIsActive(templateName: string, tasks: Task[]): boolean {
  return (
    templateName !== '' && tasks.filter((task) => task.label !== '').length > 0
  )
}

type ChecklistSectionProps = {
  enterTaskLabel: string
  onChangeTaskLabel: (text: string) => void
  onRenameTask: (id: string, taskLabel: string) => void
  tasks: Task[]
  onRemoveTask: (id: string) => void
  onRemoveSection: () => void
  onRearrangeTasks: (newOrder: Task[]) => void
}
function ChecklistSection(props: ChecklistSectionProps) {
  return (
    <View>
      <DraggableFlatList
        data={props.tasks}
        persistentScrollbar={true}
        renderItem={({ item, drag, isActive }) => (
          <View key={item.id}>
            <ChecklistTask
              onRemoveTask={props.onRemoveTask}
              onRenameTask={props.onRenameTask}
              onDrag={drag}
              id={item.id}
              label={item.label}></ChecklistTask>
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
          style={{
            color: ds.colors.light,
          }}
          placeholderTextColor={ds.colors.faint}
          // autoFocus={props.autoFocus}
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
  getIsActive: () => boolean
}
function SaveTemplate(props: SaveTemplateProps) {
  return (
    <View
      style={[
        props.getIsActive() ? styles.orangePanel : styles.grayPanel,
        {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: ds.sizes.s,
        },
      ]}>
      <IconButton
        iconStyle={{ paddingHorizontal: ds.sizes.s }}
        onPress={props.onSubmit}
        disabled={!props.getIsActive()}
        icon={icons.save}
        size={ds.icons.medium}
        labelStyle={{
          fontSize: ds.text.sizes.major,
          color: props.getIsActive() ? ds.colors.white : ds.colors.light,
        }}
        label="Save template"></IconButton>
    </View>
  )
}

export default EnterTemplate
