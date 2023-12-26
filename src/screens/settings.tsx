import { Alert, Button, Platform, Text, View } from 'react-native'
import { ds } from '../ux/design'
import { useContext } from 'react'
import { StorageContext } from '../storage/context'
import RNFS, { readFile } from 'react-native-fs'
import { BlueWell } from '../views/wells'
import { SubText } from '../views/text'
import DocumentPicker from 'react-native-document-picker'
import { Checklist, ChecklistTemplate } from '../storage/interfaces'
import { makeConfirmDialog } from '../views/dialogs'

async function importJSON(): Promise<{ templates: ChecklistTemplate[] }> {
  try {
    const res = await DocumentPicker.pick({
      type: 'application/json',
    })

    const fileContent = await readFile(res[0].uri)
    const jsonData = JSON.parse(fileContent)
    return jsonData
  } catch (err) {
    if (DocumentPicker.isCancel(err)) {
      return { templates: [] }
    } else {
      throw err
    }
  }
}

function Settings() {
  const { checklists, templates, saveNewTemplates, getTemplateExists } =
    useContext(StorageContext)

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
    <>
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
      <BlueWell style={{ marginTop: ds.sizes.s }}>
        <SubText>
          Import lists from exported JSON. This will not erase any data. You
          will be prompted before import.
        </SubText>
        <View style={{ paddingTop: ds.sizes.s }}>
          <Button
            onPress={async () => {
              const result = await importJSON()
              if (result.hasOwnProperty('templates')) {
                const templates = result.templates
                const newTemplates = templates.filter((template) => {
                  return !getTemplateExists(template.id)
                })
                const nbrExists = templates.length - newTemplates.length
                const s = newTemplates.length != 1 ? 's' : ''
                const alreadyExists =
                  nbrExists > 0 ? `(${nbrExists} already exists)` : ''

                if (newTemplates.length > 0) {
                  makeConfirmDialog(
                    'Import JSON',
                    `Import ${newTemplates.length} checklist template${s}? ${alreadyExists}`,
                    () => {
                      saveNewTemplates(newTemplates)
                    },
                  )
                } else {
                  Alert.alert('No new templates found')
                }
              }
            }}
            title="Import data"
            color={ds.colors.highlight1}></Button>
        </View>
      </BlueWell>
    </>
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
