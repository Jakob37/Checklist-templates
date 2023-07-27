import { useContext } from 'react'
import { View } from 'react-native'
import { StorageContext } from '../storage/context'
import {
  CheckboxStatus,
  Checklist,
  ChecklistTemplate,
} from '../storage/interfaces'
import { generateId } from '../util/util'
import { icons } from '../ux/icons'
import { IconButton } from '../views/iconbutton'

function SelectChecklist() {
  const { templates, removeTemplate, createChecklist } =
    useContext(StorageContext)

  function instantiateTemplate(template: ChecklistTemplate) {
    const checkboxes = template.stacks.flatMap((stack) => {
      return stack.tasks.map((task, i) => {
        return {
          id: generateId(`checkbox-${i}`),
          label: task.label,
          checked: CheckboxStatus.unchecked,
        }
      })
    })

    const newChecklist: Checklist = {
      id: generateId('checklist'),
      template: template,
      checkboxes,
    }
    createChecklist(newChecklist)
    console.log(
      'Instantiating checklist',
      JSON.stringify(newChecklist, null, 2),
    )
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
          <IconButton
            style={{ paddingHorizontal: 10 }}
            onPress={() => {
              removeTemplate(template.id)
            }}
            icon={icons.trash}></IconButton>
        </View>
      ))}
    </View>
  )
}

export default SelectChecklist
