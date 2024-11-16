import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Modal,
  TextInput,
  Button,
} from 'react-native';
import { firestore } from '../../../Backend/Firebase'; // Assuming Firebase setup
import { MaterialIcons } from '@expo/vector-icons';
import Jabamcard from '../../../Components/Meditation/Jabamcard'; // Assuming the component exists
import Menubar from '../../../Components/Menubar';

class Ddhirayadhiyanam extends Component {
  state = {
    dhiyanams: [],
    isLoading: true,
    isModalVisible: false,
    selectedDhiyanam: null,
    title: '',
    imageUrl: '',
    songUrl: '',
    times: '',
  };

  // Function to fetch data from Firestore
  componentDidMount() {
    this.fetchDhiyanams();
  }

  fetchDhiyanams = async () => {
    try {
      const snapshot = await firestore.collection('thirayadhiyanam').get();
      const dhiyanams = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      this.setState({ dhiyanams, isLoading: false });
    } catch (error) {
      console.error('Error fetching dhiyanams:', error);
      Alert.alert('Error', 'Failed to fetch dhiyanams');
    }
  };

  // Function to handle delete
  handleDelete = async (id) => {
    try {
      await firestore.collection('thirayadhiyanam').doc(id).delete();
      Alert.alert('Success', 'Dhiyanam deleted successfully');
      this.fetchDhiyanams(); // Refresh the list
    } catch (error) {
      console.error('Error deleting dhiyanam:', error);
      Alert.alert('Error', 'Failed to delete dhiyanam');
    }
  };

  // Function to handle edit
  handleEdit = (item) => {
    this.setState({
      isModalVisible: true,
      selectedDhiyanam: item,
      title: item.title,
      imageUrl: item.imageUrl,
      songUrl: item.songUrl,
      times: item.times,
    });
  };

  // Function to handle saving the edited dhiyanam
  handleSave = async () => {
    const { title, imageUrl, songUrl, times, selectedDhiyanam } = this.state;
    if (!title || !imageUrl || !songUrl || !times) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      await firestore.collection('thirayadhiyanam').doc(selectedDhiyanam.id).update({
        title,
        imageUrl,
        songUrl,
        times,
      });
      Alert.alert('Success', 'Dhiyanam updated successfully');
      this.fetchDhiyanams(); // Refresh the list
      this.setState({ isModalVisible: false });
    } catch (error) {
      console.error('Error updating dhiyanam:', error);
      Alert.alert('Error', 'Failed to update dhiyanam');
    }
  };

  renderDhiyanam = ({ item }) => (
    <View style={styles.cardContainer}>
      <Jabamcard
        key={item.id}
        title={item.title}
        imageUri={item.imageUrl}
        audioUri={item.songUrl}
        times={item.times}
      />
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => this.handleEdit(item)} style={styles.iconButton}>
          <MaterialIcons name="edit" size={24} color="blue" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.handleDelete(item.id)} style={styles.iconButton}>
          <MaterialIcons name="delete" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  render() {
    const { dhiyanams, isLoading, isModalVisible, title, imageUrl, songUrl, times } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <Menubar />
        <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('Athirayadhiyanam')}>
            <Text style={styles.buttonText}>Add Thirayadhiyanam</Text>
          </TouchableOpacity>

        {isLoading ? (
          <Text style={styles.loading}>Loading...</Text>
        ) : (
          <FlatList
            data={dhiyanams}
            keyExtractor={(item) => item.id}
            renderItem={this.renderDhiyanam}
            contentContainerStyle={styles.listContainer}
          />
        )}

        {/* Edit Modal */}
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => this.setState({ isModalVisible: false })}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Edit Thirayadhiyanam</Text>

              <TextInput
                style={styles.input}
                placeholder="Title"
                value={title}
                onChangeText={(text) => this.setState({ title: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Image URL"
                value={imageUrl}
                onChangeText={(text) => this.setState({ imageUrl: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Song URL"
                value={songUrl}
                onChangeText={(text) => this.setState({ songUrl: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Times"
                value={times}
                onChangeText={(text) => this.setState({ times: text })}
              />

              <Button title="Save" onPress={this.handleSave} />
              <Button
                title="Cancel"
                onPress={() => this.setState({ isModalVisible: false })}
                color="gray"
              />
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
  cardContainer: {
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    width: '100%',
    paddingHorizontal: 20,
  },
  iconButton: {
    padding: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
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

export default Ddhirayadhiyanam;
