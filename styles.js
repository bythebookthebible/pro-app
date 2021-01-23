import { StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export const colors = {
  pink: '#f88',
  yellow: '#ff0',
  lightBlue: '#3cbfef',
  text: 'black',
  background: '#f4f4f4',
}
colors.primary = colors.lightBlue;

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 40 : StatusBar.currentHeight;

export const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'stretch',
    backgroundColor: colors.background,
  },

  text: {
    fontFamily: 'Helvetica-Light',
    textAlign: 'center',
    fontSize: 16,
  },
  titleText: {
    fontFamily: 'Helvetica',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 24,
  },

  // content selector
  contentSelector: {
    paddingTop: STATUSBAR_HEIGHT,
    alignSelf: 'stretch',
    backgroundColor: 'white',
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
    backgroundColor: 'white',
  },
  settingIcon: {
    padding: 10,
  },
  listSelector: {
    paddingHorizontal: 10,
    height: 60,
  },

  // media player
  mediaPlayer: {
    alignItems: 'center',
  },
  playCircle: {
    backgroundColor: '#fffc', 
    width:120, height:120,
    borderRadius: 60,
    marginTop:-60, marginBottom:-60,
    paddingVertical:60,
    alignItems: 'center',
  },
});
