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
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Icon from 'react-native-vector-icons/FontAwesome'

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    dark: ds.colors.primary,
    background: ds.colors.primary,
  },
}

// const Drawer = createDrawerNavigator()
const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

function TemplateNavigation() {
  return (
    <Stack.Navigator>
      <Tab.Screen
        name="List templates"
        component={Templates}
        options={{
          headerShown: false,
          // tabBarBadge: 3,
          // headerRight: () => (
          //   <IconButton
          //     onPress={() =>
          //       // @ts-ignore
          //       navigation.navigate('Make template', {
          //         templateId: null,
          //         isNew: true,
          //       })
          //     }
          //     icon={icons.plus}
          //     color={ds.colors.highlight1}
          //     iconStyle={{ paddingRight: ds.padding.m }}></IconButton>
          // ),
        }}></Tab.Screen>
      <Tab.Screen
        name="Make template"
        initialParams={{ templateId: null, isNew: false }}
        component={MakeTemplate}></Tab.Screen>
    </Stack.Navigator>
  )
}

function Navigation() {
  const navigation = useNavigation()
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconName = icons.eye
          if (route.name === 'Templates') {
            iconName = icons.paste
            // iconName = focused ? icons.bars : icons.check
          } else if (route.name === 'Checklists') {
            iconName = icons.check
          } else if (route.name === 'Settings') {
            iconName = icons.gear
            // iconName = focused ? icons.tag : icons.done
            // iconName = focused ? icons.copy : icons.reset
          } else if (route.name === 'Make template') {
            iconName = icons.plus
          }

          // return <Text>test</Text>>
          return (
            <Icon
              name={iconName}
              color={focused ? 'black' : 'gray'}
              size={ds.icons.medium}></Icon>
          )
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: {
          paddingBottom: ds.padding.xs,
        },
      })}>
      <Tab.Screen
        name="Templates"
        component={TemplateNavigation}
        options={{ headerShown: false }}></Tab.Screen>
      {/* <Tab.Screen
        name="Templates"
        component={Templates}
        options={{
          headerShown: false,
          // tabBarBadge: 3,
          // headerRight: () => (
          //   <IconButton
          //     onPress={() =>
          //       // @ts-ignore
          //       navigation.navigate('Make template', {
          //         templateId: null,
          //         isNew: true,
          //       })
          //     }
          //     icon={icons.plus}
          //     color={ds.colors.highlight1}
          //     iconStyle={{ paddingRight: ds.padding.m }}></IconButton>
          // ),
        }}></Tab.Screen>
      <Tab.Screen
        name="Make template"
        initialParams={{ templateId: null, isNew: false }}
        component={MakeTemplate}
        options={{
          headerShown: false,
        }}></Tab.Screen> */}
      <Tab.Screen
        name="Checklists"
        component={Checklists}
        options={{
          headerShown: false,
        }}></Tab.Screen>
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{ headerShown: false }}></Tab.Screen>
    </Tab.Navigator>
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
