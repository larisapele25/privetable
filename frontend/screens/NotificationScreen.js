import React, { useEffect, useState, useContext } from 'react';
import {
  View, Text, StyleSheet, FlatList, SafeAreaView,
  TouchableOpacity, Alert, Platform, LayoutAnimation, UIManager
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../services/api';
import { format, parseISO } from 'date-fns';
import { FavoriteContext } from '../context/FavoriteContext';
import { useNavigation } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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
    if (hiddenNotificationIds.includes(item.id)) return null;

    const statusColor = {
      PENDING: { backgroundColor: '#fff4e5', color: '#e6b800' },
      APPROVED: { backgroundColor: '#e0f7e9', color: 'green' },
      REJECTED: { backgroundColor: '#ffe6e6', color: 'crimson' },
    };

    return (
      <Swipeable renderRightActions={() => renderRightActions(item)}>
        <View style={styles.card}>
          <Text style={styles.message}>{item.message}</Text>
          <Text style={styles.timestamp}>{format(parseISO(item.timestamp), 'dd MMM yyyy, HH:mm')}</Text>

          {item.type === 'REENGAGEMENT' && (
            <Text style={styles.tag}>🍽 
Recommendation for you</Text>
          )}

          {(item.type === 'MENU_UPDATE' || item.type === 'REENGAGEMENT') && item.restaurantId && (
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() =>
                navigation.navigate('MenuScreen', {
                  restaurantId: item.restaurantId,
                  readOnly: true,
                })
              }
            >
              <Text style={styles.buttonText}>View Menu</Text>
            </TouchableOpacity>
          )}

          {item.type === 'INVITE' &&
            item.reservationId &&
            !acceptedReservationIds.includes(item.reservationId) && (
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => handleAccept(item.reservationId)}
              >
                <Text style={styles.buttonText}>Accept</Text>
              </TouchableOpacity>
            )}

          {item.type === 'INVITE' &&
            acceptedReservationIds.includes(item.reservationId) && (
              <Text style={styles.acceptedText}>✔ You already accepted.</Text>
            )}

          {item.type === 'VERIFICATION' && item.verificationId && (
            <Text style={[
              styles.statusText,
              statusColor[verificationStatuses[item.verificationId]] || {},
            ]}>
              Status: {verificationStatuses[item.verificationId] || 'Se verifică...'}
            </Text>
          )}

          {item.type === 'REVIEW_REMINDER' &&
            item.reservationId &&
            item.restaurantId &&
            item.recipient?.id && (
              <TouchableOpacity
                style={styles.reviewButton}
                onPress={() =>
                  navigation.navigate('ReviewScreen', {
                    reservationId: item.reservationId,
                    userId: item.recipient.id,
                    restaurantId: item.restaurantId,
                  })
                }
              >
                <Text style={styles.buttonText}>Leave a review</Text>
              </TouchableOpacity>
            )}
        </View>
      </Swipeable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>NOTIFICATION</Text>
      <FlatList
        data={notifications.filter(n => !hiddenNotificationIds.includes(n.id))}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.empty}>You don't have notifications yet.</Text>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '400',
    paddingHorizontal: 20,
    marginBottom: 10,
    color: '#222',
    marginTop: 40
  },
  card: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  message: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  tag: {
    backgroundColor: '#fff4e6',
    color: '#b86b00',
    fontSize: 12,
    fontWeight: '500',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 14,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  menuButton: {
    marginTop: 10,
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 25,
    alignSelf: 'flex-start',
  },
  acceptButton: {
    marginTop: 10,
    backgroundColor: '#111',
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 25,
    alignSelf: 'flex-start',
  },
  reviewButton: {
    marginTop: 10,
    backgroundColor: '#222',
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 25,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  acceptedText: {
    marginTop: 10,
    fontStyle: 'italic',
    color: 'gray',
    fontSize: 14,
  },
  statusText: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: '500',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  deleteButton: {
    backgroundColor: 'crimson',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 20,
    marginVertical: 8,
  },
  deleteText: {
    color: 'white',
    fontWeight: '600',
  },
  empty: {
    textAlign: 'center',
    color: '#aaa',
    marginTop: 50,
    fontSize: 16,
  },
});

export default NotificationsScreen;
