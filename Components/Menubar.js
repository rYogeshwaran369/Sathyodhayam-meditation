import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, StyleSheet, Platform, SafeAreaView, StatusBar, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the hamburger icon
import { signOut } from 'firebase/auth';
import { auth } from '../Backend/Firebase';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

const { width: screenWidth } = Dimensions.get('window');

const Menubar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // State to track if the user is an admin
  const navigation = useNavigation(); // Get the navigation object using useNavigation

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser?.email === 'admin@gmail.com') {
      setIsAdmin(true); // Set admin state to true if the email matches
    }
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('logout success');
      navigation.navigate('Login'); // Now you can use navigate
    } catch (error) {
      console.error('Error signing out: ', error);
      Alert.alert('Logout Error', 'There was a problem logging out. Please try again.');
    }
  };

  const handleProfile = () => {
    navigation.navigate('Userprofile');
  };

  const handleMeditation = () => {
    navigation.navigate('Meditation');
  };

  const handleAdmin = () => {
    navigation.navigate('Adminmenu'); // Navigate to Admin Panel
  };

  // Toggle the visibility of the hamburger menu
  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topbarContainer}>
        {/* Left side - Logo */}
        <View style={styles.leftContainer}>
          <Image
            source={{
              uri: 'https://res.cloudinary.com/dkkkl3td3/image/upload/v1722829874/vayqnwazm9xtrmffrkqp.png',
            }}
            style={styles.logo}
          />
        </View>

        {/* Right side - Hamburger Menu Button */}
        <View style={styles.rightContainer}>
          <TouchableOpacity onPress={toggleMenu}>
            {/* Using the hamburger icon from MaterialIcons */}
            <Icon name="menu" size={30} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Hamburger Menu - Conditional Rendering */}
      {isMenuOpen && (
        <View style={styles.menuContainer}>
          {isAdmin && ( // Display Admin menu if isAdmin is true
            <TouchableOpacity style={styles.menuItem} onPress={handleAdmin}>
              <Text style={styles.menuText}>Admin</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.menuItem} onPress={handleMeditation}>
            <Text style={styles.menuText}>Meditation</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleProfile}>
            <Text style={styles.menuText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <Text style={styles.menuText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight, // Add margin for Android StatusBar
  },
  topbarContainer: {
    width: screenWidth,
    height: Platform.OS === 'ios' ? 60 : 50, // Adjust height based on platform
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  leftContainer: {
    flex: 1,
  },
  logo: {
    width: 100, // Adjust size as necessary
    height: 40,
    resizeMode: 'contain',
  },
  rightContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    position: 'absolute',
    top: 60, // Just below the top bar
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    width: screenWidth * 0.5, // Adjust width of the menu
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 10, // Ensures menu is above other elements
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  menuText: {
    fontSize: 18,
    color: '#333',
  },
});

export default Menubar;
