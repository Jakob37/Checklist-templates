import { useNavigation } from '@react-navigation/native'
import { useContext } from 'react'
import { View } from 'react-native'
import { StorageContext } from '../storage/context'
import { instantiateTemplate } from '../storage/util'
import { ds } from '../ux/design'
import { icons } from '../ux/icons'
import { IconButton } from '../views/iconbutton'
import { printObject } from '../util/util'

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
                printObject(checklist)
                createChecklist(checklist)
                navigate.navigate('Checklists')
              }}
              icon={icons.done}
              label={`${template.label}`}></IconButton>
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
            <IconButton
              iconStyle={{ paddingHorizontal: ds.padding.s }}
              onPress={() => {
                console.log(
                  `${template.label} ${template.id} ${JSON.stringify(
                    template.stacks,
                    null,
                    2,
                  )}`,
                )
              }}
              icon={icons.info}></IconButton>
          </View>
        </View>
      ))}
    </View>
  )
}

export default Templates
