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

  useEffect(() => {
    fetchData();
  }, [selectedTab, selectedDate]);

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const dateStr = selectedDate.toISOString().split('T')[0];
      const endpoint = selectedTab === 'reservations'
        ? `/api/restaurant/reservations/by-date?date=${dateStr}`
        : `/api/restaurant/orders/by-date?date=${dateStr}`;

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
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  } catch (err) {
    Alert.alert('Eroare la logout');
  }
};


  const renderItem = ({ item }) => {
    if (selectedTab === 'reservations') {
      const date = new Date(item.dateTime);
      const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      return (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>⏰ {time} |  {item.numberOfPeople} persoane</Text>
          {item.createdById && (
            <Text style={styles.cardDetail}>🧾 Rezervată de ID: {item.createdById}</Text>
          )}
          <Text style={styles.cardDetail}>⏳ Durată: {item.duration} ore</Text>
        </View>
      );
    } else {
      const product = item.product || {};
      return (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🍽️ {product.name || 'Produs necunoscut'}</Text>
          <Text style={styles.cardDetail}>🔢 Cantitate: {item.quantity}</Text>
          {product.price != null && (
            <Text style={styles.cardDetail}>💸 {product.price} RON</Text>
          )}
          <Text style={styles.cardDetail}>🪪 Rezervare ID: {item.reservationId}</Text>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>DASHBOARD RESTAURANT</Text>

      <TouchableOpacity
        style={styles.manageButton}
        onPress={() => navigation.navigate('ProductManager')}
      >
        <Text style={styles.manageButtonText}>Gestionare Produse</Text>
      </TouchableOpacity>

      <View style={styles.tabContainer}>
        {['reservations', 'orders'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, selectedTab === tab && styles.activeTab]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={selectedTab === tab ? styles.activeTabText : styles.tabText}>
              {tab === 'reservations' ? 'Rezervări' : 'Comenzi'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.dateText}> {selectedDate.toLocaleDateString()}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
  <Text style={styles.logoutText}>Logout</Text>
</TouchableOpacity>


     <FlatList
         data={data}
         keyExtractor={(_, index) => index.toString()}
         renderItem={renderItem}
         ListEmptyComponent={
    <Text style={styles.emptyText}>
         Nu sunt {selectedTab === 'reservations' ? 'rezervări' : 'comenzi'} în data selectată.
    </Text>
    
  }
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
    fontSize: 24,
    fontWeight: '500',
    marginVertical: 20,
    marginTop: 60,
    textAlign: 'center',
    color: '#222',
  },
 manageButton: {
  backgroundColor: '#000',
  paddingVertical: 10,
  paddingHorizontal: 20,     
  borderRadius: 20,
  marginBottom: 20,
  alignSelf: 'center',        
},

  manageButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginHorizontal: 6,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  activeTab: {
    backgroundColor: '#000',
  },
  tabText: {
    color: '#555',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '600',
  },
  dateButton: {
    alignSelf: 'center',
    backgroundColor: '#dedede',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 6,
  },
  cardDetail: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  emptyText: {
  textAlign: 'center',
  marginTop: 30,
  fontSize: 16,
  color: '#777',
},

logoutButton: {
  position: 'absolute',
  top: 70,
  right: 25,
  backgroundColor: '#333',
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 10,
  zIndex: 1,
},
logoutText: {
  color: '#fff',
  fontWeight: '500',
},

});
