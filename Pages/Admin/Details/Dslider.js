import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  SafeAreaView,
  Button,
} from 'react-native';
import { firestore } from '../../../Backend/Firebase';
import { MaterialIcons } from '@expo/vector-icons';
import Menubar from '../../../Components/Menubar';

class Dslider extends Component {
  state = {
    imageUrl: '',
    images: [],
  };

  componentDidMount() {
    this.fetchImages();
  }

  fetchImages = async () => {
    try {
      const snapshot = await firestore.collection('sliderimages').get();
      const images = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      this.setState({ images });
    } catch (error) {
      console.error('Error fetching images:', error);
      Alert.alert('Error', 'Failed to fetch images');
    }
  };

  handleAddImage = async () => {
    const { imageUrl } = this.state;

    if (imageUrl.trim() === '') {
      Alert.alert('Error', 'Image URL cannot be empty');
      return;
    }

    try {
      await firestore.collection('sliderimages').add({ imageUrl });
      this.setState({ imageUrl: '' });
      this.fetchImages(); // Refresh the image list
      Alert.alert('Success', 'Image added successfully');
    } catch (error) {
      console.error('Error adding image:', error);
      Alert.alert('Error', 'Failed to add image');
    }
  };

  handleDeleteImage = async (id) => {
    Alert.alert('Delete', 'Are you sure you want to delete this image?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'OK',
        onPress: async () => {
          try {
            await firestore.collection('sliderimages').doc(id).delete();
            this.fetchImages(); // Refresh the image list
            Alert.alert('Success', 'Image deleted successfully');
          } catch (error) {
            console.error('Error deleting image:', error);
            Alert.alert('Error', 'Failed to delete image');
          }
        },
      },
    ]);
  };

  render() {
    const { imageUrl, images } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <Menubar/>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter image URL"
            value={imageUrl}
            onChangeText={(text) => this.setState({ imageUrl: text })}
          />
          <Button title="Submit" onPress={this.handleAddImage} />
        </View>

        <ScrollView contentContainerStyle={styles.imageList}>
          {images.length > 0 ? (
            images.map((image) => (
              <View key={image.id} style={styles.imageCard}>
                <Image source={{ uri: image.imageUrl }} style={styles.image} />
                <TouchableOpacity
                  style={styles.deleteIcon}
                  onPress={() => this.handleDeleteImage(image.id)}
                >
                  <MaterialIcons name="delete" size={24} color="#F44336" />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.noImagesText}>No images available</Text>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    // paddingHorizontal: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    marginHorizontal:10
},
input: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
    backgroundColor: '#fff',
},
imageList: {
    paddingBottom: 20,
    marginHorizontal:10
},
imageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    padding: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
  },
  deleteIcon: {
    marginLeft: 'auto',
  },
  noImagesText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 20,
  },
});

export default Dslider;
