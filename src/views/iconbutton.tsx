import { Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { ds } from '../ux/design'

function IconButton(props: {
  onPress: () => void
  icon: string
  size?: number
  color?: string
  iconStyle?: {}
  containerStyle?: {}
  label?: string
  labelPos?: 'left' | 'right'
}) {
  return (
    <TouchableOpacity onPress={props.onPress} style={props.containerStyle}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        {props.label !== '' && props.labelPos === 'left' ? (
          <Text style={{ paddingHorizontal: ds.padding.s }}>{props.label}</Text>
        ) : (
          ''
        )}
        <Icon
          name={props.icon}
          size={props.size}
          style={{ color: props.color, ...props.iconStyle }}></Icon>
        {props.label !== '' && props.labelPos === 'right' ? (
          <Text
            style={{
              paddingHorizontal: ds.padding.s,
              fontSize: ds.font.sizes.major,
            }}>
            {props.label}
          </Text>
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
  iconStyle: {},
  containerStyle: {},
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
      iconStyle={{ padding: ds.padding.s }}></IconButton>
  )
}

export { IconButton, TopBarIconButton }
