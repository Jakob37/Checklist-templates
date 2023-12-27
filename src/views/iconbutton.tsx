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
import { icons } from '../ux/icons'

function IconButton(props: {
  onPress?: () => void
  onLongPress?: () => void
  icon: string
  size?: number
  iconStyle?: StyleProp<TextStyle>
  containerStyle?: StyleProp<ViewStyle>
  labelStyle?: StyleProp<TextStyle>
  label?: string
  labelPos?: 'left' | 'right'
  disabled?: boolean
}) {
  return (
    <View style={props.containerStyle}>
      <TouchableOpacity
        disabled={props.disabled}
        onPress={props.onPress}
        onLongPress={props.onLongPress}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          {props.label !== '' && props.labelPos === 'left' ? (
            <Text style={[props.labelStyle, { paddingHorizontal: ds.sizes.s }]}>
              {props.label}
            </Text>
          ) : (
            ''
          )}
          <Icon
            name={props.icon}
            size={props.size}
            style={props.iconStyle}></Icon>
          {props.label !== '' && props.labelPos === 'right' ? (
            <Text style={[props.labelStyle, { paddingHorizontal: ds.sizes.s }]}>
              {props.label}
            </Text>
          ) : (
            ''
          )}
        </View>
      </TouchableOpacity>
    </View>
  )
}
IconButton.defaultProps = {
  onPress: () => {},
  onLongPress: () => {},
  size: ds.icons.medium,
  color: ds.colors.light,
  iconStyle: {
    color: ds.colors.light,
  },
  containerStyle: {},
  labelStyle: { fontSize: ds.text.sizes.minor, color: ds.colors.light },
  label: '',
  labelPos: 'right',
  disabled: false,
}

function TopBarIconButton(props: { icon: string; onPress: () => void }) {
  return (
    <IconButton
      onPress={props.onPress}
      icon={props.icon}
      size={ds.text.sizes.huge}
      color={ds.colors.secondary}
      iconStyle={{ padding: ds.sizes.s }}></IconButton>
  )
}

type HoverButtonProps = {
  onPress: () => void
}
function HoverButton(props: HoverButtonProps) {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={styles.hoverButtonContainer}>
      <View
        style={[
          styles.hoverButton,
          { alignItems: 'center', justifyContent: 'center' },
        ]}>
        <Icon
          style={{ color: ds.colors.white }}
          name={icons.plus}
          size={ds.icons.large}></Icon>
      </View>
    </TouchableOpacity>
  )
}

export { IconButton, TopBarIconButton, HoverButton }
