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
  const { templates, removeTemplate, saveChecklist } =
    useContext(StorageContext)

  const navigate = useNavigation()

  return (
    <View>
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          onInstantiate={() => {
            const checklist = instantiateTemplate(template)
            printObject(checklist)
            saveChecklist(checklist)
            navigate.navigate('Checklists')
          }}
          onRemove={() => {
            removeTemplate(template.id)
          }}
          onCopy={() => {
            navigate.navigate('Make template', {
              templateId: template.id,
              isNew: true,
            })
          }}
          onEdit={() => {
            navigate.navigate('Make template', {
              templateId: template.id,
              isNew: false,
            })
          }}></TemplateCard>
      ))}
    </View>
  )
}

function TemplateCard(props) {
  return (
    <View
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
          onPress={props.onSave}
          icon={icons.done}
          label={`${props.template.label}`}></IconButton>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <IconButton
          iconStyle={{ paddingHorizontal: ds.padding.s }}
          onPress={props.onRemove}
          icon={icons.trash}></IconButton>
        <IconButton
          iconStyle={{ paddingHorizontal: ds.padding.s }}
          onPress={props.onEdit}
          icon={icons.pen}></IconButton>
        <IconButton
          iconStyle={{ paddingHorizontal: ds.padding.s }}
          onPress={props.onCopy}
          icon={icons.copy}></IconButton>
        <IconButton
          iconStyle={{ paddingHorizontal: ds.padding.s }}
          onPress={() => {
            console.log(
              `${props.template.label} ${props.template.id} ${JSON.stringify(
                props.template.stacks,
                null,
                2,
              )}`,
            )
          }}
          icon={icons.info}></IconButton>
      </View>
    </View>
  )
}

export default Templates
