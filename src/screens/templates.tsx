import { useContext } from 'react'
import { Text, View } from 'react-native'
import { StorageContext } from '../storage/context'
import { IconButton } from '../views/iconbutton'
import { icons } from '../ux/icons'
import { ds } from '../ux/design'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Checklist } from '../storage/interfaces'

function SelectChecklist() {
  const { templates, checklists, saveChecklists } = useContext(StorageContext)

  function instantiateTemplate() {
    const dummyChecklist: Checklist = {
      id: String(Date.now()),
      template: templates[0],
      checkboxes: [],
    }
    saveChecklists([dummyChecklist])
    console.log('Instantiating checklist')
  }

  return (
    <View>
      {templates.map(template => (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 10,
            paddingLeft: 10,
          }}>
          <Text>{template.label}</Text>
          <IconButton
            style={{ paddingHorizontal: 10 }}
            onPress={instantiateTemplate}
            icon={icons.copy}
            size={ds.icons.size}
            color={ds.colors.primary}></IconButton>
        </View>
      ))}
    </View>
  )
}

export default SelectChecklist
