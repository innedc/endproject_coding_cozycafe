import { View, SafeAreaView, Image, StyleSheet, Platform } from 'react-native';
import { Link } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import useMessages from '@/data/messages';
import useCafes from '@/data/cafes';

export default function HomeScreen() {
  const { data, isLoading, isError } = useCafes();

  console.log(data);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <ThemedText>Loading...</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

   return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ThemedText type="title">Home</ThemedText>
        <Link href="/details">View details</Link>
        {data.map((message: any) => (
          <ThemedText key={message._id}>{message.text}</ThemedText>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#ccc',
    flex: 1,
  },
 
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
