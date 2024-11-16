import React, { Component } from "react";
import { 
  View, Text, StyleSheet, Image, Dimensions, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator 
} from "react-native";
import Slider from "../Components/Slider";
import Menubar from "../Components/Menubar";
import VoiceCard from "../Components/Voicecard";
import { FlatList } from "react-native";
import { Voicedata } from "../Data/Voicedata";
import Headings from "../Components/Headings";
import Newscard from "../Components/Newscard";
import { Voicedatalist } from "../Data/Voicedata";
import { Newsdata } from "../Data/Newsdata";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get("window").width,
      screenHeight: Dimensions.get("window").height,
      isLandscape: Dimensions.get("window").width > Dimensions.get("window").height,
      email: "",
      loading: true, // Initial loading state
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

    // Simulate fetching data
    this.fetchData();
  }

  componentWillUnmount() {
    // Cleanup the listener when the component is unmounted
    if (this.subscription && this.subscription.remove) {
      this.subscription.remove();
    }
  }

  fetchData = () => {
    // Simulate a data fetch (e.g., from an API)
    setTimeout(() => {
      // Once data is fetched, set loading to false
      this.setState({ loading: false });
    }, 2000); // Simulated 2-second delay for fetching data
  };

  handleResetPassword = async () => {
    const { email } = this.state;
    if (!email) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    } else {
      try {
        await resetPassword(email);
        Alert.alert('Password Reset', 'A reset link has been sent to your email.');
      } catch (error) {
        Alert.alert('Error', error.message);  
      }
    }
  };

  render() {
    const { screenWidth, screenHeight, isLandscape, email, loading } = this.state;

    return (
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Top Image */}
        <Menubar />
        <Slider />

        {/* Voice Cards */}
        <Headings subtitle="Voice of" title="Master Sri Ji" Viewm="View more" navigation={this.props.navigation} targetScreen="Podcasts" />

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" /> // Loading spinner
        ) : (
          Voicedatalist && Voicedatalist._j && Voicedatalist._j.length > 0 ? (
            <FlatList
              horizontal
              data={Voicedatalist._j}
              renderItem={({ item }) => (
                <View style={{ marginRight: 10 }}>
                  <VoiceCard imageUrl={item.imageUri} description={item.description} webViewUrl={item.webViewUrl} />
                </View>
              )}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: '2%' }}
            />
          ) : (
            <Text>No voice data available</Text>
          )
        )}

        {/* News Feeds */}
        <Headings subtitle="Headlines of" title="Master Sri Ji" navigation={this.props.navigation} targetScreen="Newsfeeds" Viewm="View more" />

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" /> // Loading spinner
        ) : (
          Newsdata && Newsdata._j && Newsdata._j.length > 0 ? (
            <View>
              {Newsdata._j.map((item) => (
                <Newscard key={item.id} title={item.title} date={item.date} description={item.description} imageUri={item.imageUri} />
              ))}
            </View>
          ) : (
            <Text>No news data available</Text>
          )
        )}
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

export default Home;
