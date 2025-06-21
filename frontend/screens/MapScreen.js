import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Image, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Constants from 'expo-constants';

// --- IMPORTANT ---
// Function to get your computer's local IP address
// This is where your backend server is running.
const getBackendUrl = () => {
  const { manifest } = Constants;
  // Use the LAN address from Expo's manifest. Fallback to localhost for web.
  const uri = `http://${manifest.debuggerHost.split(':').shift()}:5000`;
  return uri;
};

// --- Your Category Icons ---
const icons = {
  historical: require('../assets/images/icons/historical.png'),
  nature: require('../assets/images/icons/nature.png'),
  food: require('../assets/images/icons/food.png'),
  adventure: require('../assets/images/icons/adventure.png'),
  default: require('../assets/images/icons/nature.png'), // A fallback icon
};

const MapScreen = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [spots, setSpots] = useState([]); // State to hold spots from the API
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const setupAndFetchSpots = async () => {
      // 1. Get user's location permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        setLoading(false);
        return;
      }

      // 2. Get user's current position
      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);

      // 3. Fetch nearby spots from YOUR backend
      try {
        const backendUrl = getBackendUrl();
        const apiUrl = `${backendUrl}/api/spots/nearby?lat=${location.coords.latitude}&lng=${location.coords.longitude}`;
        
        console.log("Attempting to fetch spots from:", apiUrl); // For debugging
        
        const response = await axios.get(apiUrl);
        
        if (response.data.success) {
          setSpots(response.data.spots);
          console.log("Successfully fetched spots:", response.data.spots.length);
        }
      } catch (error) {
        console.error("Error fetching spots:", error);
        Alert.alert("Error", "Could not connect to the backend server. Make sure it is running.");
      }

      setLoading(false);
    };

    setupAndFetchSpots();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!userLocation) {
    return (
      <View style={styles.loader}>
        <Text>Could not determine location.</Text>
      </View>
    );
  }

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
      showsUserLocation={true}
    >
      {spots.map(spot => (
        <Marker
          key={spot._id} // Use the database _id as the key
          coordinate={{
            latitude: spot.location.coordinates[1], // Latitude is the second element
            longitude: spot.location.coordinates[0], // Longitude is the first
          }}
          title={spot.name}
          onPress={() => navigation.navigate('SpotDetails', { spot })}
        >
          <Image source={icons[spot.category] || icons.default} style={styles.icon} />
        </Marker>
      ))}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: { flex: 1 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  icon: { width: 32, height: 32, resizeMode: 'contain' },
});

export default MapScreen;