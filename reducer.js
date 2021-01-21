import { createReducer, combineReducers, createAction, createAsyncThunk } from '@reduxjs/toolkit'
import { firestoreReducer } from 'redux-firestore'
import { firebaseReducer } from 'react-redux-firebase'
import { valueAfter } from './util'

export const setStartVerse = createAction('SET_START_VERSE')
export const setBlockSize = createAction('SET_BLOCK_SIZE')
export const setRepeatCount = createAction('SET_REPEAT_COUNT')

export const nextBlock = createAsyncThunk('PLAYER/NEXT_BLOCK', (arg, thunk) => {
  let state = thunk.getState()
  let settings = state.settings

  let curItem = getCurrentModule(state)
  let measuresInModule = Math.floor(curItem.length / 60 * curItem.bpm)

  return {settings, measuresInModule, arg}
})

export function getCurrentModule(state) {
  let resources = state.firestore.data.memoryResources
  if(!resources) return undefined
  
  let musicKeys = Object.entries(resources)
    .filter( ([key, data]) => data.music )
    .map( ([key, data]) => key )

  let curItem = resources[valueAfter(musicKeys, state.content, state.playerIndex.blockOffset.module + state.playerIndex.moduleIndex)]
  return curItem
}

// Add firebase to reducers
export default function createRootReducer() {
  return combineReducers({
    firebase: firebaseReducer,
    firestore: firestoreReducer, // <- needed if using firestore

    // content selector
    content: createReducer('18-001-001-006', { // default starting module
      [setStartVerse]: (state, action) => action.payload
    }),

    // settings selector
    settings: combineReducers({
      blockUnitSize: createReducer(1, {
        [setBlockSize]: (state, action) => action.payload
      }),
      blockRepeatCount: createReducer(5, {
        [setRepeatCount]: (state, action) => action.payload
      }),
    }),

    // media player
    playerIndex: createReducer({
      blockLength: {measure: 1, module: 0},
      blockOffset: {measure: 0, module: 0},
      moduleIndex: 0,
      repeatIndex: 0,
    }, {
      [nextBlock.fulfilled]: (state, action) => {
        let {blockLength, blockOffset, moduleIndex, repeatIndex} = state
        let {settings, measuresInModule} = action.payload

        // cycle module index
        moduleIndex++
        if(blockLength.module > 1 && moduleIndex < blockLength.module) {
          return {blockLength, blockOffset, moduleIndex, repeatIndex}
        }
        moduleIndex = 0

        // cycle repeat index
        repeatIndex++
        if(repeatIndex < settings.blockRepeatCount) {
          return {blockLength, blockOffset, moduleIndex, repeatIndex}
        }
        repeatIndex = 0

        // cycle block index
        let L = blockLength.measure
        let O = blockOffset.measure
        let LM = blockLength.module
        let OM = blockOffset.module

        if( !( LM  
            ?  (OM + LM) % (2 * LM) == 0  
            :  (O + L) % (2 * L) == 0)
          && O+L < measuresInModule
        ) {
          // new material (smallest interval immediately after current one)
          blockOffset = {measure: O + L, module: OM + LM}
          blockLength = {measure: 1, module: 0}
          return {blockLength, blockOffset, moduleIndex, repeatIndex}
        }

        if(2*L < measuresInModule) {
          // review (double interval size, end time fixed)
          blockOffset = {measure: O - L, module: OM - LM}
          blockLength = {measure: 2 * L, module: 2 * LM}
          return {blockLength, blockOffset, moduleIndex, repeatIndex}
        }

        // review (interval expands to full module)
        blockOffset = {measure: 0, module: OM + LM}
        blockLength = {measure: 0, module: 1}
        return {blockLength, blockOffset, moduleIndex, repeatIndex}
      },
    }),

  })
} 
