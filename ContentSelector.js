import React, { useEffect, useState } from 'react';
import { Text, View, SectionList, Pressable, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'
import {styles, colors} from './styles'
import { useDispatch, useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';
import { scriptureFromKey } from './util';
import { getCurrentModule, setStartVerse, showModuleChooser } from './reducer'
import NestedListView, {NestedRow} from 'react-native-nested-listview'
import spacer from './spacer.svg'

export const ContentSelector = React.forwardRef((props, ref) => {
  let dispatch = useDispatch()
  let expanded = useSelector(state => state.visual.showModuleChooser)

  useFirestoreConnect([{collection:'memoryResources_02', storeAs:'memoryResources'}])
  let resources = useSelector(state => state.firestore.data.memoryResources)

  let data = [{title: "Loading", items: []}]
  if (resources) {
    // filter only verses with music uploaded
    resources = Object.fromEntries(Object.entries(resources).filter(([key, data]) => data.music))

    // format into subcatagories by book (formatted for NestedListView)
    data = Object.entries(resources)
      .sort(([k1,v1], [k2,v2]) => k1 > k2)
      .reduce( (books, [key, data]) => {
        let b = data.book
        let bc = `${b} ${data.chapter}`
        let bcv = `${bc} ${data.startVerse}-${data.endVerse}`

        books[b] = books[b] || {}
        books[b][bc] = books[b][bc] || {}
        books[b][bc][bcv] = key

        return books
      }, {})

    function nestObjectForList(obj) { // object keys become title
      return Object.entries(obj)
      .reduce((a, [key, value]) => {
        if(typeof value == 'object')
          a.push({ title: key, opened: true, items: nestObjectForList(value) })
        else 
          a.push({ title: key, value})
        return a
      }, [])
    }
    data = nestObjectForList(data)
  }

  // keep current selection key in redux, but get all info for that key from resources
  // display curItem == currently playing module not currently selected module
  let curItem = useSelector( state => getCurrentModule(state))

  let selectorList = <View style={[styles.contentSelector, {left: expanded ? 0 : '-100%'}]}>
    <NestedListView 
      data={data}
      extraData={curItem && curItem.key}
      getChildrenName={() => 'items'}
      onNodePressed={(node) => {
        if(node.value) {
          dispatch(setStartVerse(node.value))
        }
      }}
      renderNode={(node, level) => (<View>
        <NestedRow level={level} paddingLeftIncrement={30} style={curItem && node.value == curItem.key
            ? {backgroundColor: colors.lightBlue} : {}}>
          <View style={styles.listRow}>
            <Text style={level == 1 ? styles.listTitle : styles.listEntry}>
              {node.title}
            </Text>

            {node.items && <FontAwesome name={node.opened ? "angle-down" : "angle-right"}
              style={{marginVertical: -20}} size={40} color={colors.primary} />}
              
          </View>
        </NestedRow>

        <Image source={spacer} style={styles.listSpacer}/>
      </View>)}
    />
  </View>

  let title = <Pressable onPress={() => dispatch(showModuleChooser(!expanded))}>
    <View style={styles.contentTitle}>
      <Text style={[styles.titleText]}>
        { curItem ? `${curItem.book} ${curItem.chapter}:${curItem.startVerse}-${curItem.endVerse}` : '' }
      </Text>
    </View>
  </Pressable> 

  return <>
    {title}
    {selectorList}
  </>
})