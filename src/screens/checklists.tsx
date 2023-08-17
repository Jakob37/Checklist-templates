import { ScrollView, Text, View } from 'react-native'
import { StorageContext } from '../storage/context'
import { useContext } from 'react'
import { CheckboxStatus } from '../storage/interfaces'
import { IconButton } from '../views/iconbutton'
import { icons } from '../ux/icons'
import { assert } from '../util/util'
import { ds, styles } from '../ux/design'
import { BlueWell } from '../views/wells'
import { makeConfirmDialog } from '../views/dialogs'

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
          <BlueWell style={{ marginTop: ds.padding.s }}>
            <ChecklistHeader
              label={checklist.template.label}
              removeChecklist={() => {
                makeConfirmDialog(
                  `Remove checklist`,
                  `Do you want to remove the ongoing checklist ${checklist.template.label}?`,
                  () => removeChecklist(checklist.id),
                )
              }}
              resetChecklist={() =>
                resetChecklist(checklist.id)
              }></ChecklistHeader>
          </BlueWell>

          <BlueWell style={{ marginTop: ds.padding.xs }}>
            {checklist.checkboxes.map((checkbox, i) => {
              return (
                <View style={{ paddingTop: i !== 0 ? ds.padding.s : 0 }}>
                  <Checkbox
                    key={checkbox.id}
                    checklistId={checklist.id}
                    checkboxId={checkbox.id}
                    checked={checkbox.checked}
                    label={checkbox.label}
                    toggleCheck={toggleCheck}></Checkbox>
                </View>
              )
            })}
          </BlueWell>

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
      <View style={{ height: ds.padding.s }}></View>
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
          containerStyle={{ paddingRight: ds.padding.l }}
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
