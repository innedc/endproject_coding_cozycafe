import FontAwesome from '@expo/vector-icons/FontAwesome';
import {Tabs} from 'expo-router';   

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="(home)" options={{ headerShown: false, title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}/>
        <Tabs.Screen name="settings" options={{ headerShown: false}} />
    </Tabs>
  );
}