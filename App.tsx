import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createStackNavigator } from '@react-navigation/stack'

import {
  DefaultTheme,
  NavigationContainer,
  useNavigation,
} from '@react-navigation/native'
import MakeTemplate from './src/screens/maketemplate'
import Templates from './src/screens/templates'
import { StorageProvider } from './src/storage/provider'
import Checklists from './src/screens/checklists'
import {
  CHECKLISTS_STORAGE_KEY,
  TEMPLATES_STORAGE_KEY,
} from './src/storage/storage'
import { Text } from 'react-native'
import { IconButton } from './src/views/iconbutton'
import { icons } from './src/ux/icons'
import { ds } from './src/ux/design'

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

function Navigation(): JSX.Element {
  const navigation = useNavigation()
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="Templates"
        component={Templates}
        options={{
          headerRight: () => (
            <IconButton
              // @ts-ignore
              onPress={() => navigation.navigate('Make template')}
              icon={icons.plus}
              color={ds.colors.darkgray}
              iconStyle={{ paddingRight: ds.padding.s }}></IconButton>
          ),
        }}></Drawer.Screen>
      <Drawer.Screen
        name="Make template"
        component={MakeTemplate}></Drawer.Screen>
      <Drawer.Screen name="Checklists" component={Checklists}></Drawer.Screen>
    </Drawer.Navigator>
  )
}

function App(): JSX.Element {
  return (
    <StorageProvider
      templates_storage_key={TEMPLATES_STORAGE_KEY}
      checklists_storage_key={CHECKLISTS_STORAGE_KEY}>
      <NavigationContainer theme={MyTheme}>
        <Navigation></Navigation>
      </NavigationContainer>
    </StorageProvider>
  )
}

export default App
