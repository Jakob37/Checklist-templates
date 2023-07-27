import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createStackNavigator } from '@react-navigation/stack'

import { DefaultTheme, NavigationContainer } from '@react-navigation/native'
import EnterTemplate from './src/screens/entertemplate'
import SelectChecklist from './src/screens/templates'
import { StorageProvider } from './src/storage/provider'
import Checklists from './src/screens/checklists'
import {
  CHECKLISTS_STORAGE_KEY,
  TEMPLATES_STORAGE_KEY,
} from './src/storage/storage'
import { Text } from 'react-native'

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    dark: '#1F3B4D',
    background: '#1F3B4D',
  },
}

const Drawer = createDrawerNavigator()
const Stack = createStackNavigator()

function TemplatesHome(): JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Templates" component={SelectChecklist} />
      <Stack.Screen name="Make template" component={EnterTemplate} />
    </Stack.Navigator>
  )
}

function App(): JSX.Element {
  return (
    <StorageProvider
      templates_storage_key={TEMPLATES_STORAGE_KEY}
      checklists_storage_key={CHECKLISTS_STORAGE_KEY}>
      <NavigationContainer theme={MyTheme}>
        <Drawer.Navigator>
          <Drawer.Screen name="Home" component={TemplatesHome}></Drawer.Screen>
          {/* <Drawer.Screen
            name="Make template"
            component={EnterTemplate}></Drawer.Screen> */}
          <Drawer.Screen
            name="Checklists"
            component={Checklists}></Drawer.Screen>
        </Drawer.Navigator>
      </NavigationContainer>
    </StorageProvider>
  )
}

export default App
