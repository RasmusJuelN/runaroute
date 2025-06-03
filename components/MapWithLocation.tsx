import React, { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, View, TouchableOpacity} from 'react-native';
import MapView, { Marker, Polyline, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';

type Props = {
  coords: { lat: string; lon: string } | null;
  route?: RouteType | null; // Optional route prop
  onSetCoords: (coords: { lat: string; lon: string }) => void;
  
};

type RouteType = {
  coordinates: { latitude: number; longitude: number }[];
  distance: number;
};

export default function MapWithLocation({ coords , route, onSetCoords}: Props) {
  const [region, setRegion] = useState<Region | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [showMarker, setShowMarker] = useState(true);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (userLocation && !coords) {
      onSetCoords({
        lat: userLocation.latitude.toString(),
        lon: userLocation.longitude.toString(),
      });
    }
  }, [userLocation]);
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
      setShowMarker(false);
      mapRef.current.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      // Set coords to user location
      onSetCoords({
        lat: userLocation.latitude.toString(),
        lon: userLocation.longitude.toString(),
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
        showsMyLocationButton={false}
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
        {/* Show route polyline if available */}
        {route && (
          <Polyline
            coordinates={route.coordinates}
            strokeColor="#f0735a"
            strokeWidth={4}
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
    bottom: 110,
    right: 12,
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 12,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});