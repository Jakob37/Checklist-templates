import { useContext, useEffect, useState } from 'react'
import { Button, ScrollView, Text, TextInput, View } from 'react-native'

import { useIsFocused, useNavigation } from '@react-navigation/native'
import { StorageContext } from '../storage/context'
import { Task } from '../storage/interfaces'
import { buildTemplateObject } from '../storage/util'
import { generateId } from '../util/util'
import { ds, styles } from '../ux/design'
import { icons } from '../ux/icons'
import { HoverButton, IconButton } from '../views/iconbutton'
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

  return (
    <View style={{ flex: 1 }}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <BlueWell style={{ marginTop: ds.sizes.s }}>
          <TextInput
            autoFocus={true}
            placeholder="Enter template name"
            value={templateName}
            onChangeText={(text) => setTemplateName(text)}></TextInput>
        </BlueWell>

        <BlueWell style={{ marginTop: ds.sizes.s }}>
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
            }}></ChecklistSection>
        </BlueWell>

        {templateName !== '' &&
        tasks.filter((task) => task.label !== '').length > 0 ? (
          <SaveTemplate onSubmit={handleSubmitList}></SaveTemplate>
        ) : (
          ''
        )}
      </ScrollView>
      <HoverButton onPress={onAddTask}></HoverButton>
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
}
function ChecklistSection(props: ChecklistSectionProps) {
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

      {props.tasks.map((task, i) => (
        <ChecklistTask
          key={task.id}
          onRemoveTask={props.onRemoveTask}
          onRenameTask={props.onRenameTask}
          id={task.id}
          label={task.label}
          autoFocus={i !== 0}></ChecklistTask>
      ))}
    </View>
  )
}

type ChecklistTaskProps = {
  id: string
  label: string
  onRemoveTask: (id: string) => void
  onRenameTask: (id: string, text: string) => void
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
      <TextInput
        autoFocus={props.autoFocus}
        placeholder="Enter your task..."
        onChangeText={(text) => {
          props.onRenameTask(props.id, text)
        }}>
        {props.label}
      </TextInput>
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
