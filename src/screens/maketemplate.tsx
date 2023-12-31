import { createRef, useContext, useEffect, useRef, useState } from 'react'
import { TextInput, View } from 'react-native'

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

// @ts-ignore
function EnterTemplate({ route }) {
  const navigate = useNavigation()

  const templateNameRef = useRef<TextInput | null>(null)
  const taskInputRefs = useRef(new Map()).current

  const [templateName, setTemplateName] = useState('')
  const [taskLabel, setTaskLabel] = useState('')
  const [templateId, setTemplateId] = useState(generateId('template'))
  const { saveTemplate, getTemplateById } = useContext(StorageContext)

  // FIXME: Maybe remove default tasks
  const generateDefaultTask = (): Task => {
    const taskId = generateId('task')
    taskInputRefs.set(taskId, createRef())
    return { id: taskId, label: '' }
  }

  const [tasks, setTasks] = useState<Task[]>([generateDefaultTask()])
  const [sections, _setSections] = useState<SectionState[]>([])
  const isFocused = useIsFocused()
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const lastTaskId = tasks[tasks.length - 1]?.id
    if (lastTaskId && taskInputRefs.has(lastTaskId) && tasks.length > 1) {
      const ref = taskInputRefs.get(lastTaskId)
      ref.current?.focus()
    }
  }, [tasks])

  useEffect(() => {
    const templateId = route.params.templateId
    const isNew = route.params.isNew

    if (isFocused && templateNameRef != null) {
      templateNameRef.current?.focus()
    }

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
    if (template != null) {
      const preloadedTasks = template.stacks.flatMap((stack) => stack.tasks)
      setTasks(preloadedTasks)
      const preloadedIds = preloadedTasks.map((task) => task.id)
      for (const id of preloadedIds) {
        taskInputRefs.set(id, createRef())
      }
    } else {
      setTasks([generateDefaultTask()])
    }
  }, [isFocused])

  const onAddTask = () => {
    const taskId = generateId('task')
    const newTask: Task = {
      id: taskId,
      label: '',
    }
    setTasks([...tasks, newTask])
    taskInputRefs.set(taskId, createRef())
  }

  const handleRemoveTask = (id: string) => {
    const updatedTasks = tasks.filter((checkbox) => checkbox.id !== id)
    setTasks(updatedTasks)

    taskInputRefs.delete(id)
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
    setTasks([generateDefaultTask()])
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
          placeholder="Enter template name"
          value={templateName}
          onChangeText={(text) => setTemplateName(text)}></TextInput>
      </BlueWell>

      <BlueWell
        style={{
          flexDirection: 'column',
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
          attachRef={(id, el) => {
            taskInputRefs.get(id).current = el
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
  attachRef: (id: string, el: TextInput) => void
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
              attachRef={props.attachRef}
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
  attachRef: (id: string, el: TextInput) => void
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
          ref={(el) => (el != null ? props.attachRef(props.id, el) : '')}
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
