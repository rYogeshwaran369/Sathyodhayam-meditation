import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Modal,
  TextInput,
  Button,
} from 'react-native';
import { firestore } from '../../../Backend/Firebase';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import Menubar from '../../../Components/Menubar';

class Dnewsfeed extends Component {
  state = {
    newsfeed: [],
    modalVisible: false,
    selectedNews: null,
    updatedTitle: '',
    updatedDate: '',
    updatedDescription: '',
    updatedImageUri: '',
  };

  componentDidMount() {
    this.fetchNewsfeed();
  }

  fetchNewsfeed = async () => {
    try {
      const snapshot = await firestore.collection('newsfeed').get();
      const newsfeed = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      this.setState({ newsfeed });
    } catch (error) {
      console.error('Error fetching newsfeed:', error);
      Alert.alert('Error', 'Failed to fetch newsfeed');
    }
  };

  openEditModal = (news) => {
    this.setState({
      modalVisible: true,
      selectedNews: news.id,
      updatedTitle: news.title,
      updatedDate: news.date,
      updatedDescription: news.description,
      updatedImageUri: news.imageUri,
    });
  };

  handleEdit = async () => {
    const { selectedNews, updatedTitle, updatedDate, updatedDescription, updatedImageUri } = this.state;

    try {
      await firestore.collection('newsfeed').doc(selectedNews).update({
        title: updatedTitle,
        date: updatedDate,
        description: updatedDescription,
        imageUri: updatedImageUri,
      });

      this.setState({ modalVisible: false, selectedNews: null });
      this.fetchNewsfeed(); // Refresh the newsfeed list
      Alert.alert('Success', 'Newsfeed updated successfully');
    } catch (error) {
      console.error('Error updating newsfeed:', error);
      Alert.alert('Error', 'Failed to update newsfeed');
    }
  };

  handleDelete = async (id) => {
    Alert.alert('Delete', 'Are you sure you want to delete this newsfeed?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'OK',
        onPress: async () => {
          try {
            await firestore.collection('newsfeed').doc(id).delete();
            Alert.alert('Success', 'Newsfeed deleted successfully');
            this.fetchNewsfeed(); // Refresh the list after deletion
          } catch (error) {
            console.error('Error deleting newsfeed:', error);
            Alert.alert('Error', 'Failed to delete newsfeed');
          }
        },
      },
    ]);
  };

  renderNewsfeedItem = (item) => (
    <View key={item.id} style={styles.card}>
      <Image source={{ uri: item.imageUri }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.date}>{item.date}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => this.openEditModal(item)}>
            <AntDesign name="edit" size={24} color="#4CAF50" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.handleDelete(item.id)}>
            <MaterialIcons name="delete" size={24} color="#F44336" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  render() {
    const { newsfeed, modalVisible, updatedTitle, updatedDate, updatedDescription, updatedImageUri } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <Menubar/>
        <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('Anewsfeed')}>
            <Text style={styles.buttonText}>Add News Feed</Text>
          </TouchableOpacity>
        <ScrollView contentContainerStyle={styles.scrollView}>
          {newsfeed.length > 0 ? (
            newsfeed.map(this.renderNewsfeedItem)
          ) : (
            <Text style={styles.noDataText}>No newsfeed available</Text>
          )}
        </ScrollView>

        {/* Edit Modal */}
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Newsfeed</Text>
              <TextInput
                style={styles.input}
                placeholder="Title"
                value={updatedTitle}
                onChangeText={(text) => this.setState({ updatedTitle: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Date"
                value={updatedDate}
                onChangeText={(text) => this.setState({ updatedDate: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Description"
                value={updatedDescription}
                onChangeText={(text) => this.setState({ updatedDescription: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Image URL"
                value={updatedImageUri}
                onChangeText={(text) => this.setState({ updatedImageUri: text })}
              />
              <View style={styles.modalButtonContainer}>
                <Button title="Save" onPress={this.handleEdit} />
                <Button
                  title="Cancel"
                  color="red"
                  onPress={() => this.setState({ modalVisible: false })}
                />
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollView: {
    padding: 15,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    padding: 10,
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  date: {
    fontSize: 12,
    color: '#777',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 70,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 50,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  button: {
    backgroundColor: "#10357E",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Dnewsfeed;
