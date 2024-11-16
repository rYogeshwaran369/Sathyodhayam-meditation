import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Dimensions, TextInput, Button, Modal, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { firestore } from '../../../Backend/Firebase'; // Ensure firestore is properly imported
import Menubar from '../../../Components/Menubar';

const { width, height } = Dimensions.get('window');

class Duserdetails extends Component {
  state = {
    users: [],
    isEditModalVisible: false,
    selectedUser: null,
    name: '',
    email: '',
    mobile: '',
    address: '',
    userType: '',
    gender: '',
    isDetailModalVisible: false,
    selectedUserDetails: null,
  };

  componentDidMount() {
    this.fetchUserDetails();
  }

  fetchUserDetails = async () => {
    try {
      const snapshot = await firestore.collection('users').get();
      const users = [];

      snapshot.forEach((doc) => {
        users.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      this.setState({ users });
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  handleEdit = (user) => {
    this.setState({
      isEditModalVisible: true,
      selectedUser: user,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      address: user.address,
      userType: user.userType,
      gender: user.gender,
    });
  };

  handleSaveEdit = async () => {
    const { name, email, mobile, address, userType, gender, selectedUser } = this.state;

    if (name && email && mobile && address && userType && gender) {
      try {
        await firestore.collection('users').doc(selectedUser.id).update({
          name,
          email,
          mobile,
          address,
          userType,
          gender,
        });

        this.setState({ isEditModalVisible: false });
        this.fetchUserDetails();
        Alert.alert('Success', 'User details updated successfully');
      } catch (error) {
        console.error('Error updating user:', error);
        Alert.alert('Error', 'Failed to update user details');
      }
    } else {
      Alert.alert('Error', 'Please fill out all fields');
    }
  };

  handleDelete = async (userId) => {
    try {
      await firestore.collection('users').doc(userId).delete();
      this.fetchUserDetails();
      Alert.alert('Success', 'User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      Alert.alert('Error', 'Failed to delete user');
    }
  };

  handleViewDetails = (user) => {
    this.setState({
      isDetailModalVisible: true,
      selectedUserDetails: user,
    });
  };

  render() {
    const { users, isEditModalVisible, name, email, mobile, address, userType, gender, isDetailModalVisible, selectedUserDetails } = this.state;

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Menubar />
        <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('Auserdetails')}>
            <Text style={styles.buttonText}>Add User</Text>
          </TouchableOpacity>
        

        {/* User List */}
        {users.map((user) => (
          <View key={user.id} style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.email}>{user.email}</Text>
              <Text style={styles.mobile}>{user.mobile}</Text>
              <Text style={styles.address}>{user.address}</Text>
              <Text style={styles.userType}>User Type: {user.userType}</Text>
              <Text style={styles.gender}>Gender: {user.gender}</Text>
            </View>
            <View style={styles.iconsContainer}>
              <TouchableOpacity onPress={() => this.handleEdit(user)} style={styles.iconButton}>
                <Icon name="edit" size={20} color="#007bff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.handleDelete(user.id)} style={styles.iconButton}>
                <Icon name="trash" size={20} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Edit Modal */}
        {isEditModalVisible && (
          <Modal
            visible={isEditModalVisible}
            animationType="slide"
            onRequestClose={() => this.setState({ isEditModalVisible: false })}
          >
            <View style={styles.modalContainer}>
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={(text) => this.setState({ name: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={(text) => this.setState({ email: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Mobile"
                value={mobile}
                onChangeText={(text) => this.setState({ mobile: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Address"
                value={address}
                onChangeText={(text) => this.setState({ address: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="User Type"
                value={userType}
                onChangeText={(text) => this.setState({ userType: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Gender"
                value={gender}
                onChangeText={(text) => this.setState({ gender: text })}
              />

              <Button title="Save Changes" onPress={this.handleSaveEdit} />
            </View>
          </Modal>
        )}

        {/* Detail Modal */}
        {isDetailModalVisible && selectedUserDetails && (
          <Modal
            visible={isDetailModalVisible}
            animationType="slide"
            onRequestClose={() => this.setState({ isDetailModalVisible: false })}
          >
            <View style={styles.modalContainer}>
              <Text>Name: {selectedUserDetails.name}</Text>
              <Text>Email: {selectedUserDetails.email}</Text>
              <Text>Mobile: {selectedUserDetails.mobile}</Text>
              <Text>Address: {selectedUserDetails.address}</Text>
              <Text>User Type: {selectedUserDetails.userType}</Text>
              <Text>Gender: {selectedUserDetails.gender}</Text>

              <Button title="Close" onPress={() => this.setState({ isDetailModalVisible: false })} />
            </View>
          </Modal>
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'white',
    padding: 10,
    justifyContent:''
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
  card: {
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    color: '#555',
  },
  mobile: {
    fontSize: 14,
    color: '#555',
  },
  address: {
    fontSize: 14,
    color: '#555',
  },
  userType: {
    fontSize: 14,
    color: '#555',
  },
  gender: {
    fontSize: 14,
    color: '#555',
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconButton: {
    padding: 5,
  },
  modalContainer: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
});

export default Duserdetails;
