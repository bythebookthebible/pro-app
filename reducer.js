import { createReducer, combineReducers, createAction, createAsyncThunk } from '@reduxjs/toolkit'
import { firestoreReducer } from 'redux-firestore'
import { firebaseReducer } from 'react-redux-firebase'
import { valueAfter } from './util'

export const showSettings = createAction('VISUAL/SHOW_SETTINGS')
export const showModuleChooser = createAction('VISUAL/SHOW_MODULE_CHOOSER')
export const resetSelection = createAction('VISUAL/RESET_SELECTIONS')
export const playMedia = createAction('VISUAL/PLAYING_MEDIA')

export const setBlockSize = createAction('SETTINGS/SET_BLOCK_SIZE')
export const setRepeatCount = createAction('SETTINGS/SET_REPEAT_COUNT')

export const setStartVerse = createAsyncThunk('SET_START_MODULE', (key, thunk) => {
  // settings.blockUnitSize needed for player reducer
  let settings = thunk.getState().settings
  return {key, settings}
})

export const nextBlock = createAsyncThunk('PLAYER/NEXT_BLOCK', (arg, thunk) => {
  let state = thunk.getState()
  let settings = state.settings

  let curItem = getCurrentModule(state)
  let measuresInModule = Math.floor(curItem.length / 60 * curItem.bpm)

  return {settings, measuresInModule, ...arg}
})

const defaultBlockUnitSize = 4

export function getCurrentModule(state) {
  let resources = state.firestore.data.memoryResources
  if(!resources) return undefined
  
  let musicKeys = Object.entries(resources)
    .filter( ([key, data]) => data.music )
    .map( ([key, data]) => key )

  let key = valueAfter(musicKeys, state.content, state.repetition.blockOffset.module + state.repetition.moduleIndex)
  return {...resources[key], key}
}

export default function createRootReducer() {
  return combineReducers({
    // Add firebase to reducers
    firebase: firebaseReducer,
    firestore: firestoreReducer, // firestore is seperate

    // content selector
    content: createReducer('58-001-001-004', { // default starting module
      [setStartVerse.fulfilled]: (state, action) => {
        console.log(action)
        return action.payload.key
      }
    }),

    // visual state
    visual: combineReducers({
      showSettings: createReducer(false, {
        [showSettings]: (state, action) => action.payload,
        [playMedia]: (state, action) => action.payload ? false : state,
        [resetSelection]: () => false,
      }),
      showModuleChooser: createReducer(false, {
        [showModuleChooser]: (state, action) => action.payload,
        [playMedia]: (state, action) => action.payload ? false : state,
        [setStartVerse.fulfilled]: () => false,
        [resetSelection]: () => false,
      }),
      playMedia: createReducer(false, {
        [playMedia]: (state, action) => action.payload,
        [setStartVerse.fulfilled]: () => false,
      })
    }),

    // settings selector
    settings: combineReducers({
      blockUnitSize: createReducer(defaultBlockUnitSize, {
        [setBlockSize]: (state, action) => action.payload
      }),
      blockRepeatCount: createReducer(3, {
        [setRepeatCount]: (state, action) => action.payload
      }),
    }),

    // media player
    repetition: repetitionReducer,
  })
}

const repetitionReducer = createReducer({
  blockLength: {measure: defaultBlockUnitSize, module: 0},
  blockOffset: {measure: 0, module: 0},
  moduleIndex: 0,
  repeatIndex: 0,
}, {
  [setStartVerse.fulfilled]: (state, action) => {
    console.log(action)
    return {
      blockLength: {module: 0, measure: action.payload.settings.blockUnitSize},
      blockOffset: {module: 0, measure: 0},
      moduleIndex: 0,
      repeatIndex: 0,
    }
  },
  [setBlockSize]: (state, action) => {
    // keep offsets
    // round lengths to multiple of new block size
    let size = action.payload
    let m = state.blockLength.measure
    state.blockLength.measure = Math.max(size, Math.floor(m/size)*size)
    return state
  },
  [setRepeatCount]: (state, action) => {
    let {repeatIndex} = state
    let newBlockRepeatCount = action.payload

    // refresh repeat index
    if(repeatIndex >= newBlockRepeatCount) {
      repeatIndex = 0
    }
    return {...state, repeatIndex}
  },
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
      blockLength = {measure: settings.blockUnitSize, module: 0}
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
})