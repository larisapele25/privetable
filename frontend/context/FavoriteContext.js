import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../services/api';

export const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [userId, setUserId] = useState(null);

  // Se apelează automat la pornirea aplicației
  useEffect(() => {
    autoLoginAndLoadFavorites();
  }, []);

  // Autentifică automat dacă există userId salvat
  const autoLoginAndLoadFavorites = async () => {
    try {
      const storedId = await AsyncStorage.getItem('userId');
      if (!storedId) return;

      const userRes = await API.get(`/users/${storedId}`);
      console.log('✅ Utilizator găsit:', userRes.data);
      setUserId(storedId);

      await loadFavorites(storedId);
    } catch (error) {
      console.warn('❌ Autentificare eșuată:', error.message);
      await AsyncStorage.removeItem('userId');
      setUserId(null);
      setFavorites([]);
    }
  };

  // Încarcă favoritele de pe backend
  const loadFavorites = async (id) => {
  try {
    const favRes = await API.get(`/users/${id}/favorites`);
    console.log('✅ Favorites API response:', favRes.data);

    // ACUM favRes.data ESTE direct lista DTO — deci merge direct:
    const favoriteIds = favRes.data.map((r) => r.id);
    setFavorites(favoriteIds);

  } catch (error) {
    console.error('❌ Eroare la încărcarea favoriteleor:', error.message);
    setFavorites([]); // fallback gol
  }
};



  // Adaugă un restaurant la favorite
  const addFavorite = async (restaurantId) => {
    try {
      await API.post(`/users/${userId}/favorites/${restaurantId}`);
      setFavorites((prev) => [...prev, restaurantId]);
    } catch (error) {
      console.error('❌ Eroare la adăugare favorite:', error.message);
    }
  };

  // Șterge un restaurant din favorite
  const removeFavorite = async (restaurantId) => {
    try {
      await API.delete(`/users/${userId}/favorites/${restaurantId}`);
      setFavorites((prev) => prev.filter((id) => id !== restaurantId));
    } catch (error) {
      console.error('❌ Eroare la ștergere favorite:', error.message);
    }
  };

  
  const logout = async () => {
    await AsyncStorage.removeItem('userId');
    setUserId(null);
    setFavorites([]);
    console.log(' Logout – userId și favorite resetate');
  };

  return (
    <FavoriteContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        userId,
        setUserId,
        logout,
        loadFavorites,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};
