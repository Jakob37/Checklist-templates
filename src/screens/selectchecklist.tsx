import { useContext } from 'react'
import { Text, View } from 'react-native'
import { StorageContext } from '../storage/context'

// FIXME: Shared location for the interfaces
interface ChecklistTemplate {
  id: string
  label: string
  stacks: TaskStack[]
}

interface TaskStack {
  id: string
  label: string
  tasks: Task[]
}

interface Task {
  id: string
  label: string
}

function SelectChecklist() {
  const { templates } = useContext(StorageContext)

  return (
    <View>
      <Text>Select checklist</Text>
      {templates.map(template => (
        <Text>{template.label}</Text>
      ))}
    </View>
  )
}

export default SelectChecklist
