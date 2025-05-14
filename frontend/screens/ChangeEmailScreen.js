import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../services/api';
import Icon from 'react-native-vector-icons/Ionicons';
import { useEffect } from 'react';

const ChangeEmailScreen = ({ navigation }) => {
  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  

useEffect(() => {
  const fetchUserEmail = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;

      const response = await API.get(`/users/${userId}`);
      setCurrentEmail(response.data.email);
    } catch (err) {
      console.log('Error fetching current email:', err.message);
    }
  };

  fetchUserEmail();
}, []);

  const validateEmail = (email) => {
    const regex = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;
    return regex.test(email);
  };

  const handleChangeEmail = async () => {
    if (!newEmail || !confirmEmail || !password) {
      Alert.alert('Missing fields', 'Please fill in all fields.');
      return;
    }

    if (!validateEmail(newEmail)) {
      Alert.alert('Invalid email', 'Please enter a valid email address.');
      return;
    }

    if (newEmail !== confirmEmail) {
      Alert.alert('Error', 'Emails do not match.');
      return;
    }

    try {
      const userId = await AsyncStorage.getItem('userId');
      await API.put('/users/change-email', {
        userId: parseInt(userId),
        newEmail,
        confirmEmail,
        password,
      });

      Alert.alert('Success', 'Email updated.');
      navigation.goBack();
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ??
        err?.response?.data?.error ??
        'A apărut o eroare la schimbarea emailului.';
      Alert.alert('Eroare', errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>CHANGE EMAIL</Text>

     <TextInput
  placeholder="CURRENT EMAIL"
  placeholderTextColor="#aaa"
  style={styles.inputBox}
  value={currentEmail}
  editable={false} // afișează emailul dar nu-l lasă editabil
  selectTextOnFocus={false}
/>


      <TextInput
        placeholder="NEW EMAIL"
        placeholderTextColor="#aaa"
        style={styles.inputBox}
        value={newEmail}
        onChangeText={setNewEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="CONFIRM EMAIL"
        placeholderTextColor="#aaa"
        style={styles.inputBox}
        value={confirmEmail}
        onChangeText={setConfirmEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="PASSWORD"
          placeholderTextColor="#aaa"
          style={styles.inputBoxWithIcon}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon
            name={showPassword ? 'eye-outline' : 'eye-off-outline'}
            size={20}
            color="#555"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleChangeEmail}>
        <Text style={styles.saveText}>SAVE</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ChangeEmailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingTop: 60,

   
  },
  title: {
    color: '#000',
    fontSize: 24,
    fontWeight: '400',
    marginBottom: 40,
    marginTop: 40,
    paddingLeft: 20,
  },
  inputBox: {
    backgroundColor: '#f4f4f4',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#000',
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#ddd',
    marginLeft: 20,
    marginRight: 20
  },
  saveButton: {
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 40,
    alignSelf: 'flex-start',
    borderRadius: 6,
    marginLeft: 20
  },
  saveText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  passwordHint: {
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
    textAlign: 'left',
  },
  errorText: {
    color: 'crimson',
    marginLeft: 20,
    marginBottom: 15,
    fontSize: 12,
  },
  
  inputContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#f4f4f4',
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#ddd',
  marginBottom: 25,
  paddingHorizontal: 16,
  marginLeft: 20,
  marginRight: 20,
},
inputBoxWithIcon: {
  flex: 1,
  paddingVertical: 12,
  fontSize: 14,
  color: '#000',
},

 
});
