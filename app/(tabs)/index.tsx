import React, { useRef, useState, useEffect } from 'react';
import { Button, Keyboard, StyleSheet, TouchableWithoutFeedback, View, Text, TouchableOpacity, Platform } from 'react-native';
import AddressInput from '@/components/AddressInput';

// Remove static import of MapWithLocation for web compatibility
import SeekBar from '@/components/SeekBar';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Animated,Alert, ActivityIndicator} from 'react-native';
import * as Location from 'expo-location';

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
        seed,
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

// Haversine formula for distance in km
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function HomeScreen() {
  const [address, setAddress] = useState('');
  const [coords, setCoords] = useState<{ lat: string; lon: string } | null>(null);
  const [distance, setDistance] = useState(5);
  const [routes, setRoutes] = useState<RouteType[]>([]);
  const [currentRouteIndex, setCurrentRouteIndex] = useState(0);
  const [routeStarted, setRouteStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Tracking state
  const [tracking, setTracking] = useState(false);
  const [userPath, setUserPath] = useState<{ latitude: number; longitude: number; timestamp: number }[]>([]);
  const [elapsed, setElapsed] = useState(0); // seconds
  const [distanceCovered, setDistanceCovered] = useState(0); // km
  const [pace, setPace] = useState(0); // min/km
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const locationSub = useRef<Location.LocationSubscription | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showSavedAlert, setShowSavedAlert] = useState(false);
  const resetRouteState = () => {
  setTracking(false);
  setRouteStarted(false);
  setIsPaused(false);
  setUserPath([]);
  setElapsed(0);
  setDistanceCovered(0);
  setPace(0);
  if (timerRef.current) clearInterval(timerRef.current);
  if (locationSub.current) locationSub.current.remove();
  // Animate topPanel back to original position
  Animated.timing(topPanelTranslate, {
    toValue: 0,
    duration: 400,
    useNativeDriver: true,
  }).start();
};
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

  // Panel animation
  const topPanelTranslate = useRef(new Animated.Value(0)).current; // Y position

  // Start tracking
  const startRoute = async () => {
    setTracking(true);
    setUserPath([]);
    setElapsed(0);
    setDistanceCovered(0);
    setPace(0);

    // Start timer
    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);

    // Subscribe to location
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;
    locationSub.current = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.Highest, distanceInterval: 2 },
      loc => {
        setUserPath(path => {
          const newPath = [...path, { latitude: loc.coords.latitude, longitude: loc.coords.longitude, timestamp: Date.now() }];
          // Calculate distance
          if (newPath.length > 1) {
            const prev = newPath[newPath.length - 2];
            const curr = newPath[newPath.length - 1];
            setDistanceCovered(d =>
              d + getDistance(prev.latitude, prev.longitude, curr.latitude, curr.longitude)
            );
          }
          return newPath;
        });
      }
    );
  };

  // show alert to confirm stopping the route
  const stopRoute = () => {
  Alert.alert(
    'Stop Route',
    'Are you sure you want to stop the route?',
    [
      {
        text: 'No',
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          Alert.alert(
            'Save Route',
            'Do you want to save this route?',
            [
              {
                text: 'No',
                style: 'destructive',
                onPress: () => {
                  resetRouteState();
                },
              },
              {
                text: 'Yes',
                onPress: () => {
                  setShowSavedAlert(true);
                  resetRouteState();
                  setTimeout(() => setShowSavedAlert(false), 2000);
                },
              },
            ],
            { cancelable: false }
          );
        },
      },
    ],
    { cancelable: false }
  );
};

  // Update pace
  useEffect(() => {
    if (distanceCovered > 0) {
      setPace((elapsed / 60) / distanceCovered); // min/km
    }
  }, [elapsed, distanceCovered]);

  // Pause/Resume tracking
  useEffect(() => {
    if (tracking && isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (locationSub.current) locationSub.current.remove();
    } else if (tracking && !isPaused) {
      // Resume timer and location
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
      Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Highest, distanceInterval: 2 },
        loc => {
          setUserPath(path => {
            const newPath = [...path, { latitude: loc.coords.latitude, longitude: loc.coords.longitude, timestamp: Date.now() }];
            if (newPath.length > 1) {
              const prev = newPath[newPath.length - 2];
              const curr = newPath[newPath.length - 1];
              setDistanceCovered(d =>
                d + getDistance(prev.latitude, prev.longitude, curr.latitude, curr.longitude)
              );
            }
            return newPath;
          });
        }
      ).then(sub => {
        locationSub.current = sub;
      });
    }
    // Cleanup on unmount
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (locationSub.current) locationSub.current.remove();
    };
    // eslint-disable-next-line
  }, [isPaused, tracking]);

  // Animate panels and start route
  const handleStart = () => {
    Animated.parallel([
      Animated.timing(topPanelTranslate, {
        toValue: -500, // Slide up (adjust as needed)
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setRouteStarted(true);
      startRoute();
    });
  };

  // Dynamically import MapWithLocation for web compatibility
  let MapWithLocation;
  if (Platform.OS !== 'web') {
    MapWithLocation = require('@/components/MapWithLocation').default;
  }

  return (
    
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      
      <View style={styles.container}>{showSavedAlert && (
  <View style={{
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 999,
  }}>
    <View style={{
      backgroundColor: '#222',
      padding: 24,
      borderRadius: 16,
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 8,
    }}>
      <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>Route saved!</Text>
    </View>
  </View>
)}
        {/* Live stats at the top when tracking */}
        {tracking && (
          <View style={styles.statsBar}>
            <View style={styles.statsItem}>
              <Text style={styles.statsLabel}>Distance</Text>
              <Text style={styles.statsValue}>{distanceCovered.toFixed(2)} km</Text>
            </View>
            <View style={styles.statsItem}>
              <Text style={styles.statsLabel}>Time</Text>
              <Text style={styles.statsValue}>
                {`${Math.floor(elapsed / 60).toString().padStart(2, '0')}:${(elapsed % 60).toString().padStart(2, '0')}`}
              </Text>
            </View>
            <View style={styles.statsItem}>
              <Text style={styles.statsLabel}>Pace</Text>
              <Text style={styles.statsValue}>
                {pace > 0 ? pace.toFixed(2) : '0.00'} min/km
              </Text>
            </View>
          </View>
        )}

        {/* Top Panel */}
        <Animated.View style={[styles.topPanel, {
          transform: [{ translateY: topPanelTranslate }],
          display: routeStarted ? 'none' : 'flex'
        }]}>
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
        </Animated.View>

        {/* Map */}
        <View style={styles.mapContainer}>
          {!mapLoaded && (
            <View style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: '#222C',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
            }}>
              <ActivityIndicator size="large" color="#f0735a" />
              <Text style={{ color: '#fff', marginTop: 12 }}>Loading map...</Text>
            </View>
          )}
          {Platform.OS !== 'web' && MapWithLocation && (
            <MapWithLocation
              coords={coords}
              route={routes.length > 0 ? routes[currentRouteIndex] : null}
              onSetCoords={setCoords}
              onMapLoaded={() => setMapLoaded(true)} // <-- Pass this prop
            />
          )}
          {Platform.OS === 'web' && (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#888', fontSize: 18 }}>Map is not available on web.</Text>
            </View>
          )}
        </View>
        {/* Bottom Panel for Route Controls */}
        <View style={styles.bottomPanel}>
          {/* Show "Find routes" button if no routes yet and not started */}
          {!routeStarted && coords && routes.length === 0 && (
            <TouchableOpacity style={styles.customButton} onPress={handleFindRoute}>
              <Text style={styles.customButtonText}>Find routes</Text>
            </TouchableOpacity>
          )}

          {/* Show route controls if routes exist and not started */}
          {!routeStarted && routes.length > 0 && (
            <View style={styles.routeControls}>
              <TouchableOpacity
                style={[styles.customButton, styles.customButtonCancel]}
                onPress={() => setRoutes([])}
              >
                <MaterialIcons name="close" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.customButton}
                onPress={handleFindRoute}
              >
                <MaterialIcons name="refresh" size={20} color="#fff" />
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
                <MaterialIcons name="chevron-left" size={20} color="#fff" />
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
                <MaterialIcons name="chevron-right" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          )}

          {/* Show only Pause and Stop when route is started */}
          {routeStarted && (
            <View style={styles.routeControls}>
              <TouchableOpacity
                style={styles.customButton}
                onPress={() => setIsPaused(p => !p)}
              >
                <MaterialIcons name={isPaused ? "play-arrow" : "pause"} size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.customButton, styles.customButtonCancel]}
                onPress={stopRoute}
              >
                <MaterialIcons name="stop" size={20} color="#fff" />
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

  },
  statsBar: {
    position: 'absolute',
    top: 8,
    left: 0,
    right: 0,
    zIndex: 100,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#3e3e3eE6',
    borderRadius: 16,
    marginHorizontal: 8,
    paddingVertical: 12,
  },
  statsItem: {
    alignItems: 'center',
    minWidth: 80,
  },
  statsLabel: {
    color: '#fff',
    fontSize: 16,
  },
  statsValue: {
    color: '#f0735a',
    fontSize: 22,
    fontWeight: 'bold',
  },
  topPanel: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    padding: 16,
    zIndex: 10,
    borderRadius: 20,
    backgroundColor: '#3e3e3eE6'
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
    bottom: 8,
    left: 8,
    right: 8,
    padding: 16,
    backgroundColor: '#3e3e3eE6',
    borderRadius: 20,
    zIndex: 10,
    flexDirection: 'column',
    alignItems: 'center',
  },
  customButton: {
    paddingVertical: 12,
    paddingHorizontal: 12,
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
    fontSize: 20,
    textAlign: 'center',
  },
});