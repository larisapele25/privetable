import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert
} from 'react-native';
import { API } from '../services/api';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const handleSendCode = () => {
    if (!email.includes('@')) {
      return Alert.alert('Error', 'Please enter a valid email.');
    }

    // aici se trimite codul spre email
    API.post('/auth/forgot-password', { email })
      .then(() => {
        Alert.alert('Succes', 'Check your email.');
        navigation.navigate('ResetPassword', { email }); // trimitem emailul mai departe
      })
      .catch(() => {
        Alert.alert('Error', 'Unable to send reset code.');
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter your email</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handleSendCode}>
        <Text style={styles.buttonText}>Send Reset Code</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 40, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 24, textAlign: 'left' },
  input: { borderWidth: 1, borderColor: '#aaa', borderRadius: 8, padding: 12, marginBottom: 16 },
  button: { backgroundColor: '#000', padding: 14, borderRadius: 8 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
});
