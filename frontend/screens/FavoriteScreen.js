import React, { useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { FavoriteContext } from '../context/FavoriteContext';
import { API } from '../services/api'; 
import { useFocusEffect } from '@react-navigation/native';

const FavoritesScreen = () => {
  const { favorites, removeFavorite } = useContext(FavoriteContext);
  const [restaurants, setRestaurants] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const fetchFavDetails = async () => {
        try {
          const res = await API.get('/restaurants/all');
          const filtered = res.data.filter((r) => favorites.includes(r.id));
          setRestaurants(filtered);
        } catch (err) {
          console.log('Eroare la încărcarea restaurantelor:', err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchFavDetails();
    }, [favorites])
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <TouchableOpacity onPress={() => removeFavorite(item.id)}>
          <Icon name="trash-outline" size={22} color="#900" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.emptyText}>Loading favorites...</Text>
      </SafeAreaView>
    );
  }

  if (restaurants.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.emptyText}>You have no favorite restaurants yet.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
        <Text style={styles.title}>FAVORITES</Text>
      <FlatList
        data={restaurants}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default FavoritesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    padding: 20,
  },
  card: {
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 160,
  },
  info: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 60,
    fontSize: 16,
    color: '#888',
  },
  title: {
    fontSize: 24,
    fontWeight: '400',
    marginBottom: 20,
    marginTop: 40,
    paddingLeft: 20,
  },
  
});
