import { useContext } from 'react'
import { Text, View } from 'react-native'
import { StorageContext } from '../storage/context'
import { IconButton } from '../views/iconbutton'
import { icons } from '../ux/icons'
import { ds } from '../ux/design'
import {
  CheckboxStatus,
  Checklist,
  ChecklistTemplate,
} from '../storage/interfaces'
import { assert, generateId } from '../util/util'

function SelectChecklist() {
  const { templates, checklists, saveChecklists } = useContext(StorageContext)

  function instantiateTemplate(template: ChecklistTemplate) {
    const defaultStacks = template.stacks.filter(
      stack => stack.label === 'default',
    )

    assert(defaultStacks.length === 1, 'One default stack expected')
    const defaultStack = defaultStacks[0]

    const checkboxes = defaultStack.tasks.map(task => {
      return {
        id: generateId('checkbox'),
        label: task.label,
        checked: CheckboxStatus.unchecked,
      }
    })
    const newChecklist: Checklist = {
      id: generateId('checklist'),
      template: template,
      checkboxes,
    }
    saveChecklists([newChecklist])
    console.log('Instantiating checklist', newChecklist)
  }

  return (
    <View>
      {templates.map((template, i) => (
        <View
          key={String(i)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 10,
            paddingLeft: 10,
          }}>
          <IconButton
            style={{ paddingHorizontal: 10 }}
            onPress={() => instantiateTemplate(template)}
            icon={icons.copy}
            label={template.label}></IconButton>
        </View>
      ))}
    </View>
  )
}

export default SelectChecklist
