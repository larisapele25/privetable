import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import MainTabNavigator from './navigation/MainTabNavigator';
import { FavoriteProvider } from './context/FavoriteContext';
import ChangePasswordScreen from './screens/ChangePasswordScreen';
import VerificationScreen from './screens/VerificationScreen';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <FavoriteProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          <Stack.Screen name="Verification" component={VerificationScreen}/>
          <Stack.Screen name="ChangePassword" component={ChangePasswordScreen}/>
         
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
  );
}
