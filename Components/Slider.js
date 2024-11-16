import React, { Component } from 'react';
import { View, Dimensions, StyleSheet, Image,Text } from 'react-native';
import { firestore } from '../Backend/Firebase';  // Import Firebase configuration

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

class Slider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      currentIndex: 0,
      isPortrait: screenHeight > screenWidth,
    };
  }

  componentDidMount() {
    this.fetchSliderImages();
    this.interval = setInterval(this.nextImage, 3000);
    this.orientationSubscription = Dimensions.addEventListener('change', this.handleOrientationChange);
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    if (this.orientationSubscription) {
      this.orientationSubscription.remove(); // Unsubscribe from orientation change
    }
  }

  handleOrientationChange = ({ window }) => {
    const { width, height } = window;
    this.setState({
      isPortrait: height > width,
    });
  };

  nextImage = () => {
    const { currentIndex, images } = this.state;
    const nextIndex = (currentIndex + 1) % images.length;
    this.setState({ currentIndex: nextIndex });
  };

  fetchSliderImages = async () => {
    try {
      const snapshot = await firestore.collection('sliderimages').get(); // Assuming 'sliderimages' is your collection
      const images = snapshot.docs.map((doc) => doc.data().imageUrl); // Assuming your Firestore documents have an 'imageUrl' field
      this.setState({ images });
    } catch (error) {
      console.error('Error fetching slider images:', error);
    }
  };

  render() {
    const { images, currentIndex, isPortrait } = this.state;
    const imageWidth = isPortrait ? screenWidth * 0.9 : screenWidth * 0.7;
    const imageHeight = isPortrait ? 200 : 150;

    return (
      <View style={styles.container}>
        {images.length > 0 ? (
          <View style={styles.sliderContainer}>
            <Image
              source={{ uri: images[currentIndex] }}
              style={[styles.image, { width: imageWidth, height: imageHeight }]}
            />
          </View>
        ) : (
          <Text>Loading...</Text> // Display a loading text or spinner while the images are loading
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    resizeMode: 'cover',
    borderRadius: 10,
  },
});

export default Slider;
