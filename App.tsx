import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createStackNavigator } from '@react-navigation/stack'

import {
  DefaultTheme,
  DrawerActions,
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
import { Button, Text, TouchableOpacity, View } from 'react-native'
import { IconButton } from './src/views/iconbutton'
import { icons } from './src/ux/icons'
import { ds } from './src/ux/design'
import Settings from './src/screens/settings'

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    dark: ds.colors.primary,
    background: ds.colors.primary,
  },
}

const Drawer = createDrawerNavigator()
const Stack = createStackNavigator()

function Screen1({ navigation }) {
  return (
    <View>
      <Text>Screen 1 Content</Text>
      <Button
        title="Go to Screen 2"
        onPress={() => navigation.navigate('Screen2')}></Button>
    </View>
  )
}

function Screen2() {
  return <Text>Screen 2</Text>
}

const CustomDrawerHeader = ({ navigation }) => {
  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer())
  }

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
      <TouchableOpacity onPress={openDrawer}>
        {/* <Ionicons name="menu" size={24} /> */}
        <IconButton icon={icons.bars} onPress={openDrawer}></IconButton>
      </TouchableOpacity>
      <Text style={{ marginLeft: 10 }}>Drawer Header</Text>
    </View>
  )
}

const CustomStackNavigatorHeader = ({ navigation }) => {
  const goBack = () => {
    navigation.goBack()
  }

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
      <TouchableOpacity onPress={goBack}>
        {/* <Ionicons name="arrow-back" size={24} /> */}
        <IconButton icon={icons.bars} onPress={goBack}></IconButton>
      </TouchableOpacity>
      <Text style={{ marginLeft: 10 }}>Stack Header</Text>
    </View>
  )
}

const MainStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => <CustomStackNavigatorHeader {...props} />, // Use custom stack header
      }}>
      <Stack.Screen
        name="Screen1"
        component={Screen1}
        options={{
          header: (props) => <CustomDrawerHeader {...props} />, // Use custom drawer header
        }}
      />
      <Stack.Screen name="Screen2" component={Screen2} />
    </Stack.Navigator>
  )
}

function Navigation(): JSX.Element {
  const navigation = useNavigation()
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        options={{ headerShown: false }}
        name="MainStack"
        component={MainStackNavigator}></Drawer.Screen>
      <Drawer.Screen
        name="Templates"
        component={Templates}
        options={{
          headerRight: () => (
            <IconButton
              onPress={() =>
                // @ts-ignore
                navigation.navigate('Make template', {
                  templateId: null,
                  isNew: true,
                })
              }
              icon={icons.plus}
              color={ds.colors.highlight1}
              iconStyle={{ paddingRight: ds.padding.m }}></IconButton>
          ),
        }}></Drawer.Screen>
      <Drawer.Screen
        name="Make template"
        initialParams={{ templateId: null, isNew: false }}
        component={MakeTemplate}></Drawer.Screen>
      <Drawer.Screen name="Checklists" component={Checklists}></Drawer.Screen>
      <Drawer.Screen name="Settings" component={Settings}></Drawer.Screen>
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
