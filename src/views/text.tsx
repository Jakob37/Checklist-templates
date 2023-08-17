import { Text, TextStyle } from 'react-native'
import { ds } from '../ux/design'
import { PropsWithChildren } from 'react'

type MinorTextProps = {
  style?: TextStyle
}
function MinorText(props: PropsWithChildren<MinorTextProps>) {
  return (
    <Text style={{ fontSize: ds.font.sizes.minor, ...props.style }}>
      {props.children}
    </Text>
  )
}

export { MinorText }
