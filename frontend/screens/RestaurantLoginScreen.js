import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function RestaurantLoginScreen({ navigation }) {
  const [loginCode, setLoginCode] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await fetch('http://192.168.0.150:8080/api/restaurant/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginCode, password }),
      });

      if (!response.ok) throw new Error('Login failed');

      const data = await response.json();
      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('restaurantId', data.restaurantId.toString());
     await AsyncStorage.setItem('restaurantName', data.restaurantName);


      Alert.alert('Login successful', 'Welcome!');
      navigation.navigate('RestaurantDashboard');
    } catch (error) {
      Alert.alert('Authentication error', 'Check loginCode and password.');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/image.png')}
        style={styles.logo}
      />

      <TextInput
        placeholder="Login Code"
        value={loginCode}
        onChangeText={setLoginCode}
        style={styles.input}
        autoCapitalize="none"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Parolă"
          value={password}
          onChangeText={setPassword}
          style={styles.passwordInput}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(prev => !prev)}
          style={styles.icon}
        >
          <Ionicons
            name={showPassword ? 'eye' : 'eye-off'}
            size={22}
            color="#333"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Login as user</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#fff',
  },
  logo: {
    width: 220,
    height: 220,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: -10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    marginBottom: 16,
    paddingRight: 12,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
  },
  icon: {
    padding: 4,
  },
  button: {
    backgroundColor: '#000',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  link: {
    color: '#000',
    textAlign: 'center',
    marginTop: 8,
  },
});
