import React, { useState } from 'react';
import { Button, Keyboard, StyleSheet, TouchableWithoutFeedback, View , Text, TouchableOpacity} from 'react-native';
import AddressInput from '@/components/AddressInput';
import MapWithLocation from '@/components/MapWithLocation';
import SeekBar from '@/components/SeekBar';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type RouteType = {
  coordinates: { latitude: number; longitude: number }[];
  distance: number; // in km
};

async function fetchORSRoute(start: { lat: string; lon: string }, distanceKm: number, seed: number = 1) {
  const apiKey = '5b3ce3597851110001cf6248e5a552452d70455a998168bb819ed0f8';
  const url = 'https://api.openrouteservice.org/v2/directions/foot-walking/geojson';
  const body = {
    coordinates: [[parseFloat(start.lon), parseFloat(start.lat)]],
    options: {
      round_trip: {
        length: distanceKm * 1000, // meters
        points: 4,
        seed, // <--- use the seed
      },
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error('Failed to fetch route');
  const data = await res.json();
  const coordinates = data.features[0].geometry.coordinates.map(([lon, lat]: [number, number]) => ({
    latitude: lat,
    longitude: lon,
  }));
  const distance = data.features[0].properties.summary.distance / 1000;
  return { coordinates, distance };
}

export default function HomeScreen() {
  const [address, setAddress] = useState('');
  const [coords, setCoords] = useState<{ lat: string; lon: string } | null>(null);
  const [distance, setDistance] = useState(5);

  // New state for routes
  const [routes, setRoutes] = useState<RouteType[]>([]);
  const [currentRouteIndex, setCurrentRouteIndex] = useState(0);

  // Find Route handler
  const handleFindRoute = async () => {
  if (!coords) return;
  try {
    // Fetch 3 routes with different seeds
    const promises = [1, 2].map(seed => fetchORSRoute(coords, distance, seed));
    const routes = await Promise.all(promises);
    setRoutes(routes);
    setCurrentRouteIndex(0);
  } catch (e) {
    alert('Could not generate routes. Please try again.');
    setRoutes([]);
  }
};

  // Navigation handlers
  const handlePrevRoute = () => setCurrentRouteIndex(i => Math.max(i - 1, 0));
  const handleNextRoute = () => setCurrentRouteIndex(i => Math.min(i + 1, routes.length - 1));
  const handleStart = () => {
    // Implement your "start" logic here
    alert('Route started!');
  };

  return (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={styles.container}>
      {/* Top Panel */}
      <View style={styles.topPanel}>
        <AddressInput
          style={styles.addressInput}
          value={address}
          onChangeText={setAddress}
          onSelectSuggestion={sugg => {
            setCoords({ lat: sugg.lat, lon: sugg.lon });
            setRoutes([]); // Clear routes if new address is chosen
          }}
        />
        <SeekBar value={distance} onValueChange={setDistance} style={styles.seekbar} />
      </View>
      {/* Map */}
      <View style={styles.mapContainer}>
        <MapWithLocation
          coords={coords}
          route={routes.length > 0 ? routes[currentRouteIndex] : null}
          onSetCoords={setCoords}
        />
      </View>
      {/* Bottom Panel for Route Controls */}
      <View style={styles.bottomPanel}>
        {coords && routes.length === 0 && (
  <TouchableOpacity style={styles.customButton} onPress={handleFindRoute}>
    <Text style={styles.customButtonText}>Find routes</Text>
  </TouchableOpacity>
)}
        {routes.length > 0 && (
  <View style={styles.routeControls}>
    
    
    
    
    
    <TouchableOpacity
      style={[styles.customButton, styles.customButtonCancel]}
      onPress={() => setRoutes([])}
    >
      <MaterialIcons name="close" size={24} color="#fff" />
    </TouchableOpacity>
    <TouchableOpacity
      style={styles.customButton}
      onPress={handleFindRoute}
    >
      <MaterialIcons name="refresh" size={24} color="#fff" />
    </TouchableOpacity>
    <Text style={styles.routeDistance}>
      {routes[currentRouteIndex].distance.toFixed(1)} km
    </Text>
<TouchableOpacity
      style={[
        styles.customButton,
        currentRouteIndex === 0 && styles.customButtonDisabled,
      ]}
      onPress={handlePrevRoute}
      disabled={currentRouteIndex === 0}
    >
      <MaterialIcons name="chevron-left" size={24} color="#fff" />
    </TouchableOpacity>
<TouchableOpacity
      style={styles.customButton}
      onPress={handleStart}
    >
      <Text style={styles.customButtonText}>GO</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[
        styles.customButton,
        currentRouteIndex === routes.length - 1 && styles.customButtonDisabled,
      ]}
      onPress={handleNextRoute}
      disabled={currentRouteIndex === routes.length - 1}
    >
      <MaterialIcons name="chevron-right" size={24} color="#fff" />
    </TouchableOpacity>
    
  </View>
        )}
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
    position: 'absolute',
    top: 5,
    left: 5,
    right: 5,
    padding: 16,
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
  routeControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 8,
    
  },
  routeDistance: {
    color: '#fff',
    marginLeft: 4,
    marginRight: 4,
    fontWeight: 'bold',
    fontSize: 20,
  },
  mapContainer: {
    flex: 1,
    zIndex: 1,
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  generateButton: {
    
    width: '50%',
    borderRadius: 10,
    padding: 10,
  },
  bottomPanel: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    right: 5,
   
    padding: 20,
    backgroundColor: '#3e3e3e',
    borderRadius: 20,
  

    zIndex: 10,
    flexDirection: 'column',
    alignItems: 'center',
  },
  customButton: {
  paddingVertical: 12,
  paddingHorizontal:12,
  borderRadius: 10,
  backgroundColor: '#f0735a',
  marginHorizontal: 2,

  alignItems: 'center',
},
customButtonDisabled: {
  backgroundColor: '#ccc',
},
customButtonCancel: {
  backgroundColor: '#888',
},
customButtonText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 24,
  textAlign: 'center',
},
});