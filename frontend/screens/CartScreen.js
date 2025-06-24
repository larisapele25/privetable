import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { API } from '../services/api';
import { FavoriteContext } from '../context/FavoriteContext';

const CartScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { reservationId } = route.params;

  const [cartItems, setCartItems] = useState([]);
  const { userId } = useContext(FavoriteContext);

  const fetchCartItems = () => {
  API.get(`/cart/reservation/${reservationId}`)
    .then(response => {
      console.log("Cart items response:", response.data);
      setCartItems(response.data);  //  răspunsul e lista DTO directă
    })
    .catch(error => {
      console.error('Error fetching cart items:', error);
      setCartItems([]); // fallback dacă e eroare
    });
};


  useEffect(() => {
    fetchCartItems();
  }, [reservationId]);

  const handleTakeOver = async (cartItemId) => {
    try {
      await API.put(`/cart/transfer/${cartItemId}/to/${userId}`);
      fetchCartItems();
    } catch (err) {
      console.error('Failed to take over item:', err);
      Alert.alert("Error", "Could not add item to your cart.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('ReservationDetails', { reservationId })}
      >
        <Icon name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>CART ITEMS</Text>

      {cartItems.map((item, index) => (
        <View key={index} style={styles.item}>
          <Text style={styles.product}>
            {item.product.name} – {item.product.price} lei x {item.quantity}
          </Text>
          <Text style={styles.orderedBy}>
            Ordered by: {item.user.email}
          </Text>

          {item.user.id !== parseInt(userId) && (
            <TouchableOpacity
              style={styles.addToCartBtn}
              onPress={() => handleTakeOver(item.id)}
            >
              <Text style={styles.addToCartText}>Add to your cart</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  backButton: {
    marginBottom: 16,
    marginTop: 40,
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
  },
  item: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f6f6f6',
    borderRadius: 12,
  },
  product: {
    fontSize: 16,
    fontWeight: '500',
  },
  orderedBy: {
    marginTop: 4,
    fontSize: 14,
    color: '#666',
  },
  addToCartBtn: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: 'black',
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  addToCartText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default CartScreen;
