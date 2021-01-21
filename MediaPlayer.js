import React, { useEffect, useRef, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'
import { Svg, Path } from 'react-native-svg';
import {styles, colors} from './styles'
import { useDispatch, useSelector } from "react-redux";
import { storage } from './firebase'
import { useAsyncEffect } from './hooks';
import { useFirestoreConnect } from 'react-redux-firebase';

// Need to replace Video with react-native-video 
//    for non web. APIs are compatable for us.
import Video from '@lnormanha/react-native-web-video'
import poster from './icon.png'
import { getCurrentModule, nextBlock } from './reducer';


export function MediaPlayer(props) {
  let [paused, setPaused] = useState(false)
  let dispatch = useDispatch()

  useFirestoreConnect([{collection:'memoryResources_02', storeAs:'memoryResources'}])
  let curItem = useSelector( state => getCurrentModule(state))

  let [url, setUrl] = useState('')
  let playerRef = useRef()

  useAsyncEffect(async (cancel) => {
    if(curItem) {
      let u = await storage.ref(curItem.music[0]).getDownloadURL()
      setUrl(u)
    }
  }, [curItem && curItem.music[0]])

  console.log('url', url)


  return <>
    {/* Handles playing audio. Splitting the source into repetitions may be seperated out */}
    <Video
      source={{uri: url}}
      ref={playerRef}
      // poster={poster}
      paused={paused}
      posterResizeMode={'none'}
      audioOnly={true}
      // onBuffer={}
      // onError={}
      style={{
        position: 'absolute',
        top: 0, left: 0,
        width: 0, height: 0,
      }} 
    />

    <View style={styles.mediaPlayer}>
      <FontAwesome
        name={paused ? "play" : "pause"}
        style={{marginTop:-40, marginBottom:-40}}
        size={80} color={colors.text}
        onPress={() => {setPaused(p => !p)}}   
      />
      {/* <FontAwesome name={"star"} // for testing block itteration
        style={{marginTop:-40, marginBottom:-40}}
        size={80} color={colors.text}
        onPress={() => {dispatch(nextBlock())}}   
      /> */}
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