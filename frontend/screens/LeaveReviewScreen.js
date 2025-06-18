import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function LeaveReviewScreen({ route, navigation }) {
  const { reservationId, userList } = route.params;
  const [selectedUser, setSelectedUser] = useState(userList[0]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const submitReview = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await fetch('http://192.168.0.234:8080/api/reviews/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          reservationId,
          userId: selectedUser.id,
          rating,
          comment
        })
      });

      if (!response.ok) throw new Error('Eroare la trimitere');

      Alert.alert('Succes', 'Review trimis!');
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Eroare', 'Nu s-a putut trimite review-ul.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>LEAVE A REVIEW</Text>

      <View style={styles.section}>
        <Text style={styles.label}>User:</Text>
        <Picker
          selectedValue={selectedUser.id}
          onValueChange={(id) => {
            const found = userList.find(u => u.id === id);
            if (found) setSelectedUser(found);
          }}
          style={styles.picker}
        >
          {userList.map(user => (
            <Picker.Item key={user.id} label={user.email} value={user.id} />
          ))}
        </Picker>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Rating:</Text>
        <Picker
          selectedValue={rating}
          onValueChange={setRating}
          style={styles.picker}
        >
          {[1, 2, 3, 4, 5].map(val => (
            <Picker.Item key={val} label={`${val} ⭐`} value={val} />
          ))}
        </Picker>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Comment:</Text>
        <TextInput
          style={styles.input}
          placeholder="Write something..."
          value={comment}
          onChangeText={setComment}
          multiline
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={submitReview}>
        <Text style={styles.buttonText}>Send Review</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 80,
    backgroundColor: '#fff',
    flexGrow: 1
  },
  backButton: {
    position: 'absolute',
    top: 40,
    marginTop:16,
    left: 16,
    zIndex: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '500',
    marginBottom: 20,
    alignSelf: 'center',
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontWeight: '600',
    marginBottom: 4,
    fontSize:16,
  },
  picker: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
     height: 180,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    height: 100,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
});
