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
      huge: 32,
      major: 32,
      minor: 32,
    },
  },
  colors: {
    // primary: 'white',
    // secondary: 'lightgray',
    // darkgray: 'darkgray',
    // background: 'darkgreen',
    // cardBackground: '#1F3B4D',

    primary: '#468B97',
    secondary: '#1D5B79',
    highlight1: '#EF6262',
    highlight2: '#F3AA60',
    // cardBackground: 'gray',
  },
  icons: {
    medium: 32,
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
    backgroundColor: ds.colors.secondary,
    marginHorizontal: ds.padding.s,
    marginTop: ds.padding.m,
    paddingVertical: ds.padding.s,
    paddingHorizontal: ds.padding.s,
    borderRadius: ds.border.radius,
  },
  orangePanel: {
    backgroundColor: ds.colors.highlight1,
    marginHorizontal: ds.padding.s,
    marginTop: ds.padding.m,
    paddingVertical: ds.padding.s,
    paddingHorizontal: ds.padding.s,
    borderRadius: ds.border.radius,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
    height: '100%',
  },
})

export { styles }
