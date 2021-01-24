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

const defaultFontSize = 20

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
    fontSize: defaultFontSize,
  },
  titleText: {
    fontFamily: 'Helvetica',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: defaultFontSize,
  },

  // content selector
  contentTitle: {
    paddingTop: defaultFontSize + (STATUSBAR_HEIGHT || 0),
    paddingBottom: defaultFontSize,
    alignSelf: 'stretch',
    backgroundColor: 'white',
  },
  contentSelector: {
    position: 'absolute',
    top: 0, bottom: 0,
    paddingTop: STATUSBAR_HEIGHT || 0,
    width: '100%', maxWidth: 400,
    zIndex: 10,
    backgroundColor: 'white',
    borderColor: '#0002',
    borderRightWidth: 1.5,
  },
  listTitle: {
    fontFamily: 'Helvetica',
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: defaultFontSize,
  },
  listEntry: {
    fontFamily: 'Helvetica-Light',
    textAlign: 'left',
    fontSize: defaultFontSize,
  },
  listRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 30,
    paddingVertical: 15,
  },
  listSpacer: {
    height: 6,
    marginVertical: -3,
  },

  // setting selector
  settingSelector: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
  },
  settingSelectorExpanded: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    paddingRight: 80,
    minHeight: 100,
    backgroundColor: 'white',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: defaultFontSize,
  },
  listSelector: {
    height: 60,
  },
  settingListItem: {
    paddingHorizontal: 30,
  },
  settingIcon: {
    position: 'absolute',
    right: 20,
    bottom: 20,
  },

  // media player
  mediaPlayer: {
    alignItems: 'center',
  },
  playCircle: {
    backgroundColor: '#fffc', 
    width:80, height:80,
    borderRadius: 40,
    marginTop:-40, marginBottom:-40,
    paddingVertical:40,
    alignItems: 'center',
  },
});
