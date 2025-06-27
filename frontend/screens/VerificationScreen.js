import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Image,
  StyleSheet, TouchableOpacity, Alert, ScrollView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { FILE_HOST } from '../services/api';

const VerificationScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [cnp, setCnp] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    (async () => {
      const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();

      if (mediaPermission.status !== 'granted' || cameraPermission.status !== 'granted') {
        Alert.alert("Permissions required.Camera and gallery permissions required.");
      }

      const storedId = await AsyncStorage.getItem('userId');
      if (storedId) {
        setUserId(parseInt(storedId));
      } else {
        Alert.alert("Error", "Nu s-a putut prelua ID-ul utilizatorului.");
      }
    })();
  }, []);

  const pickImage = async (type) => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const originalUri = result.assets[0].uri;
      const fileName = originalUri.split('/').pop();
      const newPath = FileSystem.documentDirectory + fileName;

      try {
        await FileSystem.copyAsync({ from: originalUri, to: newPath });

        if (type === 'front') setFrontImage(newPath);
        else setBackImage(newPath);
      } catch (err) {
        console.error('Copy error:', err);
        Alert.alert("Error", "The image could not be saved.");
      }
    }
  };

  const submitVerification = async () => {
    if (!name || !surname || !cnp || !idNumber || !frontImage || !backImage) {
      Alert.alert("Error", "Complete all fields and upload both images.");
      return;
    }

    if (!userId) {
      Alert.alert("Error", "User ID not found.");
      return;
    }

    const formData = new FormData();
    formData.append("userId", userId.toString());
    formData.append("name", name);
    formData.append("surname", surname);
    formData.append("cnp", cnp);
    formData.append("idNumber", idNumber);
    formData.append("frontImage", {
      uri: frontImage,
      type: 'image/jpeg',
      name: 'front.jpg',
    });
    formData.append("backImage", {
      uri: backImage,
      type: 'image/jpeg',
      name: 'back.jpg',
    });

    try {
      const response = await fetch(`${FILE_HOST}/api/verify/submit`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        Alert.alert("Sent", "The data has been submitted for verification.");
        navigation.goBack();
      } else {
        const errorText = await response.text();
        //console.error("Eroare răspuns:", errorText);
        Alert.alert("Error", "You already have a request sent.");
      }
    } catch (error) {
     console.log("URL:", `${FILE_HOST}/api/verify/submit`);
console.log("FormData:", formData);
console.error("Eroare submit:", error);

      Alert.alert("Error", "An error occurred while sending.");
    }
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={30} color="black" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>VERIFY ACCOUNT</Text>

        <TextInput style={styles.input} placeholder="FirstName" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Surname" value={surname} onChangeText={setSurname} />
        <TextInput style={styles.input} placeholder="CNP" value={cnp} onChangeText={setCnp} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="ID Number (ex: AB123456)" value={idNumber} onChangeText={setIdNumber} />

        <TouchableOpacity style={styles.button} onPress={() => pickImage('front')}>
          <Text style={styles.buttonText}>Upload front of the identity card</Text>
        </TouchableOpacity>
        {frontImage && <Image source={{ uri: frontImage }} style={styles.imagePreview} />}

        <TouchableOpacity style={styles.button} onPress={() => pickImage('back')}>
          <Text style={styles.buttonText}>Upload back of the identity card</Text>
        </TouchableOpacity>
        {backImage && <Image source={{ uri: backImage }} style={styles.imagePreview} />}

        <TouchableOpacity style={styles.submitButton} onPress={submitVerification}>
          <Text style={styles.submitButtonText}>Send</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#f2f2f2' },
  container: { padding: 20, paddingBottom: 40 },
  backButton: { position: 'absolute', top: 10, left: 10, marginTop: 70, zIndex: 1 },
  header: { fontSize: 24, fontWeight: '500', textAlign: 'center', marginVertical: 30, marginTop: 100 },
  input: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc',
    paddingHorizontal: 10, borderRadius: 8, height: 45, marginBottom: 15
  },
  button: {
    backgroundColor: '#007bff', padding: 10, borderRadius: 8,
    alignItems: 'center', marginBottom: 10,
  },
  buttonText: { color: '#fff', fontSize: 16 },
  imagePreview: {
    width: 150, height: 150, borderRadius: 10,
    borderWidth: 1, borderColor: '#ccc', alignSelf: 'center', marginBottom: 15
  },
  submitButton: {
    backgroundColor: '#28a745', padding: 15,
    borderRadius: 8, alignItems: 'center', marginTop: 20
  },
  submitButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default VerificationScreen;
