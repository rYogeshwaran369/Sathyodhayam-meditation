import React, { Component } from "react";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import Menubar from "../../../Components/Menubar";
import Timer from "../../../Components/Meditation/Timer";
import Headings from "../../../Components/Headings";

class Meditationtimer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get("window").width,
      screenHeight: Dimensions.get("window").height,
      isLandscape: Dimensions.get("window").width > Dimensions.get("window").height,
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

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Menubar style={styles.menubar} />
        <Timer imageUri={'https:/i.ytimg.com/vi/D4xV6FWJ8mw/maxresdefault.jpg'} />\
        <Headings/>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow:1,
    alignItems: "center",
    justifyContent: "flex-start",  // Align to top
    backgroundColor: 'white',
    flexDirection: 'column',
    marginTop: 0,  // Ensure no margin at the top
    paddingBottom: 0, // Minimize the bottom padding
    
  },
  menubar: {
    marginBottom: 0, // Remove margin between Menubar and Timer
  },
});

export default Meditationtimer;
