import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
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
  const { userId } = useContext(FavoriteContext);
  const [participants, setParticipants] = useState([]);

  
  useEffect(() => {
    if (reservation) {
      console.log('reservation full:', reservation);
    }
  }, [reservation]);
  
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: '',
      headerBackVisible: false,
      headerTransparent: true,
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('CartScreen',{reservationId})} style={{ marginRight: 20, paddingTop: 40 }}>
          <Icon name="cart-outline" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  
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
  
  if (loading) return (
    <SafeAreaView style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#000" />
    </SafeAreaView>
  );

  if (!reservation) return (
    <SafeAreaView style={styles.loadingContainer}>
      <Text style={styles.errorText}>Reservation not found</Text>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.container}>
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
            style={styles.button}
            onPress={() => navigation.navigate('InviteScreen', { reservationId })}
          >
            <Icon name="person-add-outline" size={20} color="white" />
            <Text style={styles.buttonText}>Add persons</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('MenuScreen', {
              reservationId: reservation.id,
              restaurantId: reservation.restaurantId
            })}
            
          >
            <Icon name="book-outline" size={20} color="white" />
            <Text style={styles.buttonText}>View Menu</Text>
          </TouchableOpacity>

          <TouchableOpacity
  style={styles.payButton}
  onPress={() => navigation.navigate('PaymentScreen', {
    amount: total * 100, // Stripe cere bani, nu lei
    name: 'Plată masă'
  })}
>
  <Text style={styles.buttonText}>TotalTableAmount: {total} lei</Text>
</TouchableOpacity>

<TouchableOpacity
  style={styles.payButton}
  onPress={() => navigation.navigate('PaymentScreen', {
    amount: userTotal * 100,
    name: 'Plată personală'
  })}
>
  <Text style={styles.buttonText}>PersonalTotal: {userTotal} lei</Text>
</TouchableOpacity>


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
    marginBottom: 10,
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
  buttonGroup: {
    alignItems: 'center',
    gap: 16,
    marginBottom: 180,

  },
  button: {
    flexDirection: 'row',
    backgroundColor: 'black',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignItems: 'center',
    gap: 8,
    minWidth: 240,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  payButton: {
    backgroundColor: 'black',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 20,
    alignItems: 'center',
    minWidth: 240,
  },
  payText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center',
    marginTop: 10,
  },
  
});

export default ReservationDetailsScreen;
