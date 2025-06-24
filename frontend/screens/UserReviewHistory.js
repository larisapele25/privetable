import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { API } from '../services/api';

export default function UserReviewHistory({ route, navigation }) {
  const { userId, userEmail } = route.params;
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
     const response = await API.get(`/reviews/about-user/${userId}`, {
  headers: { Authorization: `Bearer ${token}` },
});
const data = response.data;

      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.stars}>{'⭐'.repeat(item.rating)} ({item.rating}/5)</Text>
      <Text style={styles.comment}>{item.comment || '(No comment)'}</Text>
      <Text style={styles.detail}>📍 {item.restaurantName}</Text>
      <Text style={styles.detail}>📅 {new Date(item.createdAt).toLocaleDateString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>Reviews for: {userEmail}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : reviews.length === 0 ? (
        <Text style={styles.noData}>This user doesn't have reviews yet.</Text>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: {
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 90,

  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  stars: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  comment: { fontSize: 14, marginBottom: 6, color: '#444' },
  detail: { fontSize: 12, color: '#666' },
  noData: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#999',
  },
  backButton: {
    marginTop: 30,
    position: 'absolute',
    top: 40,
    left: 16,
    zIndex: 10,
    padding: 8,
  },
});
