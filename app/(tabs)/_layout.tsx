import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react';

export default function TabLayout() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getUserId = async () => {
      const user = await AsyncStorage.getItem('userId');
      if (user) {
        const parsedUser = JSON.parse(user);
        const userId = parsedUser.id;
        setUserId(userId);
      }
    };
    getUserId();
  }, []);

  if (!userId) {
    return null;
  }

  return (
    <Tabs>
      <Tabs.Screen 
        name="(home)" 
        initialParams={{ userId }} 
        options={{
          headerShown: false, 
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
          tabBarStyle: { backgroundColor: '#5D3023' }, // Customize the tab bar background color
          tabBarActiveTintColor: '#fff', // Active tab icon color
          tabBarInactiveTintColor: '#BA977E', // Inactive tab icon color
        }} 
      />
      <Tabs.Screen 
        name="(search)" 
        options={{
          headerShown: false, 
          title: 'Search',
          tabBarStyle: { backgroundColor: '#5D3023' },
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: '#BA977E',
          tabBarIcon: (tabInfo) => {
            return (<Ionicons 
              name="search" 
              size={28} 
              color={tabInfo.color}
            />);
          }
        }} 
      />
      <Tabs.Screen 
        name="(add)" 
        options={{
          headerShown: false, 
          title: 'Add',
          tabBarStyle: { backgroundColor: '#5D3023' },
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: '#BA977E',
          tabBarIcon: (tabInfo) => {
            return (<Ionicons 
              name="add-circle" 
              size={28} 
              color={tabInfo.color}
            />);
          }
        }} 
      />
      <Tabs.Screen 
        name="(profile)" 
        options={{
          headerShown: false,
          tabBarStyle: { backgroundColor: '#5D3023' },
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: '#BA977E',
          tabBarIcon: (tabInfo) => {
            return (<FontAwesome 
              name="user" 
              size={28} 
              color={tabInfo.color}
            />);
          }
        }} 
      />
    </Tabs>
  );
}