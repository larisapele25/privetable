import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FavoriteProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
            <Stack.Screen name="Verification" component={VerificationScreen}/>
            <Stack.Screen name="ChangePassword" component={ChangePasswordScreen}/>
            <Stack.Screen name="RestaurantLogin" component={RestaurantLoginScreen} />
            <Stack.Screen name="RestaurantDashboard" component={RestaurantDashboard} />
            <Stack.Screen name="ProductManager" component={ProductManagerScreen} />
            <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
            <Stack.Screen name="AdminPanel" component={AdminPanelScreen} />
            <Stack.Screen name="AddRestaurant" component={AddRestaurantScreen} />
            <Stack.Screen name="AdminRestaurantList" component={AdminRestaurantListScreen} />
            <Stack.Screen name="VerificationAdmin" component={VerificationAdminScreen} />

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