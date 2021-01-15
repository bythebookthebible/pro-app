import React, { useState } from 'react';
import { StyleSheet, Text, View, SectionList, Image, Pressable, Button, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'
import {styles, colors} from './styles'
import { useDispatch, useSelector } from "react-redux";


function iconMenu({children, icon, ...props}) {
  let [expanded, setExpanded] = useState(false)

  return <View>
    {expanded && children}
    {React.cloneElement(icon, 
      {style: (expanded ? {} : {}) }
    )}
  </View>
}

export const SettingSelector = React.forwardRef((props, ref) => {
  let [expanded, setExpanded] = useState(false)

  let countOptions = [1, 2, 3, 4, 5, 6, 7]
  let sizeOptions = ['S', 'M', 'L']

  let [count, setCount] = useState(5)
  let [size, setSize] = useState('M')

  return <View style={styles.selectRepeat}>
    {expanded && <>
      <View>
        <Text>Repeat Size:</Text>
        <Text>{size}</Text>
      </View>
      <View>
        <Text>Repeat Count:</Text>
        <Text>{count}</Text>
      </View>
    </>}
    <FontAwesome name="gear" size={40} color={colors.text} onPress={() => {setExpanded(p => !p)}} />

  </View>
})