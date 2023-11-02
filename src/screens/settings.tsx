import { Alert, Button, Platform, Text, View } from 'react-native'
import { ds } from '../ux/design'
import { useContext } from 'react'
import { StorageContext } from '../storage/context'
import RNFS from 'react-native-fs'
import { BlueWell } from '../views/wells'
import { SubText } from '../views/text'

function Settings() {
  const { checklists, templates } = useContext(StorageContext)

  function getJSONExportString(): string {
    const exportObj = {
      date: Date.now(),
      checklists,
      templates,
    }
    const exportObjStr = JSON.stringify(exportObj)
    return exportObjStr
  }

  return (
    <BlueWell
      style={{
        paddingTop: ds.sizes.s,
        paddingHorizontal: ds.sizes.s,
        marginTop: ds.sizes.s,
      }}>
      <SubText>
        You can export the full data containing your templates and ongoing
        checklists in JSON format.
      </SubText>
      <View style={{ paddingTop: ds.sizes.s }}>
        <Button
          onPress={() => {
            writeJSON(
              getJSONExportString(),
              `Checklist-templates-${Date.now()}`,
            )
          }}
          title="Export data as JSON"
          color={ds.colors.highlight1}></Button>
      </View>
    </BlueWell>
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
