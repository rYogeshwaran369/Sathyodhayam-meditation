import React, { Component } from "react";
import { View, Text, StyleSheet, Image, Dimensions, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from '@expo/vector-icons';
import { auth, firestore } from "../../Backend/Firebase";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get("window").width,
      screenHeight: Dimensions.get("window").height,
      isLandscape: Dimensions.get("window").width > Dimensions.get("window").height,

      name: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
      address: "",
      gender: "",
      showPassword: false,
      showConfirmPassword: false,
    };
  }

  componentDidMount() {
    const handleDimensionsChange = () => {
      const { width, height } = Dimensions.get("window");
      this.setState({
        screenWidth: width,
        screenHeight: height,
        isLandscape: width > height,
      });
    };

    this.subscription = Dimensions.addEventListener("change", handleDimensionsChange);
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.remove();
    }
  }

  // Handle Sign Up
  handleSignUp = async () => {
    const { email, password, name, mobile, address, gender, confirmPassword } = this.state;
  
    // Validate inputs
    if (!name || !email || !mobile || !password || !confirmPassword || !address || !gender) {
      Alert.alert('Error', 'Please fill in all fields!');
      return;
    }
  
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match!');
      return;
    }
  
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long!');
      return;
    }
  
    // Check if email format is valid
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address!');
      return;
    }
  
    try {
      // Register user in Firebase Authentication
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
  
      // Store additional user data in Firestore
      await firestore.collection('users').doc(user.uid).set({
        name,
        email,
        mobile,
        address,
        gender,
        createdAt: new Date(),
      });
  
      Alert.alert('Success', 'Account created successfully!');
  
      // Clear form fields
      this.setState({
        name: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
        address: "",
        gender: "",
        showPassword: false,
        showConfirmPassword: false
      });
  
      // Navigate to login screen after successful registration
      this.props.navigation.navigate("Login");
  
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert(
          'Email Already Registered',
          'The email address is already in use by another account. Would you like to go to the login page?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Go to Login', onPress: () => this.props.navigation.navigate("Login") }
          ]
        );
      } else {
        console.error("Error signing up:", error);
        Alert.alert('Registration Error', error.message);
      }
    }
  };
  

  render() {
    const {
      screenWidth,
      screenHeight,
      isLandscape,
      name,
      email,
      mobile,
      password,
      confirmPassword,
      address,
      gender,
      showPassword,
      showConfirmPassword
    } = this.state;

    return (
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={[styles.topImage, { width: isLandscape ? screenWidth * 0.5 : screenWidth * 0.9, height: isLandscape ? screenHeight * 0.4 : screenHeight * 0.3, marginTop: screenHeight * 0.05 }]} >
          <Image source={{ uri: "https://res.cloudinary.com/dkkkl3td3/image/upload/v1722784157/Sathyodhayam/mk2lpjcsc1oytupt3fxc.jpg" }} style={styles.image} resizeMode="cover" />
        </View>

        <View style={[styles.registerForm, { width: isLandscape ? screenWidth * 0.6 : screenWidth * 0.9, padding: screenWidth * 0.05, marginTop: screenHeight * 0.05 }]} >
          <Text style={styles.formTitle}>User Sign Up</Text>
          <Text style={styles.subTitle}>Hey, enter your details to create your new account</Text>

          <TextInput placeholder="Name" placeholderTextColor="#858585" style={styles.inputBox} onChangeText={(text) => this.setState({ name: text })} value={name} />
          <TextInput placeholder="Email" placeholderTextColor="#858585" style={styles.inputBox} keyboardType="email-address" onChangeText={(text) => this.setState({ email: text })} value={email} />
          <TextInput placeholder="Mobile" placeholderTextColor="#858585" style={styles.inputBox} keyboardType="phone-pad" onChangeText={(text) => this.setState({ mobile: text })} value={mobile} />

          <View style={styles.passwordContainer}>
            <TextInput placeholder="Password" placeholderTextColor="#858585" style={[styles.inputBox, styles.passwordInput]} secureTextEntry={!showPassword} onChangeText={(text) => this.setState({ password: text })} value={password} />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => this.setState({ showPassword: !showPassword })}>
              <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="#858585" />
            </TouchableOpacity>
          </View>

          <View style={styles.passwordContainer}>
            <TextInput placeholder="Confirm Password" placeholderTextColor="#858585" style={[styles.inputBox, styles.passwordInput]} secureTextEntry={!showConfirmPassword} onChangeText={(text) => this.setState({ confirmPassword: text })} value={confirmPassword} />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => this.setState({ showConfirmPassword: !showConfirmPassword })}>
              <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={24} color="#858585" />
            </TouchableOpacity>
          </View>

          <TextInput placeholder="Address" placeholderTextColor="#858585" style={styles.inputBox} onChangeText={(text) => this.setState({ address: text })} value={address} />

          <Picker selectedValue={gender} onValueChange={(itemValue) => this.setState({ gender: itemValue })} style={styles.inputBox}>
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
            <Picker.Item label="Other" value="other" />
          </Picker>

          <TouchableOpacity style={styles.button} onPress={this.handleSignUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          <View style={styles.loginNavigation}>
            <Text>Already have an account?{" "}
              <TouchableOpacity onPress={() => this.props.navigation.navigate("Login")}>
                <Text style={styles.loginText}>Login</Text>
              </TouchableOpacity>
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 20, // To prevent content from getting cut off at the bottom
    backgroundColor:'white'
  },
  topImage: {
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  registerForm: {
    flex: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:'white'
  },
  formTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: "black",
  },
  inputBox: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 15,
    paddingLeft: 15,
    fontSize: 16,
    borderColor:"black",
    borderWidth:0.5,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },
  passwordInput: {
    paddingRight: 40, // Add space for the icon
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
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
  loginNavigation: {
    marginTop: 20,
  },
  loginText: {
    fontWeight: "bold",
    fontSize: 16,
    // color: "#4CAF50",
  },
});

export default Register;