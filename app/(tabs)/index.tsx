import React, { useState } from 'react';
import { Keyboard, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import AddressInput from '@/components/AddressInput';
import MapWithLocation from '@/components/MapWithLocation';
import SeekBar from '@/components/SeekBar';

export default function HomeScreen() {
  const [address, setAddress] = useState('');
  const [coords, setCoords] = useState<{ lat: string; lon: string } | null>(null);
  const [distance, setDistance] = useState(5);
  return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <View style={styles.topPanel}>
    <AddressInput
      style={styles.addressInput}
      value={address}
      onChangeText={setAddress}
      onSelectSuggestion={sugg => setCoords({ lat: sugg.lat, lon: sugg.lon })}
    />
    <SeekBar value={distance} onValueChange={setDistance} style={styles.seekbar}/>
  </View>
        <View style={styles.mapContainer}>
    <MapWithLocation coords={coords} />
  </View>
  </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
  },
  topPanel: {
    position: 'relative',

    padding: 16,
    margin: 10,
    zIndex: 10,
    borderRadius: 20,
    backgroundColor: '#3e3e3e'
  },
  addressInput: {
    position: 'relative',
  },
  seekbar: {
    position: 'relative',
  },

  mapContainer: {
    flex: 1,
    zIndex: 1,
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
});