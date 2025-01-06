import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, StyleSheet, TouchableOpacity, ScrollView, Image, Button, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://endproject-coding.onrender.com';

const SettingsScreen = () => {
  const userId = '67597b129dc37967a2979c75'; // Replace with actual user ID
  const [username, setUsername] = useState<string>('');
  const [newUsername, setNewUsername] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false); // To control edit mode

  const [cafeLists, setCafeLists] = useState<{ [key: string]: any[] }>({});

  // Fetch the current username and cafe lists when the component mounts
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await fetch(`${API_URL}/users/${userId}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setUsername(data.username);
        setNewUsername(data.username);  // Pre-fill the input with the current username
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setIsLoading(false);
      }
    };

    const loadCafeLists = async () => {
      try {
        const cafeLists = await AsyncStorage.getItem('cafeLists');
        const lists = cafeLists ? JSON.parse(cafeLists) : {};
        setCafeLists(lists); // Set the cafe lists into state
      } catch (error) {
        console.error("Error loading cafe lists:", error);
      }
    };

    fetchUsername();
    loadCafeLists();
  }, []);

  // Handle username change
  const handleUsernameChange = async () => {
    if (!newUsername) {
      setError('Username cannot be empty');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: newUsername }),
      });

      if (!response.ok) {
        throw new Error('Failed to update username');
      }

      // Update the username in the UI
      setUsername(newUsername);
      setIsEditing(false); // Exit edit mode
      setError(null); // Clear error if update was successful
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  // Loading and error handling states
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Error: {error}</Text>
      </SafeAreaView>
    );
  }

  // Calculate total cafes
  const calculateTotalCafes = () => {
    return Object.values(cafeLists).reduce((total, cafes: any[]) => total + cafes.length, 0);
  };

  // Render cafe list titles with count
  const renderCafeListTitles = () => {
    const statuses = ['Yet to Visit', 'Visited', 'With friends', 'Reading spots'];
    return statuses.map((status, index) => {
      const cafes = cafeLists[status] || [];
      return (
        <View key={index} style={styles.statusContainer}>
          <Text style={styles.statusTitle}>{status}</Text>
          <Text>{cafes.length} cafes</Text>
        </View>
      );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Username and cafe count containers side by side */}
      <View style={styles.profileContainer}>
        {/* Username display */}
        <View style={styles.usernameContainer}>
          <Text style={styles.usernameText}>{username}</Text>
          <Button title="Edit" 
          onPress={() => setIsEditing(true)} 
          color="#5D3023" 
          />
        </View>
  
        {/* Cafe count display */}
        <View style={styles.cafeCountContainer}>
          <Text style={styles.cafeCountNumber}>{calculateTotalCafes()}</Text>
          <Text style={styles.cafeCountText}>cafes saved</Text>
        </View>
      </View>
  
      {/* Username edit input */}
      {isEditing && (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.input}
            value={newUsername}
            onChangeText={setNewUsername}
            placeholder="Enter new username"
          />
          <Button title="Save" 
          onPress={handleUsernameChange} 
          color="#5D3023" 
          />
          <Button title="Cancel" 
          onPress={() => setIsEditing(false)} 
          color="#5D3023" 
          />
        </View>
      )}

      {/* Title "Your cafes" with underline */}
      <Text style={styles.cafeListTitle}>Your lists</Text>
  
      {/* Display cafe list titles in a 2x2 grid */}
      <View style={styles.gridContainer}>
        {/* First Row */}
        <View style={styles.row}>
          {renderCafeListTitles().slice(0, 2)} {/* First two items */}
        </View>
        {/* Second Row */}
        <View style={styles.row}>
          {renderCafeListTitles().slice(2, 4)} {/* Next two items */}
        </View>
      </View>
  
      {/* Display error message */}
      {error && <Text style={styles.error}>{error}</Text>}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#BA977E',
    padding: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 50,
    width: '100%',
    paddingHorizontal: 40,
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cafeCountContainer: {
    alignItems: 'center',
    marginLeft: 40,
  },
  cafeCountNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cafeCountText: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  usernameText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  editContainer: {
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    width: '100%',
    paddingLeft: 10,
  },
  listsContainer: {
    width: '100%',
  },
  statusContainer: {
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    width: '45%',  // Width set to 45% for each box
    height: 100,   // Set a consistent height
    alignSelf: 'center',  // Center boxes
    justifyContent: 'center', // Center the text vertically
    alignItems: 'center',  // Center the text horizontally
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',  // Center title horizontally
  },
  gridContainer: {
    width: '100%',
    marginTop: 10,
    paddingHorizontal: 40,
    flexDirection: 'column', // Align boxes in a column
    alignItems: 'center',    // Center the content
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  cafeListTitle: {
    fontSize: 22,
    marginTop: 50,
    textDecorationLine: 'underline',
    alignSelf: 'flex-start',
    marginLeft: 40,
  },
});


export default SettingsScreen;
