import { Button, ScrollView, Text, View } from 'react-native'
import { StorageContext } from '../storage/context'
import { useContext } from 'react'
import { IconButton } from '../views/iconbutton'
import { icons } from '../ux/icons'
import { ds, styles } from '../ux/design'
import { BlueWell } from '../views/wells'
import { useNavigation } from '@react-navigation/native'
import { Header, MinorText } from '../views/text'

function Checklists() {
  const {
    checklists,
    removeChecklist,
    toggleCheck,
    resetChecklist,
    isChecklistDone,
  } = useContext(StorageContext)

  const navigate = useNavigation()

  return (
    <ScrollView>
      {checklists.length === 0 ? (
        <BlueWell style={{ marginTop: ds.sizes.s }}>
          <MinorText style={{ fontSize: ds.text.sizes.major }}>
            Currently no active checklists
          </MinorText>
          <View style={{ paddingTop: ds.sizes.s }}>
            <Button
              onPress={() => {
                // @ts-ignore
                navigate.navigate('Templates')
              }}
              title="Go to templates"
              color={ds.colors.highlight1}></Button>
          </View>
        </BlueWell>
      ) : (
        ''
      )}
      {checklists
        .sort((c1, c2) => {
          return c1.timecreated > c2.timecreated ? 1 : -1
        })
        .map((checklist, i) => (
          <View key={checklist.id}>
            <BlueWell style={{ marginTop: ds.sizes.s }}>
              <ChecklistHeader
                label={checklist.template.label}
                removeChecklist={() => {
                  removeChecklist(checklist.id)
                }}
                resetChecklist={() =>
                  resetChecklist(checklist.id)
                }></ChecklistHeader>
            </BlueWell>

            <BlueWell style={{ marginTop: ds.sizes.xs }}>
              {checklist.checkboxes.map((checkbox, i) => {
                return (
                  <View
                    key={checkbox.id}
                    style={{ paddingTop: i !== 0 ? ds.sizes.s : 0 }}>
                    <Checkbox
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
                    fontSize: ds.text.sizes.huge,
                  }}
                  label="Done"></IconButton>
              </View>
            ) : (
              ''
            )}
          </View>
        ))}
      <View style={{ height: ds.sizes.s }}></View>
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
      <Header text={props.label}></Header>
      <View style={{ flexDirection: 'row' }}>
        <IconButton
          containerStyle={{ paddingRight: ds.sizes.l }}
          onPress={() => {
            props.resetChecklist()
          }}
          icon={icons.reset}></IconButton>
        <IconButton
          containerStyle={{ paddingRight: ds.sizes.s }}
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
