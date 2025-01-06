import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const CafeDetails = () => {
  const { id } = useLocalSearchParams() as { id: string };
  const [status, setStatus] = useState<string>('Yet to Visit'); // Default status
  const [isDropdownVisible, setIsDropdownVisible] = useState(false); // Dropdown visibility state
  const [isAdded, setIsAdded] = useState(false); // Whether the cafe is added to the list
  const [isLoading, setIsLoading] = useState(true);
  const [cafe, setCafe] = useState<any>(null);

  // Load the saved cafe lists from AsyncStorage
  useEffect(() => {
    const fetchCafeDetails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://endproject-coding.onrender.com/cafes/${id}`);
        if (!response.ok) throw new Error('Error fetching cafe details');
        const data = await response.json();
        setCafe(data);
      } catch (error) {
        console.error("Error loading cafe details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const loadCafeLists = async () => {
      try {
        const cafeLists = await AsyncStorage.getItem('cafeLists');
        const lists = cafeLists ? JSON.parse(cafeLists) : {};
        // Check if this cafe exists in any list
        if (lists[id]) {
          setStatus(lists[id]); // Set the saved status for this cafe
          setIsAdded(true); // Mark it as added
        }
      } catch (error) {
        console.error("Error loading cafe lists:", error);
      }
    };

    if (id) {
      fetchCafeDetails();
      loadCafeLists();
    }
  }, [id]);

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus); // Update the status to the new one immediately
    setIsDropdownVisible(false); // Close the dropdown after selection
    console.log(`Status changed to: ${newStatus}`); // Log status change
  };
  const handleButtonClick = async () => {
    if (status && !isAdded) {
      // Add cafe to the selected status list
      setIsAdded(true);
      try {
        const cafeLists = await AsyncStorage.getItem('cafeLists');
        const lists = cafeLists ? JSON.parse(cafeLists) : {};
        // Save cafe to the selected list
        lists[id] = status;
        await AsyncStorage.setItem('cafeLists', JSON.stringify(lists));
        console.log(`Cafe with ID: ${id} added to the ${status} list.`); // Log cafe added to list
      } catch (error) {
        console.error("Error saving cafe status:", error);
      }
    } else if (isAdded) {
      // If already added, remove it from the list
      setIsAdded(false);
      try {
        const cafeLists = await AsyncStorage.getItem('cafeLists');
        const lists = cafeLists ? JSON.parse(cafeLists) : {};
        // Remove the cafe from the selected list
        delete lists[id];
        await AsyncStorage.setItem('cafeLists', JSON.stringify(lists));
        console.log(`Cafe with ID: ${id} removed from the list.`); // Log cafe removed from list
      } catch (error) {
        console.error("Error removing cafe status:", error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {cafe ? (
          <>
            {/* Title */}
            <Text style={styles.header}>{cafe.title}</Text>

            {/* Location */}
            <Text style={styles.location}>{cafe.location}</Text>

            {/* Price and Rating */}
            <View style={styles.infoContainer}>
              <View>
                <Text style={styles.infoText}>Price: {cafe.price}</Text>
                <Text style={styles.infoText}>Rating: {cafe.rating}</Text>
              </View>

              {/* Opening Hours Box */}
              <View style={styles.openingHoursContainer}>
                <Text style={styles.openingHoursTitle}>Opening Hours</Text>
                <Text style={styles.openingHours}>{cafe.hours}</Text>
              </View>
            </View>

            {/* Status Button */}
            <View style={styles.statusContainer}>
              <TouchableOpacity
                style={[styles.statusButton, isAdded && styles.addedButton]} // Apply the "addedButton" style if isAdded is true
                onPress={handleButtonClick}
              >
                <Text style={styles.statusText}>{status}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setIsDropdownVisible(!isDropdownVisible)}
              >
                <Ionicons
                  name={isDropdownVisible ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color="#000"
                  style={styles.arrowIcon}
                />
              </TouchableOpacity>

              {isDropdownVisible && (
                <View style={styles.dropdownMenu}>
                  {['Yet to Visit', 'Visited', 'With friends', 'Reading spots'].map((list) => (
                    <TouchableOpacity
                      key={list}
                      style={styles.dropdownItem}
                      onPress={() => handleStatusChange(list)}
                    >
                      <Text style={styles.dropdownText}>{list}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </>
        ) : (
          <Text>No cafe details available.</Text>
        )}
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
