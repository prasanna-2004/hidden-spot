import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, Image, StyleSheet, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import axios from 'axios';

const AddSpotScreen = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [story, setStory] = useState('');
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);

  // Get user location on mount
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  // Pick an image from gallery
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  // Submit spot to backend
  const submitSpot = async () => {
    if (!title || !category || !story || !location || !image) {
      Alert.alert('Please fill all fields and select an image.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('story', story);
    formData.append('latitude', location.latitude);
    formData.append('longitude', location.longitude);

    // Append image
    formData.append('image', {
      uri: image.uri,
      name: 'spot.jpg',
      type: 'image/jpeg',
    });

    try {
      const response = await axios.post('http://<49.43.228.30>:5000/api/spots/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      Alert.alert('Spot submitted successfully!');
    } catch (error) {
      console.error(error);
      Alert.alert('Error uploading spot.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        placeholder="Title"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        placeholder="Category"
        style={styles.input}
        value={category}
        onChangeText={setCategory}
      />
      <TextInput
        placeholder="Story"
        style={[styles.input, { height: 100 }]}
        multiline
        value={story}
        onChangeText={setStory}
      />

      <Button title="Pick Image" onPress={pickImage} />
      {image && <Image source={{ uri: image.uri }} style={styles.image} />}

      <Button title="Submit Spot" onPress={submitSpot} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    alignItems: 'stretch',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 12,
  },
});

export default AddSpotScreen;
