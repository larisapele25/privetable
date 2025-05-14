import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { API } from '../services/api';
import { FavoriteContext } from '../context/FavoriteContext';

const MenuScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { reservationId, restaurantId, readOnly } = route.params; // ✅ citim readOnly
  const { userId } = useContext(FavoriteContext);

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (restaurantId) {
      API.get(`/products/restaurant/${restaurantId}`)
        .then(response => setProducts(response.data))
        .catch(err => console.error('Error loading menu:', err));
    }
  }, [restaurantId]);

  const addToCart = (product) => {
    if (readOnly) return; // ✅ prevenim acțiunea în mod read-only
    const updatedCart = { ...cart };
    updatedCart[product.id] = updatedCart[product.id]
      ? { ...product, quantity: updatedCart[product.id].quantity + 1 }
      : { ...product, quantity: 1 };
    setCart(updatedCart);
    updateTotal(updatedCart);
  };

  const removeFromCart = (product) => {
    if (readOnly) return; // ✅ prevenim acțiunea în mod read-only
    const updatedCart = { ...cart };
    if (updatedCart[product.id]) {
      updatedCart[product.id].quantity -= 1;
      if (updatedCart[product.id].quantity <= 0) {
        delete updatedCart[product.id];
      }
    }
    setCart(updatedCart);
    updateTotal(updatedCart);
  };

  const updateTotal = (updatedCart) => {
    const sum = Object.values(updatedCart)
      .reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(sum);
  };

  const groupByCategory = (items) =>
    items.reduce((groups, item) => {
      const cat = item.category || 'Other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
      return groups;
    }, {});

  const grouped = groupByCategory(products);

  const handlePlaceOrder = async () => {
    if (readOnly) return; // ✅ nici să nu poți trimite comanda
    try {
      if (!userId || !reservationId || Object.keys(cart).length === 0) {
        Alert.alert("Missing data", "Make sure you selected products and are logged in.");
        return;
      }

      const requests = Object.values(cart).map(item =>
        API.post('/cart/add', {
          reservation: { id: reservationId },
          product: { id: item.id },
          user: { id: parseInt(userId) },
          quantity: item.quantity
        })
      );

      await Promise.all(requests);

      Alert.alert("Success", "Order placed successfully!");
      navigation.navigate('ReservationDetails', { reservationId });

    } catch (err) {
      console.error('Error placing order:', err);
      Alert.alert("Error", "Failed to place order. Try again.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      {readOnly && (
        <Text style={styles.readOnlyBanner}>Acesta este doar un preview al meniului</Text>
      )}

      {Object.keys(grouped).map(category => (
        <View key={category} style={styles.section}>
          <Text style={styles.sectionTitle}>{category}</Text>
          {grouped[category].map(product => (
            <View key={product.id} style={styles.item}>
              <View style={styles.itemInfo}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={styles.name}>{product.name}</Text>
                  {product.createdAt && new Date() - new Date(product.createdAt) < 2 * 24 * 60 * 60 * 1000 && (
                    <Text style={styles.newTag}>NEW</Text>
                  )}
                </View>
                <Text style={styles.desc}>{product.description}</Text>
                <Text style={styles.price}>{product.price} lei</Text>
              </View>

              {!readOnly && (
                <View style={styles.actions}>
                  <TouchableOpacity onPress={() => removeFromCart(product)} style={styles.actionButton}>
                    <Text style={styles.actionText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantity}>{cart[product.id]?.quantity || 0}</Text>
                  <TouchableOpacity onPress={() => addToCart(product)} style={styles.actionButton}>
                    <Text style={styles.actionText}>+</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </View>
      ))}

      {!readOnly && (
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Your total: {total} lei</Text>
          <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
            <Text style={styles.placeOrderText}>Place Order</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 12,
    marginTop: 50,
  },
  item: {
    marginBottom: 16,
    backgroundColor: '#f6f6f6',
    padding: 12,
    borderRadius: 12,
  },
  itemInfo: {
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
  },
  desc: {
    fontSize: 14,
    color: '#666',
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    backgroundColor: '#000',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  totalText: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeOrderButton: {
    marginTop: 16,
    backgroundColor: 'black',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 20,
    alignItems: 'center',
  },
  placeOrderText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  newTag: {
    backgroundColor: 'red',
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 6,
  },
  readOnlyBanner: {
    textAlign: 'center',
    color: '#888',
    fontStyle: 'italic',
    marginBottom: 16,
    fontSize: 14,
  },
});

export default MenuScreen;
