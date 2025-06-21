import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import AddSpotScreen from '../screens/AddSpotScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SpotDetailsScreen from '../screens/SpotDetailsScreen'; // ✅ new

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// ⬇️ Bottom Tabs
const Tabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;
        if (route.name === 'Home') iconName = 'home';
        else if (route.name === 'Add Spot') iconName = 'add-circle';
        else if (route.name === 'Profile') iconName = 'person';

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#007AFF',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Add Spot" component={AddSpotScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

// ⬇️ Main Navigation Container with Stack (for details)
const TabNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Bottom Tabs as Main */}
        <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
        
        {/* Details Page */}
        <Stack.Screen name="SpotDetails" component={SpotDetailsScreen} options={{ title: 'Spot Details' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default TabNavigator;
