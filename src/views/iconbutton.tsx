import { Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { ds } from '../ux/design'

function IconButton(props: {
  onPress: () => void
  icon: string
  size?: number
  color?: string
  style?: {}
  label?: string
  labelPos?: 'left' | 'right'
}) {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={{ flexDirection: 'row' }}>
        {props.label !== '' && props.labelPos === 'left' ? (
          <Text>{props.label}</Text>
        ) : (
          ''
        )}
        <Icon
          name={props.icon}
          size={props.size}
          style={{ color: props.color, ...props.style }}></Icon>
        {props.label !== '' && props.labelPos === 'right' ? (
          <Text>{props.label}</Text>
        ) : (
          ''
        )}
      </View>
    </TouchableOpacity>
  )
}
IconButton.defaultProps = {
  size: ds.icons.size,
  color: ds.colors.primary,
  style: {},
  label: '',
  labelPos: 'right',
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
