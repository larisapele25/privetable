import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../services/api';

export const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const init = async () => {
      const id = await AsyncStorage.getItem('userId');
      console.log('loaded userId from AsyncStorage:', id);

      if (id) {
        try {
          const userRes = await API.get(`/users/${id}`);
          console.log('✅ User logat:', userRes.data);
          setUserId(id);

          const favRes = await API.get(`/users/${id}/favorites`);
          setFavorites(favRes.data.map((r) => r.id));
        } catch (err) {
          console.warn('⚠️ User invalid. Șterg userId din AsyncStorage.');
          await AsyncStorage.removeItem('userId');
          setUserId(null);
          setFavorites([]);
        }
      } else {
        console.log('🟡 Niciun user salvat în AsyncStorage.');
      }
    };

    init();
  }, []);

  const addFavorite = async (restaurantId) => {
    await API.post(`/users/${userId}/favorites/${restaurantId}`);
    setFavorites((prev) => [...prev, restaurantId]);
  };

  const removeFavorite = async (restaurantId) => {
    await API.delete(`/users/${userId}/favorites/${restaurantId}`);
    setFavorites((prev) => prev.filter((id) => id !== restaurantId));
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userId');
    setUserId(null);
    setFavorites([]);
    console.log('🚪 Logout complet – userId șters din AsyncStorage');
  };

  return (
    <FavoriteContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        userId,
        logout,
        setUserId,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};
