import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { API } from '../services/api';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View as RNView } from 'react-native'; // pentru View nested în TouchableOpacity

const HomeScreen = ({ navigation }) => {
  const [upcomingData, setUpcomingData] = useState([]);
  const [bookAgainData, setBookAgainData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) return;
  
        const res1 = await API.get('/reservations/upcoming', {
          params: { userId },
        });
  
        const res2 = await API.get('/restaurants/booked-before', {
          params: { userId },
        });
  
        const res3 = await API.get(`/notifications/unread-count/${userId}`);

        setUpcomingData(res1.data || []);
        setBookAgainData(res2.data || []);
        setUnreadCount(res3.data || 0);
      } catch (error) {
        console.error('❌ Eroare la fetch:', error.message);
      } finally {
        setLoading(false);
      }
    };
  
    const unsubscribe = navigation.addListener('focus', fetchData);
    fetchData();
  
    return unsubscribe;
  }, [navigation]);
  

  const renderUpcoming = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('ReservationDetails', { reservationId: item.id })
      }
    >
      <Text style={styles.cardTitle}>{item.restaurantName}</Text>
      <Text>{item.date} • {item.time}</Text>
    </TouchableOpacity>
  );
  

  const renderBookAgain = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('SelectDateTime', {
          restaurant: {
            id: item.id,
            name: item.name,
            imageUrl: item.imageUrl, 
          }
        })
      }
    >
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <Text style={styles.cardTitle}>{item.name}</Text>
    </TouchableOpacity>
  );
  
  
  

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="black" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../assets/images/image.png')}
          style={styles.logoImage}
        />
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
  <View style={{ position: 'relative' }}>
    <Icon name="notifications-outline" size={24} color="#000" />
    {unreadCount > 0 && (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>
          {unreadCount > 9 ? '9+' : unreadCount}
        </Text>
      </View>
    )}
  </View>
</TouchableOpacity>


      </View>

      <View style={styles.content}>
        <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Upcoming</Text>
        {upcomingData.length === 0 ? (
          <Text style={styles.emptyText}>No upcoming reservations.</Text>
        ) : (
          <FlatList
            data={upcomingData}
            renderItem={renderUpcoming}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.list}
          />
        )}

        <Text style={styles.sectionTitle}>Book Again</Text>
        {bookAgainData.length === 0 ? (
          <Text style={styles.emptyText}>No previous reservations found.</Text>
        ) : (
          <FlatList
            data={bookAgainData}
            renderItem={renderBookAgain}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.list}
          />
        )}

        {/* Book a Table Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ChooseRestaurant')}

        >
          <Text style={styles.buttonText}>Book a Table</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 5,
  },
  logoImage: {
    width: 120,
    height: 100,
    resizeMode: 'contain',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
    marginTop: 20,
  },
  list: {
    paddingBottom: 10,
  },
  card: {
    width: 140,
    height: 100,
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    padding: 10,
    marginRight: 10,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  image: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    marginBottom: 5,
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 10,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: 'red',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  
});
