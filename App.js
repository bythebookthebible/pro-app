import React, { useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { createFirestoreInstance, constants as rfConstants } from 'redux-firestore'
import { ReactReduxFirebaseProvider, getFirebase, actionTypes as rrfActionTypes } from 'react-redux-firebase'

import { firebase } from './firebase'
import createRootReducer from './reducer'

import {styles, colors} from './styles'

import {ContentSelector} from './ContentSelector'
import {SettingSelector} from './SettingSelector'
import {MediaPlayer} from './MediaPlayer'

// configure store
const middleware = [
  ...getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [
        // just ignore every redux-firebase and react-redux-firebase action type
        ...Object.keys(rfConstants.actionTypes).map(
          type => `${rfConstants.actionsPrefix}/${type}`
        ),
        ...Object.keys(rrfActionTypes).map(
          type => `@@reactReduxFirebase/${type}`
        )
      ],
      ignoredPaths: ['firebase', 'firestore']
    },
    thunk: {
      extraArgument: getFirebase
    }
  })
]

const reducer = createRootReducer()

const store = configureStore({reducer, middleware})

// react-redux-firebase config
const rrfProps = {
  firebase,
  config: {
    userProfile: 'users',
    useFirestoreForProfile: true, // Firestore for Profile instead of Realtime DB
    enableClaims: true, // Get custom claims along with the profile
  },
  dispatch: store.dispatch,
  createFirestoreInstance, // <- needed if using firestore
}

export default function App(props) {
  return <Provider store={store}>
    <ReactReduxFirebaseProvider {...rrfProps}>
      <View style={styles.outerContainer}>
        <StatusBar translucent />
        <ContentSelector />
        <MediaPlayer />
        <SettingSelector />
      </View>
    </ReactReduxFirebaseProvider>
  </Provider>
}

// // renders phone status bar, and blocks that region of the screen
// function MyStatusBar({backgroundColor, ...props}) {
//   return <View style={[styles.statusBar, { backgroundColor }]}>
//     <StatusBar translucent backgroundColor={backgroundColor} {...props} />
//   </View>
// }
