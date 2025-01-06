import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Link } from 'expo-router';

interface Cafe {
  _id: string;
  title: string;
  location?: string;
  price?: number;
  rating?: number;
}

const Home: React.FC = () => {
  const [data, setData] = useState<Cafe[] | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://endproject-coding.onrender.com/cafes');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error(error);
        setIsError(true);
      }
    };
    fetchData();
  }, []);

  if (isError) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text>Error loading cafés. Please try again later.</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!data) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Welcome</Text>
        {data.map((cafe) => (
          <TouchableOpacity key={cafe._id} style={styles.cafeItem}>
            <Link href={`/cafedetails/${cafe._id}`}>
              <Text style={styles.title}>{cafe.title}</Text>
            </Link>
            <Text>{cafe.location || 'N/A'}</Text>
            <Text>Price: {cafe.price ? cafe.price.toString() : 'N/A'}</Text>
            <Text>Rating: {cafe.rating ? cafe.rating.toString() : 'N/A'}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#BA977E',
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    color: '#fff',
  },
  cafeItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 20,
  },
});

export default Home;