import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { firestore } from '../../../Backend/Firebase';
import Menubar from '../../../Components/Menubar';

class Apodcast extends Component {
  state = {
    imageUri: '',
    title: '',
    duration: '',
    webViewUrl: '',
    description: '',
  };

  handleSubmit = async () => {
    const { imageUri, title, duration, webViewUrl, description } = this.state;

    if (imageUri && title && duration && webViewUrl && description) {
      try {
        await firestore.collection('podcasts').add({
          imageUri,
          title,
          duration,
          webViewUrl,
          description,
        });

        this.setState({
          imageUri: '',
          title: '',
          duration: '',
          webViewUrl: '',
          description: '',
        });

        Alert.alert('Success', 'Podcast added successfully');
      } catch (error) {
        console.error('Error adding podcast:', error);
        Alert.alert('Error', 'Failed to add podcast');
      }
    } else {
      Alert.alert('Error', 'All fields are required');
    }
  };

  render() {
    const { imageUri, title, duration, webViewUrl, description } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <Menubar/>
        <ScrollView contentContainerStyle={styles.formContainer}>
          <Text style={styles.heading}>Add Podcast</Text>

          <TextInput
            style={styles.input}
            placeholder="Image URI"
            value={imageUri}
            onChangeText={(text) => this.setState({ imageUri: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={(text) => this.setState({ title: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Duration (e.g., 00:30:00)"
            value={duration}
            onChangeText={(text) => this.setState({ duration: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Web View URL"
            value={webViewUrl}
            onChangeText={(text) => this.setState({ webViewUrl: text })}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description"
            value={description}
            onChangeText={(text) => this.setState({ description: text })}
            multiline
          />

          <Button title="Submit" onPress={this.handleSubmit} />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  formContainer: {
    flexGrow: 1,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
});

export default Apodcast;
