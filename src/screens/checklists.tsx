import { Text, View } from 'react-native'
import { StorageContext } from '../storage/context'
import { useContext } from 'react'
import { CheckboxStatus } from '../storage/interfaces'
import { IconButton } from '../views/iconbutton'
import { icons } from '../ux/icons'
import { assert } from '../util/util'
import { ds } from '../ux/design'

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
      {checklists.length === 0 ? (
        <Text>Currently no active checklists</Text>
      ) : (
        ''
      )}
      {checklists.map((checklist, i) => (
        <View key={checklist.id}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingBottom: 20,
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                paddingRight: ds.spacing.s,
              }}>
              {checklist.template.label}
            </Text>
            <IconButton
              onPress={() => {
                removeChecklist(checklist.id)
              }}
              icon={icons.trash}
              label=""></IconButton>
          </View>
          {checklist.checkboxes.map((checkbox) => {
            return (
              <Checkbox
                checklistId={checklist.id}
                checkboxId={checkbox.id}
                checked={checkbox.checked}
                label={checkbox.label}
                toggleCheck={toggleCheck}></Checkbox>
            )
          })}
          <IconButton
            onPress={() => {
              resetChecklist(checklist.id)
            }}
            icon={icons.reset}
            label="Reset all"
            containerStyle={{
              paddingTop: ds.spacing.l,
              paddingBottom: ds.spacing.s,
            }}></IconButton>
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

function Checkbox(props) {
  return (
    <View
      key={`${props.checklistId}`}
      style={{ flexDirection: 'row', paddingBottom: ds.spacing.s }}>
      <IconButton
        onPress={() => {
          props.toggleCheck(props.checklistId, props.checkboxId)
        }}
        icon={props.checked === 1 ? icons.uncheck : icons.check}
        label={`${props.label}`}></IconButton>
    </View>
  )
}

export default Checklists
