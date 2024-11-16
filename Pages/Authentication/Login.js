import React, { Component } from "react";
import { 
  View, Text, StyleSheet, Image, Dimensions, TextInput, TouchableOpacity, ScrollView, Alert 
} from "react-native";
import { Ionicons } from '@expo/vector-icons'; 
import { auth, firestore } from "../../Backend/Firebase";
import * as Device from 'expo-device';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get("window").width,
      screenHeight: Dimensions.get("window").height,
      isLandscape: Dimensions.get("window").width > Dimensions.get("window").height,
      email: "",
      password: "",
      showPassword: false,
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

  // Firebase login method with single-device check
  handleLogin = async () => {
    const { email, password } = this.state;
    const deviceId = Device.deviceName || "Unknown Device"; // Get unique device ID

    try {
      // Sign in with Firebase Authentication
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Check Firestore for existing active session on another device
      const userRef = firestore.collection('sessions').doc(user.uid);
      const doc = await userRef.get();

      if (doc.exists && doc.data().deviceId !== deviceId) {
        // If user already logged in on another device
        Alert.alert(
          'Session Active',
          'You are already logged in on another device. Do you want to log in here instead?',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Yes', 
              onPress: async () => {
                // Update session to this device and log out other session
                await userRef.set({ deviceId, active: true });
                this.props.navigation.navigate("Home");
              }
            },
          ]
        );
      } else {
        // No other device active, or logging in first time
        await userRef.set({ deviceId, active: true });
        Alert.alert('Success', 'Logged in successfully!');
        this.props.navigation.navigate("Home");
      }
    } catch (error) {
      // Handle specific error messages for incorrect email or password
      if (error.code === 'auth/wrong-password') {
        Alert.alert("Login Error", "Incorrect password. Please try again.");
      } else if (error.code === 'auth/user-not-found') {
        Alert.alert("Login Error", "No account found with this email address.");
      } else {
        Alert.alert("Login Error", "Please Check your credentials.");
      }
    }
  };
  render() {
    const {
      screenWidth,
      screenHeight,
      isLandscape,
      email,
      password,
      showPassword,
    } = this.state;

    return (
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.topImage,
            {
              width: isLandscape ? screenWidth * 0.5 : screenWidth * 0.9,
              height: isLandscape ? screenHeight * 0.4 : screenHeight * 0.3,
              marginTop: screenHeight * 0.05,
            },
          ]}
        >
          <Image
            source={{
              uri: "https://res.cloudinary.com/dkkkl3td3/image/upload/v1722784157/Sathyodhayam/mk2lpjcsc1oytupt3fxc.jpg",
            }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        <View
          style={[
            styles.registerForm,
            {
              width: isLandscape ? screenWidth * 0.6 : screenWidth * 0.9,
              padding: screenWidth * 0.05,
              marginTop: screenHeight * 0.05,
            },
          ]}
        >
          <Text style={styles.formTitle}>User Login</Text>
          <Text style={styles.subTitle}>Hey, enter your Login Credentials</Text>

          <TextInput
            placeholder="Email"
            placeholderTextColor="#858585"
            style={styles.inputBox}
            keyboardType="email-address"
            onChangeText={(text) => this.setState({ email: text })}
            value={email}
          />

          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Password"
              placeholderTextColor="#858585"
              style={[styles.inputBox, styles.passwordInput]}
              secureTextEntry={!showPassword}
              onChangeText={(text) => this.setState({ password: text })}
              value={password}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => this.setState({ showPassword: !showPassword })}
            >
              <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="#858585" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={this.handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.troubleLoginText} onPress={() => this.props.navigation.navigate('Forgot')}>
            <Text style={styles.troubleLogin}>Having trouble logging in?</Text>
          </TouchableOpacity>

          <View style={styles.loginNavigation}>
            <Text>
              Don't have an account?{" "}
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}>
                <Text style={styles.loginText}>Register</Text>
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
    borderWidth:0.5
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
  },
  troubleLoginText: {
    marginTop: 10,
    alignItems: "center",
  },
  troubleLogin: {
    color: "#3498db",
    fontWeight: "bold",
  },
});

export default Login;