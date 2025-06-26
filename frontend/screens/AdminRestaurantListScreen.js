import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { API } from '../services/api';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function AdminRestaurantListScreen({ route }) {
  const [restaurants, setRestaurants] = useState([]);
  const { adminCode } = route.params;
  const navigation = useNavigation();

  useEffect(() => {
    API.get('/admin/restaurants-with-codes', {
      headers: { 'X-ADMIN-CODE': adminCode }
    })
    .then(res => setRestaurants(res.data))
    .catch(err => {
      console.error(err);
      Alert.alert('Error', 'The restaurants could not be loaded.');
    });
  }, []);

  return (
    <View style={styles.container}>
      {/* Buton de back */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>RESTAURANTS & CODES</Text>

      <FlatList
        data={restaurants}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.code}>Cod: {item.loginCode}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, marginTop: 70 },
  backText: { marginLeft: 6, fontSize: 16, color: '#000' },
  title: { fontSize: 24, fontWeight: '400', marginBottom: 16, textAlign: 'center' },
  item: { marginBottom: 14, padding: 10, borderBottomWidth: 1, borderColor: '#ddd' },
  name: { fontSize: 16, fontWeight: '500' },
  code: { fontSize: 14, color: '#555' }
});
