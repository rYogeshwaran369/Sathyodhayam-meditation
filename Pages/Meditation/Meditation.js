import React, { Component } from "react";
import { 
  View, Text, StyleSheet, Image, Dimensions, TextInput, TouchableOpacity, ScrollView, Alert 
} from "react-native";
import Slider from "../../Components/Slider";
import Menubar from "../../Components/Menubar";
import Headings from "../../Components/Headings";
import MeditationOptions from "../../Components/Meditation/Meditationoptions";

class Meditation extends Component {
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
        <Menubar />
        <Slider />

      {/* News Feeds */}

      <Headings subtitle="Join with" title="Master Sri Ji" />
        <MeditationOptions
            imageUri="https://img.freepik.com/free-vector/female-doing-yoga-meditation-mandala-background_1017-38763.jpg?t=st=1731541237~exp=1731544837~hmac=a5602ac005c38708055f018d9b4fc474b983a008a656b8686e289a13efa7e433&w=826"
            title="Dhiyanam"
            navigation={this.props.navigation}
            target={'Meditationtimer'}
        />
        <MeditationOptions
            imageUri="https://img.freepik.com/premium-vector/international-yoga-day-vector-illustration-june-21_723055-598.jpg?w=826"
            title="Thirayadhiyanam"
            navigation={this.props.navigation}
            target={'Meditator'}
        />
        <MeditationOptions
            imageUri="https://img.freepik.com/free-vector/international-yoga-day-particle-style-woman-doing-lotus-asana_1017-52611.jpg?t=st=1731542691~exp=1731546291~hmac=84437566af5249ce6e31759ec56f488ea42ce0db4367c15000327ad470463d67&w=1380"
            title="Jabam"
            navigation={this.props.navigation}
            target={'Jabam'}
        />


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
    backgroundColor:'white',
    marginTop: 10, // Reduced gap between the Menubar and Slider
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

export default Meditation;
