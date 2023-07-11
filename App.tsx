import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { STORAGE_KEY } from './src/storage/storage'

import { DefaultTheme, NavigationContainer } from '@react-navigation/native'
import EnterListTemplate from './src/screens/enterlisttemplate'
import SelectChecklist from './src/screens/selectchecklist'
import { StorageProvider } from './src/storage/provider'
import OngoingChecklists from './src/screens/ongoingchecklists'

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    dark: 'gray',
    background: 'gray',
  },
}

const Drawer = createDrawerNavigator()

function App(): JSX.Element {
  return (
    <StorageProvider storage_key={STORAGE_KEY}>
      <NavigationContainer theme={MyTheme}>
        <Drawer.Navigator>
          <Drawer.Screen
            name="Make template"
            component={EnterListTemplate}></Drawer.Screen>
          <Drawer.Screen
            name="Select checklist"
            component={SelectChecklist}></Drawer.Screen>
          <Drawer.Screen
            name="Ongoing checklists"
            component={OngoingChecklists}></Drawer.Screen>
        </Drawer.Navigator>
      </NavigationContainer>
    </StorageProvider>
  )
}

export default App
