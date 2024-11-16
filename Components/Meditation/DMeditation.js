import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
const { width } = Dimensions.get('window'); // Get the device's width

class DMeditationOptions extends Component {
  render() {
    const { imageUri, title,navigation,target } = this.props; // Access the imageUri and title from props

    return (
      <View style={styles.cardContainer}>
        <Image source={{ uri: imageUri }} style={styles.cardImage} />
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>{title}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row', // Arrange image and text side by side
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    width: width - 20, // Make the card full width, with some padding
    alignSelf: 'center', // Center the card horizontally
    shadowColor: '#000', // Optional shadow for Android
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Optional shadow for iOS
  },
  cardImage: {
    width: 80, // Set width for the image
    height: 80, // Set height for the image
    borderRadius: 40, // Make the image circular
    marginRight: 15, // Space between the image and text
  },
  cardTextContainer: {
    justifyContent: 'center', // Vertically align the text
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default DMeditationOptions;
