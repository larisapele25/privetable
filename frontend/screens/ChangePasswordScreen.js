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


const ChangePasswordScreen = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordValid, setPasswordValid] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [showCurrentPassword, setShowCurrentPassword] = useState(false);


  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    return regex.test(password);
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Missing fields', 'Please fill in all fields.');
      return;
    }

    if (!passwordValid) {
      Alert.alert('Weak password', 'Your new password does not meet the requirements.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    try {
      

      const userId = await AsyncStorage.getItem('userId');
await API.put('/users/change-password', {
  userId: parseInt(userId),
  currentPassword,
  newPassword,
});


      Alert.alert('Success', 'Password updated.');
      navigation.goBack();
    } catch(err){  const errorMessage =
        err?.response?.data?.message ??
        err?.response?.data?.error ??
        'An error occurred while changing your password.';
      
      Alert.alert('Error', errorMessage);
      
  };
  }
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>CHANGE PASSWORD</Text>
      <View style={styles.inputContainer}>
      <TextInput
        placeholder="CURRENT PASSWORD"
        placeholderTextColor="#aaa"
        style={styles.inputBoxWithIcon}
        secureTextEntry={!showCurrentPassword}
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />
       <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
    <Icon
      name={showCurrentPassword ? 'eye-outline' : 'eye-off-outline'}
      size={20}
      color="#555"
    />
  </TouchableOpacity>
  </View>

<View style={styles.inputContainer}>
  <TextInput
    placeholder="NEW PASSWORD"
    placeholderTextColor="#aaa"
    style={styles.inputBoxWithIcon}
    secureTextEntry={!showNewPassword}
    value={newPassword}
    onChangeText={(text) => {
      setNewPassword(text);
      setPasswordValid(validatePassword(text));
    }}
  />
  <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
    <Icon
      name={showNewPassword ? 'eye-outline' : 'eye-off-outline'}
      size={20}
      color="#555"
    />
  </TouchableOpacity>
</View>


      {/* Password rule message */}
      {newPassword.length > 0 && (
        <Text style={[styles.passwordHint, { color: passwordValid ? 'green' : 'crimson' }]}>
          Your new password must contain at least 8 characters, one uppercase
          letter, one lowercase letter, one digit and one special character.
        </Text>
      )}

<View style={styles.inputContainer}>
  <TextInput
    placeholder="CONFIRM NEW PASSWORD"
    placeholderTextColor="#aaa"
    style={styles.inputBoxWithIcon}
    secureTextEntry={!showConfirmPassword}
    value={confirmPassword}
    onChangeText={setConfirmPassword}
  />
  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
    <Icon
      name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
      size={20}
      color="#555"
    />
  </TouchableOpacity>
</View>

      {confirmPassword.length > 0 && newPassword !== confirmPassword && (
        <Text style={styles.errorText}>Passwords do not match</Text>
      )}

      <TouchableOpacity style={styles.saveButton} onPress={handleChangePassword}>
        <Text style={styles.saveText}>SAVE</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ChangePasswordScreen;



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
