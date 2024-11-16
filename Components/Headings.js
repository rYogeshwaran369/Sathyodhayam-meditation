import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

class Headings extends Component {
  render() {
    const { subtitle, title, onPress, navigation, targetScreen, Viewm } = this.props; // Receive navigation and targetScreen

    const handlePress = () => {
      // Check if targetScreen is provided and navigate to it
      if (targetScreen) {
        navigation.navigate(targetScreen);
      }
    };

    return (
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          <Text style={styles.subtitle}>{subtitle}</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
        <TouchableOpacity style={styles.rightContainer} onPress={handlePress}>
          <Text style={styles.linkText}>{Viewm}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Space out left and right components
    alignItems: 'center', // Align vertically
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    marginTop:'3%'
  },
  leftContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start', // Align left text to the left
    flex: 1, // Ensures it takes available space
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  rightContainer: {
    alignItems: 'flex-end', // Align "View More" to the right
    padding: 5,
    justifyContent: 'center', // Ensure it's vertically centered
  },
  linkText: {
    fontSize: 14,
    color: '#007bff', // Blue color for "View More" link
    fontWeight: 'bold',
  },
});

export default Headings;
