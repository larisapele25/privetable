import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity, Alert, StyleSheet
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';

export default function ProductManagerScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch('http://192.168.0.234:8080/api/restaurant/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Eroare la încărcare produse');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      Alert.alert('Eroare', err.message || 'Nu s-au putut încărca produsele.');
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.category) {
      Alert.alert('Câmpuri obligatorii', 'Completează numele, prețul și categoria.');
      return;
    }

    const token = await AsyncStorage.getItem('token');
    const url = editId
      ? `http://192.168.0.234:8080/api/restaurant/products/${editId}`
      : `http://192.168.0.234:8080/api/restaurant/products`;

    const method = editId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price),
      }),
    });

    if (res.ok) {
      Alert.alert(editId ? 'Actualizat' : 'Adăugat', 'Produsul a fost salvat.');
      setForm({ name: '', description: '', price: '', category: '' });
      setEditId(null);
      fetchProducts();
    } else {
      Alert.alert('Eroare', 'Produsul nu a putut fi salvat.');
    }
  };

  const handleDelete = (id) => {
    Alert.alert('Confirmare', 'Sigur vrei să ștergi acest produs?', [
      { text: 'Anulează', style: 'cancel' },
      {
        text: 'Șterge',
        style: 'destructive',
        onPress: async () => {
          const token = await AsyncStorage.getItem('token');
          const res = await fetch(`http://192.168.0.234:8080/api/restaurant/products/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            Alert.alert('Șters', 'Produsul a fost eliminat.');
            fetchProducts();
          } else {
            Alert.alert('Eroare', 'Produsul nu a putut fi șters.');
          }
        },
      },
    ]);
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
    });
    setEditId(item.id);
  };

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>

            <Text style={styles.title}>GESTIONARE PRODUSE</Text>

            {['name', 'description', 'price', 'category'].map((field) => (
              <TextInput
                key={field}
                placeholder={
                  field === 'name' ? 'Nume produs' :
                  field === 'description' ? 'Descriere' :
                  field === 'price' ? 'Preț' : 'Categorie'
                }
                style={styles.input}
                keyboardType={field === 'price' ? 'numeric' : 'default'}
                value={form[field]}
                onChangeText={(text) => setForm({ ...form, [field]: text })}
              />
            ))}

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>{editId ? 'Actualizează' : 'Adaugă produs'}</Text>
            </TouchableOpacity>
          </>
        }
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.productBox}>
            <Text style={styles.productTitle}>{item.name} - {item.price} RON</Text>
            <Text style={styles.productDesc}>{item.category} | {item.description}</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleEdit(item)}>
                <Feather name="edit" size={20} color="#333" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)} style={{ marginLeft: 20 }}>
                <MaterialIcons name="delete" size={22} color="#333" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  backButton: {
    marginTop: 50,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  title: { fontSize: 22, fontWeight: '500', marginBottom: 16, textAlign: 'center' },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 10, marginBottom: 10,
  },
  button: {
    backgroundColor: '#000', padding: 12,
    borderRadius: 8, marginBottom: 20,
  },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
  productBox: {
    padding: 14, borderWidth: 1, borderColor: '#eee',
    borderRadius: 10, marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  productTitle: { fontWeight: 'bold', fontSize: 16 },
  productDesc: { color: '#555', marginVertical: 4 },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 6,
  },
});
