import { useContext, useEffect } from 'react'
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
import { instantiateTemplate } from '../storage/util'
import { ds } from '../ux/design'
import { useNavigation } from '@react-navigation/native'

const PADDING = 10

function Templates() {
  const {
    templates,
    removeTemplate,
    saveChecklist: createChecklist,
  } = useContext(StorageContext)

  const navigate = useNavigation()

  return (
    <View>
      {templates.map((template, i) => (
        <View
          key={String(i)}
          style={{
            paddingVertical: PADDING,
            paddingLeft: PADDING,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View>
            <IconButton
              iconStyle={{ paddingHorizontal: PADDING }}
              onPress={() => {
                const checklist = instantiateTemplate(template)
                createChecklist(checklist)
                navigate.navigate('Checklists')
              }}
              icon={icons.done}
              label={template.label}></IconButton>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <IconButton
              iconStyle={{ paddingHorizontal: ds.padding.s }}
              onPress={() => {
                removeTemplate(template.id)
              }}
              icon={icons.trash}></IconButton>
            <IconButton
              iconStyle={{ paddingHorizontal: ds.padding.s }}
              onPress={() => {
                navigate.navigate('Make template', {
                  templateId: template.id,
                  isNew: false,
                })
              }}
              icon={icons.pen}></IconButton>
            <IconButton
              iconStyle={{ paddingHorizontal: ds.padding.s }}
              onPress={() => {
                navigate.navigate('Make template', {
                  templateId: template.id,
                  isNew: true,
                })
              }}
              icon={icons.copy}></IconButton>
          </View>
        </View>
      ))}
    </View>
  )
}

export default Templates
