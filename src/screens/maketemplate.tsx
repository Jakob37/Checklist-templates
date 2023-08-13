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
import { SimpleInputModal } from '../views/modal'

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
    // @ts-ignore
    navigate.navigate('Templates')
  }

  function reset() {
    setTaskLabel('')
    setTemplateName('')
    setDefaultTasks([])
    setTemplateId(generateId('template'))
  }

  function addSection() {
    const newSection = {
      sectionLabel: newSectionLabel,
      enterTaskLabel: '',
      tasks: [],
    }
    setSections([...sections, newSection])
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
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
            tasks={defaultTasks}
            onRemoveTask={handleRemoveTask}
            onRemoveSection={() => {}}></ChecklistSection>
        </View>

        {sections.length > 0 ? (
          <View>
            {sections.map((section, i) => {
              return (
                <View key={String(i)} style={styles.bluePanel}>
                  <ChecklistSection
                    sectionLabel={section.sectionLabel}
                    enterTaskLabel={section.enterTaskLabel}
                    onChangeTaskLabel={(text) => {
                      mutateStateAtIndex(
                        sections,
                        setSections,
                        i,
                        (section) => (section.enterTaskLabel = text),
                      )
                    }}
                    onAddCheckbox={() => {
                      mutateStateAtIndex(
                        sections,
                        setSections,
                        i,
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
                        i,
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
                      removeStateAtIndex(sections, setSections, i)
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
            addSection()
            setModalVisible(false)
          }}
          onCancel={() => {
            setModalVisible(false)
          }}></SimpleInputModal>

        {templateName !== '' && defaultTasks.length > 0 ? (
          <SaveTemplate onSubmit={handleSubmitList}></SaveTemplate>
        ) : (
          ''
        )}
      </ScrollView>

      <BlueWell
        style={{
          width: '33%',
          position: 'absolute',
          bottom: ds.padding.s,
          right: 0,
        }}>
        <IconButton
          onPress={() => {
            setModalVisible(true)
          }}
          icon={icons.plus}
          label={'Add section'}></IconButton>
      </BlueWell>
    </View>
  )
}

type ChecklistSectionProps = {
  sectionLabel: string
  enterTaskLabel: string
  onChangeTaskLabel: (text: string) => void
  onAddCheckbox: () => void
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
        <View style={{ paddingRight: ds.padding.s }}>
          <IconButton
            onPress={props.onAddCheckbox}
            icon={icons.plus}></IconButton>
        </View>

        <EnterTask
          taskLabel={props.enterTaskLabel}
          onAddCheckbox={props.onAddCheckbox}
          onChangeText={props.onChangeTaskLabel}></EnterTask>
      </View>

      {props.tasks.map((task) => (
        <ChecklistTask
          key={task.id}
          handleRemoveTask={props.onRemoveTask}
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
          iconStyle={{ paddingHorizontal: ds.padding.s }}></IconButton>
        <IconButton
          onPress={() => {
            props.handleRemoveTask(props.id)
          }}
          icon={icons.trash}
          size={ds.icons.medium}
          color="white"
          iconStyle={{ paddingHorizontal: ds.padding.s }}></IconButton>
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
        iconStyle={{ paddingHorizontal: ds.padding.s }}
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
