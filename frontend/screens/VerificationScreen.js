import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Image,
  StyleSheet, TouchableOpacity, Alert, ScrollView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

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
        Alert.alert("Permisiuni necesare", "Trebuie permisiuni pentru cameră și galerie.");
      }

      const storedId = await AsyncStorage.getItem('userId');
      if (storedId) {
        setUserId(parseInt(storedId));
      } else {
        Alert.alert("Eroare", "Nu s-a putut prelua ID-ul utilizatorului.");
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
        console.error('Eroare la copiere:', err);
        Alert.alert("Eroare", "Imaginea nu a putut fi salvată.");
      }
    }
  };

  const submitVerification = async () => {
    if (!name || !surname || !cnp || !idNumber || !frontImage || !backImage) {
      Alert.alert("Eroare", "Completează toate câmpurile și încarcă ambele imagini.");
      return;
    }

    if (!userId) {
      Alert.alert("Eroare", "ID-ul utilizatorului nu a fost găsit.");
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
      const response = await fetch("http://192.168.0.234:8080/verify/submit", {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (response.ok) {
        Alert.alert("Trimis", "Datele au fost trimise pentru verificare manuală.");
        navigation.goBack();
      } else {
        const errorText = await response.text();
        console.error("Eroare răspuns:", errorText);
        Alert.alert("Eroare", "Trimiterea a eșuat.");
      }
    } catch (error) {
      console.error("Eroare submit:", error);
      Alert.alert("Eroare", "A apărut o eroare la trimitere.");
    }
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={30} color="black" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Verificare identitate</Text>

        <TextInput style={styles.input} placeholder="Nume" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Prenume" value={surname} onChangeText={setSurname} />
        <TextInput style={styles.input} placeholder="CNP" value={cnp} onChangeText={setCnp} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Serie buletin (ex: AB123456)" value={idNumber} onChangeText={setIdNumber} />

        <TouchableOpacity style={styles.button} onPress={() => pickImage('front')}>
          <Text style={styles.buttonText}>Încarcă fața buletinului</Text>
        </TouchableOpacity>
        {frontImage && <Image source={{ uri: frontImage }} style={styles.imagePreview} />}

        <TouchableOpacity style={styles.button} onPress={() => pickImage('back')}>
          <Text style={styles.buttonText}>Încarcă verso buletinului</Text>
        </TouchableOpacity>
        {backImage && <Image source={{ uri: backImage }} style={styles.imagePreview} />}

        <TouchableOpacity style={styles.submitButton} onPress={submitVerification}>
          <Text style={styles.submitButtonText}>Trimite verificare</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#f2f2f2' },
  container: { padding: 20, paddingBottom: 40 },
  backButton: { position: 'absolute', top: 10, left: 10, marginTop: 70, zIndex: 1 },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 30 },
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
