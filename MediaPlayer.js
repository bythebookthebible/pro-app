import React, { useEffect, useRef, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'
import { Svg, Path } from 'react-native-svg';
import { styles, colors } from './styles'
import { useDispatch, useSelector } from "react-redux";
import { storage } from './firebase'
import { useAsyncEffect } from './hooks';
import { useFirestoreConnect } from 'react-redux-firebase';

import { Audio } from 'expo-av'

// import poster from './icon.png'
import { getCurrentModule, nextBlock } from './reducer';


export function MediaPlayer(props) {
  let [paused, setPaused] = useState(true)
  let dispatch = useDispatch()

  // cur video source url
  useFirestoreConnect([{collection:'memoryResources_02', storeAs:'memoryResources'}])
  let curItem = useSelector( state => getCurrentModule(state))
  let [url, setUrl] = useState('')

  useAsyncEffect(async (cancel) => {
    if(curItem) {
      let u = await storage.ref(curItem.music[0]).getDownloadURL()
      setUrl(u)
    }
  }, [curItem && curItem.music[0]])

  console.log('url', url)

  // cur indices 
  let {blockLength, blockOffset, moduleIndex, repeatIndex } = useSelector(state => state.repetition)
  let L = blockLength.measure
  let O = blockOffset.measure

  // these are refs so they can be current in 
  // the sound async effect without an update
  let measureTime = useRef(1)
  let startTime = useRef(0)
  let endTime = useRef(9999)
  if(curItem) {
    measureTime.current = 60 / curItem.bpm * 1000
    startTime.current = O * measureTime.current
    endTime.current = (O + L) * measureTime.current
  }

  // create sound object per url
  let [sound, setSound] = useState()
  let soundStatus = useRef({})
  useAsyncEffect(async (cancel) => {
    const { sound } = await Audio.Sound.createAsync(
      {uri: url}, // source
      { // initialStatus
        progressUpdateIntervalMillis: measureTime.current,
        // positionMillis: 0,
        // shouldPlay: false,
        // rate: 1.0,
      },
      (status) => { // onPlaybackStatusUpdate
        soundStatus.current = status
        if(status.positionMillis >= endTime.current || status.didJustFinish) {
          dispatch(nextBlock())
          console.log('nextBlock', status)
        }
      },
      true // downloadFirst
    )
    setSound(sound)
  }, [url])

  // clean up old sound objects
  React.useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync(); }
      : undefined;
  }, [sound]);

  // seek to the beginning part of the section each time the indices change
  useEffect(() => {
    if(soundStatus.current.isLoaded && url) {
      sound.setPositionAsync(startTime.current)
      console.log('seeking:', startTime.current)
    }
    // must trigger on moduleIndex, repeatIndex changes also
  }, [soundStatus, url, L, O, moduleIndex, repeatIndex])



  return <>
    <View style={styles.mediaPlayer}>
      <FontAwesome
        name={paused ? "play" : "pause"}
        style={{marginTop:-40, marginBottom:-40}}
        size={80} color={colors.text}
        onPress={() => {
          let p = !paused
          if(sound) {
            if(p) sound.pauseAsync()
            else sound.playAsync()
          }
          setPaused(p)
        }}   
      />
      <Waves />
    </View>
  </>
}

function Wave({wavelength, amplitude, offsetX, offsetY, maxX, ...props}) {
  const p = 0.3642 // guide point (fraction of quarter wave)
  let w = wavelength ? wavelength/2 : 1
  let a = amplitude ? amplitude/2 : 1
  let x = offsetX || 0
  let y = offsetY || 0
  let count = Math.ceil((maxX - x) / w)

  let d = `M ${x} ${y}`
  for(let i=0; i < count; i+=2) {
    d += `C ${w*(i+p)+x} ${y-a} ${w*(i+1-p)+x} ${y+a} ${w*(i+1)+x} ${y+a}
        C ${w*(i+1+p)+x} ${y+a} ${w*(i+2-p)+x} ${y-a} ${w*(i+2)+x} ${y-a}`
  }

  return <Path d={d} stroke={colors.pink} strokeWidth="0.2" fill='none' {...props} />
}

function Waves(props) {
  let {width} = useWindowDimensions()
  const aspect = 2

  return <View {...props} style={{
      zIndex: -10, pointerEvents: 'none',
      width: width, height: width / aspect, 
      marginTop: -width / aspect / 2,
      marginBottom: -width / aspect / 2,
    }}>
    <Svg viewBox={`0 -1 ${2*aspect} 2`} >
      <Wave amplitude={1} wavelength={5} offsetX={-1} maxX={2*aspect} 
        stroke={'#f008'} strokeWidth="0.2" />
      <Wave amplitude={1.2} wavelength={3} offsetX={-1} maxX={2*aspect} 
        stroke={'#ff08'} strokeWidth="0.18" />
      <Wave amplitude={.5} wavelength={2} offsetX={-1} maxX={2*aspect} 
        stroke={'#49f8'} strokeWidth="0.14" />
    </Svg>
  </View>
}