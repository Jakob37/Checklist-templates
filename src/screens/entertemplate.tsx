import { FlatList, Text, TextInput, View } from 'react-native'

import { useContext, useState } from 'react'
import { StorageContext } from '../storage/context'
import { ds } from '../ux/design'
import { icons } from '../ux/icons'
import { IconButton } from '../views/iconbutton'
import { ChecklistTemplate, Task, TaskStack } from '../storage/interfaces'
import { generateId } from '../util/util'

const PADDING_TEMP = 10

function EnterTemplate() {
  const [templateName, setTemplateName] = useState('')
  const [taskLabel, setTaskLabel] = useState('')
  const { templates, saveTemplates } = useContext(StorageContext)

  const [tasks, setTasks] = useState<Task[]>([])

  const handleAddCheckbox = () => {
    if (taskLabel !== '') {
      const newTask: Task = {
        id: String(Date.now()),
        label: taskLabel,
      }
      setTasks([...tasks, newTask])
      setTaskLabel('')
    }
  }

  const handleRemoveTask = (id: string) => {
    const updatedCheckboxes = tasks.filter(checkbox => checkbox.id !== id)
    setTasks(updatedCheckboxes)
  }

  const handleSubmitList = () => {
    const updatingTemplates = [...templates]

    const template = makeTemplate(
      templateName,
      // FIXME: Omit this double work
      tasks.map(task => task.label),
    )

    updatingTemplates.push(template)
    saveTemplates(updatingTemplates)

    reset()
  }

  function reset() {
    setTaskLabel('')
    setTemplateName('')
    setTasks([])
  }

  return (
    <View>
      <TextInput
        placeholder="Name"
        value={templateName}
        onChangeText={text => setTemplateName(text)}></TextInput>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <IconButton
          style={{ paddingHorizontal: PADDING_TEMP }}
          onPress={handleAddCheckbox}
          icon={icons.plus}
          size={ds.icons.size}
          color={ds.colors.primary}></IconButton>

        <TextInput
          placeholder="Enter..."
          value={taskLabel}
          onChangeText={text => setTaskLabel(text)}></TextInput>
      </View>

      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row' }}>
            <IconButton
              onPress={() => {
                handleRemoveTask(item.id)
              }}
              icon={icons.trash}
              size={ds.icons.size}
              color="white"
              style={{ paddingHorizontal: PADDING_TEMP }}></IconButton>
            <Text style={{ fontSize: ds.font.sizes.major }}>{item.label}</Text>
          </View>
        )}></FlatList>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingTop: PADDING_TEMP,
        }}>
        <IconButton
          style={{ paddingHorizontal: PADDING_TEMP }}
          onPress={handleSubmitList}
          icon={icons.save}
          size={ds.icons.size}
          color={ds.colors.primary}></IconButton>
        <Text>Save template</Text>
      </View>
    </View>
  )
}

function makeTemplate(
  templateName: string,
  taskLabels: string[],
): ChecklistTemplate {
  const templateId = generateId('template')

  const tasks: Task[] = taskLabels.map(label => {
    return {
      id: generateId('task'),
      label,
    }
  })

  const stackId = generateId('stack')
  const stack: TaskStack = {
    id: stackId,
    label: 'default',
    tasks,
  }
  const stacks: TaskStack[] = [stack]

  return {
    id: templateId,
    label: templateName,
    stacks,
  }
}

export default EnterTemplate
