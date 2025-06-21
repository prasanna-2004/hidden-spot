import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  TextInput,
  Button,
  Switch,
  FlatList,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import axios from 'axios';

const { width } = Dimensions.get('window');

const SpotDetailsScreen = ({ route }) => {
  const { spot } = route.params;
  const carouselRef = useRef(null);

  const [comments, setComments] = useState([]);
  const [authorName, setAuthorName] = useState('');
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  // 🔁 Fetch comments
  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://<your-ip>:5000/api/comments/${spot._id}`);
      setComments(res.data.comments);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  // ➕ Post comment
  const submitComment = async () => {
    if (!comment.trim()) return;

    try {
      await axios.post(`http://<your-ip>:5000/api/comments`, {
        authorName: isAnonymous ? 'Anonymous' : authorName || 'Guest',
        isAnonymous,
        comment,
        spotId: spot._id,
      });

      setComment('');
      setAuthorName('');
      setIsAnonymous(false);
      fetchComments(); // Refresh after submitting
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* 📸 Image Carousel */}
      <Carousel
    loop={false} // Set to true if you want it to loop
    width={width}
    height={250}
    data={[spot.imageUrl]}
    renderItem={({ item }) => (
        <Image source={{ uri: item }} style={styles.image} />
    )}
/>

      {/* 📍 Spot Info */}
      <View style={styles.info}>
        <Text style={styles.title}>{spot.title}</Text>
        <Text style={styles.category}>{spot.category}</Text>
        <Text style={styles.story}>{spot.story}</Text>
      </View>

      {/* ⭐ Community Ratings */}
      <View style={styles.ratingSection}>
        <Text style={styles.subTitle}>Community Ratings</Text>

        <Text style={styles.label}>Vibe</Text>
        <StarRatingDisplay rating={4.5} starSize={20} />

        <Text style={styles.label}>Safety</Text>
        <StarRatingDisplay rating={4} starSize={20} />

        <Text style={styles.label}>Uniqueness</Text>
        <StarRatingDisplay rating={4.8} starSize={20} />

        <Text style={styles.label}>Crowd</Text>
        <StarRatingDisplay rating={3} starSize={20} />
      </View>

      {/* 💬 Comments Section */}
      <View style={styles.commentSection}>
        <Text style={styles.subTitle}>Comments</Text>

        {/* 🔄 List */}
        {comments.map((item) => (
          <View key={item._id} style={styles.comment}>
            <Text style={styles.commentUser}>{item.isAnonymous ? 'Anonymous' : item.authorName}:</Text>
            <Text style={styles.commentText}>{item.comment}</Text>
          </View>
        ))}

        {/* ➕ New Comment Input */}
        {!isAnonymous && (
          <TextInput
            placeholder="Your name"
            value={authorName}
            onChangeText={setAuthorName}
            style={styles.input}
          />
        )}
        <TextInput
          placeholder="Write a comment..."
          value={comment}
          onChangeText={setComment}
          style={styles.input}
        />

        <View style={styles.toggleRow}>
          <Text>Comment Anonymously</Text>
          <Switch value={isAnonymous} onValueChange={setIsAnonymous} />
        </View>

        <Button title="Post Comment" onPress={submitComment} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  image: { width: '100%', height: 250, resizeMode: 'cover' },
  info: { padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold' },
  category: { fontSize: 16, color: '#888', marginBottom: 8 },
  story: { fontSize: 16, lineHeight: 22 },

  ratingSection: { paddingHorizontal: 16, marginTop: 20 },
  subTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  label: { marginTop: 10, fontWeight: '500' },

  commentSection: { paddingHorizontal: 16, marginTop: 30, marginBottom: 50 },
  comment: { flexDirection: 'row', marginBottom: 8 },
  commentUser: { fontWeight: 'bold', marginRight: 4 },
  commentText: { flex: 1 },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default SpotDetailsScreen;
