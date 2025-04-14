import {
  createRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { TextInput, View } from 'react-native'

import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native'
import DraggableFlatList from 'react-native-draggable-flatlist'
import { StorageContext } from '../storage/context'
import { Task } from '../storage/interfaces'
import { buildTemplateObject } from '../storage/util'
import { generateId } from '../util/util'
import { ds, styles } from '../ux/design'
import { icons } from '../ux/icons'
import { IconButton } from '../views/iconbutton'
import { BlueWell } from '../views/wells'

type RootStackParamList = {
  EnterTemplate: { templateId: string | null; isNew?: boolean }
}
type EnterTemplateScreenRouteProp = RouteProp<
  RootStackParamList,
  'EnterTemplate'
>

function EnterTemplate() {
  const navigate = useNavigation()
  const route = useRoute<EnterTemplateScreenRouteProp>()
  const { saveTemplate, getTemplateById } = useContext(StorageContext)

  const templateNameRef = useRef<TextInput>(null)
  // const taskInputRefs = useRef<Record<string, React.RefObject<TextInput>>>({})
  const taskInputRefs = useRef<Map<string, TextInput | null>>(new Map()).current

  const [templateName, setTemplateName] = useState('')
  const [tasks, setTasks] = useState<Task[]>([])
  const [templateId, setTemplateId] = useState(generateId('template'))
  const [isFavorite, setIsFavorite] = useState(false)
  const isFocused = useIsFocused()

  const prevTaskCountRef = useRef(tasks.length)

  useEffect(() => {
    const currentTaskCount = tasks.length
    const prevTaskCount = prevTaskCountRef.current

    if (currentTaskCount > prevTaskCount) {
      const lastTaskId = tasks[currentTaskCount - 1]?.id
      if (lastTaskId) {
        setTimeout(() => {
          const inputNode = taskInputRefs.get(lastTaskId)
          if (inputNode) {
            inputNode.focus()
          } else {
            console.warn(`Node not found in ref map for task ID: ${lastTaskId}`)
          }
        }, 50)
      }
    }
    prevTaskCountRef.current = currentTaskCount
  }, [tasks, taskInputRefs])

  const registerTaskInputRef = useCallback(
    (id: string, node: TextInput | null) => {
      if (node) {
        taskInputRefs.set(id, node)
      } else {
        taskInputRefs.delete(id)
      }
    },
    [taskInputRefs],
  )

  const reset = useCallback(() => {
    setTemplateName('')
    setTasks([])
    setTemplateId(generateId('template'))
    setIsFavorite(false)
  }, [])

  useEffect(() => {
    const currentTemplateId = route.params?.templateId ?? null
    const isNew = route.params?.isNew ?? currentTemplateId === null

    if (isFocused) {
      templateNameRef.current?.focus()
    }

    if (currentTemplateId === null) {
      if (isNew) {
        reset()
      }
      return
    }

    const template = getTemplateById(currentTemplateId)

    if (template) {
      setTemplateId(template.id)
      setIsFavorite(template.favorite)
      setTemplateName(template.label)
      const preloadedTasks = template.stacks.flatMap((stack) => stack.tasks)
      setTasks(preloadedTasks)
    } else {
      console.warn(`Template ID ${currentTemplateId} not found. Resetting.`)
      reset()
    }

    setTemplateName(template != null ? template.label : '')
    if (template != null) {
      const preloadedTasks = template.stacks.flatMap((stack) => stack.tasks)
      setTasks(preloadedTasks)
      const preloadedIds = preloadedTasks.map((task) => task.id)
      // for (const id of preloadedIds) {
      //   taskInputRefs.set(id, createRef())
      // }
    }
    //  else {
    //   setTasks([generateDefaultTask()])
    // }
  }, [isFocused, route.params, getTemplateById, reset])

  const onAddTask = () => {
    const taskId = generateId('task')
    // const ref = createRef<TextInput>()
    // taskInputRefs.set(taskId, ref)

    const newTask: Task = {
      id: taskId,
      label: '',
    }
    setTasks([...tasks, newTask])

    // setTimeout(() => {
    //   ref.current?.focus();
    // }, 0)
  }

  const handleRemoveTask = (id: string) => {
    const updatedTasks = tasks.filter((checkbox) => checkbox.id !== id)
    setTasks(updatedTasks)

    // taskInputRefs.delete(id)
  }

  const handleSubmitList = async () => {
    const template = buildTemplateObject(
      templateId,
      templateName,
      isFavorite,
      tasks.map((task) => task.label),
    )
    saveTemplate(template)
    reset()
    navigate.goBack()
  }

  // function reset() {
  //   // setTaskLabel('')
  //   setTemplateName('')
  //   // setTasks([generateDefaultTask()])
  //   setTasks([])
  //   setTemplateId(generateId('template'))
  // }

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
          // enterTaskLabel={taskLabel}
          // onChangeTaskLabel={(text) => setTaskLabel(text)}
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
          // attachRef={(id, el) => {
          //   taskInputRefs.get(id).current = el
          // }}
          onRearrangeTasks={(newOrderTasks) => {
            const copy = [...newOrderTasks]
            setTasks(copy)
          }}
          registerTaskRef={registerTaskInputRef}></ChecklistSection>
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
  // enterTaskLabel: string
  // onChangeTaskLabel: (text: string) => void
  onRenameTask: (id: string, taskLabel: string) => void
  tasks: Task[]
  // attachRef: (id: string, el: TextInput) => void
  onRemoveTask: (id: string) => void
  onRemoveSection: () => void
  onRearrangeTasks: (newOrder: Task[]) => void
  registerTaskRef: (id: string, node: TextInput | null) => void
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
              registerTaskRef={props.registerTaskRef}
              // attachRef={props.attachRef}
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
  // attachRef: (id: string, el: TextInput) => void
  registerTaskRef: (id: string, node: TextInput | null) => void
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
          ref={(node) => props.registerTaskRef(props.id, node)}
          // ref={(el) => (el != null ? props.attachRef(props.id, el) : '')}
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
