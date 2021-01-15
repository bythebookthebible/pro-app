import React, { useState } from 'react';
import { StyleSheet, Text, View, SectionList, Image, Pressable, Button, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'
import {styles, colors} from './styles'

export const ContentSelector = React.forwardRef((props, ref) => {
  let [expanded, setExpanded] = useState(false)
  let books = [
    {title:"James", data: [1,2,3,4,5]},
    {title:"Matthew", data: [5,6,7]},
  ]
  let [curBook, setCurBook] = useState(books[0].title)
  let [curChapter, setCurChapter] = useState(books[0].data[0])

  if(expanded) {
    return <SectionList
      style={styles.selectBook}
      sections={books}
      keyExtractor={(item, index) => item + index}
      renderItem={({item, section}) => 
        <Text
          style={styles.selectBookHeader}
          onPress={() => {
            setCurBook(section.title)
            setCurChapter(item)
            setExpanded(false)
          }}
        >{item}</Text>
      }
      renderSectionHeader={({ section: { title } }) => (
        <Text style={styles.selectBookHeader}>{title}</Text>
      )}
    />

  } else { // expanded == false
    return <View style={styles.selectBook}>
      <Text
        onPress={() => {setExpanded(true)}}
      >{`${curBook} ${curChapter}`}</Text>
    </View>
  }
})