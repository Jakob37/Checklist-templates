import { Text, View } from 'react-native'
import { StorageContext } from '../storage/context'
import { useContext } from 'react'
import { CheckboxStatus } from '../storage/interfaces'
import { IconButton } from '../views/iconbutton'
import { icons } from '../ux/icons'
import { assert } from '../util/util'

function Checklists() {
  const {
    checklists,
    removeChecklist,
    toggleCheck,
    resetChecklist,
    isChecklistDone,
  } = useContext(StorageContext)

  return (
    <View>
      <Text>Ongoing checklists</Text>
      {checklists.map((checklist, i) => (
        <View key={checklist.id}>
          <IconButton
            onPress={() => {
              removeChecklist(checklist.id)
            }}
            icon={icons.trash}
            label={checklist.template.label}></IconButton>
          {checklist.checkboxes.map((checkbox) => {
            return (
              <View key={`${checkbox.id}`} style={{ flexDirection: 'row' }}>
                <IconButton
                  onPress={() => {
                    toggleCheck(checklist.id, checkbox.id)
                  }}
                  icon={checkbox.checked === 1 ? icons.uncheck : icons.check}
                  label={`${checkbox.label}`}></IconButton>
              </View>
            )
          })}
          <IconButton
            onPress={() => {
              resetChecklist(checklist.id)
            }}
            icon={icons.reset}
            label="Reset all"></IconButton>
          {isChecklistDone(checklist.id) ? (
            <IconButton
              onPress={() => {
                removeChecklist(checklist.id)
              }}
              icon={icons.done}
              label="Done"></IconButton>
          ) : (
            ''
          )}
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
