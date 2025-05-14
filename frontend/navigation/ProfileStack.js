
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/ProfileScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import ChangeEmailScreen from '../screens/ChangeEmailScreen';

const Stack = createNativeStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="ChangeEmail" component ={ChangeEmailScreen} />
    </Stack.Navigator>
  );
};

export default ProfileStack;
