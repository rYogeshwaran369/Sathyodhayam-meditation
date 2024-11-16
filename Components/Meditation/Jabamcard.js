import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';
import { FontAwesome } from '@expo/vector-icons';

class Jabamcard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPlaying: false,
      sound: null,
      duration: 0,
      position: 0,
      screenWidth: Dimensions.get('window').width,
      screenHeight: Dimensions.get('window').height,
    };
  }

  async componentDidMount() {
    const { audioUri } = this.props; // Get audio URI from props
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync({ uri: audioUri });
      const status = await soundObject.getStatusAsync();
      this.setState({ sound: soundObject, duration: status.durationMillis });

      soundObject.setOnPlaybackStatusUpdate(this.updatePosition);
    } catch (error) {
      console.log('Error loading sound:', error);
    }

    this.dimensionsSubscription = Dimensions.addEventListener('change', this.handleDimensionsChange);
  }

  componentWillUnmount() {
    const { sound } = this.state;
    if (sound) {
      sound.unloadAsync();
    }
    if (this.dimensionsSubscription) {
      this.dimensionsSubscription.remove(); // Unsubscribe from the dimensions change event
    }
  }

  handleDimensionsChange = ({ window }) => {
    this.setState({
      screenWidth: window.width,
      screenHeight: window.height,
    });
  };

  updatePosition = (status) => {
    if (status.isLoaded && status.positionMillis !== undefined) {
      this.setState({ position: status.positionMillis });
    }
  };

  togglePlayPause = async () => {
    const { sound, isPlaying } = this.state;

    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      this.setState({ isPlaying: !isPlaying });
    }
  };

  formatTime = (millis) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  render() {
    const { title, imageUri, times } = this.props; // Get title and image URI from props
    const { isPlaying, duration, position, screenWidth } = this.state;
    const progress = duration ? position / duration : 0;

    return (
      <View style={[styles.container, { width: screenWidth * 0.9 }]}>
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
        />
        
        <View style={styles.infoContainer}>
          <Text style={styles.title}>
            {title.length > 20 ? title.substring(0, 20) + '...' : title} {times}
          </Text>
          
          <View style={styles.controlsContainer}>
            <TouchableOpacity onPress={this.togglePlayPause} style={styles.iconContainer}>
              <FontAwesome name={isPlaying ? 'pause' : 'play'} size={18} color="#333" />
            </TouchableOpacity>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1}
              value={progress}
              minimumTrackTintColor="#10357E"
              maximumTrackTintColor="#cccccc"
              onSlidingComplete={async (value) => {
                const { sound, duration } = this.state;
                if (sound && duration) {
                  const newPosition = value * duration;
                  await sound.setPositionAsync(newPosition);
                  this.setState({ position: newPosition });
                }
              }}
            />
          </View>
          <Text style={styles.time}>{this.formatTime(position)} / {this.formatTime(duration)}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'gray',
    borderRadius: 10,
    padding: 8,  // Reduced padding to minimize the size
    marginVertical: 8,  // Reduced margin for compactness
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 5,
    elevation: 1,
    color: 'white'
  },
  image: {
    width: 50,  // Reduced image size
    height: 50,
    borderRadius: 8,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,  // Reduced font size for title
    fontWeight: 'bold',
    color: 'white',
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  iconContainer: {
    marginRight: 10,
  },
  slider: {
    flex: 1,
    height: 15,  // Reduced slider height
  },
  time: {
    fontSize: 10,  // Reduced font size for time
    color: 'white',
    marginTop: 5,
    alignSelf: 'flex-end',
  },
});

export default Jabamcard;
