import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function AdminPanelScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { adminCode } = route.params;

  const handleLogout = () => {
    Alert.alert('Confirmare', 'Sigur vrei să te deloghezi?', [
      { text: 'Anulează', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => navigation.reset({
          index: 0,
          routes: [{ name: 'AdminLogin' }],
        }),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>ADMIN PANEL</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.smallButton}
          onPress={() => navigation.navigate('AddRestaurant', { adminCode })}
        >
          <Text style={styles.buttonText}>➕ Add Restaurant</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.smallButton}
          onPress={() => navigation.navigate('AdminRestaurantList', { adminCode })}
        >
          <Text style={styles.buttonText}>📋 Restaurants</Text>
        </TouchableOpacity>
    <TouchableOpacity
        style={styles.smallButton}
        onPress={() => navigation.navigate('VerificationAdmin')}>
    <Text style={styles.buttonText}>🔍 User Verification</Text>
    </TouchableOpacity>

        <TouchableOpacity
          style={[styles.smallButton, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>🚪 Logout</Text>
        </TouchableOpacity>

     
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  header: {
    fontSize: 24,
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    alignItems: 'center',
    gap: 16,
  },
  smallButton: {
    backgroundColor: '#000',
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 20,
    minWidth: 250,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: 'red', 
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});
