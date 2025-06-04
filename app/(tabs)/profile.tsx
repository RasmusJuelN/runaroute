import CompletedRouteItem from '@/components/CompletedRouteItem';
import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';

const mockRoutes = [
  {
    id: '1',
    date: '2024-06-04',
    distance: 5.2,
    time: '00:28:15',
    avgPace: '5:25',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: '2',
    date: '2024-06-01',
    distance: 10.0,
    time: '00:55:10',
    avgPace: '5:31',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: '3',
    date: '2024-06-01',
    distance: 10.0,
    time: '00:55:10',
    avgPace: '5:31',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: '4',
    date: '2024-06-01',
    distance: 10.0,
    time: '00:55:10',
    avgPace: '5:31',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: '5',
    date: '2024-06-01',
    distance: 10.0,
    time: '00:55:10',
    avgPace: '5:31',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: '6',
    date: '2024-06-01',
    distance: 10.0,
    time: '00:55:10',
    avgPace: '5:31',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: '7',
    date: '2024-06-01',
    distance: 10.0,
    time: '00:55:10',
    avgPace: '5:31',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=80',
  },

];

export default function ProfileScreen() {
  const username = 'Username';

  return (
    <View style={styles.container}>
      {/* Profile Picture */}
      <View style={styles.profilePicWrapper}>
        <Image          
          style={styles.profilePic}
        />
      </View>
      {/* Username */}
      <Text style={styles.username}>{username}</Text>
      {/* Separator */}
      <View style={styles.separator} />
      {/* Previous Routes */}
      <Text style={styles.sectionTitle}>Completed Routes</Text>
      <FlatList
      style={styles.listContainer}
      data={mockRoutes}
      keyExtractor={item => item.id}
      contentContainerStyle={{ paddingBottom: 10 }}
      renderItem={({ item }) => (
      <CompletedRouteItem
   
      date={item.date}
      distance={item.distance}
      time={item.time}
      avgPace={item.avgPace}
      image={item.image}
    />
  )}
/>
<View>

        <TouchableOpacity
      style={styles.statisticsButton}

    >
      <Text style={styles.customButtonText}>Statistics</Text>
    </TouchableOpacity>

</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    marginTop: 50,
    alignItems: 'center',
  },
  profilePicWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  profilePic: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: '#f0735a',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#222',
  },
  separator: {
    width: '80%',
    height: 1,
    backgroundColor: '#f2d3cd',
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    alignSelf: 'flex-start',
    marginHorizontal: 20,
    marginBottom: 10,
    color: '#f0735a',
  },
  listContainer: {
     width: '100%', 
     paddingHorizontal: 20, 
  },
  statisticsButton: {
    width: '80%',
    height: 50,
    backgroundColor: '#f0735a',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  customButtonText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 20,
  textAlign: 'center',
  padding: 10,
},
 
});