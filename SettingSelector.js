import React, { useEffect, useRef, useState } from 'react';
import { Text, View, FlatList, TouchableOpacity, useWindowDimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'
import {styles, colors} from './styles'
import { useDispatch, useSelector } from "react-redux";
import { setRepeatCount, setBlockSize, showSettings } from './reducer';
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
  let dispatch = useDispatch()
  let expanded = useSelector(state => state.visual.showSettings)
  let size = useSelector(state => state.settings.blockUnitSize)
  let count = useSelector(state => state.settings.blockRepeatCount)
  let {width} = useWindowDimensions()

  let sizeOptions = [1, 2, 3, 4, 6, 8]
  let countOptions = [1, 2, 3, 4, 6, 8]

  if(expanded) return <View style={[styles.settingSelectorExpanded,
    {justifyContent: width < 600 ? 'flex-start' : 'flex-end'}]}>
    <View style={styles.settingItem}>
      <Text style={styles.titleText}>Repeat Section:</Text>
      <ListSelector
        data={countOptions}
        keyExtractor={(item) => item}
        selected={count}
        onPress={count => dispatch(setRepeatCount(count))}
      />
    </View>

    <View style={styles.settingItem}>
      <Text style={styles.titleText}>Section Size:</Text>
      <ListSelector
        data={sizeOptions}
        keyExtractor={(item) => item}
        selected={size}
        onPress={size => dispatch(setBlockSize(size))}
      />
    </View>

    <FontAwesome style={styles.settingIcon} name="gear" size={60}
    color={colors.lightBlue} onPress={() => dispatch(showSettings(!expanded))} />
  </View>

  else return <View style={styles.settingSelector}>
    <FontAwesome style={styles.settingIcon} name="gear" size={60}
    color={colors.lightBlue} onPress={() => dispatch(showSettings(!expanded))} />
  </View>
})

function ListSelector({data, renderItem, onPress, selected, ...props}) {
  let listRef = useRef()

  // scroll so selected position is visible
  let itemHeight = styles.text.fontSize
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
      extraData={selected}
      style={[styles.settingListItem, {opacity: (item == selected ? 1 : .2)}]}
    >
      <View>
        <Text style={styles.text}>{String(item)}</Text>
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