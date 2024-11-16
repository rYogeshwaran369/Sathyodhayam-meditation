import React, { Component } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { firestore } from '../../../Backend/Firebase';
import Menubar from '../../../Components/Menubar';

class Anewsfeed extends Component {
  state = {
    date: '',
    title: '',
    imageUri: '',
    description: '',
  };

  handleSubmit = async () => {
    const { date, title, imageUri, description } = this.state;

    if (date && title && imageUri && description) {
      try {
        await firestore.collection('newsfeed').add({
          date,
          title,
          imageUri,
          description,
        });

        this.setState({
          date: '',
          title: '',
          imageUri: '',
          description: '',
        });

        Alert.alert('Success', 'News feed added successfully');
      } catch (error) {
        console.error('Error adding news feed:', error);
        Alert.alert('Error', 'Failed to add news feed');
      }
    } else {
      Alert.alert('Error', 'Please fill out all fields');
    }
  };

  render() {
    const { date, title, imageUri, description } = this.state;

    return (
      <View style={styles.container}>
        <Menubar />
        <ScrollView contentContainerStyle={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Date"
            value={date}
            onChangeText={(text) => this.setState({ date: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={(text) => this.setState({ title: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Image URL"
            value={imageUri}
            onChangeText={(text) => this.setState({ imageUri: text })}
          />
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Description"
            value={description}
            onChangeText={(text) => this.setState({ description: text })}
            multiline
          />
          <Button title="Submit" onPress={this.handleSubmit} />
        </ScrollView>
      </View>
    );
  }
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  formContainer: {
    // flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 10, // Reduced padding to place form closer to the Menubar
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 15,
    elevation: 5, // Adds shadow for Android
    shadowColor: '#000', // Adds shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    paddingBottom:10
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top', // Ensures text starts at the top for multiline inputs
  },
});

export default Anewsfeed;
