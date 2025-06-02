import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

type Props = {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  style?: object;
};

export default function SeekBar({ value, onValueChange, min = 1, max = 50 }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Distance: {value} km</Text>
      <Slider
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        step={1}
        value={value}
        onValueChange={onValueChange}
        minimumTrackTintColor="#f0735a"
        maximumTrackTintColor="#f0735a"
        thumbTintColor="#f0735a"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',

    marginTop: 20

  },
  label: {
    fontSize: 20,
    paddingLeft:14,
    paddingBottom: 10,
    color: '#f0735a',
    zIndex: 10,
  },
  slider: {
    width: '100%',
    height: 20,
    zIndex: 5,
  },
});