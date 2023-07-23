import { Text, View } from 'react-native'
import { StorageContext } from '../storage/context'
import { useContext } from 'react'

function Checklists() {
  const { checklists } = useContext(StorageContext)

  return (
    <View>
      <Text>Ongoing checklists</Text>
      {checklists.map(checklist => (
        <View>
          <Text style={{ fontWeight: 'bold' }}>{checklist.template.label}</Text>
          {checklist.checkboxes.map(checkbox => {
            return (
              <View>
                <Text>{checkbox.label}</Text>
                <Text>Status: {checkbox.checked}</Text>
              </View>
            )
          })}
          <Text></Text>
        </View>
      ))}
    </View>
  )
}

export default Checklists
