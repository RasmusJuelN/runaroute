import React, { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, View, TouchableOpacity} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';

type Props = {
  coords: { lat: string; lon: string } | null;
};

export default function MapWithLocation({ coords }: Props) {
  const [region, setRegion] = useState<Region | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [showMarker, setShowMarker] = useState(true);
  const mapRef = useRef<MapView>(null);

  // Get user's current location on mount
  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission denied', 'Location permission is required to use this feature.');
          return;
        }
        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        setUserLocation({ latitude, longitude });
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      } catch (error) {
        Alert.alert('Error', 'Failed to get location: ' + (error as Error).message);
      }
    })();
  }, []);

  // Update region and show marker when user selects an address
  useEffect(() => {
    if (coords) {
      console.log('Address selected coords:', coords);
      setRegion({
        latitude: parseFloat(coords.lat),
        longitude: parseFloat(coords.lon),
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setShowMarker(true); // Show marker when address is selected
    }
  }, [coords]);

  // Helper to compare regions (with some tolerance)
  const isRegionUserLocation = (region: Region, userLocation: { latitude: number; longitude: number }) => {
    const tolerance = 0.0005;
    return (
      Math.abs(region.latitude - userLocation.latitude) < tolerance &&
      Math.abs(region.longitude - userLocation.longitude) < tolerance
    );
  };

  // Custom handler for the custom button
  const handleShowMyLocation = () => {
    if (userLocation && mapRef.current) {
      setShowMarker(false); // Hide marker when showing user location
      console.log('ShowMyLocation button pressed, user coords:', userLocation);
      mapRef.current.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
        
      });
    }
  };

  if (!region) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        showsUserLocation={true}
        showsMyLocationButton={false} // Hide built-in button
        onRegionChangeComplete={newRegion => {
          if (
            userLocation &&
            isRegionUserLocation(newRegion, userLocation)
          ) {
            setShowMarker(false);
          }
        }}
      >
        {coords && showMarker && (
          <Marker
            coordinate={{
              latitude: parseFloat(coords.lat),
              longitude: parseFloat(coords.lon),
            }}
          />
        )}
      </MapView>
      <TouchableOpacity style={styles.myLocationButton} onPress={handleShowMyLocation}>
        <MaterialIcons name="my-location" size={28} color="#f0735a" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  myLocationButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 12,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});