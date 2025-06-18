import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, SafeAreaView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function RestaurantDashboard({ navigation }) {
  const [selectedTab, setSelectedTab] = useState('reservations');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [data, setData] = useState([]);
  const [restaurantName, setRestaurantName] = useState('Dashboard Restaurant');

  useEffect(() => {
    const loadName = async () => {
      const name = await AsyncStorage.getItem('restaurantName');
      if (name) setRestaurantName(`🍽️ ${name}`);
    };
    loadName();
  }, []);

  useEffect(() => {
    fetchData();
  }, [selectedTab, selectedDate]);

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const restaurantId = await AsyncStorage.getItem('restaurantId');
      const dateStr = selectedDate.toISOString().split('T')[0];

      let endpoint = '';
      if (selectedTab === 'reservations') {
        endpoint = `/api/restaurant/reservations/by-date?date=${dateStr}`;
      } else if (selectedTab === 'orders') {
        endpoint = `/api/restaurant/orders/by-date?date=${dateStr}`;
      } else if (selectedTab === 'reviews') {
        endpoint = `/api/reviews/restaurant/${restaurantId}`;
        } else if (selectedTab === 'user-history') {
        endpoint = `/api/restaurant/user-history`;
        }
       else {
        endpoint = `/api/restaurant/reservations/past`;
      }

      const response = await fetch(`http://192.168.0.234:8080${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Eroare la încărcare');

      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error(err);
      Alert.alert('Eroare', 'Nu s-au putut încărca datele.');
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('restaurantId');
      await AsyncStorage.removeItem('restaurantName');
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    } catch {
      Alert.alert('Eroare la logout');
    }
  };

  const renderItem = ({ item }) => {
    if (selectedTab === 'reservations') {
      const date = new Date(item.dateTime);
      const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      return (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>⏰ {time} | {item.numberOfPeople} persons</Text>
          <Text style={styles.cardDetail}>📄 Reservation ID: {item.id}</Text>
          <Text style={styles.cardDetail}>🧾 Created by ID: {item.createdById}</Text>
          <Text style={styles.cardDetail}>⏳ Duration: {item.duration}h</Text>

  
        </View>
      );
    }

   if (selectedTab === 'orders') {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>🍽️ {item.productName || 'Unknown product'}</Text>
      <Text style={styles.cardDetail}>🔢 Quantity: {item.quantity}</Text>
      <Text style={styles.cardDetail}>🪪 Reservation ID: {item.reservationId}</Text>
      <Text style={styles.cardDetail}>👤 Ordered by ID: {item.userId}</Text>
    </View>
  );
}


    if (selectedTab === 'reviews') {
      const stars = '⭐'.repeat(item.rating);
      const date = item.reservationDateTime
        ? new Date(item.reservationDateTime).toLocaleDateString()
        : 'Data indisponibilă';

      return (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{stars} ({item.rating}/5)</Text>
          <Text style={styles.cardDetail}>{item.comment || '(No comment)'}</Text>
         <Text style={styles.cardDetail}>📧 Email: {item.userEmail ?? 'unknown'}</Text>
          <Text style={styles.cardDetail}>📅 {date}</Text>
        </View>
      );
    }

    if (selectedTab === 'user-history') {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('UserReviewHistory', {
          userId: item.id,
          userEmail: item.email
        })
      }
    >
      <Text style={styles.cardTitle}>👤 {item.name}</Text>
      <Text style={styles.cardDetail}>📧 {item.email}</Text>
       <Text style={styles.cardDetail}>User ID: {item.id}</Text>
    </TouchableOpacity>
  );
}


    if (selectedTab === 'past-reservations') {
      return (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📅 Reservation no.{item.id}</Text>
          <Text style={styles.cardDetail}>👤 Creator: {item.userEmail}</Text>
          {item.participantEmails?.length > 0 && (
            <Text style={styles.cardDetail}>
              👥 Participants: {item.participantEmails.join(', ')}
            </Text>
          )}

          <TouchableOpacity
            style={[styles.button, { marginTop: 10 }]}
            onPress={() => navigation.navigate('LeaveReviewScreen', {
              reservationId: item.id,
             userList: [
  { id: item.userId, email: item.userEmail },
  ...(item.participantIds || []).map((id, i) => ({
    id,
    email: item.participantEmails[i]
  }))
]

            })}
          >
            <Text style={styles.buttonText}>Leave a review</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>{restaurantName}</Text>

      <TouchableOpacity
        style={styles.manageButton}
        onPress={() => navigation.navigate('ProductManager')}
      >
        <Text style={styles.manageButtonText}>Product Manager</Text>
      </TouchableOpacity>

      <View style={styles.tabContainer}>
        {['reservations', 'orders', 'reviews', 'past-reservations','user-history'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, selectedTab === tab && styles.activeTab]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={selectedTab === tab ? styles.activeTabText : styles.tabText}>
              {{
                  reservations: 'Reservations',
                  orders: 'Orders',
                  reviews: 'Reviews',
                  'past-reservations': 'Past Reservations',
                  'user-history': 'User History'
              }[tab]}

            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {['reservations', 'orders'].includes(selectedTab) && (
        <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.dateText}>{selectedDate.toLocaleDateString()}</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <FlatList
        data={data}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>Nothing to display for this tab.</Text>}
        contentContainerStyle={{ paddingBottom: 40 }}
      />

      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="date"
        date={selectedDate}
        onConfirm={(date) => {
          setSelectedDate(date);
          setShowDatePicker(false);
        }}
        onCancel={() => setShowDatePicker(false)}
        themeVariant="light"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingHorizontal: 16 },
  header: {
    fontSize: 26,
    fontWeight: '500',
    marginVertical: 20,
    textAlign: 'center',
    color: '#222',
    letterSpacing: 0.5,
    marginTop: 80
  },
  manageButton: {
    backgroundColor: '#111',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 24,
    alignSelf: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
    marginTop: 16
  },
  manageButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    margin: 4,
    borderRadius: 24,
    backgroundColor: '#eee',
  },
  activeTab: {
    backgroundColor: '#000',
  },
  tabText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  activeTabText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '700',
  },
  dateButton: {
    alignSelf: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginBottom: 14,
  },
  dateText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
  },
  cardDetail: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#222',
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#777',
  },
  logoutButton: {
    position: 'absolute',
    top: 90,
    right: 20,
    backgroundColor: '#e63946',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    zIndex: 10,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
  },
});
