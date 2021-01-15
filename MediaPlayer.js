import React, { useState } from 'react';
import { View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'
import { Svg, Path } from 'react-native-svg';
import {styles, colors} from './styles'
import { useDispatch, useSelector } from "react-redux";

export function MediaPlayer(props) {
  let [playing, setPlaying] = useState(false)

  return <View>
    {
      playing
      ? <FontAwesome name="pause" size={60} color={colors.text} onPress={() => {setPlaying(p => !p)}} />
      : <FontAwesome name="play" size={60} color={colors.text} onPress={() => {setPlaying(p => !p)}} />
    }
    <Waves style={{flex: 1}} />
    {/* Handles playing audio. Splitting the source into repetitions may be seperated out */}
  </View>
}

function Wave({wavelength, amplitude, offsetX, offsetY, count=10, ...props}) {
  const p = 0.3642 // guide point
  let w = wavelength ? wavelength/2 : 1
  let a = amplitude || 1
  let x = offsetX || 0
  let y = offsetY || 0

  let d = `M ${x} ${y}`
  for(let i=0; i < count; i+=2) {
    d += `C ${w*(i+p)+x} ${y} ${w*(i+1-p)+x} ${a+y} ${w*(i+1)+x} ${a+y}
        C ${w*(i+1+p)+x} ${a+y} ${w*(i+2-p)+x} ${y} ${w*(i+2)+x} ${y}`
  }

  return <Path d={d} stroke={colors.pink} strokeWidth="0.2" fill='none' {...props} />
}

function Waves(props) {
  return <View {...props}>
    <Svg viewBox="0 -.5 10 2">
      <Wave amplitude={1} wavelength={11} offsetX={-1} stroke={colors.pink} strokeWidth="0.3" />
      <Wave amplitude={1} wavelength={7} offsetX={-2} stroke={colors.yellow} strokeWidth="0.3" />
      <Wave amplitude={1} wavelength={5} offsetX={-2} stroke={colors.lightBlue} strokeWidth="0.3" />
    </Svg>
  </View>
}