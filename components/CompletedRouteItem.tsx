import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

type Props = {
  date: string;
  distance: number;
  time: string;
  avgPace: string;
  image?: string;
  style?: object;
};

export default function CompletedRouteItem({ date, distance, time, avgPace, image }: Props) {
  return (
    <View style={styles.routeItem}>
      
      <View style={styles.routeInfo}>
        <Text style={styles.routeDate}>{date}</Text>
        <Text style={styles.routeStats}>
          {distance} km   |   {time}   |   {avgPace} min/km
        </Text>
      </View>
      {image && <Image source={{ uri: image }} style={styles.routeImage} />}
    </View>
  );
}

const styles = StyleSheet.create({
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3e3e3e',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
    alignSelf: 'stretch',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  routeImage: {
    width: 54,
    height: 54,
    borderRadius: 50,
    marginLeft: 14,

  },
  routeInfo: {
    flex: 1,

  },
  routeDate: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 2,
    color: '#f0735a',
  },
  routeStats: {
    fontSize: 16,
    fontWeight:'bold',
    color: '#ffffff',
  },
});