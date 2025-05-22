import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, Alert
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { API } from '../services/api';
import { FontAwesome } from '@expo/vector-icons';

export default function ReviewScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  const { reservationId, userId, restaurantId } = route.params || {};
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = async () => {
    if (!reservationId || !userId || !restaurantId) {
      Alert.alert('Eroare', 'Lipsesc informații esențiale din link.');
      return;
    }

    if (rating === 0) {
      Alert.alert('Atenție', 'Te rugăm să alegi un rating.');
      return;
    }

    try {
      await API.post('/reviews/submit', {
        reservationId,
        userId,
        restaurantId,
        rating,
        comment,
      });

      Alert.alert('Mulțumim!', 'Review-ul tău a fost trimis cu succes.');
      navigation.navigate('MainTabs');
    } catch (err) {
      console.error('Review error:', err);
      Alert.alert('Eroare', 'Nu am putut trimite review-ul. Încearcă din nou.');
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <TouchableOpacity key={index} onPress={() => setRating(index + 1)}>
        <FontAwesome
          name={index < rating ? 'star' : 'star-o'}
          size={36}
          color="#FFD700"
          style={styles.star}
        />
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lasă un review</Text>
      <Text style={styles.subtitle}>Cum a fost la restaurant?</Text>

      <View style={styles.starsContainer}>{renderStars()}</View>

      <TextInput
        style={styles.input}
        placeholder="Comentariu (opțional)"
        value={comment}
        onChangeText={setComment}
        multiline
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Trimite Review</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: 'white' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 10 },
  subtitle: { fontSize: 16, marginBottom: 16, color: '#444' },
  starsContainer: { flexDirection: 'row', marginBottom: 20 },
  star: { marginRight: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
