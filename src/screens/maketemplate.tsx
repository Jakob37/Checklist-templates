import { Button, Modal, ScrollView, Text, TextInput, View } from 'react-native'

import { useIsFocused, useNavigation } from '@react-navigation/native'
import { useContext, useEffect, useState } from 'react'
import { StorageContext } from '../storage/context'
import { Task } from '../storage/interfaces'
import { buildTemplateObject } from '../storage/util'
import { generateId } from '../util/util'
import { ds, styles } from '../ux/design'
import { icons } from '../ux/icons'
import { IconButton } from '../views/iconbutton'
import { BlueWell } from '../views/wells'
import { mutateStateAtIndex, removeStateAtIndex } from '../util/state'
import { SimpleInputModal } from '../views/dialogs'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { FloatingButton } from '../views/floatingbutton'

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
      sections.map((section) => {
        return {
          label: section.sectionLabel,
          tasks: section.tasks.map((task) => task.label),
        }
      }),
    )
    saveTemplate(template)
    reset()
    // @ts-ignore
    navigate.navigate('Templates')
  }

  function reset() {
    setTaskLabel('')
    setTemplateName('')
    setDefaultTasks([])
    setTemplateId(generateId('template'))
  }

  function addSection(sectionLabel: string) {
    const newSection = {
      sectionLabel,
      enterTaskLabel: '',
      tasks: [],
    }
    setSections([...sections, newSection])
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.bluePanel}>
          <TextInput
            placeholder="Enter template name"
            value={templateName}
            onChangeText={(text) => setTemplateName(text)}></TextInput>
        </View>

        <View style={styles.bluePanel}>
          <ChecklistSection
            sectionLabel=""
            enterTaskLabel={taskLabel}
            onChangeTaskLabel={(text) => setTaskLabel(text)}
            onAddCheckbox={handleAddDefaultCheckbox}
            onRenameCheckbox={(text, i) => {
              defaultTasks[i].label = text
            }}
            tasks={defaultTasks}
            onRemoveTask={handleRemoveTask}
            onRemoveSection={() => {}}></ChecklistSection>
        </View>

        {sections.length > 0 ? (
          <View>
            {sections.map((section, sectionIndex) => {
              return (
                <View key={String(sectionIndex)} style={styles.bluePanel}>
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
                    onAddCheckbox={() => {
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
                </View>
              )
            })}
          </View>
        ) : (
          ''
        )}

        {/* FIXME: Fix the styling here */}

        <SimpleInputModal
          modalVisible={modalVisible}
          onSubmit={() => {
            addSection(newSectionLabel)
            setModalVisible(false)
          }}
          onCancel={() => {
            setModalVisible(false)
          }}></SimpleInputModal>

        <BlueWell style={{ paddingTop: ds.sizes.s }}>
          {addingNewSectionNew ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TextInput
                placeholder="Enter label"
                onChangeText={(text) =>
                  setNewEnterSectionLabel(text)
                }></TextInput>
              <View style={{ flexDirection: 'row' }}>
                <IconButton
                  icon={icons.done}
                  containerStyle={{ paddingRight: ds.sizes.s }}
                  onPress={() => {
                    if (newEnterSectionLabel === '') {
                      console.log('You need to enter a value')
                      return
                    }
                    setAddingNewSectionNew(false)
                    addSection(newEnterSectionLabel)
                  }}></IconButton>
                {/* FIXME: Cross icon */}
                <IconButton
                  icon={icons.trash}
                  onPress={() => {
                    setAddingNewSectionNew(false)
                  }}></IconButton>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => {
                // addSection()
                setAddingNewSectionNew(true)
              }}>
              <Text>Click to add new section</Text>
            </TouchableOpacity>
          )}
        </BlueWell>

        {templateName !== '' && defaultTasks.length > 0 ? (
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
  onAddCheckbox: () => void
  onRenameCheckbox: (newName: string, index: number) => void
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
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ paddingRight: ds.sizes.s }}>
          <IconButton
            onPress={props.onAddCheckbox}
            icon={icons.plus}></IconButton>
        </View>

        <EnterTask
          taskLabel={props.enterTaskLabel}
          onAddCheckbox={props.onAddCheckbox}
          onChangeText={props.onChangeTaskLabel}></EnterTask>
      </View>

      {props.tasks.map((task, i) => (
        <ChecklistTask
          key={task.id}
          handleRemoveTask={props.onRemoveTask}
          onRenameTask={(newLabel) => {
            props.onRenameCheckbox(newLabel, i)
          }}
          id={task.id}
          label={task.label}></ChecklistTask>
      ))}
    </View>
  )
}

type EnterTaskProps = {
  taskLabel: string
  onAddCheckbox: () => void
  onChangeText: (text: string) => void
}
function EnterTask(props: EnterTaskProps) {
  return (
    <TextInput
      placeholder="Enter task..."
      value={props.taskLabel}
      onSubmitEditing={props.onAddCheckbox}
      editable={true}
      onChangeText={(text) => props.onChangeText(text)}></TextInput>
  )
}

type ChecklistTaskProps = {
  handleRemoveTask: (id: string) => void
  onRenameTask: (newName: string) => void
  label: string
  id: string
}
function ChecklistTask(props: ChecklistTaskProps) {
  const [isEditMode, setIsEditMode] = useState(false)
  const [editText, setEditText] = useState('')

  return (
    <View>
      {isEditMode ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TextInput
            placeholder={props.label}
            onChangeText={(text) => setEditText(text)}></TextInput>
          <View style={{ flexDirection: 'row' }}>
            {/* FIXME: Use same styling as the non edit mode */}
            <IconButton
              iconStyle={{ paddingRight: ds.sizes.s }}
              icon={icons.close}
              onPress={() => {
                setIsEditMode(false)
              }}></IconButton>
            <IconButton
              icon={icons.save}
              onPress={() => {
                props.onRenameTask(editText)
                setIsEditMode(false)
              }}></IconButton>
          </View>
        </View>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            paddingBottom: ds.sizes.s,
            justifyContent: 'space-between',
            paddingLeft: ds.sizes.s,
          }}>
          <View>
            <Text style={{ fontSize: ds.font.sizes.minor }}>{props.label}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <IconButton
              onPress={() => {
                setIsEditMode(true)
              }}
              icon={icons.pen}
              size={ds.icons.medium}
              color="white"
              iconStyle={{ paddingHorizontal: ds.sizes.s }}></IconButton>
            <IconButton
              onPress={() => {
                props.handleRemoveTask(props.id)
              }}
              icon={icons.trash}
              size={ds.icons.medium}
              color="white"
              iconStyle={{ paddingHorizontal: ds.sizes.s }}></IconButton>
          </View>
        </View>
      )}
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
