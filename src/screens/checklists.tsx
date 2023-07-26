import { Text, View } from 'react-native'
import { StorageContext } from '../storage/context'
import { useContext } from 'react'
import { CheckboxStatus } from '../storage/interfaces'
import { IconButton } from '../views/iconbutton'
import { icons } from '../ux/icons'
import { assert } from '../util/util'

function Checklists() {
  const { checklists, saveChecklists } = useContext(StorageContext)

  function toggleCheck(checklistId: string, checkboxId: string) {
    const targetChecklist = checklists.filter(
      checklist => checklist.id === checklistId,
    )
    assert(targetChecklist.length === 1, 'One checklist expected')

    const updatedChecklist = { ...targetChecklist[0] }
    updatedChecklist.checkboxes = targetChecklist[0].checkboxes.map(
      checkbox => {
        if (checkbox.id === checkboxId) {
          const newChecked =
            checkbox.checked === CheckboxStatus.checked
              ? CheckboxStatus.unchecked
              : CheckboxStatus.checked
          const newCheckbox = { ...checkbox }
          newCheckbox.checked = newChecked
          return newCheckbox
        } else {
          return checkbox
        }
      },
    )

    saveChecklists([
      ...checklists.filter(checklist => checklist.id !== checklistId),
      updatedChecklist,
    ])
  }

  return (
    <View>
      <Text>Ongoing checklists</Text>
      {checklists.map((checklist, i) => (
        <View key={checklist.id}>
          <IconButton
            onPress={() => {
              // FIXME: Generalize with the template logic
              const retainedChecklists = checklists.filter(
                c => c.id !== checklist.id,
              )
              assert(
                retainedChecklists.length === checklists.length - 1,
                `One template less expected after removal`,
              )
              saveChecklists(retainedChecklists)
            }}
            icon={icons.trash}
            label={checklist.template.label}></IconButton>
          {checklist.checkboxes.map(checkbox => {
            console.log(checkbox)
            return (
              <View key={`${checkbox.id}`} style={{ flexDirection: 'row' }}>
                <IconButton
                  onPress={() => {
                    toggleCheck(checklist.id, checkbox.id)
                  }}
                  icon={checkbox.checked === 1 ? icons.check : icons.uncheck}
                  label={`${checkbox.label} (checked ${checkbox.checked})`}></IconButton>
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
