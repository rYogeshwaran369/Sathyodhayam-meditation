import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, Modal } from 'react-native';
import { WebView } from 'react-native-webview';

class VoiceCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardSize: this.calculateCardSize(),
      showWebView: false,  // State to toggle WebView visibility
    };
  }

  componentDidMount() {
    this.subscription = Dimensions.addEventListener("change", this.handleDimensionsChange);
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
    const { width, height } = Dimensions.get('window');
    const isLandscape = width > height;
    const numColumns = isLandscape ? 5 : 3; // More columns in landscape mode
    const cardSize = width / numColumns - 15; // Adjust padding/margin

    return cardSize;
  }

  toggleWebView = () => {
    this.setState({ showWebView: !this.state.showWebView });
  };

  render() {
    const { imageUrl, description, webViewUrl } = this.props;
    const { cardSize, showWebView } = this.state;

    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.toggleWebView}>
          <View style={[styles.card, { width: cardSize-10, height: cardSize + 20 }]}>
            <View style={[styles.imageContainer, { width: cardSize, height: cardSize }]}>
              <Image source={{ uri: imageUrl }} style={styles.image} />
            </View>
            <Text numberOfLines={2} style={styles.description}>{description}</Text>
          </View>
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
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 5,
    elevation: 1,
    overflow: 'hidden',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // Ensures the image fills the entire card without extra space
  },
  description: {
    padding: 5,
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
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
    zIndex:2
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  webView: {
    marginTop:'3%',
    width: 300,  // WebView takes up the full width of the modal
    height: '100%', // WebView will take up most of the modal height
  },
});

export default VoiceCard;
