import { StyleProp, View, ViewStyle } from 'react-native'
import { styles } from '../ux/design'
import { PropsWithChildren } from 'react'

type BlueWellProps = {
  style: StyleProp<ViewStyle>
}
function BlueWell(props: PropsWithChildren<BlueWellProps>) {
  return <View style={[styles.bluePanel, props.style]}>{props.children}</View>
}

export { BlueWell }
