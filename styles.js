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
  contentTitle: {
    paddingTop: 20 + (STATUSBAR_HEIGHT || 0),
    paddingBottom: 20,
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
    fontSize: 24,
  },
  listEntry: {
    fontFamily: 'Helvetica',
    textAlign: 'left',
    fontSize: 24,
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
    paddingHorizontal: 20,
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
    width:120, height:120,
    borderRadius: 60,
    marginTop:-60, marginBottom:-60,
    paddingVertical:60,
    alignItems: 'center',
  },
});
