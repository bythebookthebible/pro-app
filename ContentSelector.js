import React, { useEffect, useState } from 'react';
import { Text, View, SectionList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'
import {styles, colors} from './styles'
import { useDispatch, useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';
import { scriptureFromKey } from './util';
import { getCurrentModule, setStartVerse } from './reducer'

export const ContentSelector = React.forwardRef((props, ref) => {
  let [expanded, setExpanded] = useState(false)
  let dispatch = useDispatch()

  useFirestoreConnect([{collection:'memoryResources_02', storeAs:'memoryResources'}])
  let resources = useSelector(state => state.firestore.data.memoryResources)

  let books = [{title: "Loading", data: []}]
  if (resources) {
    // filter only verses with music uploaded
    resources = Object.fromEntries(Object.entries(resources).filter(([key, data]) => data.music))
  
    // format into subcatagories by book (formatted for SectionList)
    books = Object.entries(resources)
      .sort(([k1,v1], [k2,v2]) => k1 > v1)
      .reduce( (books, [key, data]) => {
        books[data.book] = books[data.book] || {title: data.book, data:[]}
        let title = `${data.chapter}:${data.startVerse}-${data.endVerse}`
        books[data.book].data.push({title, key})
        return books
      }, {})

    books = Object.values(books)
  }

  // keep current selection key in redux, but get all info for that key from resources
  // display curItem == currently playing module not currently selected module
  let curItem = useSelector( state => getCurrentModule(state))

  let listForm = <SectionList
    sections={books}
    keyExtractor={(item, index) => item + index}
    renderItem={({item, section}) => 
      <Text
        style={styles.text}
        onPress={() => {
          dispatch(setStartVerse(item.key))
          setExpanded(false)
        }}
      >{item.title}</Text>
    }
    renderSectionHeader={({ section: { title } }) => (
      <Text style={styles.titleText}>{title}</Text>
    )}
  />

  let shortForm = <Text
    style={styles.titleText}
    onPress={() => {setExpanded(true)}}
  >
    { curItem ? `${curItem.book} ${curItem.chapter}:${curItem.startVerse}-${curItem.endVerse}` : '' }
  </Text>

  return <View style={styles.contentSelector}>
    {expanded ? listForm : shortForm}
  </View>
})