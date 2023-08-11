import { View } from 'react-native'
import { styles } from '../ux/design'
import { PropsWithChildren } from 'react'

type BlueWellProps = {}
function BlueWell(props: PropsWithChildren<BlueWellProps>) {
  return <View style={styles.bluePanel}>{props.children}</View>
}

export { BlueWell }
