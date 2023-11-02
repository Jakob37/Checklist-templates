import { useContext, useEffect, useState } from 'react'
import { Text, TextInput, View } from 'react-native'

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

  const [templateName, setTemplateName] = useState('')
  const [taskLabel, setTaskLabel] = useState('')
  const [templateId, setTemplateId] = useState(generateId('template'))
  const { saveTemplate, getTemplateById } = useContext(StorageContext)

  const [tasks, setTasks] = useState<Task[]>([getDefaultTask()])
  const [sections, _setSections] = useState<SectionState[]>([])
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
      {/* <ScrollView keyboardShouldPersistTaps="handled"> */}
      <Header
        templateName={templateName}
        setTemplateName={setTemplateName}></Header>

      <Content
        taskLabel={taskLabel}
        setTaskLabel={setTaskLabel}
        tasks={tasks}
        setTasks={setTasks}
        handleRemoveTask={handleRemoveTask}></Content>
      <Footer
        onAddTask={onAddTask}
        templateName={templateName}
        tasks={tasks}
        handleSubmitList={handleSubmitList}></Footer>
    </View>
  )
}

type HeaderProps = {
  templateName: string
  setTemplateName: (name: string) => void
}
function Header(props: HeaderProps) {
  return (
    <BlueWell style={{ marginTop: ds.sizes.s }}>
      <TextInput
        style={{
          color: ds.colors.light,
        }}
        placeholderTextColor={ds.colors.faint}
        autoFocus={true}
        placeholder="Enter template name"
        value={props.templateName}
        onChangeText={(text) => props.setTemplateName(text)}></TextInput>
    </BlueWell>
  )
}

type ContentProps = {
  taskLabel: string
  setTaskLabel: (label: string) => void
  tasks: Task[]
  setTasks: (tasks: Task[]) => void
  handleRemoveTask: (id: string) => void
}
function Content(props: ContentProps) {
  // return <View style={{ flex: 1, backgroundColor: 'green' }}></View>
  return (
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
        sectionLabel=""
        enterTaskLabel={props.taskLabel}
        onChangeTaskLabel={(text) => props.setTaskLabel(text)}
        onRenameTask={(id, text) => {
          const taskIndex = props.tasks.findIndex((task) => task.id === id)
          const tasksCopy = [...props.tasks]
          tasksCopy[taskIndex].label = text
          props.setTasks(tasksCopy)
        }}
        tasks={props.tasks}
        onRemoveTask={props.handleRemoveTask}
        onRemoveSection={() => {
          console.error('Cannot remove default section')
        }}
        onRearrangeTasks={(newOrderTasks) => {
          const copy = [...newOrderTasks]
          props.setTasks(copy)
        }}></ChecklistSection>
    </BlueWell>
  )
}

type FooterProps = {
  onAddTask: () => void
  templateName: string
  tasks: Task[]
  handleSubmitList: () => void
}
function Footer(props: FooterProps) {
  return (
    <View>
      <BlueWell>
        <IconButton
          icon={icons.plus}
          onPress={props.onAddTask}
          label="Add task"></IconButton>
      </BlueWell>

      {props.templateName !== '' &&
      props.tasks.filter((task) => task.label !== '').length > 0 ? (
        <SaveTemplate onSubmit={props.handleSubmitList}></SaveTemplate>
      ) : (
        ''
      )}
      <View style={{ height: ds.sizes.s }}></View>
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
        persistentScrollbar={true}
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
          style={{
            color: ds.colors.light,
          }}
          placeholderTextColor={ds.colors.faint}
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
          paddingVertical: ds.sizes.s,
        },
      ]}>
      <IconButton
        iconStyle={{ paddingHorizontal: ds.sizes.s }}
        onPress={props.onSubmit}
        icon={icons.save}
        size={ds.icons.medium}
        labelStyle={{ fontSize: ds.text.sizes.major }}
        label="Save template"></IconButton>
    </View>
  )
}

export default EnterTemplate
