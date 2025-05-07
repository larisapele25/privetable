import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../services/api';
import { format, parseISO } from 'date-fns';
import { FavoriteContext } from '../context/FavoriteContext';

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [acceptedReservationIds, setAcceptedReservationIds] = useState([]);
  const { userId } = useContext(FavoriteContext);

  useEffect(() => {
    const fetchNotifications = async () => {
      const storedUserId = await AsyncStorage.getItem('userId');
      const finalUserId = userId || storedUserId;

      if (!finalUserId) return;

      try {
        await API.delete(`/notifications/cleanup/${finalUserId}`);
        await API.put(`/notifications/mark-as-read/${finalUserId}`);

        const notiRes = await API.get(`/notifications/${finalUserId}`);
        console.log("Notificări primite:", notiRes.data);

        const allNotifications = Array.isArray(notiRes.data) ? notiRes.data : [];

        const reservationsRes = await API.get(`/reservations/upcoming?userId=${finalUserId}`);
        const joinedReservationIds = Array.isArray(reservationsRes.data)
          ? reservationsRes.data.map(r => r.id)
          : [];

        const filtered = allNotifications.filter(n =>
          !(n.type === "INVITE" && joinedReservationIds.includes(n.reservationId))
        );

        setNotifications(filtered);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };

    fetchNotifications();
  }, [userId]);

  const handleAccept = async (reservationId) => {
    try {
      const finalUserId = userId || (await AsyncStorage.getItem('userId'));
      if (!finalUserId) {
        Alert.alert('Eroare', 'Utilizatorul nu este autentificat.');
        return;
      }

      await API.post(`/reservations/${reservationId}/join`, {
        userId: parseInt(finalUserId),
      });

      Alert.alert('Succes', 'Ai intrat în rezervare.');
      setAcceptedReservationIds(prev => [...prev, reservationId]);
    } catch (err) {
      console.error('Join error:', err);
      Alert.alert('Eroare', 'Rezervarea nu a putut fi acceptată.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.message}>{item.message}</Text>
      <Text style={styles.timestamp}>{format(parseISO(item.timestamp), 'dd MMM yyyy, HH:mm')}</Text>

      {item.type === 'INVITE' && item.reservationId && (
        !acceptedReservationIds.includes(item.reservationId) ? (
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => handleAccept(item.reservationId)}
          >
            <Text style={styles.acceptText}>Accept</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.acceptedText}>Deja ai acceptat</Text>
        )
      )}

      {item.type === 'VERIFICATION' && (
        <Text style={{ color: 'green', marginTop: 10, fontStyle: 'italic' }}>
          Status: {item.reviewed ? 'Finalizat' : 'În curs'}
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>NOTIFICĂRI</Text>
      {notifications.length === 0 ? (
        <Text style={styles.empty}>Nu ai notificări.</Text>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'white' },
  title: { fontSize: 24, fontWeight: '400', marginBottom: 20, marginTop: 40, paddingLeft: 20 },
  card: {
    backgroundColor: '#f3f3f3',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    marginLeft: 20,
    marginRight: 20
  },
  message: { fontSize: 16, fontWeight: '500' },
  timestamp: { fontSize: 12, color: '#888', marginTop: 6 },
  empty: { textAlign: 'center', color: '#888', marginTop: 50 },
  acceptButton: {
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  acceptText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  acceptedText: {
    marginTop: 10,
    color: 'gray',
    fontStyle: 'italic',
  },
});

export default NotificationsScreen;
