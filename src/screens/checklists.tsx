import { ScrollView, Text, View } from 'react-native'
import { StorageContext } from '../storage/context'
import { useContext } from 'react'
import { CheckboxStatus } from '../storage/interfaces'
import { IconButton } from '../views/iconbutton'
import { icons } from '../ux/icons'
import { assert } from '../util/util'
import { ds, styles } from '../ux/design'

function Checklists() {
  const {
    checklists,
    removeChecklist,
    toggleCheck,
    resetChecklist,
    isChecklistDone,
  } = useContext(StorageContext)

  return (
    <ScrollView>
      {checklists.length === 0 ? (
        <View style={styles.bluePanel}>
          <Text style={{ fontSize: ds.font.sizes.major }}>
            Currently no active checklists
          </Text>
        </View>
      ) : (
        ''
      )}
      {checklists.map((checklist, i) => (
        <View key={checklist.id}>
          <ChecklistHeader
            label={checklist.template.label}
            removeChecklist={() => removeChecklist(checklist.id)}
            resetChecklist={() =>
              resetChecklist(checklist.id)
            }></ChecklistHeader>

          {checklist.checkboxes.map((checkbox) => {
            return (
              <Checkbox
                key={checkbox.id}
                checklistId={checklist.id}
                checkboxId={checkbox.id}
                checked={checkbox.checked}
                label={checkbox.label}
                toggleCheck={toggleCheck}></Checkbox>
            )
          })}

          {isChecklistDone(checklist.id) ? (
            <View style={styles.orangePanel}>
              <IconButton
                onPress={() => {
                  removeChecklist(checklist.id)
                }}
                icon={icons.done}
                size={ds.icons.large}
                labelStyle={{
                  fontSize: ds.font.sizes.huge,
                }}
                label="Done"></IconButton>
            </View>
          ) : (
            ''
          )}
        </View>
      ))}
    </ScrollView>
  )
}

type ChecklistHeaderProps = {
  label: string
  removeChecklist: () => void
  resetChecklist: () => void
}
function ChecklistHeader(props: ChecklistHeaderProps) {
  return (
    <View style={styles.bluePanel}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text
          style={{
            fontWeight: 'bold',
            paddingRight: ds.padding.s,
            fontSize: ds.font.sizes.major,
          }}>
          {props.label}
        </Text>
        <View style={{ flexDirection: 'row' }}>
          <IconButton
            containerStyle={{ paddingRight: ds.padding.m }}
            onPress={() => {
              props.resetChecklist()
            }}
            icon={icons.reset}></IconButton>
          <IconButton
            containerStyle={{ paddingRight: ds.padding.s }}
            onPress={() => {
              props.removeChecklist()
            }}
            icon={icons.trash}></IconButton>
        </View>
      </View>
    </View>
  )
}

type CheckboxProps = {
  toggleCheck: (checklistId: string, checkboxId: string) => void
  checklistId: string
  checkboxId: string
  checked: number
  label: string
}
function Checkbox(props: CheckboxProps) {
  return (
    <View
      key={`${props.checkboxId}`}
      style={[
        styles.bluePanel,
        {
          flexDirection: 'row',
          alignItems: 'center',
        },
      ]}>
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
