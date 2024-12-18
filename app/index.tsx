import { View, Alert, SafeAreaView, TouchableOpacity, Image, StyleSheet, Platform } from 'react-native';
import { Link } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import useMessages from '@/data/messages';
import { useEffect } from 'react';
import {API_URL} from '@/constants/Api'
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
   const router = useRouter();

    useEffect(() => {
        const checkLogin = async () => {
            const userId = await AsyncStorage.getItem('userId');
            if (userId) {
                router.replace('/(tabs)/(home)');
            }
        };
    
        checkLogin();
    }, []);

   const handleGoogleLogin = async () => {
    try {
        const authUrl = `${API_URL}/auth/google`;
        const redirectUrl = AuthSession.makeRedirectUri();

        const result =  await WebBrowser.openAuthSessionAsync(authUrl, redirectUrl);

        if (result.type === 'success' && result.url) {
            // Handle the redirect URL
            const params = new URL(result.url).searchParams;

            // Extract user ID or other parameters (e.g., tokens, profile data)
            const user = params.get('user'); // Replace with the correct parameter from your server's redirect URL
            if (user) {
                // Store the user ID
                await AsyncStorage.setItem('userId', user);

                // Navigate to tabs after successful login
                router.replace('/(tabs)/(home)');
            }
        } else {
            Alert.alert('Authentication canceled or failed');
        }

    } catch (error) {
        console.log(error);
        Alert.alert('Error', 'Failed to authenticate with Google');
    }
}


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => handleGoogleLogin()}>
           <ThemedText type="title">LOGIN WITH GOOGLE</ThemedText>     
        </TouchableOpacity>   
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor:"#ccc",
    flex: 1
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});