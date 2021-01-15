import { StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export const colors = {
  pink: '#f88',
  yellow: '#ff0',
  lightBlue: '#49f',
  blue: '#37f',
  text: 'black',
}
colors.primary = colors.blue;
colors.secondary = colors.lightBlue;

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 40 : StatusBar.currentHeight;

export const styles = StyleSheet.create({
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  centerContents: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 15,
  },
  selectBook: {
    top: 0,
    width: '100%',
    textAlign: 'center',
    backgroundColor: colors.lightBlue,
  },
  selectBookHeader: {
    backgroundColor: colors.blue,
  },
  selectRepeat: {
    textAlign: 'right',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    backgroundColor: colors.lightBlue,
  },
});
