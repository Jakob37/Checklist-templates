import { Text, View } from 'react-native'
import { StorageContext } from '../storage/context'
import { useContext } from 'react'

function Checklists() {
  const { checklists } = useContext(StorageContext)

  return (
    <View>
      <Text>Ongoing checklists</Text>
      {checklists.map(checklist => (
        <Text>{checklist.template.label}</Text>
      ))}
    </View>
  )
}

export default Checklists
