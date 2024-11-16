import React, { Component } from "react";
import { 
  View, Text, StyleSheet, Image, Dimensions, TextInput, TouchableOpacity, ScrollView, Alert 
} from "react-native";
import { resetPassword } from "../../Backend/Firebase";

class Forgot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get("window").width,
      screenHeight: Dimensions.get("window").height,
      isLandscape: Dimensions.get("window").width > Dimensions.get("window").height,
      email: "",
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

    // Attach event listener for dimension changes
    this.subscription = Dimensions.addEventListener("change", handleDimensionsChange);
  }

  componentWillUnmount() {
    // Cleanup the listener when the component is unmounted
    if (this.subscription) {
      this.subscription.remove();
    }
  }

  handleResetPassword = async () => {
    const { email } = this.state;
    if (!email) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }
    else
    {
        try {
            await resetPassword(email);
            Alert.alert('Password Reset', 'A reset link has been sent to your email.');
            // this.props.navigation.navigate("Email_Sent");
        } catch (error) {
            Alert.alert('Error', error.message);  
        }
    }
  };
  

  render() {
    const { screenWidth, screenHeight, isLandscape, email } = this.state;

    return (
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Top Image */}
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

        {/* Login Form */}
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
          <Text style={styles.formTitle}>Forgot Password</Text>
          <Text style={styles.subTitle}>Don't worry! It happens. Please enter the address associated with your account.</Text>

          {/* Email Input */}
          <TextInput
            placeholder="Email"
            placeholderTextColor="#858585"
            style={styles.inputBox}
            keyboardType="email-address"
            onChangeText={(text) => this.setState({ email: text })}
            value={email}
          />

          {/* Get Link Button */}
          <TouchableOpacity style={styles.button} onPress={this.handleResetPassword}>
            <Text style={styles.buttonText}>Get Link</Text>
          </TouchableOpacity>

          {/* Login Navigation */}
          <View style={styles.loginNavigation}>
            <Text>
              Get back to Login?{" "}
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
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
    paddingBottom: 20,
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
});

export default Forgot;
