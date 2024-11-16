import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For the like icon

const { width, height } = Dimensions.get('window');

export default class Newscard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      liked: false, // State for like button
    };
  }

  toggleExpand = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  toggleLike = () => {
    this.setState({ liked: !this.state.liked });
  };

  render() {
    const { expanded, liked } = this.state;
    const { date, title, imageUri, description } = this.props;

    return (
      <View style={styles.container}>
        {/* Box for Image */}
        <View style={styles.imageBox}>
          <Image
            source={{ uri: imageUri }} // Use the imageUri passed from props
            style={styles.newsImage}
            resizeMode="cover"
          />
        </View>

        {/* Date and Title */}
        <View style={styles.textContainer}>
          <Text style={styles.date}>{date}</Text>
          <View style={styles.titleContainer}>
            <TouchableOpacity onPress={this.toggleExpand} style={styles.titleBox}>
              <Text style={styles.title}>{title}</Text>
            </TouchableOpacity>
            {/* Like button */}
            <TouchableOpacity onPress={this.toggleLike} style={styles.likeButton}>
              <Ionicons name={liked ? 'heart' : 'heart-outline'} size={24} color="red" />
            </TouchableOpacity>
          </View>
          {expanded && (
            <Text style={styles.description}>
              {description} {/* Display the description passed from props */}
            </Text>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5, // For Android shadow
  },
  imageBox: {
    width: width - 20,
    height: width * 0.5, // Adjust height based on screen width
    padding:'3.2%',
    borderRadius: 10,
},
newsImage: {
    width: '100%',
    height: '100%',
    padding:3,
    borderRadius: 10,
  },
  textContainer: {
    padding: 10,
  },
  date: {
    fontSize: 12,
    color: '#777',
    fontWeight: 'bold',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  titleBox: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  likeButton: {
    padding: 5,
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginTop: 10,
    fontWeight: 'bold',
  },
});
