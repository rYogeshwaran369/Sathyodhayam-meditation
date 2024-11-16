import React, { Component } from "react";
import { 
  View, Text, StyleSheet, Image, Dimensions, TextInput, TouchableOpacity, ScrollView, Alert 
} from "react-native";
import Slider from "../../Components/Slider";
import Menubar from "../../Components/Menubar";
import Headings from "../../Components/Headings";
import MeditationOptions from "../../Components/Meditation/Meditationoptions";

class Adminmenu extends Component {
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

      <Headings subtitle="Sathyodhayam" title="Admin Panel" />
        <MeditationOptions
            imageUri="https://img.freepik.com/free-vector/face-recognition-data-safety-mobile-phone-users-getting-access-data-after-biometrical-checking-verification-personal-id-access-identification-concept_74855-9858.jpg?t=st=1731691240~exp=1731694840~hmac=c981080bdf78c420fcb76b9b1a617886c86c7e244e005271176156045dd9483b&w=1380"
            title="Users"
            navigation={this.props.navigation}
            target={'Duserdetails'}
        />
        <MeditationOptions
            imageUri="https://img.freepik.com/free-vector/detailed-podcast-logo-template_23-2148779339.jpg?t=st=1731691345~exp=1731694945~hmac=85aaeb49e76cf02db16039fd785315aa87e31ba7270776028f1a48b807748c7a&w=826"
            title="Podcasts"
            navigation={this.props.navigation}
            target={'Dpodcast'}
        />
        <MeditationOptions
            imageUri="https://img.freepik.com/free-vector/mobile-marketing-isometric-style_23-2148896785.jpg?t=st=1731691437~exp=1731695037~hmac=02a51af5924fcc607cd3d7a5a7a9ac5617af35a1bfbb0159c4a7c0973c33a59a&w=826"
            title="Newsfeeds"
            navigation={this.props.navigation}
            target={'Dnewsfeed'}
        />
        <MeditationOptions
            imageUri="https://img.freepik.com/free-vector/female-doing-yoga-meditation-mandala-background_1017-38763.jpg?t=st=1731691694~exp=1731695294~hmac=e61458b0763741dd6fb59e4f0300550e79c135b9427e691842d631987f56522e&w=826"
            title="Dhiyanam"
            navigation={this.props.navigation}
            target={'Ddhiyanam'}
        />
        <MeditationOptions
            imageUri="https://img.freepik.com/premium-vector/international-yoga-day-vector-illustration-june-21_723055-598.jpg?w=826"
            title="Thirayadhiyanam"
            navigation={this.props.navigation}
            target={'Dthirayadhiyanam'}
        />
        <MeditationOptions
            imageUri="https://img.freepik.com/free-vector/international-yoga-day-particle-style-woman-doing-lotus-asana_1017-52611.jpg?t=st=1731691792~exp=1731695392~hmac=2f30c1def764d034996eccaa82c01f7ec5050358c0e8f20b99be949ecb402190&w=1380"
            title="Jabam"
            navigation={this.props.navigation}
            target={'Djabam'}
        />
        <MeditationOptions
            imageUri="https://i.ytimg.com/vi/7VgpX29JiXs/maxresdefault.jpg"
            title="Slider Images"
            navigation={this.props.navigation}
            target={'Dslider'}
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

export default Adminmenu;
