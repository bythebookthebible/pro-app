import React, { useEffect, useState } from 'react';
import { Text, View, SectionList, Pressable, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'
import {styles, colors} from './styles'
import { useDispatch, useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';
import { scriptureFromKey } from './util';
import { getCurrentModule, setStartVerse } from './reducer'
import NestedListView, {NestedRow} from 'react-native-nested-listview'
import spacer from './spacer.svg'

export const ContentSelector = React.forwardRef((props, ref) => {
  let [expanded, setExpanded] = useState(true)
  let dispatch = useDispatch()

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
      getChildrenName={() => 'items'}
      onNodePressed={(node) => {
        if(node.value) {
          dispatch(setStartVerse(node.value))
          setExpanded(false)
        }
      }}
      renderNode={(node, level) => (<View>
        <NestedRow level={level} paddingLeftIncrement={30}>
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

  // let selectorList = <SectionList
  //   style={[styles.ContentSelector, {left: expanded ? 0 : '-100%'}]}
  //   sections={books}
  //   keyExtractor={(item, index) => item + index}
  //   renderItem={({item, section}) => 
  //     <Text
  //       style={styles.text}
  //       onPress={() => {
  //         dispatch(setStartVerse(item.key))
  //         setExpanded(false)
  //       }}
  //     >{item.title}</Text>
  //   }
  //   renderSectionHeader={({ section: { title } }) => (
  //     <Text style={styles.titleText}>{title}</Text>
  //   )}
  // />

  let title = <Pressable onPress={() => {setExpanded(e => !e)}}>
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