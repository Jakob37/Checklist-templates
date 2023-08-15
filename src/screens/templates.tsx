import { useNavigation } from '@react-navigation/native'
import { useContext, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { StorageContext } from '../storage/context'
import { instantiateTemplate } from '../storage/util'
import { ds } from '../ux/design'
import { icons } from '../ux/icons'
import { IconButton } from '../views/iconbutton'
import { ViewTemplate } from './viewtemplate'
import { ChecklistTemplate } from '../storage/interfaces'

function Templates() {
  const { templates, removeTemplate, saveChecklist } =
    useContext(StorageContext)

  const navigate = useNavigation()
  const [viewSingleTemplate, setViewSingleTemplate] =
    useState<ChecklistTemplate | null>(null)

  return (
    <View>
      {viewSingleTemplate !== null ? (
        <ViewTemplate
          template={viewSingleTemplate}
          navigateBack={() => {
            setViewSingleTemplate(null)
          }}
        />
      ) : (
        <ScrollView>
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onInstantiate={() => {
                const checklist = instantiateTemplate(template)
                saveChecklist(checklist)
                // @ts-ignore
                navigate.navigate('Checklists')
              }}
              onView={() => {
                setViewSingleTemplate(template)
              }}
              onRemove={() => {
                removeTemplate(template.id)
              }}
              onCopy={() => {
                // @ts-ignore
                navigate.navigate('Make template', {
                  templateId: template.id,
                  isNew: true,
                })
              }}
              onEdit={() => {
                // @ts-ignore
                navigate.navigate('Make template', {
                  templateId: template.id,
                  isNew: false,
                })
              }}></TemplateCard>
          ))}
        </ScrollView>
      )}
    </View>
  )
}

type TemplateCardProps = {
  onInstantiate: () => void
  template: any
  onEdit: () => void
  onRemove: () => void
  onCopy: () => void
  onView: () => void
}
function TemplateCard(props: TemplateCardProps) {
  return (
    <View
      style={{
        paddingVertical: ds.padding.m,
        paddingHorizontal: ds.padding.s,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: ds.colors.secondary,
        marginTop: ds.padding.s,
        marginHorizontal: ds.padding.s,
        borderRadius: ds.border.radius,
      }}>
      <View>
        <IconButton
          iconStyle={{ paddingHorizontal: ds.padding.s }}
          onPress={props.onInstantiate}
          icon={icons.done}
          label={`${props.template.label}`}></IconButton>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <IconButton
          iconStyle={{ paddingHorizontal: ds.padding.s }}
          onPress={props.onView}
          icon={icons.eye}></IconButton>

        {/* FIXME: Remove, bake into the template display */}
        <IconButton
          iconStyle={{ paddingHorizontal: ds.padding.s }}
          onPress={props.onEdit}
          icon={icons.pen}></IconButton>

        <IconButton
          iconStyle={{ paddingHorizontal: ds.padding.s }}
          onPress={props.onRemove}
          icon={icons.trash}></IconButton>
        {/* <IconButton
          iconStyle={{ paddingHorizontal: ds.padding.s }}
          onPress={props.onCopy}
          icon={icons.copy}></IconButton> */}
        {/* <IconButton
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
          icon={icons.info}></IconButton> */}
      </View>
    </View>
  )
}

export default Templates
