import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { API } from '../services/api';

const InviteScreen = ({ route }) => {
  const { reservationId } = route.params;
  const [email, setEmail] = useState('');
  const [userFound, setUserFound] = useState(null); // true / false / null
  const [message, setMessage] = useState('');

  const checkUser = async () => {
  try {
    const response = await API.get('/users/find-by-email', {
      params: { email }
    });
    const foundName = response.data.inviting || response.data.email;
    setUserFound(true);
    setMessage(`Inviting ${foundName}`);
  } catch (err) {
    setUserFound(false);
    setMessage('This user does not exist.');
  }
};

  const sendInvite = async () => {
    try {
      const response = await API.post('/invitations', {
        email: email,
        reservationId: reservationId,
      });
      setMessage('Invitation was sent!');
    } catch (err) {
      const errorMsg = err.response?.data || 'An error occurred while sending the invitation.';
      setMessage(errorMsg);
  
      if (errorMsg === 'Participant limit reached') {
        Alert.alert("Limit reached.You can no longer send invitations for this reservation.");
        setUserFound(false); // dezactivează butonul
      }
    }
  };
  
  
  
  

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Text style={styles.title}>Add persons to your reservation</Text>

      <TextInput
        style={styles.input}
        placeholder="Email..."
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TouchableOpacity style={styles.searchButton} onPress={checkUser}>
        <Text style={styles.buttonText}>Caută</Text>
      </TouchableOpacity>

      {message !== '' && <Text style={userFound ? styles.validText : styles.invalidText}>{message}</Text>}

      {userFound && message !== 'Participant limit reached' && (
  <TouchableOpacity style={styles.inviteButton} onPress={sendInvite}>
    <Text style={styles.inviteText}>Send invite</Text>
  </TouchableOpacity>
)}

    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: 'white' },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#f8f8f8',
  },
  searchButton: {
    backgroundColor: 'black',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: { color: 'white', fontWeight: '600' },
  inviteButton: {
    backgroundColor: 'black',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  inviteText: { color: 'white', fontWeight: '700', fontSize: 16 },
  validText: { color: 'green', textAlign: 'center', marginTop: 10 },
  invalidText: { color: 'red', textAlign: 'center', marginTop: 10 },
});

export default InviteScreen;
