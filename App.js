/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import type { Node } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const cacheQR = [];
const App: () => Node = () => {

  const [memesList, setMemesList] = useState([{
    "box_count": 3, "height": 1524,
    "id": "180190441", "name": "They're The Same Picture",
    "url": "https://i.imgflip.com/2za3u1.jpg", "width": 1363
  }])

  const getMemesFromApiAsync = async () => {
    try {
      const response = await fetch(
        'https://api.imgflip.com/get_memes'
      );
      const json = await response.json()
      const memes = [...memesList, ...json.data.memes]
      setMemesList(memes)
      return json.data
    } catch (error) {
      console.error(error)
    }
  }

  const callback = (svg, idKey) => {
    const result = cacheQR.find(({ id }) => id == idKey)
    if (!result) {
      cacheQR.push({ id: idKey, svg: svg })
    }
  }

  const getDataUrl = (svg, id) => {
    svg.toDataURL((data) => callback(data, id))
  }

  const qrItem = (item) => {
    const result = cacheQR.find(({ id }) => id == item.id)
    if (result != null) {
      return (
        <View style={styles.cacheContainer}>
          <Image
            style={styles.logoQR} source={{ uri: `data:image/png;base64,${result.svg}` }}
          />
          <Text style={styles.textStyle}>Cache</Text>
        </View>
      )
    } else {
      return (<QRCode value={item.url}
        getRef={(c) => {
          if (c != null)
            getDataUrl(c, item.id)
        }}
      />
      );
    }
  }

  const renderItemComponent = ({ index, item }) => {
    return (<TouchableOpacity activeOpacity={0.5} style={styles.itemContainer} key={"child" + index}>
      <Text style={styles.textStyle}>{item.name}</Text>
      <View style={styles.imageContainer}>
        <Image style={styles.imageStyle} source={{ uri: item.url, }} />
        {qrItem(item)}
      </View>
    </TouchableOpacity>)
  }

  const handleLoadMore = () => {
    getMemesFromApiAsync()
  }

  return (
    <FlatList
      style={styles.flatListContainer}
      data={memesList}
      renderItem={item => renderItemComponent(item)}
      keyExtractor={(item, index) => index}
      onEndReached={handleLoadMore} />
  );
};

const styles = StyleSheet.create({
  flatListContainer: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 8
  },
  itemContainer: {
    flex: 1,
    height: 180,
    marginStart: 16,
    marginEnd: 16,
    marginTop: 8,
    marginBottom: 8,
    padding: 10,
    backgroundColor: "#cccccc",
    borderRadius: 16,
  },
  textStyle: {
    color: "black",
    textAlign: 'center',
    fontWeight: 'bold'
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8
  },
  imageStyle: {
    height: 100,
    width: 100,
    borderRadius: 8,
  },
  cacheContainer: {
    backgroundColor: "#0f0",
    padding: 5,
    borderRadius: 8,
  },
  logoQR: {
    width: 95,
    height: 95,
    margin: 5
  },
})

export default App;
