import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Linking from 'expo-linking';
import { navigationRef } from './screens/NavigationService';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import MainTabNavigator from './navigation/MainTabNavigator';
import { FavoriteProvider } from './context/FavoriteContext';
import ChangePasswordScreen from './screens/ChangePasswordScreen';
import VerificationScreen from './screens/VerificationScreen';
import RestaurantLoginScreen from './screens/RestaurantLoginScreen';
import RestaurantDashboard from './screens/RestaurantDashboard';
import ProductManagerScreen from './screens/ProductManagerScreen';
import AdminLoginScreen from './screens/AdminLoginScreen';
import AdminPanelScreen from './screens/AdminPanelScreen';
import AddRestaurantScreen from './screens/AddRestaurantScreen';
import AdminRestaurantListScreen from './screens/AdminRestaurantListScreen';
import VerificationAdminScreen from './screens/VerificationAdminScreen';
import ReviewScreen from './screens/ReviewScreen';
import LeaveReviewScreen from './screens/LeaveReviewScreen';
import UserReviewHistory from './screens/UserReviewHistory';
const Stack = createNativeStackNavigator();

// 🔗 Configurație pentru deep linking
const linking = {
  prefixes: ['privetable://'],
  config: {
    screens: {
      ReviewScreen: 'review', // privetable://review?reservationId=...&userId=...&restaurantId=...
    },
  },
};

export default function App() {
  useEffect(() => {
    const handleDeepLink = (event) => {
      const data = Linking.parse(event.url);
      if (data?.path === 'review') {
        const { reservationId, userId, restaurantId } = data.queryParams;
        navigationRef.current?.navigate('ReviewScreen', {
          reservationId,
          userId,
          restaurantId,
        });
      }
    };

    const getInitialUrl = async () => {
      const url = await Linking.getInitialURL();
      if (url) handleDeepLink({ url });
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);
    getInitialUrl();

    return () => subscription.remove();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FavoriteProvider>
        <NavigationContainer linking={linking} ref={navigationRef}>
          <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
            <Stack.Screen name="Verification" component={VerificationScreen} />
            <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
            <Stack.Screen name="RestaurantLogin" component={RestaurantLoginScreen} />
            <Stack.Screen name="RestaurantDashboard" component={RestaurantDashboard} />
            <Stack.Screen name="ProductManager" component={ProductManagerScreen} />
            <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
            <Stack.Screen name="AdminPanel" component={AdminPanelScreen} />
            <Stack.Screen name="AddRestaurant" component={AddRestaurantScreen} />
            <Stack.Screen name="AdminRestaurantList" component={AdminRestaurantListScreen} />
            <Stack.Screen name="VerificationAdmin" component={VerificationAdminScreen} />
            <Stack.Screen name="ReviewScreen" component={ReviewScreen} />
            <Stack.Screen name="LeaveReviewScreen" component={LeaveReviewScreen}/>
            <Stack.Screen name="UserReviewHistory" component={UserReviewHistory} />

            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
              options={{
                title: 'Forgot Password',
                headerTitleAlign: 'center',
                headerShown: true,
              }}
            />
            <Stack.Screen
              name="ResetPassword"
              component={ResetPasswordScreen}
              options={{
                title: 'Reset Password',
                headerTitleAlign: 'center',
                headerShown: true,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </FavoriteProvider>
    </GestureHandlerRootView>
  );
}
