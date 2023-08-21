import { Button, ScrollView, Text, TextInput, View } from 'react-native'

import { useIsFocused, useNavigation } from '@react-navigation/native'
import { useContext, useEffect, useState } from 'react'
import { StorageContext } from '../storage/context'
import { Task } from '../storage/interfaces'
import { buildTemplateObject } from '../storage/util'
import { mutateStateAtIndex, removeStateAtIndex } from '../util/state'
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

  const [templateName, setTemplateName] = useState('')
  const [taskLabel, setTaskLabel] = useState('')
  const [templateId, setTemplateId] = useState(generateId('template'))
  const { saveTemplate, getTemplateById } = useContext(StorageContext)

  const [defaultTasks, setDefaultTasks] = useState<Task[]>([])
  const [sections, setSections] = useState<SectionState[]>([])
  const [newSectionLabel, setNewSectionLabel] = useState('')
  const [modalVisible, setModalVisible] = useState(false)

  const [addingNewSectionNew, setAddingNewSectionNew] = useState(false)
  const [newEnterSectionLabel, setNewEnterSectionLabel] = useState('')

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

  const handleAddDefaultTask = () => {
    const newTask: Task = {
      id: String(Date.now()),
      label: '',
    }
    setDefaultTasks([...defaultTasks, newTask])
    // setTaskLabel('')
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
    setDefaultTasks([])
    setTemplateId(generateId('template'))
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <BlueWell style={{ marginTop: ds.sizes.s }}>
          <TextInput
            placeholder="Enter template name"
            value={templateName}
            onChangeText={(text) => setTemplateName(text)}></TextInput>
        </BlueWell>

        <BlueWell style={{ marginTop: ds.sizes.s }}>
          <ChecklistSection
            sectionLabel=""
            enterTaskLabel={taskLabel}
            onChangeTaskLabel={(text) => setTaskLabel(text)}
            onAddTask={handleAddDefaultTask}
            onRenameTask={(id, text) => {
              console.log(`Renaming ${id} ${text}`)
              const taskIndex = defaultTasks.findIndex((task) => task.id === id)
              // defaultTasks[taskIndex].label = text
              const tasks = [...defaultTasks]
              tasks[taskIndex].label = text
              setDefaultTasks(tasks)
            }}
            tasks={defaultTasks}
            onRemoveTask={handleRemoveTask}
            onRemoveSection={() => {
              console.error('Cannot remove default section')
            }}></ChecklistSection>
        </BlueWell>

        {/* {sections.length > 0 ? (
          <View>
            {sections.map((section, sectionIndex) => {
              return (
                <BlueWell key={String(sectionIndex)}>
                  <ChecklistSection
                    sectionLabel={section.sectionLabel}
                    enterTaskLabel={section.enterTaskLabel}
                    onChangeTaskLabel={(text) => {
                      mutateStateAtIndex(
                        sections,
                        setSections,
                        sectionIndex,
                        (section) => (section.enterTaskLabel = text),
                      )
                    }}
                    onRenameCheckbox={(newLabel, taskIndex) => {
                      console.log('FIXME: Rename action')
                      mutateStateAtIndex(
                        sections,
                        setSections,
                        sectionIndex,
                        (section) =>
                          (section.tasks[taskIndex].label = newLabel),
                      )
                    }}
                    onAddTask={() => {
                      console.log('Adding task')
                      mutateStateAtIndex(
                        sections,
                        setSections,
                        sectionIndex,
                        (section) => {
                          const newTask: Task = {
                            id: generateId('task'),
                            label: section.enterTaskLabel,
                          }
                          section.tasks.push(newTask)
                          section.enterTaskLabel = ''
                        },
                      )
                    }}
                    tasks={section.tasks}
                    onRemoveTask={(taskId) => {
                      mutateStateAtIndex(
                        sections,
                        setSections,
                        sectionIndex,
                        (section) => {
                          const updatedTasks = section.tasks.filter(
                            (task) => task.id !== taskId,
                          )
                          section.tasks = updatedTasks
                          section.enterTaskLabel = ''
                        },
                      )
                    }}
                    onRemoveSection={() => {
                      removeStateAtIndex(sections, setSections, sectionIndex)
                    }}></ChecklistSection>
                </BlueWell>
              )
            })}
          </View>
        ) : (
          ''
        )} */}

        {templateName !== '' &&
        defaultTasks.filter((task) => task.label !== '').length > 0 ? (
          <SaveTemplate onSubmit={handleSubmitList}></SaveTemplate>
        ) : (
          ''
        )}
      </ScrollView>
    </View>
  )
}

type ChecklistSectionProps = {
  sectionLabel: string
  enterTaskLabel: string
  onChangeTaskLabel: (text: string) => void
  onAddTask: () => void
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
      <Button
        onPress={props.onAddTask}
        color={ds.colors.highlight1}
        title="Add task"></Button>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {/* <View style={{ paddingRight: ds.sizes.s }}>
          <IconButton
            onPress={props.onAddCheckbox}
            icon={icons.plus}></IconButton>
        </View> */}

        {/* <EnterTask
          taskLabel={props.enterTaskLabel}
          onAddCheckbox={props.onAddCheckbox}
          onChangeText={props.onChangeTaskLabel}></EnterTask> */}
      </View>

      {props.tasks.map((task) => (
        <ChecklistTask
          key={task.id}
          onRemoveTask={props.onRemoveTask}
          onRenameTask={props.onRenameTask}
          id={task.id}
          label={task.label}></ChecklistTask>
      ))}
    </View>
  )
}

// type EnterTaskProps = {
//   taskLabel: string
//   onAddCheckbox: () => void
//   onChangeText: (text: string) => void
// }
// function EnterTask(props: EnterTaskProps) {
//   return (
//     <TextInput
//       placeholder="Enter task..."
//       value={props.taskLabel}
//       onSubmitEditing={props.onAddCheckbox}
//       editable={true}
//       onChangeText={(text) => props.onChangeText(text)}></TextInput>
//   )
// }

type ChecklistTaskProps = {
  id: string
  label: string
  onRemoveTask: (id: string) => void
  onRenameTask: (id: string, text: string) => void
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
        placeholder="Enter your task..."
        onChangeText={(text) => {
          props.onRenameTask(props.id, text)
        }}>
        {props.label}
      </TextInput>
      <IconButton
        icon={icons.trash}
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
