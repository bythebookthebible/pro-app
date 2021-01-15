import { createReducer, combineReducers, createAction, createAsyncThunk } from '@reduxjs/toolkit'
import { firestoreReducer } from 'redux-firestore'
import { firebaseReducer } from 'react-redux-firebase'

export const setStartVerse = createAction('SET_START_VERSE')
export const setBlockSize = createAction('SET_BLOCK_SIZE')
export const setRepeatCount = createAction('SET_REPEAT_COUNT')

export const nextBlock = createAsyncThunk('PLAYER/NEXT_BLOCK', (arg, thunk) => {
  let settings = thunk.getState().settings
  return {settings, arg}
})


// Add firebase to reducers
export default function createRootReducer() {
  return combineReducers({
    firebase: firebaseReducer,
    firestore: firestoreReducer, // <- needed if using firestore

    // content selector
    content: createReducer('58-001-001-004', { // default start at James 1:1-4
      [setStartVerse]: (state, action) => action.payload
    }),

    // settings selector
    settings: combineReducers({
      blockSize: createReducer(1, {
        [setBlockSize]: (state, action) => action.payload
      }),
      repeatCount: createReducer(3, {
        [setRepeatCount]: (state, action) => action.payload
      }),
    }),

    // media player
    player: createReducer({
      blockIndex: 0, 
      repeatIndex: 0
    }, {
      [nextBlock.fulfilled]: (state, action) => {
        let {settings} = action.payload
        state.repeatIndex++
        if(state.repeatIndex >= settings.repeatCount) {
          state.blockIndex++
          state.repeatIndex = 0
        }
      },
    }),

  })
} 
