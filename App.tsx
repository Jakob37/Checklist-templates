import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'

import { DefaultTheme, NavigationContainer } from '@react-navigation/native'
import EnterTemplate from './src/screens/entertemplate'
import SelectChecklist from './src/screens/templates'
import { StorageProvider } from './src/storage/provider'
import OngoingChecklists from './src/screens/ongoingchecklists'
import {
  CHECKLISTS_STORAGE_KEY,
  TEMPLATES_STORAGE_KEY,
} from './src/storage/storage'

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    dark: '#1F3B4D',
    background: '#1F3B4D',
  },
}

const Drawer = createDrawerNavigator()

function App(): JSX.Element {
  return (
    <StorageProvider
      templates_storage_key={TEMPLATES_STORAGE_KEY}
      checklists_storage_key={CHECKLISTS_STORAGE_KEY}>
      <NavigationContainer theme={MyTheme}>
        <Drawer.Navigator>
          <Drawer.Screen
            name="Templates"
            component={SelectChecklist}></Drawer.Screen>
          <Drawer.Screen
            name="Make template"
            component={EnterTemplate}></Drawer.Screen>
          <Drawer.Screen
            name="Checklists"
            component={OngoingChecklists}></Drawer.Screen>
        </Drawer.Navigator>
      </NavigationContainer>
    </StorageProvider>
  )
}

export default App
