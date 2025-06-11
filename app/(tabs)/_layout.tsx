import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';

import { supabase } from '@/.env/supabase'; // adjust path if needed

import { HapticTab } from '@/components/ui/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import RegisterScreen from '@/components/register';
import LoginScreen from '@/components/login';


export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [session, setSession] = useState<import('@supabase/supabase-js').Session | null>(null);
  const [showRegister, setShowRegister] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!session) {
    return showRegister ? (
      <RegisterScreen onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <LoginScreen onSwitchToRegister={() => setShowRegister(true)} />
    );
  }
return (
  <View style={{ flex: 1 }}>

      <Tabs
        initialRouteName="index"
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,

          tabBarStyle: Platform.select({
            ios: { position: 'absolute' },
            default: {marginTop: 4},
          }),
        }}
      >
      <Tabs.Screen
        name="weather"
        options={{
          title: 'Weather',
          tabBarIcon: () => <MaterialCommunityIcons size={28} name="weather-partly-cloudy" color="#f0735a" />,
          
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: () => <MaterialCommunityIcons size={28} name="map-search-outline" color="#f0735a" />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: () => <MaterialCommunityIcons size={28} name="account-details" color="#f0735a" />,
        }}
      />
    </Tabs>
  </View>
  );
}