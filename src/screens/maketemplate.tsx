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

const PADDING_TEMP = 10

type SectionState = {
  sectionLabel: string
  enterTaskLabel: string
  tasks: Task[]
}

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
      taskLabel: '',
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
                      const sectionsCopy = [...sections]
                      sectionsCopy[i].enterTaskLabel = text
                      setSections(sectionsCopy)
                    }}
                    onAddCheckbox={() => {
                      // FIXME: Can this state not be handled by the section?
                      const sectionsCopy = [...sections]
                      const newTask: Task = {
                        id: generateId('task'),
                        label: sectionsCopy[i].enterTaskLabel,
                      }
                      sectionsCopy[i].tasks.push(newTask)
                      sectionsCopy[i].enterTaskLabel = ''
                      setSections(sectionsCopy)
                    }}
                    tasks={section.tasks}
                    onRemoveTask={(taskId) => {
                      const sectionsCopy = [...sections]
                      sectionsCopy[i].tasks = sectionsCopy[i].tasks.filter(
                        (task) => task.id !== taskId,
                      )
                      setSections(sectionsCopy)
                    }}
                    onRemoveSection={() => {
                      const sectionsCopy = [...sections]
                      sectionsCopy.splice(i, 1)
                      setSections(sectionsCopy)
                    }}></ChecklistSection>
                </View>
              )
            })}
          </View>
        ) : (
          ''
        )}

        {/* <View style={styles.bluePanel}>
        <TextInput
          placeholder="Enter section label"
          onChangeText={(text) => setNewSectionLabel(text)}></TextInput>
        <IconButton
          onPress={addSection}
          icon={icons.plus}
          size={ds.icons.medium}
          label={'Add section'}
          color={ds.colors.primary}></IconButton>
      </View> */}

        {/* FIXME: Fix the styling here */}

        <Modal visible={modalVisible} animationType="fade" transparent={true}>
          <View style={styles.modalContainer}>
            <View
              style={{
                width: '80%',
                backgroundColor: ds.colors.secondary,
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
              <View style={{ padding: ds.padding.s }}>
                <TextInput
                  placeholder="Section name"
                  onChangeText={(text) => setNewSectionLabel(text)}></TextInput>
              </View>

              <View
                style={{
                  paddingBottom: ds.padding.s,
                  paddingHorizontal: ds.padding.s,
                  flexDirection: 'row',
                }}>
                <View style={{ paddingRight: ds.padding.s }}>
                  <Button
                    title="Submit"
                    onPress={() => {
                      console.log('More action coming here!')
                      addSection()
                      setModalVisible(false)
                    }}
                  />
                </View>
                <View>
                  <Button
                    title="Cancel"
                    onPress={() => setModalVisible(false)}
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>

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
