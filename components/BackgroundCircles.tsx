import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'

export default function BackgroundCircles() {
  return (
    <View style={{width: '100%', height: '100%', position: 'absolute'}}>
      <Image source={require('@/assets/images/circles.png')}
            blurRadius={90}
          />
    </View>
  )
}

const styles = StyleSheet.create({})