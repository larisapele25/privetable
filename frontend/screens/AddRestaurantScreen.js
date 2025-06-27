import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API } from '../services/api';  

export default function AddRestaurantScreen({ route }) {
  const { adminCode } = route.params;
  const navigation = useNavigation();

  const [form, setForm] = useState({
    name: '',
    imageUrl: '',
    capacity: ''
  });
  const [responseText, setResponseText] = useState('');

  const handleSubmit = async () => {
  const { name, imageUrl, capacity } = form;

  if (!name || !imageUrl || !capacity) {
    Alert.alert('Error', 'All fields are required!');
    return;
  }

  try {
    const res = await API.post(
      '/admin/add-restaurant',
      {
        name,
        imageUrl,
        capacity: parseInt(capacity),
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-ADMIN-CODE': adminCode,
        },
      }
    );

    setResponseText(` Restaurant added!\nLoginCode: ${res.data.loginCode}`);
    setForm({ name: '', imageUrl: '', capacity: '' });
  } catch (err) {
    console.error(err);
    Alert.alert('Error', err.response?.data || 'Something went wrong.');
  }
};


  return (
    <SafeAreaView style={styles.container}>

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.header}>ADD RESTAURANT</Text>

      {['name', 'imageUrl', 'capacity'].map((field) => (
        <TextInput
          key={field}
          placeholder={
            field === 'name'
              ? 'Restaurant name'
              : field === 'imageUrl'
              ? 'ImageURL'
              : 'Capacity'
          }
          style={styles.input}
          keyboardType={field === 'capacity' ? 'numeric' : 'default'}
          value={form[field]}
          onChangeText={(text) => setForm({ ...form, [field]: text })}
        />
      ))}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>ADD</Text>
      </TouchableOpacity>

      {responseText ? <Text style={styles.response}>{responseText}</Text> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  backBtn: { marginBottom: 10 ,marginTop: 20, marginLeft: 16 },
  backText: { fontSize: 16, color: '#000' },
  header: {
    fontSize: 24,
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    marginLeft: 10,
    marginRight: 10
  },
  button: {
    backgroundColor: '#000',
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 16,
    marginLeft: 70,
    marginRight: 70
  },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
  response: { textAlign: 'center', marginTop: 10, color: 'green' },
});
