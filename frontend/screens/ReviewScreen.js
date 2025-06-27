import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, Alert
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { API } from '../services/api';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
export default function ReviewScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  const { reservationId, userId, restaurantId } = route.params || {};
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  console.log("user",userId);
  console.log("reservation",reservationId);
  console.log("restaurant", restaurantId);

  const handleSubmit = async () => {
    if (!reservationId || !userId || !restaurantId) {
      Alert.alert('Error', 'Essential information is missing from the link.');
      return;
    }

    if (rating === 0) {
      Alert.alert('Attention', 'Please choose a rating.');
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
Alert.alert('Thank you!', 'Your review has been submitted successfully.');
navigation.reset({
  index: 0,
  routes: [{ name: 'MainTabs' }],
});

    } catch (err) {
     
      Alert.alert('Error', 'You have already submitted a review.');
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
         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>LEAVE A REVIEW</Text>
      <Text style={styles.subtitle}>How was your experience?</Text>

      <View style={styles.starsContainer}>{renderStars()}</View>

      <TextInput
        style={styles.input}
        placeholder="Comment (optional)"
        value={comment}
        onChangeText={setComment}
        multiline
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Send Review</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: 'white' },
  title: { fontSize: 24, fontWeight: '400', marginBottom: 10, marginTop: 16 },
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
   backButton: { flexDirection: 'row', alignItems: 'center',  marginTop: 70 },
  backText: { marginLeft: 6, fontSize: 16, color: '#000' }
});
