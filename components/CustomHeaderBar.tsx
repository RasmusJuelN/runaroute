import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CustomTopBar() {
  return (
    <View style={styles.topBar}>
      {/* Add icons, buttons, etc. here if needed */}
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    width: '100%',
    height: 40,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    // Add shadow if you want
    elevation: 2,
  }
});