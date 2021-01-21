import React, { useEffect, useRef, useState } from 'react';
import { Text, View, FlatList, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'
import {styles, colors} from './styles'
import { useDispatch, useSelector } from "react-redux";
import { setRepeatCount, setBlockSize } from './reducer';
import _ from 'lodash'


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

  let dispatch = useDispatch()
  let size = useSelector(state => state.settings.blockSize)
  let count = useSelector(state => state.settings.repeatCount)
  
  let sizeOptions = [1, 2, 3, 4, 5, 6, 7, 8]
  let countOptions = [1, 2, 3, 4, 5, 6, 7, 8]

  if(expanded) return <View style={styles.settingSelectorExpanded}>
    <Text style={styles.listSelectorTitle}>Block Size:</Text>
    <ListSelector
      data={sizeOptions}
      keyExtractor={(item) => item}
      selected={size}
      onPress={size => dispatch(setBlockSize(size))}
    />

    <Text style={styles.listSelectorTitle}>Repeat Count:</Text>
    <ListSelector
      data={countOptions}
      keyExtractor={(item) => item}
      selected={count}
      onPress={count => dispatch(setRepeatCount(count))}
    />

    <FontAwesome style={styles.settingIcon} name="gear" size={40} color={colors.text} onPress={() => {setExpanded(p => !p)}} />
  </View>

  else return <View style={styles.settingSelector}>
    <FontAwesome style={styles.settingIcon} name="gear" size={40} color={colors.text} onPress={() => {setExpanded(p => !p)}} />
  </View>
})

function ListSelector({data, renderItem, onPress, selected, ...props}) {
  let listRef = useRef()

  // scroll so selected position is visible
  let itemHeight = styles.listSelectorItem.height
  useEffect(() => {
    listRef.current && 
    listRef.current.scrollToIndex({
      animated: true, 
      index: Math.max(0, (_.indexOf(data, selected))),
      viewPosition: 0,
    })
  }, [listRef])

  function renderItem({ item, index, separators }) {
        return <TouchableOpacity
          onPress={() => onPress && onPress(item, index)}
          onShowUnderlay={separators.highlight}
          onHideUnderlay={separators.unhighlight}
          activeOpacity={.6}
          style={{opacity: (item == selected ? 1 : .2)}}
        >
          <View>
            <Text style={styles.listSelectorItem}>{String(item)}</Text>
          </View>
        </TouchableOpacity>
      }

  return <View style={styles.listSelector}>
    <FlatList {...props}
      ref={listRef}
      data={data}
      extraData={selected}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      getItemLayout={ (data, index) => ({length: itemHeight, offset: itemHeight * index, index}) }
    />
  </View>
}