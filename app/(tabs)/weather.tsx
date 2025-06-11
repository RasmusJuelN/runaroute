import { WEATHERAPI_KEY as apiKey } from '@/.env/weather';
import BackgroundCircles from '@/components/BackgroundCircles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';

const CITY = 'Copenhagen';

export default function WeatherScreen() {
  const [forecast, setForecast] = useState<any[]>([]);
  const [current, setCurrent] = useState<any>(null);
  const [location, setLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLoading(false);
        alert('Permission to access location was denied');
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      const lat = loc.coords.latitude;
      const lon = loc.coords.longitude;

      fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=7&aqi=no&alerts=no`
      )
        .then(res => res.json())
        .then(data => {
          setForecast(data.forecast?.forecastday || []);
          setCurrent(data.current);
          setLocation(data.location);
          setLoading(false);
        });
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#f0735a" />
      </View>
    );
  }

  const today = forecast[0];

  function getWeatherIcon(condition: string) {
  if (condition.includes('rain')) return 'weather-pouring';
  if (condition.includes('storm')) return 'weather-lightning';
  if (condition.includes('snow')) return 'weather-snowy-heavy';
  if (condition.includes('sunny')) return 'weather-sunny';
  if (condition.includes('cloudy')) return 'weather-partly-cloudy';
  if (condition.includes('cloud')) return 'weather-partly-cloudy';
  if (condition.includes('fog')) return 'weather-fog';
  if (condition.includes('clear')) return 'weather-sunny';
  if (condition.includes('thunder')) return 'weather-lightning';
  return 'weather-partly-cloudy';
}
  return (
    <View style={styles.container}>
      <BackgroundCircles />
      <Text style={styles.city}>
        {location?.name}, <Text style={styles.country}>{location?.country}</Text>
      </Text>

      {/* Center: Weather Icon, Temp, Description */}
      <View style={styles.centerBox}>
        {/* <Image
          source={{ uri: `https:${current.condition.icon}` }}
          style={styles.weatherIcon}
        /> */}
        <MaterialCommunityIcons style={styles.weatherIcon}
  name={getWeatherIcon(current.condition.text.toLowerCase())}
  size={260}
  color="#f0735a"
/>
        {/* <Image
          source={{ uri: `https:${current.condition.icon}` }}
          style={styles.weatherIcon}
        /> */}
        <Text style={styles.temp}>{Math.round(current.temp_c)}°</Text>
        <Text style={styles.desc}>{current.condition.text}</Text>
      </View>

      {/* Weather details row */}
      <View style={styles.detailsRow}>
         <View style={styles.detailItem}>
    <MaterialCommunityIcons name="weather-windy" size={32} color="#7b7b7b" />
    <Text style={styles.detailValue}>{current.wind_kph} km/h</Text>
  </View>
  <View style={styles.detailItem}>
    <MaterialCommunityIcons name="water-percent" size={32} color="#7b7b7b" />
    <Text style={styles.detailValue}>{current.humidity}%</Text>
  </View>
  <View style={styles.detailItem}>
    <MaterialCommunityIcons name="weather-sunset-up" size={32} color="#7b7b7b" />
    <Text style={styles.detailValue}>{today.astro.sunrise}</Text>
  </View>
      </View>

     
      <FlatList
        data={forecast}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.date}
        style={styles.forecastList}
        contentContainerStyle={{ gap: 12, paddingHorizontal: 8 }}
        renderItem={({ item, index }) => (
    <View style={styles.dayBox}>
      <MaterialCommunityIcons
        style={styles.dayIcon}
        name={getWeatherIcon(item.day.condition.text.toLowerCase())}
        size={32}
        color="#f0735a"
      />
      <Text style={styles.dayLabel}>
        {index === 0
          ? 'Today'
          : new Date(item.date).toLocaleDateString('en-US', { weekday: 'long' })}
      </Text>
      <Text style={styles.dayTemp}>{Math.round(item.day.avgtemp_c)}°</Text>
    </View>
  )}
/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'column', backgroundColor: '#fff', paddingTop: 60, alignItems: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  city: { fontSize:32, fontWeight: 'bold', color: '#333', textAlign: 'center' },
  country: { fontWeight: 'normal', color: '#7b7b7b' },
  centerBox: { alignItems: 'center', marginVertical: 24 },
  weatherIcon: {marginBottom: 8 , height: 260, width: 260, resizeMode: 'contain' },
  temp: { fontSize: 80, fontWeight: 'bold', color: '#333', marginLeft: 8 },
  desc: { fontSize: 32, color: '#333', marginTop: 4 },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginVertical: 16,
    alignSelf: 'center',
  },
  detailItem: { alignItems: 'center', flex: 1 },
  detailLabel: { fontSize: 22, color: '#333', marginBottom: 2 },
  detailValue: { fontSize: 18, color: '#333' },
  forecastList: { marginTop: 24, height: 120, width: '100%' },
  dayBox: {
    backgroundColor: '#333',
    borderRadius: 16,
    padding: 12,
    marginRight: 0,
    width: 100,
    alignItems: 'center',
    minWidth: 70,
  },
  dayIcon: {  marginBottom: 4 },
  dayLabel: { color: '#fff', fontSize: 18, marginBottom: 2 },
  dayTemp: { color: '#fff', fontWeight: 'bold', fontSize: 32 },
});