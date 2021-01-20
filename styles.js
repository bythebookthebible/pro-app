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
  outerContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },

  // content selector
  contentSelector: {
    paddingTop: STATUSBAR_HEIGHT,
    alignSelf: 'stretch',
    backgroundColor: colors.lightBlue,
  },
  contentBookHeader: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 24,
  },
  contentChapterItem: {
    textAlign: 'center',
    fontSize: 16,
  },

  // setting selector
  settingSelector: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
  },
  settingSelectorExpanded: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 10,
    backgroundColor: colors.lightBlue,
  },
  settingIcon: {
    padding: 10,
  },
  listSelector: {
    paddingHorizontal: 10,
    height: 60,
  },
  listSelectorItem: {
    height: 16,
    fontSize: 16,
  },
  listSelectorTitle: {
    paddingHorizontal: 10,
    fontSize: 16,
  },

  // media player
  mediaPlayer: {
    alignItems: 'center',
  },
});
