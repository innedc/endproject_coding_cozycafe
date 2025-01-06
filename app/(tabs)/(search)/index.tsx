import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, StyleSheet, TextInput, ScrollView, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Link } from 'expo-router';
import useCafes from '@/data/cafes';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SearchScreen() {
  const { data, isLoading, isError } = useCafes();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState<{ _id: string; title: string; location: string; price: string; rating: string }[]>([]);
  const [lastViewed, setLastViewed] = useState<{ _id: string; title: string; location: string; price: string; rating: string }[]>([]);

  useEffect(() => {
    if (data) {
      setFilteredData(
        data.filter((cafe: { title: string }) =>
          cafe.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [data, searchTerm]);

  useEffect(() => {
    const fetchLastViewed = async () => {
      const storedLastViewed = await AsyncStorage.getItem('lastViewed');
      if (storedLastViewed) {
        setLastViewed(JSON.parse(storedLastViewed));
      }
    };

    fetchLastViewed();
  }, []);

  const handleCafeClick = async (cafe: { _id: string; title: string; location: string; price: string; rating: string }) => {
    const updatedLastViewed = [
      { title: cafe.title, location: cafe.location, price: cafe.price, rating: cafe.rating, _id: cafe._id },
      ...lastViewed.filter(item => item._id !== cafe._id)
    ].slice(0, 3);
    setLastViewed(updatedLastViewed);

    // Store the updated last viewed list in AsyncStorage
    await AsyncStorage.setItem('lastViewed', JSON.stringify(updatedLastViewed));
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <ThemedText>Loading...</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <ThemedText>Error loading cafés. Please try again later.</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TextInput
          style={styles.SearchBar}
          placeholder="Search cafés..."
          placeholderTextColor="#7B7878" // Customize the color of the placeholder
          value={searchTerm}
          onChangeText={setSearchTerm}
        />

        {searchTerm && (
          <View style={styles.searchResultsContainer}>
            <ScrollView contentContainerStyle={styles.searchResults}>
              {filteredData.map((cafe) => (
                <View key={cafe._id} style={styles.cafeItem}>
                  {/* Make the cafe title clickable and navigate to the details page */}
                  <Link href={`/cafedetails/${cafe._id}`} style={styles.title} onPress={() => handleCafeClick(cafe)}>
                    {cafe.title}
                  </Link>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Last Viewed Section */}
        <View style={styles.lastViewedSection}>
          <ThemedText type="title" style={styles.lastViewedTitle} >Last Viewed Cafés</ThemedText>
          <ScrollView contentContainerStyle={styles.scrollView}>
            {lastViewed.length > 0 ? (
              lastViewed.map((cafe) => (
                <View key={cafe._id} style={styles.cafeItem}>
                  {/* Wrap each cafe title in the Link to navigate to the detail page */}
                  <Link href={`/cafedetails/${cafe._id}`} style={styles.title}>
                    {cafe.title}
                  </Link>
                  <Text>{cafe.location}</Text>
                  <Text>Price: {cafe.price}</Text>
                  <Text>Rating: {cafe.rating}</Text>
                </View>
              ))
            ) : (
              <Text>No recently viewed cafes</Text>
            )}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#BA977E',
    flex: 1,
  },

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
  },

  SearchBar: {
    height: 40,
    backgroundColor: '#fff',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    marginTop: 20,
    width: '100%',
  },

  searchResultsContainer: {
    position: 'absolute',
    top: 80,
    left: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    zIndex: 10,
    maxHeight: 300,
  },

  searchResults: {
    paddingVertical: 5,
    width: '100%',
  },

  cafeItem: {
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  lastViewedSection: {
    width: '100%',
    padding: 10,
  },

  scrollView: {
    width: '100%',
  },
  
  lastViewedTitle: {
    color: '#fff', // Set the color of the title to white
    fontSize: 28,   // You can also adjust the font size if needed
    fontWeight: 'bold', // Make the title bold (optional)
    marginBottom: 20,  // Add space between the title and the list of cafes
  },
});