import { useContext } from 'react'
import { Text, View } from 'react-native'
import { StorageContext } from '../storage/context'

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
