import { useNavigation } from '@react-navigation/native'
import { useContext, useState } from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import { StorageContext } from '../storage/context'
import { instantiateTemplate } from '../storage/util'
import { ds } from '../ux/design'
import { icons } from '../ux/icons'
import { HoverButton, IconButton } from '../views/iconbutton'
import { ViewTemplate } from './viewtemplate'
import { ChecklistTemplate } from '../storage/interfaces'
import { MinorText } from '../views/text'
import { makeConfirmDialog } from '../views/dialogs'

function Templates() {
  const { templates, removeTemplate, saveChecklist, saveTemplate } =
    useContext(StorageContext)

  const navigate = useNavigation()
  const [viewSingleTemplate, setViewSingleTemplate] =
    useState<ChecklistTemplate | null>(null)

  return (
    <View style={{ flex: 1 }}>
      {viewSingleTemplate !== null ? (
        <ViewTemplate
          template={viewSingleTemplate}
          navigateBack={() => {
            setViewSingleTemplate(null)
          }}
        />
      ) : (
        <ScrollView
          style={{ flex: 1, paddingBottom: ds.sizes.scrollBottom }}
          contentContainerStyle={{ flexGrow: 1 }}>
          {templates
            .sort((t1, t2) => (t1.label < t2.label ? -1 : 1))
            .map((template) => (
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
                  makeConfirmDialog(
                    `Remove template`,
                    `Are you sure you want to remove ${template.label}?`,
                    () => removeTemplate(template.id),
                  )
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
                }}
                onToggleStar={() => {
                  console.log('Toggling star')
                  // FIXME: For migration purposes, remove when not needed
                  template.favorite =
                    template.favorite != undefined ? !template.favorite : true
                  saveTemplate(template)
                }}></TemplateCard>
            ))}
          <View
            style={{ paddingTop: ds.sizes.hoverButton + ds.sizes.m }}></View>
        </ScrollView>
      )}
      <HoverButton
        onPress={() =>
          // @ts-ignore
          navigate.navigate('Make template', { templateId: null, isNew: true })
        }></HoverButton>
    </View>
  )
}

type TemplateCardProps = {
  onInstantiate: () => void
  template: ChecklistTemplate
  onEdit: () => void
  onRemove: () => void
  onCopy: () => void
  onView: () => void
  onToggleStar: () => void
}
function TemplateCard(props: TemplateCardProps) {
  return (
    <View
      style={{
        paddingVertical: ds.sizes.m,
        paddingHorizontal: ds.sizes.s,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: ds.colors.secondary,
        marginTop: ds.sizes.s,
        marginHorizontal: ds.sizes.s,
        borderRadius: ds.border.radius,
      }}>
      <IconButton
        iconStyle={{
          paddingRight: ds.sizes.s,
          color: props.template.favorite ? ds.colors.highlight2 : undefined,
        }}
        onPress={props.onToggleStar}
        icon={icons.star}></IconButton>
      <View style={{ flex: 1 }}>
        <TouchableOpacity onPress={props.onInstantiate}>
          <MinorText>{props.template.label}</MinorText>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row' }}>
        {/* FIXME: Remove, bake into the template display */}
        <IconButton
          iconStyle={{ paddingHorizontal: ds.sizes.s }}
          onPress={props.onEdit}
          icon={icons.pen}></IconButton>
        <IconButton
          iconStyle={{ paddingHorizontal: ds.sizes.s }}
          onPress={props.onRemove}
          icon={icons.trash}></IconButton>
      </View>
    </View>
  )
}

export default Templates
