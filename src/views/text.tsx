import { Text, TextStyle } from 'react-native'
import { ds } from '../ux/design'
import { PropsWithChildren } from 'react'

type MinorTextProps = {
  style?: TextStyle
}
function MinorText(props: PropsWithChildren<MinorTextProps>) {
  return (
    <Text
      style={{
        fontSize: ds.text.sizes.minor,
        color: ds.colors.light,
        ...props.style,
      }}>
      {props.children}
    </Text>
  )
}

type SubTextProps = {
  style?: TextStyle
}
function SubText(props: PropsWithChildren<SubTextProps>) {
  return (
    <Text
      style={{
        fontSize: ds.text.sizes.sub,
        color: ds.colors.light,
        ...props.style,
      }}>
      {props.children}
    </Text>
  )
}

export { MinorText, SubText }
