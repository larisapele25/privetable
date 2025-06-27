import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { API } from '../services/api';

export default function ResetPasswordScreen({ route, navigation }) {
  const { email } = route.params;
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordStrong, setIsPasswordStrong] = useState(false);
  const [showValidationText, setShowValidationText] = useState(false);

  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const checkPasswordStrength = (password) => {
    const length = password.length >= 8;
    const upper = /[A-Z]/.test(password);
    const lower = /[a-z]/.test(password);
    const digit = /\d/.test(password);
    const special = /[@$!%*?&.,;:<>#^(){}[\]~`|/+_-]/.test(password);
    setIsPasswordStrong(length && upper && lower && digit && special);
  };

  const handleReset = () => {
    if (newPassword !== confirmPassword) {
      return Alert.alert('Error', 'The passwords do not match.');
    }

    API.post('/auth/reset-password', {
      email,
      code,
      newPassword,
      confirmPassword,
    })
      .then(() => {
        Alert.alert('Succes', 'The password has been changed.');
        navigation.navigate('Login');
      })
      .catch(() => {
        Alert.alert('Error', 'Invalid or expired code.');
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
        <Text style={styles.title}>Change password</Text>

        <TextInput
          placeholder="Insert Reset Code"
          value={code}
          onChangeText={setCode}
          style={styles.input}
          autoCapitalize="none"
        />

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Insert your new password"
            value={newPassword}
            onChangeText={(text) => {
              setNewPassword(text);
              checkPasswordStrength(text);
              setShowValidationText(true);
            }}
            style={styles.input}
            secureTextEntry={!showNewPass}
          />
          <TouchableOpacity
            onPress={() => setShowNewPass(!showNewPass)}
            style={styles.icon}
          >
            <Ionicons
              name={showNewPass ? 'eye' : 'eye-off'}
              size={22}
              color="#333"
            />
          </TouchableOpacity>
        </View>

        {showValidationText && (
          <Text
            style={{
              color: isPasswordStrong ? 'green' : 'red',
              fontSize: 14,
              marginBottom: 16,
            }}
          >
            Your password must contain at least 8 characters, one uppercase letter, one lowercase letter, one digit and one special character.
          </Text>
        )}

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.input}
            secureTextEntry={!showConfirmPass}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPass(!showConfirmPass)}
            style={styles.icon}
          >
            <Ionicons
              name={showConfirmPass ? 'eye' : 'eye-off'}
              size={22}
              color="#333"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleReset}>
          <Text style={styles.buttonText}>Save password</Text>
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
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'left',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 12,
    paddingRight: 40,
    marginBottom: 16,
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
});
