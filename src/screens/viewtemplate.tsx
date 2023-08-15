import { useContext } from 'react'
import { Text } from 'react-native'
import { StorageContext } from '../storage/context'
import { ChecklistTemplate } from '../storage/interfaces'
import { IconButton } from '../views/iconbutton'
import { icons } from '../ux/icons'

type ViewTemplateProps = {
  template: ChecklistTemplate
//   FIXME: This is not the way, stack view is probably the way
  navigateBack: () => void
}
function ViewTemplate(props: ViewTemplateProps) {
  const { getTemplateById } = useContext(StorageContext)

  return (
    <>
      <Text>View template here! ID: {props.template.id}</Text>
      <IconButton icon={icons.reset} onPress={props.navigateBack} />
    </>
  )
}

export { ViewTemplate }
