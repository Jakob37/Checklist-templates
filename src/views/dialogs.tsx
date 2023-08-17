import { Alert, Button, Modal, TextInput, View } from 'react-native'
import { ds, styles } from '../ux/design'
import { PropsWithChildren, useState } from 'react'

type MyModalProps = {
  modalVisible: boolean
  onSubmit: (strValue: string) => void
  onCancel: () => void
}
function SimpleInputModal(props: MyModalProps) {
  const [inputValue, setInputValue] = useState('')

  return (
    <Modal visible={props.modalVisible} animationType="fade" transparent={true}>
      <View style={styles.modalContainer}>
        <View
          style={{
            width: '80%',
            backgroundColor: ds.colors.secondary,
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
          <View style={{ padding: ds.padding.s }}>
            <TextInput
              placeholder="Section name"
              onChangeText={(text) => setInputValue(text)}></TextInput>
          </View>

          <View
            style={{
              paddingBottom: ds.padding.s,
              paddingHorizontal: ds.padding.s,
              flexDirection: 'row',
            }}>
            <View style={{ paddingRight: ds.padding.s }}>
              <Button
                title="Submit"
                onPress={() => {
                  props.onSubmit(inputValue)
                }}
              />
            </View>
            <View>
              <Button title="Cancel" onPress={() => props.onCancel()} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  )
}

function makeConfirmDialog(label: string, message: string, onYes: () => void) {
  return Alert.alert(label, message, [
    {
      text: 'Yes',
      onPress: () => {
        onYes()
        console.log('Yes')
      },
    },
    { text: 'No' },
  ])
}

export { SimpleInputModal, makeConfirmDialog }
