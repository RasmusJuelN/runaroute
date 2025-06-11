import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated} from 'react-native';

// You can import mockRoutes or pass them as props/context
import { mockRoutes } from '@/data/routes'; // adjust path if needed
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import BackgroundCircles from '@/components/BackgroundCircles';

type Route = {
  distance: number;
  avgPace: string; // format "mm:ss"
  date: string;    // format "YYYY-MM-DD" or similar
  // add other fields if needed
};

function getTotalKm(routes: Route[]) {
  return routes.reduce((sum, r) => sum + r.distance, 0);
}

function getAveragePace(routes: Route[]) {
  if (routes.length === 0) return '0:00';
  // Convert pace "mm:ss" to seconds, average, then back to mm:ss
  const totalSeconds = routes.reduce((sum, r) => {
    const [min, sec] = r.avgPace.split(':').map(Number);
    return sum + min * 60 + sec;
  }, 0);
  const avgSec = Math.round(totalSeconds / routes.length);
  const min = Math.floor(avgSec / 60);
  const sec = avgSec % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

function getRoutesLast30Days(routes: Route[]) {
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 30);

  return routes.filter(r => {
    const routeDate = new Date(r.date);
    return routeDate >= thirtyDaysAgo && routeDate <= now;
  }).length;
}

export default function StatisticsScreen() {
  const totalKm = getTotalKm(mockRoutes);
  const totalRoutes = mockRoutes.length;
   const routesLast30Days = getRoutesLast30Days(mockRoutes);
   const avgPaceSeconds = getAveragePaceSeconds(mockRoutes);


function useAnimatedNumber(toValue: number, duration = 500, formatter?: (v: number) => string) {
  const animated = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    Animated.timing(animated, {
      toValue,
      duration,
      useNativeDriver: false,
    }).start();
  }, [toValue]);

  useEffect(() => {
    const listener = animated.addListener(({ value: v }) => setDisplay(v));
    return () => animated.removeListener(listener);
  }, []);

  return formatter ? formatter(display) : display;
}
function secondsToPace(sec: number) {
  const min = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${min}:${s.toString().padStart(2, '0')}`;
}
function getAveragePaceSeconds(routes: Route[]) {
  if (routes.length === 0) return 0;
  const totalSeconds = routes.reduce((sum, r) => {
    const [min, sec] = r.avgPace.split(':').map(Number);
    return sum + min * 60 + sec;
  }, 0);
  return totalSeconds / routes.length;
}
 const animatedKm = useAnimatedNumber(totalKm, 700);
 const animatedAvgPace = useAnimatedNumber(avgPaceSeconds, 700, secondsToPace);
  const animatedRoutes = useAnimatedNumber(totalRoutes, 700);
  const animatedLast30 = useAnimatedNumber(routesLast30Days, 700);


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <BackgroundCircles/>
      <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/profile')}>
        <MaterialIcons name="arrow-back" size={28} color="#f0735a" />
      </TouchableOpacity>
      <Text style={styles.title}>Statistics</Text>
      <View style={styles.statBox}>
        <Text style={styles.statLabel}>Total distance (km)</Text>
        <Text style={styles.statValue}>{Number(animatedKm).toFixed(1)}</Text>
      </View>
    
      <View style={styles.statBox}>
  <Text style={styles.statLabel}>Average pace (min/km)</Text>
  <Text style={styles.statValue}>{animatedAvgPace}</Text>
</View>

      <View style={styles.statBox}>
        <Text style={styles.statLabel}>Total routes completed</Text>
        <Text style={styles.statValue}>{Math.round(Number(animatedRoutes))}</Text>
      </View>
      
      <View style={styles.statBox}>
        <Text style={styles.statLabel}>Routes last 30 days</Text>
        <Text style={styles.statValue}>{Math.round(Number(animatedLast30))}</Text>
      </View>
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {

    flexGrow: 1,
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',

  },
   backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 4,
    elevation: 3,
  },
  title: {
    position: 'absolute',
    top: 24,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#f0735a',
    textAlign: 'center',
  },
  statBox: {
    marginBottom: 20,
    
    padding: 16,
    minWidth: 250,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#f0735a',
    textAlign: 'center',
  },

});