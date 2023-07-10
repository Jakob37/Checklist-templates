import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { STORAGE_KEY } from './src/storage/storage'

import { DefaultTheme, NavigationContainer } from '@react-navigation/native'
import EnterListTemplate from './src/screens/enterlisttemplate'
import SelectChecklist from './src/screens/selectchecklist'
import { StorageProvider } from './src/storage/provider'

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
            name="Checklists"
            component={SelectChecklist}></Drawer.Screen>
        </Drawer.Navigator>
      </NavigationContainer>

      <EnterListTemplate></EnterListTemplate>
    </StorageProvider>
  )
}

export default App
