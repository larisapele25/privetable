import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, Alert
} from 'react-native';
import { API } from '../services/api';
import { useNavigation, useRoute } from '@react-navigation/native';
import { HOST, FILE_HOST } from '../services/api';

const VerificationAdminScreen = () => {
  const [requests, setRequests] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { adminCode } = route.params;

  useEffect(() => {
    fetchVerifications();
  }, []);

  const fetchVerifications = async () => {
    try {
      const res = await API.get('/verify/all', {
        headers: {
          'X-ADMIN-CODE': adminCode
        }
      });
      setRequests(res.data);
    } catch (err) {
      console.error('Eroare la fetch:', err);
      Alert.alert('Error', 'Could not load verification requests.');
    }
  };

  const handleApprove = async (id) => {
    try {
      await API.put(`/verify/${id}/approve`);
      Alert.alert('Succes', 'Approved verification');
      fetchVerifications();
    } catch (err) {
      Alert.alert('Error', 'Verification could not be approved.');
    }
  };

  const handleReject = async (id, comment) => {
    try {
      await API.put(`/verify/${id}/reject`, null, {
        params: { comment }
      });
      Alert.alert('Succes', 'Verification rejected');
      fetchVerifications();
    } catch (err) {
      Alert.alert('Error', 'Verification could not be rejected.');
    }
  };

  const getImageUrl = (fullPath) => {
    if (!fullPath) return '';
    const filename = fullPath.split(/[\\/]/).pop();
   return `${FILE_HOST}/uploads/${filename}`;

  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>VERIFICATION REQUEST</Text>
      {requests.map((req) => (
        <View key={req.id} style={styles.card}>
          <Text style={styles.name}>{req.name} {req.surname}</Text>
          <Text style={styles.label}>CNP: {req.cnp}</Text>
          <Text style={styles.label}>ID: {req.idNumber}</Text>
          <Text style={styles.label}>Status: {
            req.reviewedByAdmin
              ? (req.verificationStatus ? '✅ Approved' : '❌ Rejected')
              : '⏳ În așteptare'
          }</Text>

          <View style={styles.images}>
            <Image source={{ uri: getImageUrl(req.frontImagePath) }} style={styles.image} />
            <Image source={{ uri: getImageUrl(req.backImagePath) }} style={styles.image} />
          </View>

          {!req.reviewedByAdmin && (
            <>
              <TouchableOpacity style={styles.approveButton} onPress={() => handleApprove(req.id)}>
                <Text style={styles.buttonText}>Accept</Text>
              </TouchableOpacity>

              <RejectSection id={req.id} onReject={handleReject} />
            </>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

const RejectSection = ({ id, onReject }) => {
  const [comment, setComment] = useState('');

  return (
    <View style={styles.rejectSection}>
      <TextInput
        style={styles.input}
        placeholder="Motivul respingerii (opțional)"
        value={comment}
        onChangeText={setComment}
      />
      <TouchableOpacity
        style={styles.rejectButton}
        onPress={() => onReject(id, comment)}
      >
        <Text style={styles.buttonText}>Reject</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'white' },
  title: { fontSize: 24, fontWeight: '400', marginBottom: 20, textAlign: 'center' },
  backButton: { marginBottom: 12, marginTop: 40 },
  backButtonText: { fontSize: 16 },

  card: {
    backgroundColor: '#f4f4f4',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  name: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  label: { fontSize: 14, color: '#444', marginBottom: 2 },

  images: {
    flexDirection: 'column',
    gap: 12,
    marginVertical: 12,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },

  approveButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  rejectButton: {
    backgroundColor: 'crimson',
    padding: 10,
    borderRadius: 6,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '600',
  },
  rejectSection: {
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
});

export default VerificationAdminScreen;
