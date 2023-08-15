import { useContext } from 'react'
import { Text } from 'react-native'
import { StorageContext } from '../storage/context'
import { ChecklistTemplate } from '../storage/interfaces'
import { IconButton } from '../views/iconbutton'
import { icons } from '../ux/icons'
import { BlueWell } from '../views/wells'

type ViewTemplateProps = {
  template: ChecklistTemplate
  //   FIXME: This is not the way, stack view is probably the way
  navigateBack: () => void
}
function ViewTemplate(props: ViewTemplateProps) {
  const { getTemplateById } = useContext(StorageContext)

  return (
    <>
      <BlueWell>
        <Text>{props.template.label}</Text>
      </BlueWell>
      {props.template.stacks.map((stack) => {
        return (
          <BlueWell>
            <Text style={{ fontWeight: 'bold' }}>{stack.label}</Text>
            {stack.tasks.map((task) => (
              <Text>{task.label}</Text>
            ))}
          </BlueWell>
        )
      })}
      <BlueWell>
        <IconButton
          icon={icons.reset}
          onPress={props.navigateBack}
          label={'Navigate back'}
        />
      </BlueWell>
    </>
  )
}

export { ViewTemplate }
