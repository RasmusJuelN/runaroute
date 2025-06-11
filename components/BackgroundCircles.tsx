import { StyleSheet, View, Image } from 'react-native'
import React from 'react'

export default function BackgroundCircles() {
  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/circles.png')}
            blurRadius={90}
            style={StyleSheet.absoluteFillObject}
      resizeMode="cover"
          />
    </View>
  )
}

const styles = StyleSheet.create({
   container: {
    width: '100%', height: '100%', position: 'absolute'
   },
})