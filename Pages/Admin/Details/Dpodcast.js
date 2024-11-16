import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  Alert,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { firestore } from '../../../Backend/Firebase';
import { MaterialIcons } from '@expo/vector-icons';
import Menubar from '../../../Components/Menubar';
import Apodcastcard from '../../../Components/Apodcastcard';

class Dpodcast extends Component {
  state = {
    podcasts: [],
    isLoading: true,
    isModalVisible: false,
    selectedPodcast: null,
    editedTitle: '',
    editedDescription: '',
  };

  componentDidMount() {
    this.fetchPodcasts();
  }

  fetchPodcasts = async () => {
    try {
      const snapshot = await firestore.collection('podcasts').get();
      const podcasts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      this.setState({ podcasts, isLoading: false });
    } catch (error) {
      console.error('Error fetching podcasts:', error);
      Alert.alert('Error', 'Failed to fetch podcasts');
    }
  };

  handleDelete = async (id) => {
    try {
      await firestore.collection('podcasts').doc(id).delete();
      Alert.alert('Success', 'Podcast deleted successfully');
      this.fetchPodcasts(); // Refresh list
    } catch (error) {
      console.error('Error deleting podcast:', error);
      Alert.alert('Error', 'Failed to delete podcast');
    }
  };

  handleEdit = async () => {
    const { editedTitle, editedDescription, selectedPodcast } = this.state;
    try {
      await firestore.collection('podcasts').doc(selectedPodcast.id).update({
        title: editedTitle,
        description: editedDescription,
      });

      Alert.alert('Success', 'Podcast updated successfully');
      this.setState({ isModalVisible: false });
      this.fetchPodcasts(); // Refresh list after update
    } catch (error) {
      console.error('Error updating podcast:', error);
      Alert.alert('Error', 'Failed to update podcast');
    }
  };

  openEditModal = (podcast) => {
    this.setState({
      isModalVisible: true,
      selectedPodcast: podcast,
      editedTitle: podcast.title,
      editedDescription: podcast.description,
    });
  };

  closeModal = () => {
    this.setState({ isModalVisible: false });
  };

  renderPodcast = ({ item }) => (
    <View style={styles.podcastContainer}>
      <Apodcastcard
        key={item.id}
        imageUrl={item.imageUri}
        title={item.title}
        description={item.description}
        duration={item.duration}
        webViewUrl={item.webViewUrl}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => this.handleDelete(item.id)} style={styles.deleteButton}>
          <MaterialIcons name="delete" size={24} color="red" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.openEditModal(item)} style={styles.editButton}>
          <MaterialIcons name="edit" size={24} color="blue" />
        </TouchableOpacity>
      </View>
    </View>
  );

  render() {
    const { podcasts, isLoading, isModalVisible, editedTitle, editedDescription } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <Menubar />
        {isLoading ? (
          <Text style={styles.loading}>Loading...</Text>
        ) : (
          <FlatList
            data={podcasts}
            keyExtractor={(item) => item.id}
            renderItem={this.renderPodcast}
            contentContainerStyle={styles.listContainer}
          />
        )}

        {/* Edit Modal */}
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={this.closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity onPress={this.closeModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>

              <TextInput
                value={editedTitle}
                onChangeText={(text) => this.setState({ editedTitle: text })}
                placeholder="Edit Title"
                style={styles.input}
              />
              <TextInput
                value={editedDescription}
                onChangeText={(text) => this.setState({ editedDescription: text })}
                placeholder="Edit Description"
                style={styles.input}
                multiline
              />

              <TouchableOpacity onPress={this.handleEdit} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
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
    backgroundColor: 'white',
  },
  loading: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  podcastContainer: {
    marginBottom: 15,
    position: 'relative', // To position the buttons correctly
  },
  buttonContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  deleteButton: {
    marginBottom: 10,
  },
  editButton: {},
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 50,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Dpodcast;
