import { Text, View } from 'react-native'
import { StorageContext } from '../storage/context'
import { useContext } from 'react'
import { CheckboxStatus } from '../storage/interfaces'
import { IconButton } from '../views/iconbutton'
import { icons } from '../ux/icons'

function Checklists() {
  const { checklists } = useContext(StorageContext)

  return (
    <View>
      <Text>Ongoing checklists</Text>
      {checklists.map((checklist, i) => (
        <View key={checklist.id}>
          <Text style={{ fontWeight: 'bold' }}>{checklist.template.label}</Text>
          {checklist.checkboxes.map(checkbox => {
            return (
              <View key={checkbox.id} style={{ flexDirection: 'row' }}>
                <IconButton
                  onPress={() => {
                    if (checkbox.checked === 1) {
                      checkbox.checked = 2
                    } else {
                      checkbox.checked = 1
                    }
                  }}
                  icon={checkbox.checked === 1 ? icons.check : icons.uncheck}
                  label={checkbox.label}></IconButton>
              </View>
            )
          })}
          <Text></Text>
        </View>
      ))}
    </View>
  )
}

function Checkbox(checkboxStatus: CheckboxStatus) {
  if (checkboxStatus === CheckboxStatus.checked) {
    return <IconButton onPress={() => {}} icon={icons.check} />
  } else if (checkboxStatus === CheckboxStatus.unchecked) {
    return 'o'
  } else {
    return '-'
  }
}

export default Checklists
