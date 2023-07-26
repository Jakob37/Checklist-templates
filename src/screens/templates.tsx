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
  const { templates, saveTemplates, checklists, saveChecklists } =
    useContext(StorageContext)

  function instantiateTemplate(template: ChecklistTemplate) {
    const checkboxes = template.stacks.flatMap(stack => {
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
    saveChecklists([...checklists, newChecklist])
    console.log(
      'Instantiating checklist',
      JSON.stringify(newChecklist, null, 2),
    )
  }

  function removeTemplate(id: string) {
    const retainedTemplates = templates.filter(template => template.id !== id)
    assert(
      retainedTemplates.length === templates.length - 1,
      `One template less expected after removal`,
    )
    saveTemplates(retainedTemplates)
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
