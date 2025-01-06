import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const API_URL = 'https://endproject-coding.onrender.com/cafes';

const CafeDetails = () => {
  const { id } = useLocalSearchParams() as { id: string };
  const [status, setStatus] = useState<string>('Yet to Visit');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cafe, setCafe] = useState<any>(null);

  // Fetch cafe details from the API
  const fetchCafeDetails = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) throw new Error('Failed to fetch cafe details');
      const data = await response.json();
      setCafe(data);
    } catch (error) {
      console.error('Error fetching cafe details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load cafe status from AsyncStorage
  const loadCafeLists = async () => {
    try {
      const cafeLists = await AsyncStorage.getItem('cafeLists');
      const lists = cafeLists ? JSON.parse(cafeLists) : {};
      if (lists[id]) {
        setStatus(lists[id]);
        setIsAdded(true);
      }
    } catch (error) {
      console.error('Error loading cafe lists:', error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCafeDetails();
      loadCafeLists();
    }
  }, [id]);

  // Handle button click to add or remove cafe from the list
  const handleButtonClick = async () => {
    try {
      const cafeLists = await AsyncStorage.getItem('cafeLists');
      const lists = cafeLists ? JSON.parse(cafeLists) : {};
      if (isAdded) {
        delete lists[id];
        setStatus('Yet to Visit');
        setIsAdded(false);
      } else {
        lists[id] = status;
        setIsAdded(true);
      }
      await AsyncStorage.setItem('cafeLists', JSON.stringify(lists));
    } catch (error) {
      console.error('Error updating cafe lists:', error);
    }
  };

  // Handle status change from dropdown menu
  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus);
    setIsDropdownVisible(false);
    try {
      const cafeLists = await AsyncStorage.getItem('cafeLists');
      const lists = cafeLists ? JSON.parse(cafeLists) : {};
      lists[id] = newStatus;
      await AsyncStorage.setItem('cafeLists', JSON.stringify(lists));
    } catch (error) {
      console.error('Error updating cafe status:', error);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="#BA977E" />
      </SafeAreaView>
    );
  }

  if (!cafe) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text>No cafe details available.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>{cafe.title}</Text>
        <Text style={styles.location}>{cafe.location}</Text>
        <View style={styles.infoContainer}>
          <View>
            <Text style={styles.infoText}>Price: {cafe.price}</Text>
            <Text style={styles.infoText}>Rating: {cafe.rating}</Text>
          </View>
          <View style={styles.openingHoursContainer}>
            <Text style={styles.openingHoursTitle}>Opening Hours</Text>
            <Text style={styles.openingHours}>{cafe.hours}</Text>
          </View>
        </View>
        <View style={styles.statusContainer}>
          <TouchableOpacity
            style={[styles.statusButton, isAdded && styles.addedButton]}
            onPress={handleButtonClick}
          >
            <Text style={styles.statusText}>{status}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setIsDropdownVisible(!isDropdownVisible)}
          >
            <Ionicons name={isDropdownVisible ? 'chevron-up' : 'chevron-down'} size={16} color="#000" />
          </TouchableOpacity>
          {isDropdownVisible && (
            <View style={styles.dropdownMenu}>
              {['Yet to Visit', 'Visited', 'With friends', 'Reading spots'].map((list) => (
                <TouchableOpacity key={list} style={styles.dropdownItem} onPress={() => handleStatusChange(list)}>
                  <Text style={styles.dropdownText}>{list}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#BA977E',
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 40,
    width: '100%',
  },
  location: {
    fontSize: 18,
    marginBottom: 10,
    width: '100%',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
    marginVertical: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 8,
  },
  openingHoursContainer: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    width: '55%',
    marginLeft: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  openingHoursTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  openingHours: {
    fontSize: 16,
    marginTop: 4,
    textAlign: 'center',
  },
  statusContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#BA977E',
    backgroundColor: '#fff',
  },
  addedButton: {
    backgroundColor: '#5D3023',
  },
  statusText: {
    fontSize: 16,
    color: '#000',
  },
  dropdownButton: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#BA977E',
  },
  arrowIcon: {
    marginLeft: 10,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 42,
    left: 0,
    width: 182,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingVertical: 5,
    zIndex: 1,
    borderWidth: 1,
    borderColor: '#BA977E',
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  dropdownText: {
    fontSize: 16,
    color: '#000',
  },
});

export default CafeDetails;
