import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { firestore } from '../../../Backend/Firebase'; // Assuming Firebase setup
import { MaterialIcons } from '@expo/vector-icons';
import Menubar from '../../../Components/Menubar';

class Adhiyanam extends Component {
  state = {
    imageUrl: '',
    title: '',
    count: '',
    songUrl: '',
  };

  // Function to handle form submission
  handleSubmit = async () => {
    const { imageUrl, title, count, songUrl } = this.state;

    // Simple form validation
    if (!imageUrl || !title || !count || !songUrl) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      // Add data to Firestore
      await firestore.collection('dhiyanam').add({
        imageUrl,
        title,
        count: Number(count),
        songUrl,
      });

      Alert.alert('Success', 'Data submitted successfully');
      this.setState({
        imageUrl: '',
        title: '',
        count: '',
        songUrl: '',
      });
    } catch (error) {
      console.error('Error submitting data:', error);
      Alert.alert('Error', 'Failed to submit data');
    }
  };

  render() {
    const { imageUrl, title, count, songUrl } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <Menubar />

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Image URL Input */}
          <TextInput
            value={imageUrl}
            onChangeText={(text) => this.setState({ imageUrl: text })}
            placeholder="Image URL"
            style={styles.input}
          />

          {/* Title Input */}
          <TextInput
            value={title}
            onChangeText={(text) => this.setState({ title: text })}
            placeholder="Title"
            style={styles.input}
          />

          {/* Count Input */}
          <TextInput
            value={count}
            onChangeText={(text) => this.setState({ count: text })}
            placeholder="Count"
            style={styles.input}
            keyboardType="numeric"
          />

          {/* Song URL Input */}
          <TextInput
            value={songUrl}
            onChangeText={(text) => this.setState({ songUrl: text })}
            placeholder="Song URL"
            style={styles.input}
          />

          {/* Submit Button */}
          <TouchableOpacity onPress={this.handleSubmit} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    marginRight: 10,
  },
});

export default Adhiyanam;
