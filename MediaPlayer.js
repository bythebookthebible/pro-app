import React, { useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'
import { Svg, Path } from 'react-native-svg';
import {styles, colors} from './styles'
import { useDispatch, useSelector } from "react-redux";

export function MediaPlayer(props) {
  let [playing, setPlaying] = useState(false)

  return <>
    {/* Handles playing audio. Splitting the source into repetitions may be seperated out */}
    <View style={styles.mediaPlayer}>
      <FontAwesome
        name={playing ? "pause" : "play"}
        style={{marginTop:-40, marginBottom:-40}}
        size={80} color={colors.text} 
        onPress={() => {setPlaying(p => !p)}}   
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