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

        const [res1, res2, res3] = await Promise.all([
          API.get('/reservations/upcoming', { params: { userId } }),
          API.get('/restaurants/booked-before', { params: { userId } }),
          API.get(`/notifications/unread-count/${userId}`),
        ]);

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
      style={styles.cardu
      }
      onPress={() =>
        navigation.navigate('ReservationDetails', { reservationId: item.id })
      }
    >
      <Text style={styles.cardTitle}>{item.restaurantName}</Text>
      <Text style={styles.cardSubtitle}>{item.date} • {item.time}</Text>
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
        <ActivityIndicator size="large" color="#000" />
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
            <Icon name="notifications-outline" size={26} color="#000" />
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
        <Text style={styles.sectionTitle}>Upcoming</Text>
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
    backgroundColor: '#fafafa',
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '500',
    marginVertical: 12,
    color: '#111',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 10,
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    width: 160,
    height: 150,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginRight: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
    justifyContent: 'flex-start',
  },

   cardu: {
    width: 160,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginRight: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
    justifyContent: 'flex-start',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
    color: '#222',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  image: {
    width: '100%',
    height: 90,
    borderRadius: 12,
    backgroundColor: '#eee',
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 50,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -6,
    backgroundColor: '#ff3b30',
    borderRadius: 12,
    paddingHorizontal: 6,
    height: 18,
    minWidth: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  badgeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 10,
  },
});
