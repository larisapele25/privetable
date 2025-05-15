import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert
} from 'react-native';
import { API } from '../services/api';
import { useNavigation } from '@react-navigation/native';

export default function AdminLoginScreen() {
  const [adminCode, setAdminCode] = useState('');
  const navigation = useNavigation();

  const handleVerifyCode = async () => {
    if (!adminCode.trim()) {
      return Alert.alert('Introdu codul de admin.');
    }

    try {
      // testăm cu un request HEAD (sau GET simplu) către un endpoint protejat
      await API.get('/restaurants/all', {
        headers: { 'X-ADMIN-CODE': adminCode }
      });

      // ✅ Navigăm către ecranul de admin
      navigation.navigate('AdminPanel', { adminCode });

    } catch (err) {
      Alert.alert('Cod invalid', 'Codul de admin este greșit.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ADMIN AUTHENTIFICATION</Text>

      <TextInput
        placeholder="Admin Code"
        style={styles.input}
        value={adminCode}
        onChangeText={setAdminCode}
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleVerifyCode}>
        <Text style={styles.buttonText}>CONTINUE</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '600', textAlign: 'center', marginBottom: 24 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 12, marginBottom: 14
  },
  button: {
    backgroundColor: '#000', padding: 14, borderRadius: 8
  },
  buttonText: {
    color: '#fff', textAlign: 'center', fontWeight: '600'
  }
});
