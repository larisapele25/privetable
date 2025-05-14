import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../services/api';
import HomeStack from '../navigation/HomeStack';
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { FavoriteContext } from '../context/FavoriteContext';
import LoginScreen from './LoginScreen';
import { useFocusEffect } from '@react-navigation/native';


const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const { logout } = useContext(FavoriteContext);

  useFocusEffect(
  React.useCallback(() => {
    const fetchUserData = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) return;

        const res = await API.get(`/users/${userId}`);
        setUser(res.data);
      } catch (err) {
        console.log('Failed to fetch user', err.message);
      }
    };

    fetchUserData();
  }, [])
);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) return;

        const res = await API.get(`/users/${userId}`);
        setUser(res.data);
      } catch (err) {
        console.log('Failed to fetch user', err.message);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await logout(); // din FavoriteContext
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  

 

  return (
    <SafeAreaView style={styles.container}>
      {user && (
        <>
          <Text style={styles.name}>{user.name}</Text>

       <TouchableOpacity style={styles.rowItem} onPress={() => navigation.navigate('ChangeEmail')}>
  <View>
    <Text style={styles.label}>EMAIL</Text>
    <Text style={styles.value}>{user.email}</Text>
  </View>
  <Text style={styles.arrow}>›</Text>
</TouchableOpacity>



          <View style={styles.infoBox}>
          <TouchableOpacity style={styles.rowItem} onPress={() => navigation.navigate('ChangePassword')}>
  <View>
    <Text style={styles.label}>PASSWORD</Text>
    <Text style={styles.value}>••••••••</Text>
  </View>
  <Text style={styles.arrow}>›</Text>
</TouchableOpacity>


          </View>

          {!user.verified && (
            <TouchableOpacity style={styles.verifyButton} onPress={() => navigation.navigate('Verification')}>
              <Text style={styles.verifyText}>Verify Account</Text>
            </TouchableOpacity>
          )}

<TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
  <Text style={styles.logoutText}>Logout</Text>
</TouchableOpacity>

        </>
      )}
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingTop: 60,
  },
  name: {
    fontSize: 24,
    fontWeight: '400',
    color: '#000',
    marginBottom: 20,
    marginTop: 40,
    paddingLeft: 20,
    textTransform: 'uppercase',

  },
  infoBox: {
    marginBottom: 30,
    
    
  },
  label: {
    fontSize: 13,
    color: '#999',
    marginBottom: 4,
    fontWeight: '400',
  },
  value: {
    fontSize: 16,
    color: '#000',
    fontWeight: '400',
  },
  verifyButton: {
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 10, 
    paddingHorizontal: 30, 
    borderRadius: 12,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 30,
    
  },
  verifyText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000',
    
  },
  logoutButton: {
  
    borderWidth: 1,
    backgroundColor: '#000',
    paddingVertical: 10,  
    paddingHorizontal: 60,
    borderRadius: 12,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 15,
  },
  changePasswordLink: {
    color: '#000',
    textDecorationLine: 'underline',
    paddingLeft: 20,
    marginBottom: 20,
    fontSize: 14,
  },
  rowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  arrow: {
    fontSize: 18,
    color: '#999',
  },
  
  
});
