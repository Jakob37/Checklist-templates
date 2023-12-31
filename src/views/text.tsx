import { StyleProp, Text, TextStyle } from 'react-native'
import { ds } from '../ux/design'
import { PropsWithChildren } from 'react'

type HeaderProps = {
  text: string
  style?: TextStyle
}
function Header(props: PropsWithChildren<HeaderProps>) {
  return (
    <Text
      style={{
        fontWeight: 'bold',
        fontSize: ds.text.sizes.major,
        color: ds.colors.light,
        ...props.style,
      }}>
      {props.text}
    </Text>
  )
}

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
  style?: StyleProp<TextStyle>[]
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

export { Header, MinorText, SubText }
