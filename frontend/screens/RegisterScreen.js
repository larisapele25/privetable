import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { API } from '../services/api';

const isPasswordValid = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return regex.test(password);
};

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = () => {

    if (!name || !surname || !email || !confirmEmail || !password || !confirmPassword) {
        return Alert.alert('Error', 'All fields are required.');
      }
      
    if (email !== confirmEmail) {
      return Alert.alert('Error', 'Emails do not match');
    }
    if (password !== confirmPassword) {
      return Alert.alert('Error', 'Passwords do not match');
    }
    if (!isPasswordValid(password)) {
      return Alert.alert(
        'Error',
        'The password does not meet security requirements.'
      );
    }
    

    API.post('/auth/register', {
      firstName: name,
      lastName: surname,
      email,
      confirmEmail,
      password,
      confirmPassword,
    })
      .then((res) => {
        const data = res.data;

        if (
          typeof data === 'string' &&
          data.toLowerCase().includes('email')
        ) {
          Alert.alert('Error', 'This email is already in use.');
          return;
        }

        Alert.alert('Succes', 'Account created successfully');
        navigation.navigate('Login');
      })
      .catch((err) => {
        const fullError = err.response;
        console.log('Complete error:', JSON.stringify(fullError, null, 2));

        const message =
          fullError?.data?.message ||
          fullError?.data ||
          'Something went wrong.';

        if (
          fullError?.status === 409 ||
          message.toLowerCase().includes('email')
        ) {
          Alert.alert('Error', 'This email is already used.');
        } else {
          Alert.alert('Error', message);
        }
      });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={require('../assets/images/image.png')}
          style={styles.logo}
        />

        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="Surname"
          value={surname}
          onChangeText={setSurname}
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Confirm Email"
          value={confirmEmail}
          onChangeText={setConfirmEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.icon}
          >
            <Ionicons
              name={showPassword ? 'eye' : 'eye-off'}
              size={22}
              color="#333"
            />
          </TouchableOpacity>
        </View>

        {password.length > 0 && (
          <Text
            style={[
              styles.passwordInfo,
              isPasswordValid(password)
                ? { color: 'green' }
                : { color: 'red' },
            ]}
          >
            Your password must contain at least 8 characters, one uppercase
            letter, one lowercase letter, one digit and one special character.
          </Text>
        )}

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.input}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            style={styles.icon}
          >
            <Ionicons
              name={showConfirmPassword ? 'eye' : 'eye-off'}
              size={22}
              color="#333"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Already have an account?</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#fff',
  },
  logo: {
    width: 220,
    height: 220,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: -30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 12,
    paddingRight: 40,
    marginBottom: 12,
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  icon: {
    position: 'absolute',
    right: 12,
    top: '35%',
  },
  button: {
    backgroundColor: '#000',
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  link: {
    color: '#000',
    textAlign: 'center',
    marginTop: 14,
  },
  passwordInfo: {
    fontSize: 12,
    marginBottom: 12,
    lineHeight: 16,
  },
});
