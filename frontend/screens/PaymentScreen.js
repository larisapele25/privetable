import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Linking } from 'react-native';
import { API } from '../services/api';

const PaymentScreen = ({ route, navigation }) => {
  const { amount, name } = route.params;

  useEffect(() => {
    const startPayment = async () => {
      try {
        const response = await API.post('/payment/create-checkout-session', {
          amount: parseInt(amount), // în bani (ex: 1000 = 10 RON)
          name,
        });
        const { url } = response.data;
        if (url) {
          Linking.openURL(url);
          navigation.goBack(); // Înapoi la detalii rezervare
        }
      } catch (error) {
        console.error('Payment error:', error.message);
      }
    };

    startPayment();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Connecting to Stripe...</Text>
      <ActivityIndicator size="large" color="black" />
    </View>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  text: { marginBottom: 20, fontSize: 16 },
});
