import {
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { ds, styles } from '../ux/design'

function IconButton(props: {
  onPress: () => void
  icon: string
  size?: number
  iconStyle?: StyleProp<ViewStyle>
  containerStyle?: StyleProp<ViewStyle>
  labelStyle?: StyleProp<TextStyle>
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
          <Text
            style={{ ...props.labelStyle, paddingHorizontal: ds.padding.s }}>
            {props.label}
          </Text>
        ) : (
          ''
        )}
        <Icon
          name={props.icon}
          size={props.size}
          style={{ ...props.iconStyle }}></Icon>
        {props.label !== '' && props.labelPos === 'right' ? (
          <Text
            style={{
              ...props.labelStyle,
              paddingHorizontal: ds.padding.s,
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
  size: ds.icons.medium,
  color: ds.colors.primary,
  iconStyle: {},
  containerStyle: {},
  labelStyle: { fontSize: ds.font.sizes.minor },
  label: '',
  labelPos: 'right',
}

function TopBarIconButton(props: { icon: string; onPress: () => void }) {
  return (
    <IconButton
      onPress={props.onPress}
      icon={props.icon}
      size={ds.font.sizes.huge}
      color={ds.colors.secondary}
      iconStyle={{ padding: ds.padding.s }}></IconButton>
  )
}

export { IconButton, TopBarIconButton }
