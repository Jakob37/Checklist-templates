import { PropsWithChildren } from 'react'
import { BlueWell } from './wells'
import { ds } from '../ux/design'

type FloatingButtonProps = {}
function FloatingButton(props: PropsWithChildren<FloatingButtonProps>) {
  return (
    <BlueWell
      style={{
        width: '33%',
        position: 'absolute',
        bottom: ds.padding.s,
        right: 0,
      }}>
      {props.children}
    </BlueWell>
  )
}

// Example
{
  /* <FloatingButton>
<IconButton
  onPress={() => {
    setModalVisible(true)
  }}
  icon={icons.plus}
  label={'Add section'}></IconButton>
</FloatingButton> */
}

export { FloatingButton }
