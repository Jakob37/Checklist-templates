import { Alert, Button, Platform, View } from 'react-native'
import { ds } from '../ux/design'
import { useContext } from 'react'
import { StorageContext } from '../storage/context'
import RNFS from 'react-native-fs'

function Settings() {
  const { checklists, templates } = useContext(StorageContext)

  function getJSONExportString(): string {
    const exportObj = {
      date: Date.now(),
      checklists,
      templates,
    }
    const exportObjStr = JSON.stringify(exportObj)
    // console.log(exportObjStr)
    return exportObjStr
  }

  return (
    <View>
      <View
        style={{ paddingTop: ds.padding.s, paddingHorizontal: ds.padding.s }}>
        <Button
          onPress={() => {
            writeJSON(
              getJSONExportString(),
              `Checklist-templates-${Date.now()}`,
            )
          }}
          title="Export JSON"></Button>
      </View>
    </View>
  )
}

async function writeJSON(dataString: string, name: string) {
  try {
    const filePath = `${RNFS.DocumentDirectoryPath}/${name}.json`
    await RNFS.writeFile(filePath, dataString)

    if (Platform.OS === 'android' && RNFS.ExternalStorageDirectoryPath) {
      const destPath = `${RNFS.ExternalStorageDirectoryPath}/Download/${name}.json`
      await RNFS.moveFile(filePath, destPath)
      Alert.alert(
        'Success',
        `${name}.json generated and exported to the Downloads folder!`,
      )
    } else if (Platform.OS === 'ios') {
      const destPath = `${RNFS.DocumentDirectoryPath}/${name}.json`
      await RNFS.moveFile(filePath, destPath)
      Alert.alert(
        'Success',
        '${name}.json generated and exported to the Documents directory',
      )
    } else {
      Alert.alert(
        'Warning',
        'Exporting to Downloads folder is not supported on this platform',
      )
    }
  } catch (error) {
    console.error('Error downloading JSON file', error)
    Alert.alert('Error', 'An error occured while downloading the JSON file')
  }
}

export default Settings
