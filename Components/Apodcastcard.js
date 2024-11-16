import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, Modal } from 'react-native';
import { WebView } from 'react-native-webview';

class Apodcastcard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardSize: this.calculateCardSize(),
      showWebView: false,  // State to toggle WebView visibility
    };
  }

  componentDidMount() {
    this.subscription = Dimensions.addEventListener('change', this.handleDimensionsChange);
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.remove();
    }
  }

  handleDimensionsChange = () => {
    this.setState({ cardSize: this.calculateCardSize() });
  };

  calculateCardSize() {
    const { width } = Dimensions.get('window');
    const cardSize = width /2.7; // Adjust padding/margin
    return cardSize;
  }

  toggleWebView = () => {
    this.setState({ showWebView: !this.state.showWebView });
  };

  render() {
    const { imageUrl, title,description, duration, webViewUrl } = this.props;
    const { cardSize, showWebView } = this.state;

    return (
      <View style={[styles.card, { width: cardSize, height: cardSize * 1 }]}>
        <TouchableOpacity onPress={this.toggleWebView}>
          <View style={styles.contentContainer}>
            <Image source={{ uri: imageUrl }} style={styles.image} />
           
          </View>
          <Text numberOfLines={2} style={styles.title}>{title}</Text>
          <Text style={styles.duration}>{duration}</Text>
        </TouchableOpacity>

        {/* Modal to show WebView */}
        <Modal
          visible={showWebView}
          animationType="slide"
          transparent={true}
          onRequestClose={this.toggleWebView}  // Close modal when the back button is pressed (on Android)
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity onPress={this.toggleWebView} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>

              {/* Ensure WebView has proper styling to take up enough space */}
              <WebView 
                source={{ uri: webViewUrl }} 
                style={styles.webView}
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 10, // Space around the card
    padding: 10, // Inner padding
    elevation: 1,
    borderColor: 'black',
    borderWidth: 0.6,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5, // Space between title and image row
  },
  image: {
    width: 112, // Small image size
    height: 60,
    borderRadius: 8,
    resizeMode: 'cover',
    marginRight: 10, // Space between image and textContainer
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5, // Space below the title
  },
  description: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 10, // Space between image row and description
    
  },
  duration: {
    fontSize: 10,
    color: 'black',
    marginTop: 5, // Space between duration and image
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: '90%',
    height: '60%', // Make the modal content larger
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 50,
    zIndex: 2,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  webView: {
    marginTop: '3%',
    width: 300,  // WebView takes up the full width of the modal
    height: '100%', // WebView will take up most of the modal height
  },
});

export default Apodcastcard;
