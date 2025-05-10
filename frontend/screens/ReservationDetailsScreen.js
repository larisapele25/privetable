import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { API } from '../services/api';
import Icon from 'react-native-vector-icons/Ionicons';
import { FavoriteContext } from '../context/FavoriteContext';

const ReservationDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { reservationId } = route.params;

  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [userTotal, setUserTotal] = useState(0);
  const [participants, setParticipants] = useState([]);
  const { userId } = useContext(FavoriteContext);

  useEffect(() => {
    API.get(`/reservations/${reservationId}`)
      .then(response => {
        setReservation(response.data);
        setParticipants(response.data.participants || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching reservation:', error);
        setLoading(false);
      });
  }, [reservationId]);

  useEffect(() => {
    if (reservationId) {
      API.get(`/cart/total/${reservationId}`)
        .then(res => setTotal(res.data))
        .catch(err => console.error('Error fetching total:', err));
    }
  }, [reservationId]);

  useEffect(() => {
    if (reservationId && userId) {
      API.get(`/cart/total/${reservationId}/user/${userId}`)
        .then(res => setUserTotal(res.data))
        .catch(err => console.error('Error fetching user total:', err));
    }
  }, [reservationId, userId]);

  const handleCancelReservation = () => {
    Alert.alert(
      'Confirmare',
      'Ești sigur că vrei să anulezi rezervarea?',
      [
        { text: 'Nu' },
        {
          text: 'Da',
          onPress: async () => {
            try {
              await API.post(`/reservations/${reservation.id}/cancel?userId=${userId}`);
              Alert.alert("Rezervare anulată cu succes");
              navigation.goBack();
            } catch (error) {
              const message = error?.response?.data?.message || 'A apărut o eroare.';
              Alert.alert("Eroare", message);
            }
          },
        },
      ]
    );
  };
  

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </SafeAreaView>
    );
  }

  if (!reservation) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.errorText}>Reservation not found</Text>
      </SafeAreaView>
    );
  }

  const isCreator = reservation.createdById === userId;
  console.log (isCreator);
  console.log('reservation.createdById:', reservation.createdById);
console.log('userId:', userId);
console.log('Match:', reservation.createdById === userId);


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cartIconContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('CartScreen', { reservationId })}
        >
          <Icon name="cart-outline" size={26} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{reservation.restaurantName}</Text>
          <Text style={styles.subText}>
            {new Date(reservation.dateTime).toLocaleString()}
          </Text>
          <Text style={styles.subText}>
            {reservation.numberOfPeople} persons • {reservation.duration}h
          </Text>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={styles.sectionHeader}>Participants:</Text>
          {participants.length === 0 ? (
            <Text style={styles.subText}>Only you for now.</Text>
          ) : (
            participants.map((email, idx) => (
              <Text key={idx} style={styles.subText}>• {email}</Text>
            ))
          )}
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.baseButton, styles.button]}
            onPress={() => navigation.navigate('InviteScreen', { reservationId })}
          >
            <Icon name="person-add-outline" size={20} color="white" />
            <Text style={styles.buttonText}>Add persons</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.baseButton, styles.button]}
            onPress={() => navigation.navigate('MenuScreen', {
              reservationId: reservation.id,
              restaurantId: reservation.restaurantId
            })}
          >
            <Icon name="book-outline" size={20} color="white" />
            <Text style={styles.buttonText}>View Menu</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.baseButton}
            onPress={() => navigation.navigate('PaymentScreen', {
              amount: total * 100,
              name: 'Plată masă'
            })}
          >
            <Text style={styles.buttonText}>Total masă: {total} RON</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.baseButton}
            onPress={() => navigation.navigate('PaymentScreen', {
              amount: userTotal * 100,
              name: 'Plată personală'
            })}
          >
            <Text style={styles.buttonText}>Total personal: {userTotal} RON</Text>
          </TouchableOpacity>

          {isCreator && (
            <TouchableOpacity
              style={[styles.baseButton, { backgroundColor: 'red' }]}
              onPress={handleCancelReservation}
            >
              <Text style={styles.buttonText}>Anulează rezervarea</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  cartIconContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 30,
    right: 40,
    zIndex: 999,
    marginTop: 40,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    padding: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 5,
  },
  subText: {
    fontSize: 16,
    color: '#444',
    marginBottom: 5,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#888',
  },
  baseButton: {
    backgroundColor: 'black',
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: 300,
  },
  button: {
    flexDirection: 'row',
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center',
    marginTop: 10,
  },
  buttonGroup: {
    alignItems: 'center',
    gap: 16,
    marginBottom: 180,
    marginTop: 20,
  },
});

export default ReservationDetailsScreen;
