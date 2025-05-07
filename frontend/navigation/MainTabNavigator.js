import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FavoritesScreen from '../screens/FavoriteScreen';
import ProfileScreen from '../screens/ProfileScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeStack from './HomeStack';
import ProfileStack from './ProfileStack';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'HomeTab') iconName = 'home-outline';
          else if (route.name === 'Favorites') iconName = 'heart-outline';
          else if (route.name === 'Profile') iconName = 'person-outline';

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStack} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Profile" component={ProfileStack} />
     
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
