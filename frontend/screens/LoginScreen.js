import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { API } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FavoriteContext } from '../context/FavoriteContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { setUserId } = useContext(FavoriteContext);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      return Alert.alert('Eroare', 'Completează toate câmpurile.');
    }

    try {
      const res = await API.post('/auth/login', {
        email: email.trim(),
        password,
      });

      const { userId } = res.data;

      if (!userId) {
        throw new Error('ID-ul utilizatorului nu a fost returnat.');
      }
      
      await AsyncStorage.setItem('userId', userId.toString());
      setUserId(userId);
      console.log("User:",userId);

      Alert.alert('Autentificare reușită');
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'MainTabs',
            state: {
              routes: [
                {
                  name: 'HomeTab',
                  state: {
                    routes: [{ name: 'HomeMain' }],
                  },
                },
              ],
            },
          },
        ],
      });
      
      
      
    } catch (err) {
      console.log('Eroare login:', err.response?.data || err.message);
      const errorMsg =
        err.response?.data?.message || 'Email sau parolă greșite';
      Alert.alert('Eroare', errorMsg);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/image.png')}
        style={styles.logo}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.passwordInput}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          onPress={() => setShowPassword((prev) => !prev)}
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
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.link}>Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Don't have an account?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('RestaurantLogin')}>
  <Text style={styles.link}>Login ca restaurant</Text>
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