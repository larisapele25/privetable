import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../services/api';



const SelectDateTimeScreen = ({ route }) => {
  const { restaurant } = route.params;
  console.log('Params:', route.params);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [numPersons, setNumPersons] = useState('2');
  const [hour, setHour] = useState('');
  const [duration, setDuration] = useState('1');
  const [maxDurationForSelectedHour, setMaxDurationForSelectedHour] = useState(3);

  const [availableSlots, setAvailableSlots] = useState([]); 
  const [showPersonsPicker, setShowPersonsPicker] = useState(false);
  const [showHourPicker, setShowHourPicker] = useState(false);
  const [showDurationPicker, setShowDurationPicker] = useState(false);

  const [userId, setUserId] = useState(null);

  const closeAll = () => {
    setShowDatePicker(false);
    setShowPersonsPicker(false);
    setShowHourPicker(false);
    setShowDurationPicker(false);
  };

  const formatDateForAPI = (date) => {
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    const loadUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      if (id) setUserId(id);
    };
    loadUserId();
  }, []);

  useEffect(() => {
    const fetchAvailableTimes = async () => {
      if (!restaurant?.id || !selectedDate || !numPersons) return;

      try {
        const res = await API.get('/reservations/availability', {
          params: {
            restaurantId: restaurant.id,
            date: formatDateForAPI(selectedDate),
            nrPeople: parseInt(numPersons),
          },
        });

        setAvailableSlots(res.data);

        // Dacă ora selectată nu mai există, o resetăm
        const stillAvailable = res.data.find((slot) => slot.time === hour);
        if (!stillAvailable) {
          setHour('');
          setDuration('1');
        } else {
          setMaxDurationForSelectedHour(stillAvailable.maxDuration);
        }
      } catch (err) {
        console.log('Failed to fetch availability:', err.message);
        setAvailableSlots([]);
        setHour('');
      }
    };

    fetchAvailableTimes();
  }, [selectedDate, numPersons]);

  const handleReservation = async () => {
    if (!hour) {
      Alert.alert('Select time', 'Please select an available hour first.');
      return;
    }
  
    const selectedDateTime = new Date(`${formatDateForAPI(selectedDate)}T${hour}`);
    const now = new Date();
  
    if (selectedDateTime < now) {
      Alert.alert('Invalid Date', 'You cannot book a reservation in the past.');
      return;
    }
  
    if (!userId) {
      Alert.alert('Error', 'User ID not found. Please log in again.');
      return;
    }
  
    try {
      const dateTime = `${formatDateForAPI(selectedDate)}T${hour}`;
  
      await API.post('/reservations/create', null, {
        params: {
          userId,
          restaurantId: restaurant.id,
          dateTime,
          nrPeople: parseInt(numPersons),
          duration: parseInt(duration),
        },
      });
  
      Alert.alert(
        'Reservation Confirmed',
        `Restaurant: ${restaurant.name}\nDate: ${selectedDate.toDateString()}\nHour: ${hour}\nPeople: ${numPersons}\nDuration: ${duration}h`
      );
    } catch (err) {
      console.log('Booking error:', err?.response?.data || err.message); 
      Alert.alert(
        'Error',
        'The reservation could not be made. Please check if you already have one during the same time slot.'
      );
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.titleLeft}>SELECT DATE & TIME</Text>

        {/* Date */}
        <TouchableOpacity style={styles.selectBox} onPress={() => { closeAll(); setShowDatePicker(true); }}>
          <Text>{selectedDate.toDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(e, date) => {
              if (date) setSelectedDate(date);
              setShowDatePicker(false);
            }}
          />
        )}

        {/* Persons */}
        <Text style={styles.label}>Persons</Text>
        <TouchableOpacity style={styles.selectBox} onPress={() => { closeAll(); setShowPersonsPicker(true); }}>
          <Text>{numPersons} persons</Text>
        </TouchableOpacity>
        {showPersonsPicker && (
          <View style={styles.picker}>
            <Picker
              selectedValue={numPersons}
              onValueChange={(value) => {
                setNumPersons(value);
                setShowPersonsPicker(false);
              }}
            >
              {[...Array(10).keys()].map((n) => (
                <Picker.Item key={n + 1} label={`${n + 1}`} value={`${n + 1}`} />
              ))}
            </Picker>
          </View>
        )}

        {/* Hour */}
        <Text style={styles.label}>Hour</Text>
        <TouchableOpacity style={styles.selectBox} onPress={() => { closeAll(); setShowHourPicker(true); }}>
          <Text>{hour ? `${hour} (up to ${maxDurationForSelectedHour}h)` : 'Select hour'}</Text>
        </TouchableOpacity>
        {showHourPicker && (
          <View style={styles.picker}>
            <Picker
              selectedValue={hour}
              onValueChange={(value, index) => {
                const selected = availableSlots.find(slot => slot.time === value);
                setHour(value);
                setMaxDurationForSelectedHour(selected.maxDuration);
                if (parseInt(duration) > selected.maxDuration) {
                  setDuration(selected.maxDuration.toString());
                }
                setShowHourPicker(false);
              }}
            >
              {availableSlots.length === 0 ? (
                <Picker.Item label="No available hours" value="" />
              ) : (
                availableSlots.map((slot) => (
                  <Picker.Item
                    key={slot.time}
                    label={`${slot.time} (max ${slot.maxDuration}h)`}
                    value={slot.time}
                  />
                ))
              )}
            </Picker>
          </View>
        )}

        {/* Duration */}
        <Text style={styles.label}>Duration</Text>
        <TouchableOpacity style={styles.selectBox} onPress={() => { closeAll(); setShowDurationPicker(true); }}>
          <Text>{duration} hour(s)</Text>
        </TouchableOpacity>
        {showDurationPicker && (
          <View style={styles.picker}>
            <Picker
              selectedValue={duration}
              onValueChange={(value) => {
                setDuration(value);
                setShowDurationPicker(false);
              }}
            >
              {[...Array(maxDurationForSelectedHour).keys()].map((n) => (
                <Picker.Item key={n + 1} label={`${n + 1} hour${n + 1 > 1 ? 's' : ''}`} value={`${n + 1}`} />
              ))}
            </Picker>
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={handleReservation}>
          <Text style={styles.buttonText}>Reserve</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SelectDateTimeScreen;



const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { justifyContent: 'center', alignItems: 'center', paddingVertical: 40 },
  titleLeft: { fontSize: 24, fontWeight: '400', alignSelf: 'flex-start',  marginBottom: 20,
    marginTop: 20,
    paddingLeft: 20,},
  label: { alignSelf: 'flex-start', marginLeft: 40, marginTop: 20, fontWeight: '600' },
  selectBox: { width: '80%', backgroundColor: '#eee', padding: 12, borderRadius: 8, marginTop: 10 },
  picker: { width: '80%', backgroundColor: '#eee', borderRadius: 8, marginTop: 5 },
  button: { marginTop: 30, backgroundColor: 'black', paddingVertical: 14, paddingHorizontal: 60, borderRadius: 10 },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
