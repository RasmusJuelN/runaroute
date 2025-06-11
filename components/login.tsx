import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../.env/supabase';
import Logo from './logo';
import BackgroundCircles from './BackgroundCircles';
import CustomAlert from './CustomAlert';

export default function LoginScreen({ onSwitchToRegister }: { onSwitchToRegister: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLoginError, setShowLoginError] = useState(false);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setShowLoginError(true);
      // Optionally, you can log the error or handle it in a different way
     
    } else {
      
      // You can now use supabase.auth.getUser() to get the logged-in user
    }
  };

  return (
    <View style={styles.container}>
      <CustomAlert
  visible={showLoginError}
  title="Login error"
  message="An error occurred while trying to log in."
  onConfirm={() => setShowLoginError(false)}
  confirmText="Ok"
  hideCancel={true}
/>
      <BackgroundCircles/>
      
      <View style={ styles.logoContainer}>
        <Logo></Logo>
      </View>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onSwitchToRegister}>
        <Text style={styles.link}>Dont have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  logoContainer: { position: 'absolute', top: 70, left: 0, right: 0, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16 },
  button: { backgroundColor: '#f0735a', padding: 14, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  link: { color: '#f0735a', textAlign: 'center', marginTop: 8, fontSize: 16 },
});