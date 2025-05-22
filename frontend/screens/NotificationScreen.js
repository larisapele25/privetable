import React, { useEffect, useState, useContext } from 'react';
import {
  View, Text, StyleSheet, FlatList, SafeAreaView,
  TouchableOpacity, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../services/api';
import { format, parseISO } from 'date-fns';
import { FavoriteContext } from '../context/FavoriteContext';
import { useNavigation } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [acceptedReservationIds, setAcceptedReservationIds] = useState([]);
  const [verificationStatuses, setVerificationStatuses] = useState({});
  const [hiddenNotificationIds, setHiddenNotificationIds] = useState([]);
  const { userId } = useContext(FavoriteContext);
  const navigation = useNavigation();

  useEffect(() => {
    const loadHidden = async () => {
      const stored = await AsyncStorage.getItem('hiddenNotificationIds');
      if (stored) setHiddenNotificationIds(JSON.parse(stored));
    };
    loadHidden();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      const storedUserId = await AsyncStorage.getItem('userId');
      const finalUserId = userId || storedUserId;
      if (!finalUserId) return;

      try {
        await API.delete(`/notifications/cleanup/${finalUserId}`);
        await API.put(`/notifications/mark-as-read/${finalUserId}`);

        const [notiRes, reservationsRes] = await Promise.all([
          API.get(`/notifications/${finalUserId}`),
          API.get(`/reservations/upcoming?userId=${finalUserId}`)
        ]);

        const all = Array.isArray(notiRes.data) ? notiRes.data : [];
        const joinedIds = Array.isArray(reservationsRes.data)
          ? reservationsRes.data.map(r => r.id) : [];

        setNotifications(all);
        setAcceptedReservationIds(joinedIds);

        const statuses = {};
        for (let n of all) {
          if (n.type === 'VERIFICATION' && n.verificationId) {
            try {
              const res = await API.get(`/verify/status/${n.verificationId}`);
              statuses[n.verificationId] = res.data.status;
            } catch {}
          }
        }
        setVerificationStatuses(statuses);
      } catch (err) {
        console.error('Eroare notificări:', err);
      }
    };

    fetchNotifications();
  }, [userId]);

  const handleAccept = async (reservationId) => {
    try {
      const finalUserId = userId || (await AsyncStorage.getItem('userId'));
      if (!finalUserId) return Alert.alert('Eroare', 'Utilizatorul nu este autentificat.');

      await API.post(`/reservations/${reservationId}/join`, {
        userId: parseInt(finalUserId),
      });

      Alert.alert('Succes', 'Ai intrat în rezervare.');
      const refreshed = await API.get(`/notifications/${finalUserId}`);
      setNotifications(refreshed.data);
    } catch {
      Alert.alert('Eroare', 'Rezervarea nu a putut fi acceptată.');
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    const updated = [...hiddenNotificationIds, notificationId];
    setHiddenNotificationIds(updated);
    await AsyncStorage.setItem('hiddenNotificationIds', JSON.stringify(updated));
  };

  const renderRightActions = (item) => (
    <TouchableOpacity onPress={() => handleDeleteNotification(item.id)} style={styles.deleteButton}>
      <Text style={styles.deleteText}>Șterge</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => {
    const show = !hiddenNotificationIds.includes(item.id);
console.log("NOTIFICARE:", JSON.stringify(item));

    return (
      show && (
        <Swipeable renderRightActions={() => renderRightActions(item)}>
          <View style={styles.card}>
            <Text style={styles.message}>{item.message}</Text>
            <Text style={styles.timestamp}>{format(parseISO(item.timestamp), 'dd MMM yyyy, HH:mm')}</Text>

            {item.type === 'REENGAGEMENT' && <Text style={styles.reengageTag}>🍽 Recomandare pentru tine</Text>}

            {(item.type === 'MENU_UPDATE' || item.type === 'REENGAGEMENT') && item.restaurantId && (
              <TouchableOpacity
                style={styles.menuButton}
                onPress={() =>
                  navigation.navigate('MenuScreen', {
                    restaurantId: item.restaurantId,
                    readOnly: true
                  })
                }
              >
                <Text style={styles.menuButtonText}>Vezi meniul</Text>
              </TouchableOpacity>
            )}

            {item.type === 'INVITE' && item.reservationId && !acceptedReservationIds.includes(item.reservationId) && (
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => handleAccept(item.reservationId)}
              >
                <Text style={styles.acceptText}>Accept</Text>
              </TouchableOpacity>
            )}

            {item.type === 'INVITE' && acceptedReservationIds.includes(item.reservationId) && (
              <Text style={styles.acceptedText}>Deja ai acceptat</Text>
            )}

            {item.type === 'VERIFICATION' && item.verificationId && (
              <Text style={[
                styles.statusText,
                verificationStatuses[item.verificationId] === 'PENDING' && { color: '#e6b800' },
                verificationStatuses[item.verificationId] === 'APPROVED' && { color: 'green' },
                verificationStatuses[item.verificationId] === 'REJECTED' && { color: 'crimson' },
              ]}>
                Status: {verificationStatuses[item.verificationId] || 'Se verifică...'}
              </Text>
            )}

          {item.type === 'REVIEW_REMINDER' &&
 item.reservationId && item.restaurantId && item.recipient?.id && (
  <TouchableOpacity
    style={styles.reviewButton}
    onPress={() => {
      console.log('Navigare Review:', {
        reservationId: item.reservationId,
        userId: item.recipient?.id,
        restaurantId: item.restaurantId
      });

      navigation.navigate('ReviewScreen', {
        reservationId: item.reservationId,
        userId: item.recipient.id,
        restaurantId: item.restaurantId
      });
    }}
  >
    <Text style={styles.reviewButtonText}>Lasă un review</Text>
  </TouchableOpacity>
)}



          </View>
        </Swipeable>
      )
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>NOTIFICĂRI</Text>
      <FlatList
        data={notifications.filter(n => !hiddenNotificationIds.includes(n.id))}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.empty}>Nu ai notificări.</Text>}
      />
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
    marginRight: 20,
  },
  message: { fontSize: 16, fontWeight: '500' },
  timestamp: { fontSize: 12, color: '#888', marginTop: 6 },
  empty: { textAlign: 'center', color: '#888', marginTop: 50 },
  menuButton: {
    marginTop: 10,
    backgroundColor: 'black',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  menuButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  acceptButton: {
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  acceptText: { color: 'white', fontWeight: '600', fontSize: 14 },
  acceptedText: { marginTop: 10, color: 'gray', fontStyle: 'italic' },
  statusText: { marginTop: 10, fontStyle: 'italic', fontSize: 14 },
  reengageTag: { color: '#b86b00', fontSize: 13, marginTop: 6, fontStyle: 'italic' },
  reviewButton: {
    marginTop: 10,
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  reviewButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'flex-end',
    padding: 20,
    borderRadius: 12,
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default NotificationsScreen;
