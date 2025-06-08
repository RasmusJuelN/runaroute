import CompletedRouteItem from '@/components/CompletedRouteItem';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import {supabase} from '@/env/supabase'; 
import type { User } from '@supabase/supabase-js';
import { useRouter } from 'expo-router';
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
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Log out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log out', style: 'destructive', onPress: async () => {
            await supabase.auth.signOut();
            setUser(null);
            // Optionally, clear any local state here if needed
          }
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <MaterialIcons name="logout" size={18} color="#f0735a" />
        <Text style={styles.logoutText}>Log out</Text>
        
      </TouchableOpacity>
      <View style={styles.profilePicWrapper}>
        <Image          
          style={styles.profilePic}
          source={require('@/assets/images/profile-placeholder2.jpg')}
        />
      </View>
      {/* Username */}
      <Text style={styles.username}>{user ? user.email : 'you are...'}</Text>
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
      onPress={() => router.push('/statistics')}
      >
      <MaterialCommunityIcons size={28} name="podium-gold" color="#ffffff" />
    </TouchableOpacity>

</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  logoutButton: {
    fontSize: 20,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 10,
    elevation: 5,
    zIndex: 1,
  },
  logoutText: {
    fontSize: 16,
    
    color: '#f0735a',
    marginRight: 6,
    marginLeft: 6,
  },
  profilePicWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    marginTop: 60,
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
    marginHorizontal: 26,
    marginBottom: 10,
    color: '#f0735a',
  },
  listContainer: {
     width: '100%', 
     paddingHorizontal: 10, 
  },
  statisticsButton: {
    width: '80%',
    height: 50,
    backgroundColor: '#f0735a',
    borderRadius: 10,
    padding:10,
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