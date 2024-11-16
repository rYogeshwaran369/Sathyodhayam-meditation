import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, Platform, Dimensions, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons
import { signOut } from 'firebase/auth';
import { auth, firestore } from '../Backend/Firebase'; // Import firestore
import { collection, getDocs } from 'firebase/firestore'; // Firestore functions for collection
import Menubar from '../Components/Menubar';

const { width, height } = Dimensions.get('window'); // Get window dimensions

class UserProfile extends Component {
  state = {
    profileImageUri: 'https://img.freepik.com/free-vector/silhouette-female-yoga-pose-against-mandala-design_1048-13082.jpg?t=st=1731541222~exp=1731544822~hmac=8d4bb9ff5db5bc0cbd35f45cb8e539c49efafdbf7d752bcd32ba5987331e5671&w=826',
    userName: 'Yogeshwaran R',
    userLocation: 'Sivagangai',
    stats: [
      { value: '$00.00', label: 'Dhiyanam', imageUri: 'https://img.freepik.com/free-vector/female-doing-yoga-meditation-mandala-background_1017-38763.jpg?t=st=1731541237~exp=1731544837~hmac=a5602ac005c38708055f018d9b4fc474b983a008a656b8686e289a13efa7e433&w=826' },
      { value: '10', label: 'Thirayadhiyanam', imageUri: 'https://img.freepik.com/free-vector/international-yoga-day-particle-style-woman-doing-lotus-asana_1017-52611.jpg?t=st=1731542691~exp=1731546291~hmac=84437566af5249ce6e31759ec56f488ea42ce0db4367c15000327ad470463d67&w=1380' },
      { value: '$00.00', label: 'Jabam', imageUri: 'https://img.freepik.com/premium-vector/international-yoga-day-vector-illustration-june-21_723055-598.jpg?w=826' }
    ],
    email:'',
    mobile:'',
    userType:''
  };

  componentDidMount() {
    this.fetchUserData();
  }

  // Fetch user data from Firestore collection
  fetchUserData = async () => {
    try {
      const userCollectionRef = collection(firestore, 'users'); // Reference to the 'users' collection
      const querySnapshot = await getDocs(userCollectionRef);

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const userData = doc.data();

          // Assuming you want to fetch the first user's data
          this.setState({
            profileImageUri: userData.profileImageUri || this.state.profileImageUri, // Default if not present
            userName: userData.name || this.state.userName, // Default if not present
            userLocation: userData.address || this.state.userLocation,
            email:userData.email||this.state.email,
            mobile:userData.mobile||this.state.mobile,
            userType:userData.userType||this.state.userType
             // Default if not present
          });
        });
      } else {
        console.log("No users found in the collection!");
      }
    } catch (error) {
      console.error("Error fetching user data: ", error);
      Alert.alert('Error', 'Unable to fetch user data.');
    }
  };

  handleLogout = async () => {
    const { navigation } = this.props; // Access navigation from props
    try {
      await signOut(auth);
      console.log('Logout success');
      navigation.navigate('Login'); // Navigate after successful logout
    } catch (error) {
      console.error('Error signing out: ', error);
      Alert.alert('Logout Error', 'There was a problem logging out. Please try again.');
    }
  };

  render() {
    const gap = height * 0.03; // Adjust this factor to control the gap

    const { profileImageUri, userName, userLocation, stats } = this.state;

    return (
      <ScrollView contentContainerStyle={[styles.container, { paddingTop: gap }]}>
        <Menubar />
        {/* Profile Picture */}
        <View style={styles.profilePictureContainer}>
          <Image source={{ uri: profileImageUri }} style={styles.profilePicture} />
        </View>

        {/* User Info */}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userLocation}>{userLocation}</Text>
        </View>

        {/* User Stats */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <Image source={{ uri: stat.imageUri }} style={styles.statImage} />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Menu Options */}
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem}>
            <Icon name="user" size={20} color="#333" style={styles.icon} />
            <Text style={styles.menuText}>{this.state.email}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Icon name="phone" size={20} color="#333" style={styles.icon} />
            <Text style={styles.menuText}>{this.state.mobile}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Icon name="user-circle" size={20} color="#333" style={styles.icon} />
            <Text style={styles.menuText}>{this.state.userType}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Icon name="address-card" size={20} color="#333" style={styles.icon} />
            <Text style={styles.menuText}>Address: {this.state.userLocation}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.handleLogout} style={styles.menuItem}>
            <Icon name="sign-out" size={20} color="#333" style={styles.icon} />
            <Text style={styles.menuText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: '1%',
  },
  profilePicture: {
    width: width * 0.4, // Responsive width of the image
    height: width * 0.3, // Responsive height of the image (circular)
    borderRadius: width * 0.15, // Responsive border radius to keep it circular
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
  },
  userName: {
    fontSize: width * 0.06, // Responsive font size
    fontWeight: 'bold',
  },
  userLocation: {
    fontSize: width * 0.04, // Responsive font size
    color: '#777',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    padding: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statImage: {
    width: width * 0.1, // Responsive image size for stats
    height: width * 0.1, // Responsive image size for stats
    marginBottom: 5, // Space between the image and text
  },
  statValue: {
    fontSize: width * 0.05, // Responsive font size
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: width * 0.04, // Responsive font size
    color: '#777',
    fontWeight: 'bold', // Added to make the label bold
  },
  menuText: {
    fontSize: width * 0.05, // Responsive font size
    color: '#333',
    fontWeight: 'bold', // Added to make the menu text bold
  },
  menuContainer: {
    marginTop: 20,
    padding: 5, 
    elevation: 4
  },
  menuItem: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  }
});

export default UserProfile;
