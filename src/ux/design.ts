import { StyleSheet } from 'react-native'

export const ds = {
  padding: {
    xs: 5,
    s: 10,
    m: 15,
    l: 20,
    small: 10,
  },
  entries: {
    height: 40,
  },
  font: {
    sizes: {
      huge: 24,
      major: 16,
      minor: 10,
    },
  },
  colors: {
    primary: 'white',
    secondary: 'lightgray',
    darkgray: 'darkgray',
    background: 'darkgreen',
    cardBackground: '#1F3B4D',

    darkBlue: '#1D5B79',
    lightBlue: '#468B97',
    orange: '#EF6262',
    red: '#F3AA60',
    // cardBackground: 'gray',
  },
  icons: {
    medium: 20,
    large: 32,
  },
  textInput: {
    numberOfLines: 4,
  },
  border: {
    radius: 5,
  },
}

const styles = StyleSheet.create({
  bluePanel: {
    backgroundColor: ds.colors.darkBlue,
    marginHorizontal: ds.padding.s,
    marginTop: ds.padding.m,
    paddingVertical: ds.padding.s,
    paddingHorizontal: ds.padding.s,
    borderRadius: ds.border.radius,
  },
  orangePanel: {
    backgroundColor: ds.colors.orange,
    marginHorizontal: ds.padding.s,
    marginTop: ds.padding.m,
    paddingVertical: ds.padding.s,
    paddingHorizontal: ds.padding.s,
    borderRadius: ds.border.radius,
  },
})

export { styles }
