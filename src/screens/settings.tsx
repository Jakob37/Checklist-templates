import { Button, View } from 'react-native'
import { ds } from '../ux/design'
import { useContext } from 'react'
import { StorageContext } from '../storage/context'

function Settings() {
  const { checklists, templates } = useContext(StorageContext)

  function exportJSON() {
    const exportObj = {
      date: Date.now(),
      checklists,
      templates,
    }
    const exportObjStr = JSON.stringify(exportObj)
    console.log(exportObjStr)
  }

  return (
    <View>
      <View
        style={{ paddingTop: ds.padding.s, paddingHorizontal: ds.padding.s }}>
        <Button
          onPress={() => {
            console.log('Export')
          }}
          title="Export JSON"></Button>
      </View>
    </View>
  )
}

export default Settings
