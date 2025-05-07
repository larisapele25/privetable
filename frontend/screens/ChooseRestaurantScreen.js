import React, { useEffect, useState, useCallback, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../services/api';
import Icon from 'react-native-vector-icons/Ionicons';
import { FavoriteContext } from '../context/FavoriteContext';

const ChooseRestaurantScreen = ({ navigation }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const { favorites, addFavorite, removeFavorite } = useContext(FavoriteContext);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await API.get('/restaurants/all');
        setRestaurants(response.data);
      } catch (error) {
        console.error('Failed to fetch restaurants:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const toggleFavorite = useCallback((restaurantId) => {
    if (favorites.includes(restaurantId)) {
      removeFavorite(restaurantId);
    } else {
      addFavorite(restaurantId);
    }
  }, [favorites]);

  const filteredRestaurants = restaurants.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderRestaurant = ({ item }) => {
    const isFavorite = favorites.includes(item.id);

    return (
      <TouchableOpacity
        style={[
          styles.card,
          selectedRestaurant?.id === item.id && styles.selectedCard,
        ]}
        onPress={() => setSelectedRestaurant(item)}
      >
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.image}
          onError={() => console.log(`Image failed: ${item.imageUrl}`)}
        />
        <View style={styles.cardFooter}>
          <Text style={styles.name}>{item.name}</Text>
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation(); // prevenim propagarea către card
              toggleFavorite(item.id);
            }}
          >
            <Icon
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color="#f00"
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="black" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>CHOOSE A RESTAURANT</Text>

      <TextInput
        placeholder="Search restaurants..."
        value={search}
        onChangeText={setSearch}
        style={styles.searchBar}
      />

      <FlatList
        data={filteredRestaurants}
        renderItem={renderRestaurant}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        initialNumToRender={5}
      />

      {selectedRestaurant && (
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate('SelectDateTime', {
              restaurant: selectedRestaurant,
            })
          }
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default ChooseRestaurantScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '400',
    marginBottom: 20,
    marginTop: 40,
    paddingLeft: 20,
  },
  searchBar: {
    backgroundColor: '#eee',
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#f2f2f2',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  selectedCard: {
    borderColor: 'black',
    borderWidth: 2,
  },
  image: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  button: {
    backgroundColor: 'black',
    padding: 14,
    borderRadius: 10,
    marginHorizontal: 20,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
