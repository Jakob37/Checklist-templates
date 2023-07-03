import { TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { ds } from '../ux/design'

function IconButton(props: {
  onPress: () => void
  icon: string
  size: number
  color: string
  style?: {}
}) {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <Icon
        name={props.icon}
        size={props.size}
        style={{ color: props.color, ...props.style }}></Icon>
    </TouchableOpacity>
  )
}

function TopBarIconButton(props: { icon: string; onPress: () => void }) {
  return (
    <IconButton
      onPress={props.onPress}
      icon={props.icon}
      size={ds.font.sizes.topBar}
      color={ds.colors.secondary}
      style={{ padding: ds.spacing.sideMargins }}></IconButton>
  )
}

export { IconButton, TopBarIconButton }
