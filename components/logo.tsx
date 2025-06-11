import { StyleSheet, View, Image } from 'react-native'
import React from 'react'

export default function logo() {
  return (
    <View>
        <View style={styles.profilePicWrapper}>
                <Image          
                  style={styles.profilePic}
                  source={require('@/assets/images/logo.png')}
                />
              </View>
    </View>
  )
}

const styles = StyleSheet.create({
    profilePicWrapper: {
        width:  200,
        height: 150,
        alignSelf: 'center',
    },
    profilePic: {
        
        width: '100%',
        height: '100%',
        
    },

})